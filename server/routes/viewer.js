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
const { getDoc, resolveFile, resolveMedia, kindOf, isAllowed, PRIVATE_DIR } = require("../lib/viewer-docs");
const { verifyRecaptcha } = require("../lib/recaptcha");
const { sendViewerOtp } = require("../lib/mailer");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/*  A PDF is read in one sitting. Video is watched for longer - the demo library
 *  runs past an hour end to end - and every segment is its own gated request,
 *  so a short session would cut playback off mid-video. Both stay inside the
 *  8-hour session cookie. */
const SESSION_TTL_MS = { pdf: 30 * 60 * 1000, video: 4 * 60 * 60 * 1000, library: 4 * 60 * 60 * 1000 };
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

/*  One entry per document, so opening the demo videos does not sign the same
 *  visitor out of a PDF they have open in another tab. */
function activeSession(req, docId) {
  const all = req.session && req.session.viewers;
  const v = all && Object.prototype.hasOwnProperty.call(all, docId) ? all[docId] : null;
  if (!v) return null;
  if (Date.now() > v.expires) {
    delete all[docId];
    return null;
  }
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
      /*  A real send failure is worth a 500 - the visitor would otherwise wait
       *  forever for a mail that is never coming.
       *
       *  The reason is written to the access log as well as stdout: on IIS,
       *  stdout goes wherever iisnode was configured to put it, which may be
       *  nowhere, and this has already cost several rounds of guessing. The
       *  log sits in server/private/, which is unreachable over HTTP but
       *  readable in the host's file manager. */
      console.error("viewer: OTP send failed -", err.message);
      logAccess("otp-send-failed", req, { docId, email, reason: err.message.slice(0, 400) });
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

  const session = {
    docId,
    email: String(email).trim().toLowerCase(),
    ip: req.ip,
    expires: Date.now() + SESSION_TTL_MS[kindOf(doc)]
  };
  req.session.viewers = Object.assign({}, req.session.viewers, { [docId]: session });

  logAccess("verified", req, { docId, email });
  res.json({ ok: true, email: session.email });
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
  const docId = (req.body || {}).docId;
  if (req.session && req.session.viewers) {
    if (docId) delete req.session.viewers[docId];
    else delete req.session.viewers;
  }
  res.json({ ok: true });
});

/* -------------------------------------------------------------- the bytes */

router.get("/viewer/doc/:docId", (req, res) => {
  noStore(res);
  const docId = req.params.docId;
  const v = activeSession(req, docId);
  if (!v) return res.status(401).json({ error: "Not authorised." });

  const doc = getDoc(docId);
  if (!doc || kindOf(doc) !== "pdf") return res.status(404).json({ error: "Not found." });

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

/* ------------------------------------------------------------- the media */

const MEDIA_TYPES = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".m4s": "video/mp4",
  ".mp4": "video/mp4",
  ".ts": "video/mp2t",
  ".jpg": "image/jpeg",
  ".vtt": "text/vtt"
};

/*  Video files for "video" and "library" entries:
 *    /api/viewer/media/<docId>/<file>          e.g. index.m3u8, seg_003.m4s
 *    /api/viewer/media/<docId>/<slug>/<file>   library entries
 *
 *  Library posters are the one exception to the session check: the demo page
 *  shows them as thumbnails before anyone has signed in, and a still frame of
 *  the app gives nothing away that the page text does not. */
router.get(/^\/viewer\/media\/([a-z0-9-]{1,64})\/(.+)$/, (req, res) => {
  const docId = req.params[0];
  const rel = req.params[1];
  const doc = getDoc(docId);
  if (!doc) return res.status(404).end();

  const ext = path.extname(rel).toLowerCase();
  const type = MEDIA_TYPES[ext];
  const file = type ? resolveMedia(doc, rel) : null;
  const publicPoster = kindOf(doc) === "library" && /^[a-z0-9-]+\/poster\.jpg$/.test(rel);

  if (!publicPoster) {
    const v = activeSession(req, docId);
    if (!v) {
      noStore(res);
      return res.status(401).json({ error: "Not authorised." });
    }
    // One line per playback, not per segment: a video is hundreds of requests.
    const firstByte = !req.headers.range || /^bytes=0-/.test(req.headers.range);
    if (file && (ext === ".m3u8" || (ext === ".mp4" && firstByte))) {
      logAccess("video-played", req, { docId, email: v.email, file: rel });
    }
  }

  if (!file) return res.status(404).end();

  res.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  // "private" keeps Cloudflare from caching a gated file and handing it to the
  // next visitor. Playlists are never cached at all, so a revoked address stops
  // at the next video rather than whenever a cache expires.
  res.set(
    "Cache-Control",
    publicPoster ? "public, max-age=86400" : ext === ".m3u8" ? "no-store, private" : "private, max-age=3600"
  );
  res.sendFile(file, { headers: { "Content-Type": type }, dotfiles: "deny", cacheControl: false }, (err) => {
    if (err && !res.headersSent) res.status(err.status || 500).end();
  });
});

module.exports = router;
