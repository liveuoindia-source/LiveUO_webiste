const express = require("express");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const { db } = require("../db");
const { verifyRecaptcha } = require("../lib/recaptcha");
const { sendContactNotification } = require("../lib/mailer");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." }
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, company, service, message, "g-recaptcha-response": recaptchaToken, website } = req.body || {};

  // Honeypot: real users never fill this hidden field.
  if (website) return res.json({ ok: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  try {
    const recaptchaOk = await verifyRecaptcha(recaptchaToken, req.ip);
    if (!recaptchaOk) {
      return res.status(400).json({ error: "reCAPTCHA verification failed. Please try again." });
    }
  } catch (err) {
    console.error("reCAPTCHA verification error:", err.message);
    return res.status(500).json({ error: "Could not verify reCAPTCHA right now. Please try again shortly." });
  }

  const ipHash = crypto.createHash("sha256").update(String(req.ip || "")).digest("hex");
  const info = db
    .prepare(
      "INSERT INTO contact_messages (name, email, company, service, message, ip_hash) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(name, email, company || null, service || null, message, ipHash);

  try {
    await sendContactNotification({ name, email, company, service, message });
    db.prepare("UPDATE contact_messages SET email_sent = 1 WHERE id = ?").run(info.lastInsertRowid);
  } catch (err) {
    console.error("Contact email send failed:", err.message);
    return res.json({
      ok: true,
      warning: "Your message was received, but our email notification is temporarily down. We still have your details."
    });
  }

  res.json({ ok: true });
});

module.exports = router;
