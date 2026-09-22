#!/usr/bin/env node
/*  Renders the pharCare demo video page from content/demos/videos.json.
 *
 *  Output: products/pharcare/demo/index.html - a static page, served by IIS
 *  directly.
 *
 *  The videos themselves are gated: only addresses on the "pharcare-demo"
 *  allow-list in server/private/viewers.json can watch. The page shows an
 *  email + one-time-code form over the player, and every playlist and segment
 *  is served by the Node app (/server.js/api/viewer/media/...) only to a
 *  verified session. demos/media/ must be a hidden segment in the server's
 *  web.config, or IIS would hand the files out directly and the gate would be
 *  decoration. Posters stay public so the page still looks like something.
 *
 *  As with the blog generator, the nav and footer are lifted from a live page,
 *  so a navigation change reaches this page on the next build with no edits.
 *
 *  No VideoObject structured data: Google cannot fetch a gated video, and
 *  VideoObjects pointing at URLs that answer 401 are reported as errors.
 *  build.js still adds the BreadcrumbList from the visible breadcrumb.
 *
 *  With no videos in the manifest nothing is written - an empty demo page is
 *  worse than no page, and every link to it would be a dead end.
 *
 *  Usage: node scripts/build-demos.js [--manifest <file>]
 */

"use strict";

const fs = require("fs");
const path = require("path");
const blog = require("./lib/blog");

const ROOT = blog.ROOT;
const ORIGIN = blog.ORIGIN;
const args = process.argv.slice(2);
const mi = args.indexOf("--manifest");
const MANIFEST = path.resolve(
  mi !== -1 && args[mi + 1] ? args[mi + 1] : path.join(ROOT, "content", "demos", "videos.json")
);

const PAGE_PATH = "/products/pharcare/demo/";
const PAGE_URL = ORIGIN + PAGE_PATH;
const PAGE_FILE = path.join(ROOT, "products", "pharcare", "demo", "index.html");
// The allow-list entry in server/private/viewers.json that gates these videos.
const GATE_DOC = "pharcare-demo";
// Always through /server.js: on this host IIS reaches Node only by that
// prefix, and server.js strips it again, so the same URL works locally.
const MEDIA = "/server.js/api/viewer/media/" + GATE_DOC + "/";

// Pinned: this code runs over every video on the page.
const PLYR = "https://cdnjs.cloudflare.com/ajax/libs/plyr/3.8.4";
const HLSJS = "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.6.15";
const GA_ID = "G-B27YZ8EL0J";

// Must stay byte-identical to the footer, /contact/ and the homepage
// PostalAddress - Google discounts an address that varies between pages.
const OFFICE =
  "3500, 3rd Main Rd, 1st Phase Girinagar, Phase 4, Banashankari 3rd Stage, Banashankari, Bengaluru, Karnataka 560085, India";

const rel = (p) => path.relative(ROOT, p);
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const safeJson = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

function clock(sec) {
  const s = Math.max(0, Math.round(sec || 0));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

const describe = (v) => v.description || "A short pharCare walkthrough: " + v.title + ".";

function load() {
  const m = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const sections = Array.isArray(m.sections) ? m.sections : [];
  const videos = Array.isArray(m.videos) ? m.videos : [];
  const known = new Set(sections.map((s) => s.id));

  const problems = [];
  const seen = new Set();
  for (const v of videos) {
    if (!/^[a-z0-9-]{1,60}$/.test(v.slug || "")) problems.push('invalid slug "' + v.slug + '"');
    if (seen.has(v.slug)) problems.push('duplicate slug "' + v.slug + '"');
    seen.add(v.slug);
    if (!v.title) problems.push('"' + v.slug + '" has no title');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.uploaded || "")) problems.push('"' + v.slug + '" needs "uploaded": "YYYY-MM-DD"');
  }
  if (problems.length) throw new Error(rel(MANIFEST) + ":\n  - " + problems.join("\n  - "));

  // Play order is section order first, then manifest order within a section.
  const groups = sections
    .map((s) => ({ id: s.id, name: s.name, videos: videos.filter((v) => v.section === s.id) }))
    .filter((g) => g.videos.length);
  const orphans = videos.filter((v) => !known.has(v.section));
  if (orphans.length) groups.push({ id: "more", name: "More demos", videos: orphans });

  const order = [];
  groups.forEach((g) => g.videos.forEach((v) => order.push(Object.assign({}, v, { sectionId: g.id, sectionName: g.name }))));
  return { page: m.page || {}, groups, order, orphans };
}

