#!/usr/bin/env node
/*  Builds the Digital Marketing service page.
 *
 *  Output: services/digital-marketing/index.html - a static page, served by
 *  IIS like every other page on the site.
 *
 *  The page repeats one card layout across 15 services and 24 industries, so
 *  the copy lives in scripts/lib/digital-marketing-data.js and this file only
 *  lays it out. As with the blog and demo generators, the nav and footer are
 *  lifted from a live page, so a navigation change reaches this page on the
 *  next build with no edits.
 *
 *  BreadcrumbList and FAQPage JSON-LD are added afterwards by scripts/build.js
 *  from the visible markup - do not add them here.
 *
 *  Usage: node scripts/build-digital-marketing.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const blog = require("./lib/blog");
const D = require("./lib/digital-marketing-data");

const ROOT = path.join(__dirname, "..");
const ORIGIN = "https://www.liveuo.com";
const PAGE_PATH = "/services/digital-marketing/";
const PAGE_FILE = path.join(ROOT, "services", "digital-marketing", "index.html");
const CONTACT = "/contact/?interest=digital-marketing";

// Must stay byte-identical to the footer and /contact/.
const OFFICE = "3500, 3rd Main Rd, 1st Phase Girinagar, Phase 4, Banashankari 3rd Stage, Banashankari, Bengaluru, Karnataka 560085, India";

const TITLE = "Digital Marketing Services for Every Industry | LiVEUO";
const DESCRIPTION =
  "SEO, Google Ads, social media, WhatsApp, content and marketing automation, planned around your industry. Browse channel and campaign plans for 24 sectors and book a free consultation.";
const KEYWORDS =
  "digital marketing services, digital marketing company Bengaluru, SEO services India, Google Ads management, social media marketing, WhatsApp marketing, content marketing, marketing automation, local SEO, digital marketing for small business";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Content-hashed query string, so a changed stylesheet or script is never
 * served stale from a browser or CDN cache. */
