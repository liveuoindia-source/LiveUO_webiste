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
 *  window.DEMO_GATE. Until then the page shows the gate over the player and
 *  nothing is requested but posters.
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
      if (!authed) focusGate();
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

  function checkSession() {
    return fetch(gate.api + "/api/viewer/session/" + encodeURIComponent(gate.doc), { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.json() : { authenticated: false }; })
      .then(function (s) { return !!(s && s.authenticated); })
      .catch(function () { return false; });
  }

  function gateMsg(text, isError) {
    var el = $("gate-msg");
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("is-error", !!isError);
  }

  function gateStep(which) {
    $("gate-step-email").hidden = which !== "email";
    $("gate-step-code").hidden = which !== "code";
  }

  function setGatePoster(src) {
    var g = $("demo-gate");
    if (g) g.style.backgroundImage = src ? 'url("' + src + '")' : "";
  }

  function focusGate() {
    var input = $("gate-step-code").hidden ? $("gate-email") : $("gate-code");
    if (input) input.focus({ preventScroll: true });
  }

  function showGate(message) {
    authed = false;
    try { player.pause(); } catch (e) { /* not ready */ }
    $("demo-wrap").classList.add("is-gated");
    $("demo-gate").hidden = false;
    gateStep("email");
    gateMsg(message || "", !!message);
  }

  function unlock() {
    authed = true;
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

  var sendBtn = $("gate-send");

  $("gate-email-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("gate-email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return gateMsg("Enter a valid email address.", true);
    if (typeof window.grecaptcha === "undefined") {
      return gateMsg("Verification failed to load. Please reload the page.", true);
    }
    sendBtn.disabled = true;
    gateMsg("Verifying…");
    try {
      window.grecaptcha.execute();
    } catch (err) {
      sendBtn.disabled = false;
      gateMsg("Could not start verification. Please reload the page.", true);
    }
  });

  // Invisible reCAPTCHA calls back here with the token; named on the widget,
  // so it has to be global.
  window.onDemoGateCaptcha = function (token) {
    var email = $("gate-email").value.trim();
    gateMsg("Sending…");
    post("/api/viewer/request-otp", { docId: gate.doc, email: email, "g-recaptcha-response": token })
      .then(function () {
        // Advances for every address, approved or not - the server does not
        // say which, so neither can this page.
        $("gate-sent-to").textContent = email;
        gateStep("code");
        gateMsg("");
        $("gate-code").value = "";
        $("gate-code").focus();
      })
      .catch(function (err) { gateMsg(err.message, true); })
      .then(function () {
        sendBtn.disabled = false;
        // Tokens are single-use.
        if (typeof window.grecaptcha !== "undefined") window.grecaptcha.reset();
      });
  };

  window.onDemoGateCaptchaError = function () {
    // Google can fire this on its own (a token expiring unused, a network
    // blip while loading). Only report it when the visitor pressed Send.
    if (!sendBtn.disabled) return;
    sendBtn.disabled = false;
    gateMsg("Verification did not complete. Please try again.", true);
    if (typeof window.grecaptcha !== "undefined") window.grecaptcha.reset();
  };

  $("gate-code-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var code = $("gate-code").value.trim();
    if (!/^\d{6}$/.test(code)) return gateMsg("Enter the 6-digit code from your email.", true);
    var btn = $("gate-verify");
    btn.disabled = true;
    gateMsg("Checking…");
    post("/api/viewer/verify-otp", { docId: gate.doc, email: $("gate-sent-to").textContent, code: code })
      .then(function () {
        unlock();
        load(current, true);
      })
      .catch(function (err) { gateMsg(err.message, true); })
      .then(function () { btn.disabled = false; });
  });

  $("gate-back").addEventListener("click", function () {
    gateStep("email");
    gateMsg("");
    $("gate-email").focus();
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

  // Resume a session verified earlier (another visit, a reload).
  checkSession().then(function (ok) {
    if (ok) {
      unlock();
      load(current, false);
    }
  });
})();