function tile(v, n) {
  const search = (v.title + " " + describe(v) + " " + v.sectionName).toLowerCase();
  return (
    `<li class="demo-tile" data-slug="${esc(v.slug)}" data-section="${esc(v.sectionId)}" data-search="${esc(search)}">` +
    `<a class="demo-tile-link" href="?v=${esc(v.slug)}">` +
    `<span class="demo-thumb"><img src="${MEDIA}${esc(v.slug)}/poster.jpg" alt="" loading="lazy" width="160" height="90">` +
    `<span class="demo-dur">${clock(v.duration)}</span><span class="demo-progress"><i></i></span></span>` +
    `<span class="demo-meta"><span class="demo-num">${String(n).padStart(2, "0")}</span>` +
    `<strong>${esc(v.title)}</strong><span class="demo-desc">${esc(describe(v))}</span></span>` +
    `<span class="demo-tick" aria-hidden="true">&#10003;</span>` +
    `</a></li>`
  );
}

/*  Same site key as the contact form, read from it so there is one place to
 *  change it. Invisible v2, like the document viewer. */
function recaptchaSiteKey() {
  try {
    const html = fs.readFileSync(path.join(ROOT, "contact", "index.html"), "utf8");
    const m = /data-sitekey="([^"]+)"/.exec(html);
    if (m) return m[1];
  } catch {
    /* fall through */
  }
  throw new Error("could not find the reCAPTCHA site key in contact/index.html");
}

const ICON_LOCK =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="4" y="10.5" width="16" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
const ICON_MAIL =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="m4 7 8 6 8-6"/></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';

/*  The sign-in modal: email, then a 6-digit code. Same flow as the document
 *  viewer, which answers identically for approved and unknown addresses so
 *  the allow-list cannot be probed. demo-player.js drives it; it opens on
 *  arrival for anyone without a verified session, and again on any attempt to
 *  play. The page behind it is blurred, not hidden - titles stay readable
 *  once it is closed. */
function gateModal() {
  const digits = Array.from({ length: 6 }, (_, i) =>
    `<input class="gate-digit" id="gate-d${i}" inputmode="numeric" maxlength="1" pattern="[0-9]*"` +
    ` autocomplete="${i === 0 ? "one-time-code" : "off"}" aria-label="Digit ${i + 1}">`
  ).join("");

  return (
    `<div class="gate-modal" id="gate-modal" hidden>` +
    `<div class="gate-backdrop" data-gate-close></div>` +
    `<div class="gate-dialog" role="dialog" aria-modal="true" aria-labelledby="gate-title" aria-describedby="gate-sub">` +
    `<button type="button" class="gate-close" data-gate-close aria-label="Close">${ICON_CLOSE}</button>` +
    `<span class="gate-icon" aria-hidden="true">${ICON_LOCK}</span>` +
    `<h2 class="gate-title" id="gate-title">Watch the pharCare demos</h2>` +
    `<p class="gate-sub" id="gate-sub">Enter your work email and we'll send you a one-time access code.</p>` +

    `<form class="gate-form" id="gate-email-form" novalidate>` +
    `<label class="gate-label" for="gate-email">Work email</label>` +
    `<div class="gate-field"><span class="gate-field-icon" aria-hidden="true">${ICON_MAIL}</span>` +
    `<input type="email" id="gate-email" name="email" autocomplete="email" placeholder="name@company.com" spellcheck="false" required></div>` +
    `<button type="submit" class="gate-btn" id="gate-send" data-label="Send access code">Send access code</button>` +
    `</form>` +

    `<form class="gate-form" id="gate-code-form" novalidate hidden>` +
    `<div class="gate-label-row"><label class="gate-label" for="gate-d0">6-digit code</label>` +
    `<button type="button" class="gate-link" id="gate-back">Change email</button></div>` +
    `<div class="gate-otp" id="gate-otp">${digits}</div>` +
    `<button type="submit" class="gate-btn" id="gate-verify" data-label="Verify and watch">Verify and watch</button>` +
    `<p class="gate-resend">Didn't get it? Check your spam folder, or <button type="button" class="gate-link" id="gate-resend">send a new code</button>.</p>` +
    `</form>` +

    `<p class="gate-msg" id="gate-msg" role="status" aria-live="polite"></p>` +
    `<div class="gate-foot">` +
    `<p>Access is limited to approved email addresses. No access yet? <a href="/contact/">Request a demo</a></p>` +
    // The badge is hidden in demo.css; Google requires this line instead.
    `<p class="gate-legal">Protected by reCAPTCHA. Google <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">Privacy</a>` +
    ` and <a href="https://policies.google.com/terms" rel="noopener" target="_blank">Terms</a> apply.</p>` +
    `</div>` +
    `<div class="g-recaptcha" data-sitekey="${esc(recaptchaSiteKey())}" data-size="invisible"` +
    ` data-callback="onDemoGateCaptcha" data-error-callback="onDemoGateCaptchaError" data-expired-callback="onDemoGateCaptchaError"></div>` +
    `</div></div>`
  );
}