function versioned(asset) {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, asset.replace(/^\//, "")))).digest("hex");
  return asset + "?v=" + hash.slice(0, 10);
}

function icon(name, attrs) {
  if (!D.ICONS[name]) throw new Error("Unknown icon: " + name);
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"${attrs || ""}>${D.ICONS[name]}</svg>`;
}

const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"></path></svg>';

function sectionHead(eyebrow, heading, lede, centered) {
  const style = centered ? ' style="text-align:center;max-width:720px;margin:0 auto 40px"' : ' style="max-width:720px;margin-bottom:36px"';
  const eb = centered ? ' style="justify-content:center"' : "";
  return (
    `<div class="reveal"${style}><div class="eyebrow"${eb}>${esc(eyebrow)}</div>` +
    `<h2>${esc(heading)}</h2>${lede ? `<p>${esc(lede)}</p>` : ""}</div>`
  );
}

function iconCard([ic, title, text], tint) {
  return (
    `<article class="service-card dm-card"><div class="service-icon dm-tint-${tint}">${icon(ic)}</div>` +
    `<h3>${esc(title)}</h3><p>${esc(text)}</p></article>`
  );
}

function pills(items) {
  return `<div class="dm-pills">${items.map((i) => `<span>${esc(i)}</span>`).join("")}</div>`;
}

function industry(ind) {
  const group = D.GROUPS.find((g) => g[0] === ind.group);
  if (!group) throw new Error("Unknown group for " + ind.id);
  // Everything the directory search should match, lower-cased once here.
  const haystack = [ind.name, ind.who, group[1], ind.channels.join(" "), ind.kpis.join(" ")].join(" ").toLowerCase();
  return (
    `<details class="dm-ind" id="industry-${ind.id}" data-group="${ind.group}" data-search="${esc(haystack)}">` +
    `<summary><span class="dm-ind-icon">${icon(ind.icon)}</span>` +
    `<span class="dm-ind-head"><span class="dm-ind-name">${esc(ind.name)}</span>` +
    `<span class="dm-ind-who">${esc(ind.who)}</span></span>` +
    `<span class="dm-ind-goal"><span class="dm-label">Main goal</span>${esc(ind.goal)}</span>` +
    `<span class="dm-ind-chev" aria-hidden="true"></span></summary>` +
    `<div class="dm-ind-body">` +
    `<div><h4>Target audience</h4><p>${esc(ind.audience)}</p></div>` +
    `<div><h4>Main challenges</h4><p>${esc(ind.challenges)}</p></div>` +
    `<div><h4>Best channels</h4>${pills(ind.channels)}</div>` +
    `<div><h4>KPIs to track</h4>${pills(ind.kpis)}</div>` +
    `<div><h4>Campaign ideas</h4><ul>${ind.ideas.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>` +
    `<div><h4>Expected benefit</h4><p>${esc(ind.benefit)}</p></div>` +
    `<div class="dm-ind-example"><h4>Example campaign</h4><p>${esc(ind.example)}</p></div>` +
    `</div></details>`
  );
}

function render() {
  const chrome = blog.getChrome();
  const url = ORIGIN + PAGE_PATH;

  const serviceNode = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Digital Marketing",
    url,
    provider: { "@type": "Organization", name: "LiVEUO", url: ORIGIN + "/" },
    areaServed: "IN",
    serviceType: "Digital marketing services",
    description: DESCRIPTION,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital marketing services",
      itemListElement: D.SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s[1] } }))
    }
  };

  const head =
    `<!DOCTYPE html>\n<html lang="en">\n<head>` +
    `<script async src="https://www.googletagmanager.com/gtag/js?id=G-B27YZ8EL0J"></script>` +
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-B27YZ8EL0J");</script>\n` +
    `<meta charSet="utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n` +
    `<meta name="robots" content="index, follow"/>\n<meta name="author" content="LiVEUO"/>\n<meta name="theme-color" content="#3a6cb5"/>\n` +
    `<meta name="keywords" content="${esc(KEYWORDS)}"/>\n` +
    `<link rel="canonical" href="${url}"/>\n` +
    `<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml"/>\n<link rel="apple-touch-icon" href="/assets/logo-mark.svg"/>\n` +
    `<meta property="og:type" content="website"/>\n<meta property="og:site_name" content="LiVEUO"/>\n<meta property="og:locale" content="en_US"/>\n` +
    `<meta property="og:url" content="${url}"/>\n<meta property="og:title" content="${esc(TITLE)}"/>\n` +
    `<meta property="og:description" content="${esc(DESCRIPTION)}"/>\n<meta property="og:image" content="${ORIGIN}/assets/logo-mark.svg"/>\n` +
    `<meta name="twitter:card" content="summary_large_image"/>\n<meta name="twitter:title" content="${esc(TITLE)}"/>\n` +
    `<meta name="twitter:description" content="${esc(DESCRIPTION)}"/>\n<meta name="twitter:image" content="${ORIGIN}/assets/logo-mark.svg"/>\n` +
    `<link rel="stylesheet" href="/_next/static/chunks/3plzysnn66upc.css" data-precedence="next"/>\n` +
    `<link rel="preconnect" href="https://fonts.googleapis.com"/>\n` +
    `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=Inter:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>\n` +
    `<link rel="stylesheet" href="${versioned("/assets/digital-marketing.css")}"/>\n` +
    `<title>${esc(TITLE)}</title>\n<meta name="description" content="${esc(DESCRIPTION)}"/>\n` +
    `<script type="application/ld+json">${JSON.stringify(serviceNode)}</script>\n` +
    `</head>\n<body>\n`;

  const jump = [
    ["services", "Services"],
    ["industries", "Industries"],
    ["goals", "Goals"],
    ["process", "Process"],
    ["trends", "Trends"],
    ["tools", "Tools"],
    ["results", "Results"],
    ["faq", "FAQ"]
  ];

  const hero =
    `\n<div class="page-hero dm-hero"><div class="container">` +
    `<div class="breadcrumb"><a href="/">Home</a> / <a href="/#products">Services</a> / <span>Digital Marketing</span></div>` +
    `<div class="dm-hero-grid"><div>` +
    `<div class="accent-bar" style="background:#5cc4f1"></div>` +
    `<h1>Digital Marketing Solutions for Every Industry</h1>` +
    `<p class="lede">Grow your brand, reach the right audience, and turn clicks into customers. We plan search, social, content and automation around how your industry actually buys, and report on the numbers that matter to your business.</p>` +
    `<div class="hero-cta" style="margin-top:28px">` +
    `<a class="btn btn-primary" href="#services">Explore our services ${ARROW}</a>` +
    `<a class="btn btn-ghost" href="${CONTACT}">Get a free consultation</a></div>` +
    `<div class="service-tags" style="margin-top:24px"><span>${D.SERVICES.length} services</span><span>${D.INDUSTRIES.length} industry plans</span><span>Reporting you can read</span></div>` +
    `</div>` +
    // Decorative only: a stylised funnel, not real campaign data.
    `<div class="dm-hero-visual" aria-hidden="true"><div class="dm-funnel">` +
    `<div class="dm-funnel-row" style="--w:100%"><span>Reach</span><i></i></div>` +
    `<div class="dm-funnel-row" style="--w:78%"><span>Clicks</span><i></i></div>` +
    `<div class="dm-funnel-row" style="--w:52%"><span>Leads</span><i></i></div>` +
    `<div class="dm-funnel-row" style="--w:30%"><span>Customers</span><i></i></div>` +
    `</div><div class="dm-hero-chips"><span>${icon("search")}Search</span><span>${icon("share")}Social</span>` +
    `<span>${icon("chat")}WhatsApp</span><span>${icon("mail")}Email</span><span>${icon("play")}Video</span></div></div>` +
    `</div></div></div>\n` +
    `<nav class="dm-jump" aria-label="On this page"><div class="container">` +
    jump.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("") +
    `</div></nav>\n`;

  const services =
    `\n<section id="services"><div class="container">` +
    sectionHead("What we do", "Digital marketing services", "Use one service or combine several. Every engagement starts with tracking, so results can be measured from the first day.") +
    `<div class="dm-grid-3">${D.SERVICES.map((s) => iconCard(s, "blue")).join("")}</div>` +
    `<p class="dm-note">Building a store or a custom site as part of this? See our <a href="/services/ecommerce-platform/">e-commerce platform</a>, ` +
    `<a href="/services/custom-application-development/">custom application development</a> and ` +
    `<a href="/services/ai-automation-analytics/">AI automation and analytics</a> services.</p>` +
    `</div></section>\n`;

  const industries =
    `\n<section id="industries" style="background:var(--paper-dim)"><div class="container">` +
    sectionHead(
      "Industry directory",
      "Digital marketing for your industry",
      "Each sector buys differently. Find yours to see its audience, challenges, recommended channels, campaign ideas, KPIs and an example campaign."
    ) +
    `<div class="dm-dir-controls">` +
    `<label class="dm-search"><span class="dm-sr">Search industries</span>${icon("search")}` +
    `<input type="search" id="dm-search" placeholder="Search industries, e.g. healthcare, LinkedIn, bookings" autocomplete="off"/></label>` +
    `<div class="dm-chips" role="group" aria-label="Filter by sector group">` +
    `<button type="button" class="dm-chip is-on" data-group="all" aria-pressed="true">All</button>` +
    D.GROUPS.map(([id, label]) => `<button type="button" class="dm-chip" data-group="${id}" aria-pressed="false">${esc(label)}</button>`).join("") +
    `</div></div>` +
    `<p class="dm-count" id="dm-count" aria-live="polite">Showing all ${D.INDUSTRIES.length} industries</p>` +
    `<div class="dm-dir" id="dm-dir">${D.INDUSTRIES.map(industry).join("")}</div>` +
    `<p class="dm-empty" id="dm-empty" hidden>No industry matches that search. <a href="${CONTACT}">Tell us about your business</a> and we will put a plan together for your sector.</p>` +
    `<p class="dm-note">Not listed? We also work with emerging and niche sectors. Example campaigns above are illustrative, not client results, and regulated sectors are planned within their advertising rules.</p>` +
    `</div></section>\n`;

  const goals =
    `\n<section id="goals"><div class="container">` +
    sectionHead("By business goal", "Start from the outcome you need", "The right channel mix follows from the goal. These are the nine we are asked for most often.") +
    `<div class="dm-grid-3">${D.GOALS.map((g) => iconCard(g, "green")).join("")}</div>` +
    `</div></section>\n`;

  const process =
    `\n<section id="process" style="background:var(--paper-dim)"><div class="container">` +
    sectionHead("How we work", "Our digital marketing process") +
    `<div class="reveal dm-process">` +
    D.PROCESS.map(
      ([t, p], i) =>
        `<div class="process-step"><div class="num">${String(i + 1).padStart(2, "0")}</div><h4>${esc(t)}</h4><p>${esc(p)}</p></div>`
    ).join("") +
    `</div></div></section>\n`;

  const trends =
    `\n<section id="trends"><div class="container">` +
    sectionHead("What is changing", "Latest digital marketing trends", "What we are building into plans now, and why each one matters.") +
    `<div class="dm-grid-2">` +
    D.TRENDS.map(
      ([ic, t, p]) =>
        `<div class="dm-trend"><div class="service-icon dm-tint-violet">${icon(ic)}</div><div><h3>${esc(t)}</h3><p>${esc(p)}</p></div></div>`
    ).join("") +
    `</div></div></section>\n`;

  const tools =
    `\n<section id="tools" style="background:var(--night)"><div class="container">` +
    `<div class="reveal" style="text-align:center;max-width:640px;margin:0 auto 36px"><div class="eyebrow" style="justify-content:center">Tools and technologies</div>` +
    `<h2 style="color:#fff">The tools behind the work</h2>` +
    `<p style="color:#A9B2C3">Examples of the platforms we work with, chosen per project to fit what you already use.</p></div>` +
    `<div class="dm-tools">` +
    D.TOOLS.map(([group, items]) => `<div class="dm-tool"><h3>${esc(group)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("") +
    `</div><p class="dm-note dm-note-dark">Product names are trademarks of their respective owners and are listed as examples only.</p>` +
    `</div></section>\n`;

  const results =
    `\n<section id="results"><div class="container">` +
    sectionHead("Results and measurement", "The metrics we report on", "Agreed at the start, tracked throughout, and explained in plain language.") +
    `<div class="dm-metrics">` +
    D.METRICS.map(([t, p]) => `<div class="dm-metric"><h3>${esc(t)}</h3><p>${esc(p)}</p></div>`).join("") +
    `</div>` +
    `<div class="dm-disclaimer"><strong>No guaranteed numbers.</strong> Results depend on your industry, budget, competition and how well a campaign is executed. ` +
    `We set realistic targets after an audit, and tell you when a channel is not working.</div>` +
    `</div></section>\n`;

  const cases =
    `\n<section id="case-studies" style="background:var(--paper-dim)"><div class="container">` +
    sectionHead(
      "Case studies",
      "How a campaign comes together",
      "The scenarios below are illustrative examples of our approach, not client results. Verified case studies with real figures will be published here with each client's permission."
    ) +
    `<div class="dm-grid-3">` +
    D.CASES.map(
      (c) =>
        `<article class="dm-case"><span class="dm-case-tag">Illustrative example · ${esc(c.sector)}</span><h3>${esc(c.title)}</h3>` +
        `<dl><dt>Challenge</dt><dd>${esc(c.challenge)}</dd><dt>Strategy</dt><dd>${esc(c.strategy)}</dd>` +
        `<dt>Execution</dt><dd>${esc(c.execution)}</dd><dt>What we would measure</dt><dd>${esc(c.measure)}</dd></dl></article>`
    ).join("") +
    `</div><p class="dm-note">Looking for published work? See our <a href="/resources/case-studies/">case studies</a>.</p>` +
    `</div></section>\n`;

  // Markup here is read by scripts/build.js to generate the FAQPage schema -
  // keep the faq-item / faq-q / plus / faq-a structure exactly as it is.
  const faq =
    `\n<section id="faq"><div class="container">` +
    `<div class="reveal" style="text-align:center;margin-bottom:20px"><div class="eyebrow" style="justify-content:center">Common questions</div>` +
    `<h2>Frequently asked questions</h2></div>` +
    `<div class="reveal"><div class="faq-wrap">` +
    D.FAQS.map(
      ([q, a], i) =>
        `<div class="faq-item${i === 0 ? " open" : ""}"><button class="faq-q">${esc(q)}<span class="plus"></span></button><div class="faq-a"><p>${esc(a)}</p></div></div>`
    ).join("\n") +
    `</div></div></div></section>\n`;

  const cta =
    `\n<section><div class="container"><div class="reveal cta-banner"><div>` +
    `<div class="eyebrow" style="color:#A9B2C3">Ready when you are</div>` +
    `<h2>Ready to Grow Your Business with Digital Marketing?</h2>` +
    `<div class="hero-cta" style="margin-top:18px">` +
    `<a class="btn btn-light" href="${CONTACT}&amp;intent=consultation">Get a free consultation ${ARROW}</a>` +
    `<a class="btn btn-ghost" style="border-color:#ffffff55;color:#fff" href="${CONTACT}&amp;intent=strategy">Request a marketing strategy</a>` +
    `<a class="btn btn-ghost" style="border-color:#ffffff55;color:#fff" href="/contact/">Contact our team</a>` +
    `</div></div>` +
    `<div class="cta-contact"><div>EMAIL<strong>info@liveuo.com</strong></div>` +
    `<div>PHONE<strong><a href="tel:+918050718269">+91 80507 18269</a></strong></div>` +
    `<div>OFFICE<strong>${OFFICE}</strong></div></div></div></div></section>\n`;

  const tail = `\n<script src="${versioned("/assets/digital-marketing.js")}" defer></script>\n` + chrome.scripts + `\n</body>\n</html>\n`;

  return head + chrome.nav + hero + services + industries + goals + process + trends + tools + results + cases + faq + cta + chrome.footer + tail;
}

fs.mkdirSync(path.dirname(PAGE_FILE), { recursive: true });
const html = render();
const before = fs.existsSync(PAGE_FILE) ? fs.readFileSync(PAGE_FILE, "utf8") : "";
// scripts/build.js rewrites the JSON-LD block afterwards, so compare without it.
const strip = (s) => s.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
if (strip(before) !== strip(html)) fs.writeFileSync(PAGE_FILE, html, "utf8");
console.log(`digital marketing page - ${D.SERVICES.length} services, ${D.INDUSTRIES.length} industries -> services/digital-marketing/index.html`);
