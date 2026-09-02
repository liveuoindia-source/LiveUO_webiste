/*  LiVEUO — front-end interactions & animation.
 *  Uses the Motion library (window.Motion, vendored from /assets/motion.js) for
 *  catchy, physics-based motion, with graceful fallbacks when it's unavailable
 *  or the visitor prefers reduced motion.
 */
(function () {
  "use strict";

  var M = window.Motion || null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- helpers ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $all(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }

  ready(function () {
    revealOnScroll();
    heroIntro();
    animateCounters();
    magneticButtons();
    stickyNav();
    mobileNav();
    megaMenu();
    faqAccordion();
    scrollTopButton();
    whatsappWidget();
  });

  /* ---------- scroll reveals (staggered) ----------
   * Visibility is driven by a native IntersectionObserver toggling the
   * `.visible` class (CSS handles the fade), so content is NEVER left hidden
   * even if the animation library is missing. Motion just adds a nicer,
   * staggered entrance on top when available.
   */
  function revealOnScroll() {
    var items = $all(".reveal");
    if (!items.length) return;

    function show(el) {
      if (el.dataset.shown) return;
      el.dataset.shown = "1";
      el.classList.add("visible");   // .pre.visible transitions to opacity 1
    }

    // No animation support → make sure everything is simply visible.
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var vh = window.innerHeight;
    var deferred = [];
    items.forEach(function (el) {
      // Above / near the fold: show immediately (no animation, no risk).
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.classList.add("visible");
      } else {
        el.classList.add("pre");     // hide only what we intend to animate in
        deferred.push(el);
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    deferred.forEach(function (el) { io.observe(el); });

    // Hard failsafe: whatever the observer misses becomes visible anyway.
    setTimeout(function () {
      deferred.forEach(function (el) { if (!el.dataset.shown) show(el); });
    }, 3000);
  }

  /* ---------- hero entrance ---------- */
  function heroIntro() {
    var hero = $(".hero");
    if (!hero) return;
    var pieces = $all(".hero .eyebrow, .hero h1, .hero .lede, .hero-cta, .hero-meta, .network-wrap");
    if (!pieces.length) return;

    if (reduce || !M || !M.animate) {
      pieces.forEach(function (el) { el.style.opacity = 1; });
      return;
    }
    pieces.forEach(function (el) { el.style.opacity = 0; });
    M.animate(
      pieces,
      { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0px)"] },
      { duration: 0.7, delay: M.stagger ? M.stagger(0.12) : 0, easing: [0.16, 1, 0.3, 1] }
    );
    // Failsafe: force the hero fully visible shortly after, no matter what.
    setTimeout(function () { pieces.forEach(function (el) { el.style.opacity = 1; }); }, 1600);
  }

  /* ---------- animated counters ---------- */
  function animateCounters() {
    var nums = $all(".hero-meta strong, .spotlight-stats strong");
    if (!nums.length) return;

    nums.forEach(function (el) {
      var raw = el.textContent.trim();
      var match = raw.match(/([\d.]+)/);
      if (!match) return;
      var target = parseFloat(match[1]);
      var prefix = raw.slice(0, match.index);
      var suffix = raw.slice(match.index + match[1].length);
      var decimals = (match[1].split(".")[1] || "").length;

      function run() {
        if (reduce || !M || !M.animate) { el.textContent = raw; return; }
        M.animate(0, target, {
          duration: 1.4,
          easing: "ease-out",
          onUpdate: function (v) {
            el.textContent = prefix + v.toFixed(decimals) + suffix;
          }
        });
      }

      if (M && M.inView) {
        M.inView(el, function () { run(); return function () {}; }, { amount: 0.6 });
      } else { run(); }
    });
  }

  /* ---------- magnetic primary buttons ---------- */
  function magneticButtons() {
    if (reduce || !M || !M.animate) return;
    $all(".btn-primary, .btn-light").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        M.animate(btn, { transform: "translate(" + x + "px," + y + "px)" }, { duration: 0.25 });
      });
      btn.addEventListener("mouseleave", function () {
        M.animate(btn, { transform: "translate(0px,0px)" }, { type: "spring", stiffness: 300, damping: 18 });
      });
    });
  }

  /* ---------- nav: condensed + shadow on scroll ---------- */
  function stickyNav() {
    var nav = $(".nav");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 12) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav toggle ---------- */
  function mobileNav() {
    var toggle = $(".nav-toggle");
    var links = $(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $all(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("is-open");
      });
    });
  }

  /* ---------- scroll-to-top button (fixed, site-wide) ---------- */
  function scrollTopButton() {
    if ($(".scroll-top")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Scroll back to top");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
    document.body.appendChild(btn);

    function toggle() {
      if (window.pageYOffset > 400) btn.classList.add("show");
      else btn.classList.remove("show");
    }
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- WhatsApp floating chat widget (site-wide) ---------- */
  function whatsappWidget() {
    if ($(".wa-widget")) return;

    var phone = "918050718269"; // +91 80507 18269
    var msg = "Hi LiVEUO, I'd like to know more about your services.";
    var link = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);

    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    var time = h + ":" + (m < 10 ? "0" + m : m) + " " + ampm;

    var waIcon = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 4C9.4 4 4 9.4 4 16.03c0 2.12.55 4.16 1.6 5.97L4 28l6.16-1.6a12 12 0 0 0 5.88 1.5h.01c6.63 0 12.03-5.4 12.03-12.03 0-3.21-1.25-6.23-3.52-8.5A11.94 11.94 0 0 0 16.04 4zm0 2.18c2.62 0 5.08 1.02 6.93 2.88a9.73 9.73 0 0 1 2.87 6.94c0 5.4-4.4 9.8-9.8 9.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.22-3.66.96.98-3.57-.24-.37a9.72 9.72 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.83-9.8zm-5.5 5.2c-.26 0-.68.1-1.04.5-.36.4-1.36 1.33-1.36 3.24s1.4 3.76 1.6 4.02c.2.26 2.75 4.2 6.66 5.88.93.4 1.65.64 2.22.82.93.3 1.78.26 2.45.16.75-.11 2.3-.94 2.62-1.84.32-.9.32-1.68.22-1.84-.1-.16-.36-.26-.75-.46-.4-.2-2.3-1.13-2.66-1.26-.36-.13-.62-.2-.88.2-.26.4-1 1.26-1.23 1.52-.22.26-.45.3-.84.1-.4-.2-1.67-.62-3.18-1.96-1.18-1.05-1.97-2.35-2.2-2.75-.22-.4-.02-.6.18-.8.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.26.06-.5-.04-.7-.1-.2-.88-2.12-1.2-2.9-.32-.76-.64-.66-.88-.67-.22-.01-.48-.01-.74-.01z"/></svg>';
    var xIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';

    var w = document.createElement("div");
    w.className = "wa-widget";
    w.innerHTML =
      '<div class="wa-panel" role="dialog" aria-label="Chat with LiVEUO on WhatsApp">' +
        '<div class="wa-header">' +
          '<span class="wa-avatar"><img src="/assets/logo-mark.svg" alt="LiVEUO" /></span>' +
          '<div class="wa-head-text"><strong>LiVEUO</strong><span>Typically replies within minutes</span></div>' +
          '<button class="wa-close" type="button" aria-label="Close chat">' + xIcon + '</button>' +
        '</div>' +
        '<div class="wa-body">' +
          '<div class="wa-bubble"><div class="wa-name">LiVEUO</div>' +
          '<p>Hi there! &#128075; How can we help you today?</p>' +
          '<span class="wa-time">' + time + '</span></div>' +
        '</div>' +
        '<a class="wa-cta" href="' + link + '" target="_blank" rel="noopener">' + waIcon + ' Start Chat</a>' +
      '</div>' +
      '<button class="wa-toggle" type="button" aria-label="Open WhatsApp chat" aria-expanded="false">' + waIcon + '</button>';
    document.body.appendChild(w);

    var toggle = $(".wa-toggle", w);
    var closeBtn = $(".wa-close", w);

    function open() { w.classList.add("open"); toggle.setAttribute("aria-expanded", "true"); }
    function close() { w.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }

    toggle.addEventListener("click", function () {
      if (w.classList.contains("open")) close(); else open();
    });
    closeBtn.addEventListener("click", close);
    document.addEventListener("click", function (e) { if (!w.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- mega-menu (Products / Solutions / Resources / Company) ----------
   * Click-to-toggle rather than hover, so it works identically on touch and
   * desktop, and behaves as an accordion inside the mobile full-screen panel.
   */
  function megaMenu() {
    var items = $all(".has-mega");
    if (!items.length) return;

    function closeAll(except) {
      items.forEach(function (li) {
        if (li !== except) {
          li.classList.remove("open");
          var t = $(".nav-mega-toggle", li);
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
    }

    items.forEach(function (li) {
      var toggle = $(".nav-mega-toggle", li);
      if (!toggle) return;
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = !li.classList.contains("open");
        closeAll(willOpen ? li : null);
        li.classList.toggle("open", willOpen);
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".has-mega")) closeAll(null);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll(null);
    });
  }

  /* ---------- FAQ accordion ---------- */
  function faqAccordion() {
    $all(".faq-item").forEach(function (item) {
      var q = $(".faq-q", item);
      if (!q) return;
      q.addEventListener("click", function () {
        item.classList.toggle("open");
      });
    });
  }
})();