function render({ page, groups, order }) {
  const chrome = blog.getChrome();
  const first = order[0];
  const title = (page.title || "pharCare product demos") + " | LiVEUO";
  const description = page.description || "Watch pharCare demo videos, step by step.";
  const heading = page.heading || "See pharCare in action";
  const lede = page.lede || "";
  const firstPoster = ORIGIN + MEDIA + first.slug + "/poster.jpg";

  const data = order.map((v) => ({
    slug: v.slug,
    title: v.title,
    description: describe(v),
    section: v.sectionId,
    duration: Math.round(v.duration || 0),
    poster: MEDIA + v.slug + "/poster.jpg",
    src: MEDIA + v.slug + "/index.m3u8"
  }));

  let n = 0;
  const lists = groups
    .map(
      (g) =>
        `<div class="demo-group" data-section="${esc(g.id)}"><h3>${esc(g.name)}</h3>` +
        `<ol class="demo-tiles">${g.videos.map((v) => tile(order[n], ++n)).join("")}</ol></div>`
    )
    .join("");

  const chips =
    groups.length > 1
      ? `<div class="demo-chips" role="toolbar" aria-label="Filter by topic">` +
        `<button type="button" class="demo-chip is-active" data-section="" aria-pressed="true">All</button>` +
        groups
          .map((g) => `<button type="button" class="demo-chip" data-section="${esc(g.id)}" aria-pressed="false">${esc(g.name)}</button>`)
          .join("") +
        `</div>`
      : "";

  const head =
    `<!DOCTYPE html><html lang="en"><head>` +
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>` +
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}");</script>` +
    `<meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>` +
    `<meta name="robots" content="index, follow"/><meta name="author" content="LiVEUO"/><meta name="theme-color" content="#3a6cb5"/>` +
    `<title>${esc(title)}</title><meta name="description" content="${esc(description)}"/>` +
    `<link rel="canonical" href="${PAGE_URL}"/>` +
    `<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml"/><link rel="apple-touch-icon" href="/assets/logo-mark.svg"/>` +
    `<meta property="og:type" content="website"/><meta property="og:site_name" content="LiVEUO"/><meta property="og:locale" content="en_US"/>` +
    `<meta property="og:url" content="${PAGE_URL}"/><meta property="og:title" content="${esc(title)}"/>` +
    `<meta property="og:description" content="${esc(description)}"/><meta property="og:image" content="${esc(firstPoster)}"/>` +
    `<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(title)}"/>` +
    `<meta name="twitter:description" content="${esc(description)}"/><meta name="twitter:image" content="${esc(firstPoster)}"/>` +
    `<link rel="stylesheet" href="/_next/static/chunks/3plzysnn66upc.css" data-precedence="next"/>` +
    `<link rel="preconnect" href="https://fonts.googleapis.com"/>` +
    `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=Inter:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>` +
    `<link rel="stylesheet" href="${PLYR}/plyr.css"/><link rel="stylesheet" href="/assets/demo.css"/>` +
    `</head><body>`;

  const main =
    `<section class="demo-hero"><div class="container">` +
    `<div class="breadcrumb"><a href="/">Home</a> / <a href="/products/pharcare/">pharCare</a> / <span>Demo videos</span></div>` +
    `<h1>${esc(heading)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}` +
    `</div></section>` +
    `<section class="demo-section"><div class="container demo-layout">` +
    `<div class="demo-stage" id="demo-stage">` +
    `<div class="demo-player-wrap is-gated" id="demo-wrap">` +
    // data-poster, not poster: Plyr reads the native attribute first, so a
    // native poster would pin the first video's card whenever another one is
    // loaded (a deep link, a tile click). data-audio lets a silent-by-design
    // library drop the volume control - see page.audio in the manifest.
    `<video id="demo-video" playsinline controls preload="none" controlslist="nodownload" disablepictureinpicture` +
    ` data-poster="${esc(MEDIA + first.slug)}/poster.jpg" data-icon-url="${PLYR}/plyr.svg"` +
    ` data-audio="${page.audio === false ? "false" : "true"}"></video>` +
    `<div class="demo-overlay" id="demo-upnext" hidden><div>` +
    `<div class="demo-overlay-kicker">Up next in <span id="demo-upnext-n">5</span>s</div>` +
    `<div class="demo-overlay-title" id="demo-upnext-title"></div>` +
    `<div class="demo-overlay-actions"><button type="button" class="btn btn-light" id="demo-upnext-play">Play now</button>` +
    `<button type="button" class="demo-overlay-link" id="demo-upnext-cancel">Cancel</button></div>` +
    `</div></div>` +
    // Locked state of the player. The sign-in itself is the modal below; this
    // is what remains over the player when the modal is closed.
    `<div class="demo-gate" id="demo-gate"><div class="demo-gate-card">` +
    `<span class="demo-gate-lock" aria-hidden="true">${ICON_LOCK}</span>` +
    `<div class="demo-overlay-title">These demos are for approved viewers</div>` +
    `<button type="button" class="btn btn-light" id="gate-open">Get access</button>` +
    `</div></div>` +
    `<div class="demo-overlay" id="demo-endcard" hidden><div>` +
    `<div class="demo-overlay-kicker">That's every demo</div>` +
    `<div class="demo-overlay-title">See pharCare running on your own stock list.</div>` +
    `<div class="demo-overlay-actions"><a class="btn btn-light" href="/contact/">Book a live demo</a>` +
    `<button type="button" class="demo-overlay-link" id="demo-replay">Watch again</button></div>` +
    `</div></div>` +
    `</div>` +
    `<div class="demo-error" id="demo-error" role="alert" hidden></div>` +
    `<noscript><p class="demo-error">These demos need JavaScript to play.</p></noscript>` +
    `<div class="demo-now"><span class="demo-now-count" id="demo-count">1 of ${order.length}</span>` +
    `<h2 id="demo-title">${esc(first.title)}</h2><p id="demo-desc">${esc(describe(first))}</p></div>` +
    `</div>` +
    `<aside class="demo-list" aria-label="Demo videos">` +
    `<div class="demo-list-head"><input type="search" id="demo-search" placeholder="Search ${order.length} demos" aria-label="Search demos" autocomplete="off">${chips}</div>` +
    `<div class="demo-list-body" id="demo-list">${lists}<p class="demo-empty" id="demo-empty" hidden>No demos match your search.</p></div>` +
    `</aside>` +
    `</div></section>` +
    `<section style="padding-top:0"><div class="container"><div class="cta-banner"><div>` +
    `<div class="eyebrow" style="color:#A9B2C3">Ready when you are</div>` +
    `<h2>Want to see it on your own data?</h2>` +
    `<a class="btn btn-light" style="margin-top:10px" href="/contact/">Book a live demo</a></div>` +
    `<div class="cta-contact"><div>EMAIL<strong>info@liveuo.com</strong></div>` +
    `<div>PHONE<strong><a href="tel:+918050718269">+91 80507 18269</a></strong></div>` +
    `<div>OFFICE<strong>${OFFICE}</strong></div></div></div></div></section>`;

  const tail =
    gateModal() +
    `<script type="application/json" id="demo-data">${safeJson(data)}</script>` +
    `<script>window.DEMO_GATE=${safeJson({ doc: GATE_DOC, api: "/server.js" })};</script>` +
    `<script src="https://www.google.com/recaptcha/api.js" async defer></script>` +
    `<script src="${HLSJS}/hls.min.js"></script>` +
    `<script src="${PLYR}/plyr.min.js"></script>` +
    `<script src="/assets/demo-player.js"></script>` +
    chrome.scripts +
    `</body></html>`;

  return head + chrome.nav + main + chrome.footer + tail;
}

