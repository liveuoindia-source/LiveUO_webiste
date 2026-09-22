/*  pharCare demo player: playlist, autoplay-next, resume, search.
 *
 *  Plays HLS through hls.js in every modern browser except Safari, which plays
 *  HLS natively. The page is rendered by scripts/build-demos.js, which embeds
 *  the video list as JSON so nothing extra has to load before playback.
 *
 *  Viewing state - where each video was left and which were finished - lives in
 *  localStorage, per browser. Every access is guarded: storage can be missing
 *  (private windows, blocked site data) and the player must still work.
 *
 *  Download protection on this side is deterrence only: no download control,
 *  no right-click menu on the video, no picture-in-picture. The meaningful part
 *  is upstream - the video arrives as short HLS segments, not one saveable file.
 *
 *  Access is gated: the Node app serves the playlists and segments only to a
 *  session verified by email + one-time code against the allow-list named in
 *  window.DEMO_GATE. Until then a sign-in modal opens over the (blurred) page,
 *  the player shows a locked state, and nothing is requested but posters.
 */
(function () {
  "use strict";

  var dataEl = document.getElementById("demo-data");
  var video = document.getElementById("demo-video");
  if (!dataEl || !video || typeof window.Plyr === "undefined") return;

  var videos;
  try {
    videos = JSON.parse(dataEl.textContent) || [];
  } catch (e) {
    videos = [];
  }
  if (!videos.length) return;

  var $ = function (id) { return document.getElementById(id); };
  var POS_KEY = "pcDemoPos:";
  var WATCHED_KEY = "pcDemoWatched";
  var COUNTDOWN_SECONDS = 5;

  var store = {
    get: function (k) {
      try { return window.localStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ }
    }
  };

  var tiles = Array.prototype.slice.call(document.querySelectorAll(".demo-tile"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".demo-group"));
  var listBody = $("demo-list");
  var tileBySlug = {};
  var indexBySlug = {};
  tiles.forEach(function (t) { tileBySlug[t.getAttribute("data-slug")] = t; });
  videos.forEach(function (v, i) { indexBySlug[v.slug] = i; });

  /* ---------------------------------------------------------------- player */

  var options = {
    // No "download" control - Plyr offers one, and it is deliberately absent.
    controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
    settings: ["speed"],
    speed: { selected: 1, options: [0.75, 1, 1.25, 1.5, 2] },
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    fullscreen: { iosNative: true }
  };
  // Only set when present: Plyr copies an explicit undefined over its default,
  // which would leave every control without an icon.
  var iconUrl = video.getAttribute("data-icon-url");
  if (iconUrl) options.iconUrl = iconUrl;

  // A silent-by-design library (captioned screen recordings) gets no volume
  // control: a slider on a video with nothing to hear sends people hunting for
  // sound that is not there. build-demos.js sets data-audio from the manifest.
  if (video.getAttribute("data-audio") === "false") {
    options.controls = options.controls.filter(function (c) { return c !== "mute" && c !== "volume"; });
  }

  var player = new window.Plyr(video, options);
  var gate = window.DEMO_GATE || { doc: "pharcare-demo", api: "/server.js" };
  var authed = false;
  var hls = null;
  var current = -1;
  var countdownTimer = null;
  var lastSave = 0;

  function showError(msg) {
    var el = $("demo-error");
    if (el) { el.textContent = msg; el.hidden = false; }
  }

  function clearError() {
    var el = $("demo-error");
    if (el) el.hidden = true;
  }

  function attach(src) {
    if (hls) { hls.destroy(); hls = null; }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ capLevelToPlayerSize: true });
      hls.on(window.Hls.Events.ERROR, function (evt, d) {
        if (!d || !d.fatal) return;
        // Session ran out (or access was revoked) mid-watch: back to the gate.
        if (d.response && d.response.code === 401) {
          hls.destroy();
          hls = null;
          showGate("Your viewing session has ended. Enter your email for a new code.");
          return;
        }
        if (d.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        showError("This video could not be loaded. Please check your connection and try again.");
        hls.destroy();
        hls = null;
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src; // Safari and iOS play HLS natively
      // Native playback hides the HTTP status, so ask the server directly.
      video.onerror = function () {
        checkSession().then(function (ok) {
          if (!ok) showGate("Your viewing session has ended. Enter your email for a new code.");
          else showError("This video could not be loaded. Please check your connection and try again.");
        });
      };
    } else {
      showError("Your browser cannot play these videos. Please use a current version of Chrome, Edge, Firefox or Safari.");
    }
  }

  /* --------------------------------------------------------- viewing state */

  function watchedList() {
    try { return JSON.parse(store.get(WATCHED_KEY) || "[]"); } catch (e) { return []; }
  }

  function markWatched(slug) {
    var list = watchedList();
    if (list.indexOf(slug) === -1) {
      list.push(slug);
      store.set(WATCHED_KEY, JSON.stringify(list));
    }
    var t = tileBySlug[slug];
    if (t) t.classList.add("is-watched");
  }

  function paintProgress(slug, fraction) {
    var t = tileBySlug[slug];
    var bar = t && t.querySelector(".demo-progress i");
    if (bar) bar.style.width = Math.max(0, Math.min(1, fraction)) * 100 + "%";
  }

  function savePosition(force) {
    var v = videos[current];
    if (!v || !video.duration) return;
    var now = Date.now();
    if (!force && now - lastSave < 3000) return;
    lastSave = now;
    store.set(POS_KEY + v.slug, String(video.currentTime));
    paintProgress(v.slug, video.currentTime / video.duration);
  }

  /* ----------------------------------------------------------------- load */

  function revealTile(tile) {
    // Scroll the list, never the page, and only when the list is actually a
    // scrolling panel (desktop). On mobile the list sits below the player.
    if (!tile || !listBody || listBody.scrollHeight <= listBody.clientHeight) return;
    var top = tile.offsetTop;
    if (top < listBody.scrollTop || top + tile.offsetHeight > listBody.scrollTop + listBody.clientHeight) {
      listBody.scrollTop = top - 12;
    }
  }

  function load(i, autoplay) {
    if (i < 0 || i >= videos.length) return;
    cancelCountdown();
    $("demo-endcard").hidden = true;
    clearError();

    current = i;
    var v = videos[i];

    // Plyr reads a native poster attribute ahead of data-poster, then cancels
    // its own update when the two disagree - which pinned the first video's
    // card on deep links and tile clicks. Keep only data-poster.
    video.removeAttribute("poster");
    player.poster = v.poster;
    setGatePoster(v.poster);
    // Not yet verified: show the video's details and poster, request nothing.
    if (!authed) {
      if (hls) { hls.destroy(); hls = null; }
      autoplay = false;
    } else {
      attach(v.src);
    }

    $("demo-title").textContent = v.title;
    $("demo-desc").textContent = v.description;
    $("demo-count").textContent = i + 1 + " of " + videos.length;

    tiles.forEach(function (t) {
      var on = t.getAttribute("data-slug") === v.slug;
      t.classList.toggle("is-active", on);
      var a = t.querySelector("a");
      if (a) { if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }
    });
    revealTile(tileBySlug[v.slug]);

    try { window.history.replaceState(null, "", "?v=" + encodeURIComponent(v.slug)); } catch (e) { /* file:// etc. */ }

    var resumeAt = parseFloat(store.get(POS_KEY + v.slug) || "0");
    var onMeta = function () {
      video.removeEventListener("loadedmetadata", onMeta);
      // Resume only a meaningful partial watch; a few seconds in or near the
      // end is better started over.
      if (resumeAt > 5 && video.duration && resumeAt < video.duration - 5) video.currentTime = resumeAt;
      if (autoplay) {
        var p = player.play();
        if (p && typeof p.catch === "function") p.catch(function () { /* autoplay refused: play button stays */ });
      }
    };
    video.addEventListener("loadedmetadata", onMeta);
  }

  /* ------------------------------------------------------------- up next */

  function cancelCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    $("demo-upnext").hidden = true;
  }

  function startCountdown() {
    var next = videos[current + 1];
    if (!next) return;
    var left = COUNTDOWN_SECONDS;
    $("demo-upnext-title").textContent = next.title;
    $("demo-upnext-n").textContent = left;
    $("demo-upnext").hidden = false;
    countdownTimer = setInterval(function () {
      left -= 1;
      if (left <= 0) {
        cancelCountdown();
        load(current + 1, true);
      } else {
        $("demo-upnext-n").textContent = left;
      }
    }, 1000);
  }

  $("demo-upnext-play").addEventListener("click", function () {
    cancelCountdown();
    load(current + 1, true);
  });
  $("demo-upnext-cancel").addEventListener("click", cancelCountdown);
  $("demo-replay").addEventListener("click", function () { load(0, true); });

  /* --------------------------------------------------------------- events */

  video.addEventListener("timeupdate", function () {
    savePosition(false);
    var v = videos[current];
    if (v && video.duration && video.currentTime / video.duration > 0.9) markWatched(v.slug);
  });
  video.addEventListener("pause", function () { savePosition(true); });
  window.addEventListener("pagehide", function () { savePosition(true); });

  video.addEventListener("ended", function () {
    var v = videos[current];
    if (v) {
      store.set(POS_KEY + v.slug, "0"); // finished: next visit starts from the top
      markWatched(v.slug);
      paintProgress(v.slug, 1);
    }
    if (current < videos.length - 1) startCountdown();
    else $("demo-endcard").hidden = false;
  });

  // Deterrent only: removes "Save video as…" from the right-click menu.
  video.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  tiles.forEach(function (t) {
    var a = t.querySelector("a");
    if (!a) return;
    a.addEventListener("click", function (e) {
      // Let modified clicks open the video's own URL in a new tab.
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      load(indexBySlug[t.getAttribute("data-slug")], true);
      if (!authed) openModal();
      var stage = $("demo-stage");
      if (stage) {
        var r = stage.getBoundingClientRect();
        if (r.top < 0 || r.top > window.innerHeight * 0.6) {
          var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          stage.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
      }
    });
  });

  /* -------------------------------------------------------------- filters */

  var activeSection = "";
  var search = $("demo-search");

  function applyFilter() {
    var q = (search && search.value ? search.value : "").trim().toLowerCase();
    var anyShown = false;
    groups.forEach(function (g) {
      var shown = 0;
      Array.prototype.forEach.call(g.querySelectorAll(".demo-tile"), function (t) {
        var ok =
          (!activeSection || t.getAttribute("data-section") === activeSection) &&
          (!q || (t.getAttribute("data-search") || "").indexOf(q) !== -1);
        t.hidden = !ok;
        if (ok) shown += 1;
      });
      g.hidden = shown === 0;
      if (shown) anyShown = true;
    });
    $("demo-empty").hidden = anyShown;
  }

  if (search) search.addEventListener("input", applyFilter);

  Array.prototype.forEach.call(document.querySelectorAll(".demo-chip"), function (chip, _, all) {
    chip.addEventListener("click", function () {
      activeSection = chip.getAttribute("data-section") || "";
      Array.prototype.forEach.call(all, function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      applyFilter();
    });
  });

  /* ------------------------------------------------------------------ gate */

  var modal = $("gate-modal");
  var emailForm = $("gate-email-form");
  var codeForm = $("gate-code-form");
  var emailInput = $("gate-email");
  var sendBtn = $("gate-send");
  var verifyBtn = $("gate-verify");
  var digits = Array.prototype.slice.call(document.querySelectorAll(".gate-digit"));
  var pendingEmail = "";
  var sending = false;
  var lastFocus = null;

  function checkSession() {
    return fetch(gate.api + "/api/viewer/session/" + encodeURIComponent(gate.doc), { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.json() : { authenticated: false }; })
      .then(function (s) { return !!(s && s.authenticated); })
      .catch(function () { return false; });
  }

  function gateMsg(text, kind) {
    var el = $("gate-msg");
    el.textContent = text || "";
    el.className = "gate-msg" + (text && kind ? " is-" + kind : "");
  }

  function busy(btn, on, label) {
    btn.disabled = on;
    btn.classList.toggle("is-busy", on);
    btn.textContent = on ? label : btn.getAttribute("data-label");
  }

  function step(which) {
    var code = which === "code";
    emailForm.hidden = code;
    codeForm.hidden = !code;
    $("gate-title").textContent = code ? "Check your email" : "Watch the pharCare demos";
    var sub = $("gate-sub");
    if (code) {
      sub.textContent = "We sent a 6-digit code to ";
      var b = document.createElement("strong");
      b.textContent = pendingEmail;
      sub.appendChild(b);
      sub.appendChild(document.createTextNode(". It expires in 10 minutes."));
    } else {
      sub.textContent = "Enter your work email and we'll send you a one-time access code.";
    }
  }

  function setGatePoster(src) {
    var g = $("demo-gate");
    if (g) g.style.backgroundImage = src ? 'url("' + src + '")' : "";
  }

  /* ---- modal plumbing: scroll lock, focus trap, Esc, click-outside ---- */

  function focusables() {
    return Array.prototype.filter.call(
      modal.querySelectorAll("a[href], button:not([disabled]), input:not([disabled])"),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function focusFirstField() {
    var target = !codeForm.hidden ? digits.filter(function (d) { return !d.value; })[0] || digits[5] : emailInput;
    if (target) target.focus();
  }

  function openModal() {
    if (authed || !modal.hidden) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("gate-lock");
    // Next frame, so the opening transition runs from the hidden state.
    window.requestAnimationFrame(function () {
      modal.classList.add("is-open");
      focusFirstField();
    });
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.documentElement.classList.remove("gate-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(modal.querySelectorAll("[data-gate-close]"), function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  $("gate-open").addEventListener("click", openModal);

  // The big play button with no source loaded: ask for access instead.
  video.addEventListener("play", function () {
    if (authed) return;
    try { video.pause(); } catch (e) { /* ignore */ }
    openModal();
  });

  function showGate(message) {
    authed = false;
    try { player.pause(); } catch (e) { /* not ready */ }
    $("demo-wrap").classList.add("is-gated");
    $("demo-gate").hidden = false;
    step("email");
    gateMsg(message || "", message ? "error" : "");
    openModal();
  }

  function unlock() {
    authed = true;
    closeModal();
    $("demo-gate").hidden = true;
    $("demo-wrap").classList.remove("is-gated");
    gateMsg("");
  }

  // Answers are read as text first: on this host a misrouted request comes
  // back as an empty body or an HTML error page, not JSON.
  function post(path, body) {
    return fetch(gate.api + path, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.text().then(function (raw) {
        var data;
        try { data = raw ? JSON.parse(raw) : {}; } catch (e) { data = {}; }
        if (!r.ok) throw new Error(data.error || "Something went wrong (HTTP " + r.status + "). Please try again.");
        return data;
      });
    });
  }

  /* ---- step 1: email -> code ---- */

  function requestCode(btn) {
    if (typeof window.grecaptcha === "undefined") {
      return gateMsg("Verification failed to load. Please reload the page.", "error");
    }
    sending = btn;
    busy(btn, true, "Sending…");
    gateMsg("");
    try {
      window.grecaptcha.execute();
    } catch (err) {
      busy(btn, false);
      sending = false;
      gateMsg("Could not start verification. Please reload the page.", "error");
    }
  }

  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    emailInput.parentNode.classList.toggle("is-invalid", !valid);
    if (!valid) {
      emailInput.focus();
      return gateMsg("Enter a valid email address.", "error");
    }
    pendingEmail = email;
    requestCode(sendBtn);
  });

  emailInput.addEventListener("input", function () {
    emailInput.parentNode.classList.remove("is-invalid");
    if ($("gate-msg").classList.contains("is-error")) gateMsg("");
  });

  // Invisible reCAPTCHA calls back here with the token; named on the widget,
  // so it has to be global.
  window.onDemoGateCaptcha = function (token) {
    var btn = sending || sendBtn;
    var resend = btn !== sendBtn;
    post("/api/viewer/request-otp", { docId: gate.doc, email: pendingEmail, "g-recaptcha-response": token })
      .then(function () {
        // Advances for every address, approved or not - the server does not
        // say which, so neither can this page.
        digits.forEach(function (d) { d.value = ""; d.classList.remove("is-filled"); });
        step("code");
        gateMsg(resend ? "A new code is on its way." : "", resend ? "ok" : "");
        digits[0].focus();
      })
      .catch(function (err) { gateMsg(err.message, "error"); })
      .then(function () {
        busy(btn, false);
        sending = false;
        // Tokens are single-use.
        if (typeof window.grecaptcha !== "undefined") window.grecaptcha.reset();
      });
  };

  window.onDemoGateCaptchaError = function () {
    // Google can fire this on its own (a token expiring unused, a network
    // blip while loading). Only report it when the visitor asked for a code.
    if (!sending) return;
    busy(sending, false);
    sending = false;
    gateMsg("Verification did not complete. Please try again.", "error");
    if (typeof window.grecaptcha !== "undefined") window.grecaptcha.reset();
  };

  $("gate-resend").addEventListener("click", function () {
    if (!sending) requestCode($("gate-resend"));
  });
  $("gate-resend").setAttribute("data-label", $("gate-resend").textContent);

  $("gate-back").addEventListener("click", function () {
    step("email");
    gateMsg("");
    emailInput.focus();
    emailInput.select();
  });

  /* ---- step 2: six digit boxes ---- */

  function code() {
    return digits.map(function (d) { return d.value; }).join("");
  }

  function fillFrom(index, text) {
    var chars = String(text).replace(/\D/g, "").split("");
    for (var i = index; i < digits.length && chars.length; i++) {
      digits[i].value = chars.shift();
      digits[i].classList.add("is-filled");
    }
    var next = digits.filter(function (d) { return !d.value; })[0];
    (next || digits[digits.length - 1]).focus();
    if (code().length === 6) codeForm.requestSubmit ? codeForm.requestSubmit() : verify();
  }

  digits.forEach(function (d, i) {
    d.addEventListener("input", function () {
      var v = d.value.replace(/\D/g, "");
      if (v.length > 1) { d.value = ""; return fillFrom(i, v); } // autofill / fast typing
      d.value = v;
      d.classList.toggle("is-filled", !!v);
      codeForm.classList.remove("is-invalid");
      if (v && i < digits.length - 1) digits[i + 1].focus();
      if (code().length === 6) codeForm.requestSubmit ? codeForm.requestSubmit() : verify();
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !d.value && i > 0) {
        digits[i - 1].value = "";
        digits[i - 1].classList.remove("is-filled");
        digits[i - 1].focus();
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && i > 0) {
        digits[i - 1].focus();
      } else if (e.key === "ArrowRight" && i < digits.length - 1) {
        digits[i + 1].focus();
      }
    });
    d.addEventListener("paste", function (e) {
      var text = (e.clipboardData || window.clipboardData).getData("text");
      if (!text) return;
      e.preventDefault();
      fillFrom(i, text);
    });
    d.addEventListener("focus", function () { d.select(); });
  });

  function verify() {
    if (verifyBtn.disabled) return;
    var c = code();
    if (!/^\d{6}$/.test(c)) {
      codeForm.classList.add("is-invalid");
      return gateMsg("Enter all 6 digits from your email.", "error");
    }
    busy(verifyBtn, true, "Verifying…");
    gateMsg("");
    post("/api/viewer/verify-otp", { docId: gate.doc, email: pendingEmail, code: c })
      .then(function () {
        unlock();
        load(current, true);
      })
      .catch(function (err) {
        codeForm.classList.add("is-invalid");
        gateMsg(err.message, "error");
        digits.forEach(function (d) { d.value = ""; d.classList.remove("is-filled"); });
        digits[0].focus();
      })
      .then(function () { busy(verifyBtn, false); });
  }

  codeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    verify();
  });

  /* ---------------------------------------------------------------- start */

  var watched = watchedList();
  videos.forEach(function (v) {
    if (watched.indexOf(v.slug) !== -1) {
      var t = tileBySlug[v.slug];
      if (t) t.classList.add("is-watched");
    }
    var pos = parseFloat(store.get(POS_KEY + v.slug) || "0");
    if (pos && v.duration) paintProgress(v.slug, pos / v.duration);
  });

  var match = /[?&]v=([^&#]+)/.exec(window.location.search);
  var start = match ? indexBySlug[decodeURIComponent(match[1])] : undefined;
  // No autoplay on arrival: browsers block it with sound, and a visitor who
  // opened the page should choose when to start.
  load(start === undefined ? 0 : start, false);

  // Resume a session verified earlier (another visit, a reload); otherwise
  // ask for access straight away.
  checkSession().then(function (ok) {
    if (ok) {
      unlock();
      load(current, false);
    } else {
      openModal();
    }
  });
})();
