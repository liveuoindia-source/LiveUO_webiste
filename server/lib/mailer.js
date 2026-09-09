/*  Two ways out, chosen by which credentials are present.
 *
 *  The production host blocks outbound SMTP: connecting to smtp.gmail.com:587
 *  fails with EACCES, meaning the operating system refuses to open the socket
 *  at all - the packet never leaves the machine. No SMTP credentials can fix
 *  that, and neither can a different port.
 *
 *  Outbound HTTPS does work there (reCAPTCHA verification succeeds), so mail
 *  goes over the Resend HTTP API on port 443 instead. SMTP is kept for local
 *  development, where it works fine and needs no third-party account.
 *
 *  RESEND_API_KEY set  -> HTTPS API
 *  otherwise           -> SMTP, as before
 */

const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  const port = Number(process.env.SMTP_PORT) || 587;

  /*  Auth is optional. A host that blocks outbound SMTP to the internet
   *  normally still permits its own mail server, and a local relay on
   *  localhost:25 typically authenticates by source address rather than by
   *  credentials - so requiring a username here would rule out the one SMTP
   *  route such a host actually allows.
   *
   *  Likewise TLS: a loopback relay often has no certificate worth verifying,
   *  and rejecting it would leave no usable option. Only relaxed for
   *  localhost, where the traffic never leaves the machine; anything remote
   *  keeps full verification.
   */
  const local = /^(localhost|127\.0\.0\.1|::1)$/i.test(process.env.SMTP_HOST.trim());

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true" || port === 465,
    ...(process.env.SMTP_USER && process.env.SMTP_PASS
      ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
      : {}),
    ...(local ? { tls: { rejectUnauthorized: false }, ignoreTLS: port === 25 } : {})
  });
  return transporter;
}

function fromAddress() {
  // MAIL_FROM wins: with Resend the sender must be on the verified domain,
  // which is not necessarily the SMTP username used in development.
  return process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
}

async function sendViaResend({ to, replyTo, subject, text, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [to],
      subject,
      text,
      html,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  });

  if (!res.ok) {
    // Surface Resend's own message: "domain is not verified" and "invalid
    // api key" are the two likely failures and they need different fixes.
    const detail = await res.text().catch(() => "");
    throw new Error("Resend API returned " + res.status + ": " + detail.slice(0, 300));
  }
}

/*  Single exit point for outbound mail, so the two callers below do not each
 *  have to know which transport is in play. */
async function deliver({ to, replyTo, subject, text, html }) {
  if (process.env.RESEND_API_KEY) {
    if (!fromAddress()) throw new Error("MAIL_FROM is not set — required when sending via Resend");
    return sendViaResend({ to, replyTo, subject, text, html });
  }

  const t = getTransporter();
  if (!t) {
    throw new Error(
      "No mail transport configured — set RESEND_API_KEY (production), or SMTP_HOST/USER/PASS (local)"
    );
  }
  return t.sendMail({ from: fromAddress(), to, replyTo, subject, text, html });
}

async function sendContactNotification({ name, email, company, service, message }) {

  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

  const escapeHtml = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  await deliver({
    to,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "-"}`,
      `Service: ${service || "-"}`,
      "",
      "Message:",
      message
    ].join("\n"),
    html: [
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Company:</strong> ${escapeHtml(company) || "-"}</p>`,
      `<p><strong>Service:</strong> ${escapeHtml(service) || "-"}</p>`,
      `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
    ].join("\n")
  });
}

/*  One-time passcode for the secure document viewer.
 *
 *  Sent only to an address already on that document's allow-list, so this can
 *  never be used to mail an arbitrary recipient. The code is the whole secret,
 *  so the mail carries no link that would log the recipient straight in -
 *  a forwarded email should not hand over access on its own.
 */
async function sendViewerOtp({ email, code, title, ttlMinutes }) {
  const escapeHtml = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  await deliver({
    to: email,
    subject: `Your access code for ${title}`,
    text: [
      `Your one-time access code is: ${code}`,
      "",
      `It expires in ${ttlMinutes} minutes and can be used once.`,
      "",
      "If you did not request this, you can ignore this email — the code is",
      "useless without the page it was requested from.",
      "",
      "— LiVEUO"
    ].join("\n"),
    html: [
      `<p>Your one-time access code for <strong>${escapeHtml(title)}</strong> is:</p>`,
      `<p style="font-size:30px;letter-spacing:7px;font-weight:700;margin:22px 0">${escapeHtml(code)}</p>`,
      `<p>It expires in ${ttlMinutes} minutes and can be used once.</p>`,
      `<p style="color:#666;font-size:13px">If you did not request this, ignore this email — the code is useless without the page it was requested from.</p>`,
      `<p style="color:#666;font-size:13px">— LiVEUO</p>`
    ].join("\n")
  });
}

module.exports = { sendContactNotification, sendViewerOtp };