/*  Adds or refreshes this page's <url> in sitemap.xml, outside the blog's
 *  generated block so the daily publisher never rewrites it. lastmod is the
 *  newest upload date, not today, so rebuilding changes nothing on its own. */
function updateSitemap(order) {
  const file = path.join(ROOT, "sitemap.xml");
  if (!fs.existsSync(file)) return "skipped (no sitemap.xml)";
  const xml = fs.readFileSync(file, "utf8");
  const lastmod = order.map((v) => v.uploaded).sort().pop();
  const line =
    "  <url><loc>" + PAGE_URL + "</loc><lastmod>" + lastmod + "</lastmod>" +
    "<changefreq>monthly</changefreq><priority>0.8</priority></url>";

  const mine = new RegExp("^[ \\t]*<url><loc>" + escRe(PAGE_URL) + "</loc>.*</url>[ \\t]*$", "m");
  let next;
  if (mine.test(xml)) {
    next = xml.replace(mine, line);
  } else {
    const anchor = new RegExp("^([ \\t]*<url><loc>" + escRe(ORIGIN + "/products/pharcare/") + "</loc>.*</url>)[ \\t]*$", "m");
    next = anchor.test(xml) ? xml.replace(anchor, "$1\n" + line) : xml.replace("</urlset>", line + "\n</urlset>");
  }
  if (next === xml) return "unchanged";
  fs.writeFileSync(file, next, "utf8");
  return "updated";
}

