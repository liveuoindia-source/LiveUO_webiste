/*  Secure document viewer: email + OTP gate in front of a read-only PDF.
 *
 *  THREAT MODEL - read before changing anything here.
 *
 *  What this genuinely prevents:
 *    - the PDF having any public URL (it lives outside the web root)
 *    - access without proving control of an allow-listed mailbox
 *    - discovering WHO is on an allow-list by probing the request endpoint
 *    - brute-forcing a six-digit code (rate limits + a five-attempt burn)
 *    - the document being indexed or cached
 *
 *  What it does NOT prevent, and must never be described as preventing:
 *    - screenshots or a phone camera
 *    - a technical viewer pulling the PDF bytes out of the network tab.
 *      Rendering is client-side PDF.js, chosen deliberately for a lighter
 *      deployment; server-side rasterisation is the fix if that changes.
 *
 *  The real control against a leak is therefore traceability, not prevention:
 *  every page is watermarked with the viewer's email, the time, and their IP,
 *  and every view is written to the access log.
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const otp = require("../lib/otp");
const { getDoc, resolveFile, isAllowed, PRIVATE_DIR } = require("../lib/viewer-docs");
const { verifyRecaptcha } = require("../lib/recaptcha");
const { sendViewerOtp } = require("../lib/mailer");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_TTL_MS = 30 * 60 * 1000;
const ACCESS_LOG = path.join(PRIVATE_DIR, "access.log");

/*  Sending mail is the expensive, abusable operation, so it is limited hardest.
 *  Verification is limited separately: a shared limiter would let a flood of
 *  requests lock out someone legitimately typing their code. */
const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many code requests. Please try again later." }
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." }
});

function logAccess(event, req, extra) {
  const line =
    JSON.stringify({
      at: new Date().toISOString(),
      event,
      ip: req.ip,
      ua: String(req.get("user-agent") || "").slice(0, 200),
      ...extra
    }) + "\n";
  // Append-only and non-fatal: losing an audit line must never 500 a viewer.
  fs.appendFile(ACCESS_LOG, line, (err) => {
    if (err) console.error("viewer: could not write access log -", err.message);
  });
}

function activeSession(req, docId) {
  const v = req.session && req.session.viewer;
  if (!v || v.docId !== docId) return null;
  if (Date.now() > v.expires) return null;
  return v;
}

function noStore(res) {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
}

/* ------------------------------------------------------------ request code */

router.post("/viewer/request-otp", requestLimiter, async (req, res) => {
  const { docId, email, "g-recaptcha-response": token } = req.body || {};
  noStore(res);

  if (!EMAIL_RE.test(String(email || ""))) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  try {
    if (!(await verifyRecaptcha(token, req.ip))) {
      return res.status(400).json({ error: "reCAPTCHA verification failed. Please try again." });
    }
  } catch (err) {
    console.error("viewer: reCAPTCHA error -", err.message);
    return res.status(500).json({ error: "Could not verify reCAPTCHA right now." });
  }

  const doc = getDoc(docId);
  const permitted = doc && isAllowed(doc, email);

  if (permitted) {
    try {
      const code = otp.issue(docId, email);
      await sendViewerOtp({
        email,
        code,
        title: doc.title || "your document",
        ttlMinutes: Math.round(otp.TTL_MS / 60000)
      });
      logAccess("otp-sent", req, { docId, email });
    } catch (err) {
      // A real send failure is worth a 500 - the visitor would otherwise wait
      // forever for a mail that is never coming.
      console.error("viewer: OTP send failed -", err.message);
      return res.status(500).json({ error: "Could not send the code right now. Please try again shortly." });
    }
  } else {
    logAccess("otp-denied", req, { docId, email });
  }

  /*  Identical response either way, and deliberately so. Saying "that address
   *  isn't authorised" would let anyone enumerate a client list one guess at a
   *  time. The only party who learns anything is the mailbox owner. */
  res.json({ ok: true, message: "If that address is authorised, a code is on its way." });
});

/* ------------------------------------------------------------- verify code */

router.post("/viewer/verify-otp", verifyLimiter, (req, res) => {
  const { docId, email, code } = req.body || {};
  noStore(res);

  if (!EMAIL_RE.test(String(email || "")) || !/^\d{6}$/.test(String(code || ""))) {
    return res.status(400).json({ error: "Enter the 6-digit code from your email." });
  }

  const doc = getDoc(docId);
  if (!doc || !isAllowed(doc, email)) {
    // Same shape and status as a wrong code, for the same anti-enumeration
    // reason as above.
    logAccess("verify-denied", req, { docId, email });
    return res.status(400).json({ error: "That code is not valid. Please check and try again." });
  }

  const result = otp.verify(docId, email, code);
  if (!result.ok) {
    logAccess("verify-failed", req, { docId, email, reason: result.reason });
    if (result.reason === "too-many-attempts") {
      return res.status(429).json({ error: "Too many incorrect attempts. Request a new code." });
    }
    return res.status(400).json({ error: "That code is not valid. Please check and try again." });
  }

  req.session.viewer = {
    docId,
    email: String(email).trim().toLowerCase(),
    ip: req.ip,
    expires: Date.now() + SESSION_TTL_MS
  };

  logAccess("verified", req, { docId, email });
  res.json({ ok: true, email: req.session.viewer.email });
});

/* ------------------------------------------------------------------ status */

router.get("/viewer/session/:docId", (req, res) => {
  noStore(res);
  const v = activeSession(req, req.params.docId);
  if (!v) return res.json({ authenticated: false });
  res.json({
    authenticated: true,
    email: v.email,
    ip: v.ip,
    expiresIn: Math.max(0, v.expires - Date.now())
  });
});

router.post("/viewer/logout", (req, res) => {
  noStore(res);
  if (req.session) delete req.session.viewer;
  res.json({ ok: true });
});

/* -------------------------------------------------------------- the bytes */

router.get("/viewer/doc/:docId", (req, res) => {
  noStore(res);
  const docId = req.params.docId;
  const v = activeSession(req, docId);
  if (!v) return res.status(401).json({ error: "Not authorised." });

  const doc = getDoc(docId);
  if (!doc) return res.status(404).json({ error: "Not found." });

  const file = resolveFile(doc);
  if (!file) {
    console.error("viewer: file missing for doc", docId, "->", doc.file);
    return res.status(404).json({ error: "Not found." });
  }

  logAccess("document-served", req, { docId, email: v.email });

  // inline, never attachment: an attachment disposition is what makes a
  // browser offer a Save dialog.
  res.set("Content-Type", "application/pdf");
  res.set("Content-Disposition", 'inline; filename="document.pdf"');
  fs.createReadStream(file).on("error", (err) => {
    console.error("viewer: stream failed -", err.message);
    if (!res.headersSent) res.status(500).end();
  }).pipe(res);
});

module.exports = router;
