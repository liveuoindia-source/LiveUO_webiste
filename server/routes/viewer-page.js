/*  Serves the reader shell at /viewer/:docId.
 *
 *  Rendered by Express rather than dropped in the web root as a static file so
 *  that an unknown or expired document 404s before any HTML is sent, and so the
 *  page never has to be duplicated per document.
 *
 *  The shell carries no document content. Everything sensitive arrives later,
 *  over session-gated /api/viewer/* calls.
 */

const express = require("express");
const { getDoc } = require("../lib/viewer-docs");

const router = express.Router();

const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Pinned. An unpinned CDN build of the renderer would be an unreviewed script
// running over the document.
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";

router.get("/:docId", (req, res) => {
  const docId = req.params.docId;
  const doc = getDoc(docId);

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");

  if (!doc) return res.status(404).sendFile(require("path").join(__dirname, "..", "..", "404.html"));

  const siteKey = process.env.RECAPTCHA_SITE_KEY || "";
  const title = doc.title || "Secure document";

  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
<title>${esc(title)} — LiVEUO</title>
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml" />
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<style>
  :root { --ink:#0f1216; --paper:#f7f8fa; --line:#e3e7ee; --brand:#3a6cb5; --muted:#5b6472; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink);
         font:15px/1.55 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }
  header { background:#fff; border-bottom:1px solid var(--line); padding:14px 20px;
           display:flex; align-items:center; gap:14px; justify-content:space-between; }
  header img { height:26px; }
  .doc-title { font-weight:600; font-size:15px; }
  .who { font-size:12px; color:var(--muted); text-align:right; }
  .wrap { max-width:520px; margin:9vh auto; background:#fff; border:1px solid var(--line);
          border-radius:12px; padding:34px; }
  h1 { font-size:21px; margin:0 0 8px; }
  p.lede { color:var(--muted); margin:0 0 22px; }
  label { display:block; font-size:13px; font-weight:600; margin:16px 0 6px; }
  input { width:100%; padding:12px 13px; border:1px solid var(--line); border-radius:8px;
          font-size:15px; font-family:inherit; }
  input:focus { outline:2px solid var(--brand); outline-offset:1px; }
  #code { letter-spacing:9px; font-size:23px; text-align:center; font-family:ui-monospace,monospace; }
  button { width:100%; margin-top:18px; padding:12px; border:0; border-radius:8px;
           background:var(--brand); color:#fff; font-size:15px; font-weight:600; cursor:pointer;
           font-family:inherit; }
  button:disabled { opacity:.55; cursor:not-allowed; }
  .link { background:none; color:var(--muted); font-weight:500; text-decoration:underline;
          width:auto; padding:6px 0; margin-top:12px; font-size:13px; }
  .msg { min-height:20px; font-size:13.5px; margin-top:12px; }
  .msg.err { color:#c0392b; } .msg.ok { color:#2e7d32; }
  .hint { font-size:12px; color:var(--muted); margin-top:18px; line-height:1.5; }

  /* Reader */
  #reader { display:none; padding:22px 12px 60px; }
  .page-shell { position:relative; width:fit-content; margin:0 auto 22px;
                box-shadow:0 2px 14px rgba(0,0,0,.13); }
  canvas { display:block; max-width:100%; height:auto; }

  /* The watermark is the actual anti-leak control, so it must sit above the
     page, be unselectable, and never intercept a scroll or a click. */
  .wm { position:absolute; inset:0; pointer-events:none; overflow:hidden;
        display:flex; align-items:center; justify-content:center; }
  .wm span { position:absolute; transform:rotate(-30deg); white-space:nowrap;
             font-size:15px; color:rgba(120,130,145,.20); font-weight:600;
             letter-spacing:.5px; user-select:none; }

  /* Selection is disabled everywhere in the reader. This is a deterrent, not a
     security boundary - it stops an accidental copy, not a determined one. */
  #reader, #reader * { user-select:none; -webkit-user-select:none; }

  /* Blank the document for print / Save-as-PDF. Also a deterrent only. */
  @media print {
    body * { display:none !important; }
    body::after { content:"This document cannot be printed."; display:block !important;
                  padding:40px; font:16px sans-serif; }
  }
</style>
</head>
<body>

<header>
  <img src="/assets/liveuo_logo.png" alt="LiVEUO" />
  <div class="doc-title">${esc(title)}</div>
  <div class="who"><span id="who"></span></div>
</header>

<!-- Step 1 + 2 -->
<div class="wrap" id="gate">
  <div id="step-email">
    <h1>Secure document</h1>
    <p class="lede">Enter your email address to receive a one-time access code.</p>
    <label for="email">Email address</label>
    <input id="email" type="email" autocomplete="email" placeholder="you@company.com" />
    <!-- v2 INVISIBLE, not the checkbox widget: there is nothing for the visitor
         to tick. grecaptcha.execute() runs the challenge when Send is pressed
         and Google then calls data-callback with the token. -->
    <div id="rc" class="g-recaptcha"
         data-sitekey="${esc(siteKey)}"
         data-size="invisible"
         data-callback="onViewerCaptcha"
         data-error-callback="onViewerCaptchaError"
         data-expired-callback="onViewerCaptchaError"></div>
    <button id="send">Send access code</button>
    <div class="msg" id="m1"></div>
    <p class="hint">Access is limited to addresses approved for this document.
       The code expires in 10 minutes.</p>
  </div>

  <div id="step-code" style="display:none">
    <h1>Enter your code</h1>
    <p class="lede">We've sent a 6-digit code to <strong id="sent-to"></strong>.</p>
    <label for="code">Access code</label>
    <input id="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" />
    <button id="verify">Open document</button>
    <button class="link" id="back">Use a different email</button>
    <div class="msg" id="m2"></div>
  </div>
</div>

<!-- Step 3 -->
<div id="reader"><div id="pages"></div></div>

<script src="${PDFJS}/pdf.min.js"></script>
<script>
(function () {
  var DOC_ID = ${JSON.stringify(docId)};
  var $ = function (id) { return document.getElementById(id); };
  var viewer = null;

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "${PDFJS}/pdf.worker.min.js";
  }

  function msg(el, text, kind) {
    el.textContent = text;
    el.className = "msg" + (kind ? " " + kind : "");
  }

  function post(url, body) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); });
  }

  /* ---- step 1: request a code ----
     Two halves, because invisible reCAPTCHA is asynchronous: the click only
     starts the challenge, and the actual request is sent from the callback
     below once Google hands back a token. */
  $("send").addEventListener("click", function () {
    if (!$("email").value.trim()) { return msg($("m1"), "Enter your email address.", "err"); }
    if (typeof grecaptcha === "undefined") {
      return msg($("m1"), "Verification failed to load. Please reload the page.", "err");
    }
    $("send").disabled = true;
    msg($("m1"), "Verifying…");
    try {
      grecaptcha.execute();
    } catch (e) {
      $("send").disabled = false;
      msg($("m1"), "Could not start verification. Please reload the page.", "err");
    }
  });

  // Named on the widget via data-callback, so it has to be global.
  window.onViewerCaptcha = function (token) {
    var email = $("email").value.trim();
    msg($("m1"), "Sending…");

    post("/api/viewer/request-otp", { docId: DOC_ID, email: email, "g-recaptcha-response": token })
      .then(function (r) {
        if (!r.ok) throw new Error(r.data.error || "Something went wrong.");
        // Always advances, even for an address that is not allow-listed - the
        // server deliberately does not say which, so nor can this page.
        $("sent-to").textContent = email;
        $("step-email").style.display = "none";
        $("step-code").style.display = "";
        $("code").focus();
      })
      .catch(function (e) { msg($("m1"), e.message, "err"); })
      .finally(function () {
        $("send").disabled = false;
        // A token is single-use; without this a second attempt reuses a spent
        // one and the server rejects it.
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
      });
  };

  // Challenge abandoned or token expired - re-enable so the visitor is not stuck.
  window.onViewerCaptchaError = function () {
    $("send").disabled = false;
    msg($("m1"), "Verification did not complete. Please try again.", "err");
    if (typeof grecaptcha !== "undefined") grecaptcha.reset();
  };

  $("back").addEventListener("click", function () {
    $("step-code").style.display = "none";
    $("step-email").style.display = "";
    msg($("m2"), "");
  });

  /* ---- step 2: verify ---- */
  $("verify").addEventListener("click", function () {
    var code = $("code").value.trim();
    if (!/^\\d{6}$/.test(code)) { return msg($("m2"), "Enter the 6-digit code.", "err"); }

    $("verify").disabled = true;
    msg($("m2"), "Checking…");

    post("/api/viewer/verify-otp", { docId: DOC_ID, email: $("sent-to").textContent, code: code })
      .then(function (r) {
        if (!r.ok) throw new Error(r.data.error || "That code is not valid.");
        return openDocument();
      })
      .catch(function (e) { msg($("m2"), e.message, "err"); })
      .finally(function () { $("verify").disabled = false; });
  });

  /* ---- step 3: render ---- */
  function openDocument() {
    return fetch("/api/viewer/session/" + encodeURIComponent(DOC_ID))
      .then(function (r) { return r.json(); })
      .then(function (s) {
        if (!s.authenticated) throw new Error("Session expired. Please request a new code.");
        viewer = s;
        $("who").textContent = s.email;
        $("gate").style.display = "none";
        $("reader").style.display = "block";
        harden();
        return render();
      });
  }

  function watermark(w, h) {
    var wm = document.createElement("div");
    wm.className = "wm";
    var stamp = viewer.email + "  ·  " + new Date().toISOString().slice(0, 16).replace("T", " ") +
                " UTC  ·  " + viewer.ip;
    // Tiled rather than a single mark: a crop of any corner still carries it.
    for (var y = -40; y < h + 120; y += 150) {
      for (var x = -120; x < w + 120; x += 340) {
        var s = document.createElement("span");
        s.textContent = stamp;
        s.style.left = x + "px";
        s.style.top = y + "px";
        wm.appendChild(s);
      }
    }
    return wm;
  }

  function render() {
    return pdfjsLib.getDocument({ url: "/api/viewer/doc/" + encodeURIComponent(DOC_ID) }).promise
      .then(function (pdf) {
        var chain = Promise.resolve();
        for (var n = 1; n <= pdf.numPages; n++) {
          (function (num) {
            chain = chain.then(function () {
              return pdf.getPage(num).then(function (page) {
                // Render above CSS size so the page stays sharp on HiDPI and
                // when zoomed, without a second render pass.
                var scale = Math.min(2, (Math.min(900, window.innerWidth - 30)) / page.getViewport({ scale: 1 }).width);
                var vp = page.getViewport({ scale: scale * (window.devicePixelRatio || 1) });
                var shell = document.createElement("div");
                shell.className = "page-shell";
                var canvas = document.createElement("canvas");
                canvas.width = vp.width;
                canvas.height = vp.height;
                canvas.style.width = (vp.width / (window.devicePixelRatio || 1)) + "px";
                shell.appendChild(canvas);
                shell.appendChild(watermark(vp.width, vp.height));
                $("pages").appendChild(shell);
                return page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
              });
            });
          })(n);
        }
        return chain;
      })
      .catch(function (e) {
        $("pages").innerHTML = '<p style="text-align:center;color:#c0392b">Could not display this document. ' +
                               'Please request a new code and try again.</p>';
        console.error(e);
      });
  }

  /*  Deterrents. Every one of these is trivially bypassed with DevTools and
   *  none is relied on for security - they exist to stop an accidental copy,
   *  and to make it unambiguous that copying is not intended. */
  function harden() {
    ["contextmenu", "copy", "cut", "dragstart", "selectstart"].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); });
    });
    document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "c", "u"].indexOf(k) !== -1) e.preventDefault();
    });
  }

  // Resume an existing session on reload rather than forcing a fresh code.
  fetch("/api/viewer/session/" + encodeURIComponent(DOC_ID))
    .then(function (r) { return r.json(); })
    .then(function (s) { if (s.authenticated) openDocument(); })
    .catch(function () {});
})();
</script>
</body>
</html>`);
});

module.exports = router;
