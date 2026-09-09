const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  return transporter;
}

async function sendContactNotification({ name, email, company, service, message }) {
  const t = getTransporter();
  if (!t) throw new Error("SMTP is not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS in .env");

  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const escapeHtml = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  await t.sendMail({
    from,
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
  const t = getTransporter();
  if (!t) throw new Error("SMTP is not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS in .env");

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const escapeHtml = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  await t.sendMail({
    from,
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