function main() {
  const model = load();
  if (!model.order.length) {
    console.log("demos - no videos in " + rel(MANIFEST) + "; page not generated.");
    return;
  }

  fs.mkdirSync(path.dirname(PAGE_FILE), { recursive: true });
  fs.writeFileSync(PAGE_FILE, render(model), "utf8");

  console.log("demos - " + model.order.length + " video(s) in " + model.groups.length + " section(s) -> " + rel(PAGE_FILE));
  console.log("  sitemap: " + updateSitemap(model.order));

  if (model.orphans.length) {
    console.log("  note: " + model.orphans.length + ' video(s) have an unknown section and appear under "More demos":');
    model.orphans.forEach((v) => console.log("    - " + v.slug + ' (section "' + (v.section || "") + '")'));
  }
  const noDesc = model.order.filter((v) => !v.description);
  if (noDesc.length) {
    console.log("  note: " + noDesc.length + " video(s) have no description; a generic one is used:");
    noDesc.forEach((v) => console.log("    - " + v.slug));
  }
  // Media is uploaded by hand, so a missing local copy is a reminder, not an
  // error - it may already be on the server.
  const missing = model.order.filter((v) => !fs.existsSync(path.join(ROOT, "demos", "media", v.slug, "index.m3u8")));
  if (missing.length) {
    console.log("  note: not in demos/media/ locally - make sure these are on the server:");
    missing.forEach((v) => console.log("    - " + v.slug));
  }
}

try {
  main();
} catch (err) {
  console.error("build-demos: " + err.message);
  process.exit(1);
}
