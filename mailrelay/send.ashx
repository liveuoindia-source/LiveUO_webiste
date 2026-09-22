<%@ WebHandler Language="C#" Class="MailRelay" %>
/*  SMTP relay for the Node app, run by IIS's own ASP.NET worker (w3wp.exe).
 *
 *  Why this exists: the host's firewall refuses outbound SMTP from node.exe
 *  (connect EACCES on :587), but lets w3wp.exe through - the ASP.NET site
 *  license.liveuo.com sends through Gmail from this same server. So Node
 *  POSTs the message here over HTTP and this handler does the SMTP leg.
 *
 *  Settings come from the site's .env, the same file Node reads, so the SMTP
 *  credentials live in exactly one place:
 *    MAIL_RELAY_KEY   shared secret; requests without it are refused
 *    SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM
 *
 *  Form fields arrive base64-encoded: the HTML body contains "<" and ASP.NET
 *  request validation would otherwise reject the POST outright.
 *
 *  Written for the C# 5 compiler that ASP.NET 4.x uses for .ashx files - no
 *  string interpolation or ?. here.
 */
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web;

public class MailRelay : IHttpHandler
{
    public bool IsReusable { get { return false; } }

    public void ProcessRequest(HttpContext ctx)
    {
        HttpResponse res = ctx.Response;
        res.ContentType = "text/plain";
        res.Cache.SetCacheability(HttpCacheability.NoCache);
        res.TrySkipIisCustomErrors = true;

        // GET is a health check: proves ASP.NET runs here without revealing
        // anything about the configuration.
        if (ctx.Request.HttpMethod == "GET")
        {
            res.Write("mail relay: ASP.NET is running");
            return;
        }
        if (ctx.Request.HttpMethod != "POST")
        {
            Fail(res, 405, "method not allowed");
            return;
        }

        Dictionary<string, string> env = LoadEnv(ctx.Server.MapPath("~/.env"));

        string key = Get(env, "MAIL_RELAY_KEY");
        if (key.Length < 24)
        {
            Fail(res, 503, "MAIL_RELAY_KEY missing or shorter than 24 characters in .env");
            return;
        }
        if (!FixedTimeEquals(ctx.Request.Headers["X-Relay-Key"] ?? "", key))
        {
            Fail(res, 403, "forbidden");
            return;
        }

        string to = Field(ctx, "to");
        string replyTo = Field(ctx, "replyTo");
        string subject = Field(ctx, "subject");
        string text = Field(ctx, "text");
        string html = Field(ctx, "html");
        if (to.Length == 0 || subject.Length == 0)
        {
            Fail(res, 400, "to and subject are required");
            return;
        }

        string host = Get(env, "SMTP_HOST");
        string user = Get(env, "SMTP_USER");
        string pass = Get(env, "SMTP_PASS");
        string from = Get(env, "SMTP_FROM");
        if (from.Length == 0) from = user;
        int port;
        if (!int.TryParse(Get(env, "SMTP_PORT"), out port)) port = 587;

        if (host.Length == 0 || from.Length == 0)
        {
            Fail(res, 503, "SMTP_HOST / SMTP_FROM not set in .env");
            return;
        }

        // Older .NET 4.x defaults to TLS 1.0, which Gmail refuses.
        ServicePointManager.SecurityProtocol |= (SecurityProtocolType)3072; // Tls12

        try
        {
            using (MailMessage msg = new MailMessage())
            {
                msg.From = new MailAddress(from);
                msg.To.Add(to);
                if (replyTo.Length > 0) msg.ReplyToList.Add(replyTo);
                msg.Subject = subject;
                msg.SubjectEncoding = Encoding.UTF8;
                msg.BodyEncoding = Encoding.UTF8;

                if (html.Length > 0)
                {
                    msg.Body = text;
                    msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, Encoding.UTF8, "text/html"));
                }
                else
                {
                    msg.Body = text;
                }

                // SmtpClient only does STARTTLS, so 465 (implicit TLS) is not
                // supported - use 587, or 25 for a local relay.
                bool local = host == "localhost" || host == "127.0.0.1";
                using (SmtpClient smtp = new SmtpClient(host, port))
                {
                    smtp.EnableSsl = !local;
                    smtp.Timeout = 20000;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    if (user.Length > 0 && pass.Length > 0)
                    {
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = new NetworkCredential(user, pass);
                    }
                    smtp.Send(msg);
                }
            }
            res.Write("sent");
        }
        catch (Exception ex)
        {
            // Innermost message is the useful one ("5.7.0 Authentication
            // Required", "An attempt was made to access a socket...").
            Exception inner = ex;
            while (inner.InnerException != null) inner = inner.InnerException;
            Fail(res, 502, "smtp send failed: " + ex.Message + (inner != ex ? " | " + inner.Message : ""));
        }
    }

    static void Fail(HttpResponse res, int status, string message)
    {
        res.StatusCode = status;
        res.Write(message);
    }

    static string Field(HttpContext ctx, string name)
    {
        string raw = ctx.Request.Form[name];
        if (string.IsNullOrEmpty(raw)) return "";
        try { return Encoding.UTF8.GetString(Convert.FromBase64String(raw)); }
        catch (FormatException) { return ""; }
    }

    static string Get(Dictionary<string, string> env, string name)
    {
        string v;
        return env.TryGetValue(name, out v) ? v : "";
    }

    /*  Minimal reader matching how dotenv treats the lines this site uses:
     *  KEY=value, optional "export ", quoted values kept verbatim (so a
     *  password containing # works when quoted), and an unquoted value ends
     *  at the first #. */
    static Dictionary<string, string> LoadEnv(string path)
    {
        Dictionary<string, string> env = new Dictionary<string, string>();
        if (!File.Exists(path)) return env;

        foreach (string rawLine in File.ReadAllLines(path))
        {
            string line = rawLine.Trim();
            if (line.Length == 0 || line[0] == '#') continue;
            if (line.StartsWith("export ")) line = line.Substring(7).TrimStart();

            int eq = line.IndexOf('=');
            if (eq <= 0) continue;
            string name = line.Substring(0, eq).Trim();
            string value = line.Substring(eq + 1).Trim();

            if (value.Length > 0 && (value[0] == '"' || value[0] == '\''))
            {
                int close = value.IndexOf(value[0], 1);
                value = close > 0 ? value.Substring(1, close - 1) : value.Substring(1);
            }
            else
            {
                int hash = value.IndexOf('#');
                if (hash >= 0) value = value.Substring(0, hash).TrimEnd();
            }
            env[name] = value;
        }
        return env;
    }

    static bool FixedTimeEquals(string a, string b)
    {
        byte[] x = Encoding.UTF8.GetBytes(a);
        byte[] y = Encoding.UTF8.GetBytes(b);
        int diff = x.Length ^ y.Length;
        for (int i = 0; i < x.Length && i < y.Length; i++) diff |= x[i] ^ y[i];
        return diff == 0;
    }
}
