/*  Blog engine for the LiVEUO blog (one content cluster per service).
 *
 *  The site has no template layer - exported HTML files are the source - so
 *  this generates post pages that look hand-authored and slot into the same
 *  conventions the rest of the site uses:
 *
 *    - nav and footer are LIFTED from an existing page at render time, so
 *      generated posts can never drift from the site chrome;
 *    - a visible .breadcrumb and visible .faq-item blocks are emitted, which
 *      is exactly what scripts/build.js reads to regenerate BreadcrumbList
 *      and FAQPage JSON-LD. This file deliberately does NOT emit those two
 *      node types - build.js owns them, and publish runs build.js after.
 *
 *  Posts live in content/blog/posts/*.md with a JSON front-matter block.
 *  Publication state lives in content/blog/state.json.
 */

const fs = require("fs");
const path = require("path");
const md = require("./markdown");

const ROOT = path.join(__dirname, "..", "..");
const ORIGIN = "https://www.liveuo.com";
const POSTS_DIR = path.join(ROOT, "content", "blog", "posts");
const STATE_FILE = path.join(ROOT, "content", "blog", "state.json");
const BLOG_DIR = path.join(ROOT, "resources", "blog");
const CHROME_SOURCE = path.join(ROOT, "services", "pharcare", "index.html");

/*  Every post belongs to one service, set by "service" in its front matter
 *  (default "pharcare", which is what the first 30 posts were written for).
 *  It picks the closing call to action, the "about" node in the JSON-LD,
 *  related reading, and the filter chip on the listing. */
const SERVICES = {
  pharcare: {
    label: "pharCare",
    url: "/services/pharcare/",
    type: "SoftwareApplication",
    heading: "pharCare handles this out of the box.",
    text: "GST-ready billing, batch and expiry tracking, multi-branch stock sync, and Schedule H/H1/H1X logging &mdash; built for how Indian pharmacies actually run.",
    button: "Explore pharCare"
  },
  "pharmacy-suite": {
    label: "Pharmacy Management",
    url: "/services/complete-pharmacy-software/",
    type: "SoftwareApplication",
    heading: "Run every store, warehouse and distributor from one system.",
    text: "Complete Pharmacy Management Software covers chain-wide stock, warehouse transfers, distributor billing and consolidated reporting.",
    button: "Explore the pharmacy suite"
  },
  billing: {
    label: "Billing Software",
    url: "/services/billing-software/",
    type: "SoftwareApplication",
    heading: "GST billing that keeps up with the counter.",
    text: "GST-compliant invoicing, credit notes, multi-user access and an audit trail, for businesses outside the pharmacy sector.",
    button: "Explore billing software"
  },
  ecommerce: {
    label: "E-Commerce",
    url: "/services/ecommerce-platform/",
    type: "Service",
    heading: "A store built to convert, and to hold up on sale day.",
    text: "Storefronts and checkout systems with payments, inventory sync and order workflows built around how you sell.",
    button: "Explore e-commerce"
  },
  custom: {
    label: "Custom Development",
    url: "/services/custom-application-development/",
    type: "Service",
    heading: "Software built around how your team works.",
    text: "Web, mobile and enterprise applications scoped to your process, with fixed-scope delivery and support after launch.",
    button: "Explore custom development"
  },
  automation: {
    label: "AI Automation",
    url: "/services/ai-automation-analytics/",
    type: "Service",
    heading: "Hand the repetitive work to software.",
    text: "AI automation and live analytics that take over data entry, follow-ups and reporting, so your team can focus on decisions.",
    button: "Explore AI automation"
  },
  marketing: {
    label: "Digital Marketing",
    url: "/services/digital-marketing/",
    type: "Service",
    heading: "Turn this into a plan for your business.",
    text: "SEO, Google Ads, social media, WhatsApp and content, planned around your industry and measured against the numbers that matter.",
    button: "Explore digital marketing"
  }
};

const ORG = {
  "@type": "Organization",
  name: "LiVEUO",
  url: ORIGIN + "/",
  logo: ORIGIN + "/assets/liveuo_logo.png"
};

/* ---------------------------------------------------------------- chrome  */

let chromeCache = null;

/* Nav and footer come from a real page rather than a copy kept here, so a
 * future nav change propagates to every regenerated post for free. */
function getChrome() {
  if (chromeCache) return chromeCache;
  const html = fs.readFileSync(CHROME_SOURCE, "utf8");
  const nav = html.match(/<nav class="nav">[\s\S]*?<\/nav>/);
  const footer = html.match(/<footer>[\s\S]*?<\/footer>/);
  const scripts = html.match(/<script src="\/assets\/motion\.js"><\/script>[\s\S]*?(?=<\/body>)/);
  if (!nav || !footer) {
    throw new Error("Could not lift nav/footer from " + path.relative(ROOT, CHROME_SOURCE));
  }
  chromeCache = {
    nav: nav[0],
    footer: footer[0],
    scripts: scripts
      ? scripts[0]
      : '<script src="/assets/motion.js"></script><script src="/assets/liveuo.js"></script>'
  };
  return chromeCache;
}

/* --------------------------------------------------------------- loading  */

/*  A post file is:
 *      ---json
 *      { "title": ..., "description": ..., ... }
 *      ---
 *      markdown body
 *
 *  JSON front matter rather than YAML so parsing is exact and dependency-free.
 */
function parsePostFile(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = raw.match(/^---json\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(path.basename(file) + ': missing "---json" front-matter block');

  let meta;
  try {
    meta = JSON.parse(m[1]);
  } catch (err) {
    throw new Error(path.basename(file) + ": front matter is not valid JSON - " + err.message);
  }

  const body = m[2].trim();
  const slug = meta.slug || path.basename(file, ".md").replace(/^\d+-/, "");

  for (const field of ["title", "description", "category"]) {
    if (!meta[field]) throw new Error(path.basename(file) + ': missing required field "' + field + '"');
  }
  if (!body) throw new Error(path.basename(file) + ": body is empty");
  const service = meta.service || "pharcare";
  if (!SERVICES[service]) {
    throw new Error(path.basename(file) + ': unknown service "' + service + '" (use one of ' + Object.keys(SERVICES).join(", ") + ")");
  }

  const words = md.toPlainText(body).split(/\s+/).length;

  return Object.assign({}, meta, {
    slug: slug,
    service: service,
    body: body,
    file: path.relative(ROOT, file).split(path.sep).join("/"),
    words: words,
    readingTime: meta.readingTime || Math.max(3, Math.round(words / 220)),
    faq: Array.isArray(meta.faq) ? meta.faq : [],
    keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
    url: ORIGIN + "/resources/blog/" + slug + "/"
  });
}

/* Bank order is filename order - the numeric prefix is the publishing queue. */
function loadAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).sort();
  const posts = files.map((f) => parsePostFile(path.join(POSTS_DIR, f)));

  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error('duplicate slug "' + p.slug + '" in the post bank');
    seen.add(p.slug);
  }
  return posts;
}

/* ----------------------------------------------------------------- state  */

function readState() {
  if (!fs.existsSync(STATE_FILE)) return { published: [] };
  const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  if (!Array.isArray(state.published)) state.published = [];
  return state;
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

/* Posts already live, newest first, each carrying its publication date. */
function publishedPosts(posts, state) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  return state.published
    .filter((entry) => bySlug.has(entry.slug))
    .map((entry) =>
      Object.assign({}, bySlug.get(entry.slug), {
        date: entry.date,
        updated: entry.updated || entry.date
      })
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function nextUnpublished(posts, state) {
  const done = new Set(state.published.map((e) => e.slug));
  return posts.find((p) => !done.has(p.slug)) || null;
}

/* ----------------------------------------------------------------- pages  */

const esc = md.escapeHtml;

function head(opts) {
  return (
    '<!DOCTYPE html><html lang="en"><head>' +
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-B27YZ8EL0J"></script>' +
    '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-B27YZ8EL0J");</script>' +
    '<meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>' +
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"/>' +
    '<meta name="author" content="LiVEUO"/><meta name="theme-color" content="#3a6cb5"/>' +
    (opts.keywords && opts.keywords.length
      ? '<meta name="keywords" content="' + esc(opts.keywords.join(", ")) + '"/>'
      : "") +
    '<link rel="canonical" href="' + opts.canonical + '"/>' +
    '<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml"/>' +
    '<link rel="apple-touch-icon" href="/assets/logo-mark.svg"/>' +
    '<link rel="alternate" type="application/rss+xml" title="LiVEUO Blog" href="/feed.xml"/>' +
    '<meta property="og:type" content="' + opts.ogType + '"/>' +
    '<meta property="og:site_name" content="LiVEUO"/>' +
    '<meta property="og:locale" content="en_IN"/>' +
    '<meta property="og:url" content="' + opts.canonical + '"/>' +
    '<meta property="og:title" content="' + esc(opts.title) + '"/>' +
    '<meta property="og:description" content="' + esc(opts.description) + '"/>' +
    '<meta property="og:image" content="' + ORIGIN + '/assets/liveuo_logo.png"/>' +
    (opts.publishedTime
      ? '<meta property="article:published_time" content="' + opts.publishedTime + '"/>'
      : "") +
    '<meta name="twitter:card" content="summary_large_image"/>' +
    '<meta name="twitter:title" content="' + esc(opts.title) + '"/>' +
    '<meta name="twitter:description" content="' + esc(opts.description) + '"/>' +
    '<meta name="twitter:image" content="' + ORIGIN + '/assets/liveuo_logo.png"/>' +
    '<link rel="stylesheet" href="/_next/static/chunks/3plzysnn66upc.css" data-precedence="next"/>' +
    '<link rel="stylesheet" href="/assets/blog.css"/>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"/>' +
    "<title>" + esc(opts.title) + "</title>" +
    '<meta name="description" content="' + esc(opts.description) + '"/>' +
    '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=Inter:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>' +
    '<script type="application/ld+json">' + JSON.stringify(opts.jsonLd) + "</script>" +
    "</head>"
  );
}

const BLOG_DESCRIPTION =
  "Daily, India-specific guides on pharmacy software, GST billing, e-commerce, custom software, AI automation and digital marketing.";

function prettyDate(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}

function cardHtml(post) {
  return (
    '<a class="post-card" data-service="' + post.service + '" href="/resources/blog/' + post.slug + '/">' +
    '<span class="post-card-cat">' + esc(post.category) + "</span>" +
    "<h3>" + esc(post.title) + "</h3>" +
    "<p>" + esc(post.description) + "</p>" +
    '<span class="post-card-meta"><time datetime="' + post.date + '">' +
    prettyDate(post.date) + "</time> &middot; " + post.readingTime + " min read</span>" +
    "</a>"
  );
}

/* One article page. `related` is up to two other live posts. */
function renderPost(post, related) {
  const chrome = getChrome();
  const svc = SERVICES[post.service];
  const rendered = md.render(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ORG,
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: post.url,
        mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
        datePublished: post.date,
        dateModified: post.updated || post.date,
        author: { "@type": "Organization", name: "LiVEUO", url: ORIGIN + "/" },
        publisher: ORG,
        image: ORIGIN + "/assets/liveuo_logo.png",
        articleSection: post.category,
        keywords: post.keywords.join(", "),
        wordCount: post.words,
        inLanguage: "en-IN",
        about:
          svc.type === "SoftwareApplication"
            ? { "@type": "SoftwareApplication", name: svc.label, applicationCategory: "BusinessApplication", url: ORIGIN + svc.url }
            : { "@type": "Service", name: svc.label, provider: ORG, url: ORIGIN + svc.url }
      }
    ]
  };

  const toc =
    rendered.headings.length >= 3
      ? '<nav class="post-toc" aria-label="On this page"><h2>On this page</h2><ol>' +
        rendered.headings
          .map((h) => '<li><a href="#' + h.id + '">' + esc(h.text) + "</a></li>")
          .join("") +
        "</ol></nav>"
      : "";

  const faq = post.faq.length
    ? '<section class="post-faq-section"><div class="container"><div class="post-shell">' +
      "<h2>Frequently asked questions</h2><div class=\"faq-wrap\">" +
      post.faq
        .map(
          (item, idx) =>
            '<div class="faq-item' + (idx === 0 ? " open" : "") + '">' +
            '<button class="faq-q">' + esc(item.q) + '<span class="plus"></span></button>' +
            '<div class="faq-a"><p>' + md.inline(item.a) + "</p></div></div>"
        )
        .join("") +
      "</div></div></div></section>"
    : "";

  const relatedHtml = related.length
    ? '<section class="post-related"><div class="container"><div class="post-shell">' +
      '<div class="eyebrow">Keep reading</div><h2>Related guides</h2>' +
      '<div class="post-card-grid">' + related.map(cardHtml).join("") +
      "</div></div></div></section>"
    : "";

  return (
    head({
      title: post.title + " | LiVEUO",
      description: post.description,
      canonical: post.url,
      keywords: post.keywords,
      ogType: "article",
      publishedTime: post.date,
      jsonLd: jsonLd
    }) +
    "<body>" +
    chrome.nav +
    '<div class="page-hero post-hero"><div class="container">' +
    '<div class="breadcrumb"><a href="/">Home</a> / <a href="/resources/">Resources</a> / ' +
    '<a href="/resources/blog/">Blog</a> / <span>' + esc(post.title) + "</span></div>" +
    '<div class="post-meta-row"><span class="post-cat">' + esc(post.category) + "</span>" +
    '<time datetime="' + post.date + '">' + prettyDate(post.date) + "</time>" +
    "<span>" + post.readingTime + " min read</span></div>" +
    '<h1 class="post-title">' + esc(post.title) + "</h1>" +
    '<p class="lede">' + esc(post.description) + "</p>" +
    "</div></div>" +
    '<section class="post-body-section"><div class="container">' +
    '<article class="post-shell post-body">' +
    toc +
    rendered.html +
    '<div class="post-cta"><div class="eyebrow">See it working</div>' +
    "<h2>" + svc.heading + "</h2>" +
    "<p>" + svc.text + "</p>" +
    '<div class="post-cta-actions"><a class="btn btn-primary" href="/contact/">' +
    (svc.type === "SoftwareApplication" ? "Book a free demo" : "Book a free consultation") + "</a>" +
    '<a class="btn btn-ghost" href="' + svc.url + '">' + svc.button + "</a></div></div>" +
    "</article></div></section>" +
    faq +
    relatedHtml +
    chrome.footer +
    chrome.scripts +
    "</body></html>"
  );
}

/* The /resources/blog/ listing, regenerated from live posts every publish. */
function renderIndex(live) {
  const chrome = getChrome();
  const featured = live[0];
  const rest = live.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ORG,
      {
        "@type": "Blog",
        name: "LiVEUO Blog",
        url: ORIGIN + "/resources/blog/",
        description: BLOG_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: ORG,
        blogPost: live.slice(0, 30).map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: p.url,
          datePublished: p.date,
          description: p.description
        }))
      }
    ]
  };

  // Filter chips only for services that have at least one live post.
  const present = Object.keys(SERVICES).filter((k) => live.some((p) => p.service === k));
  const filters =
    present.length > 1
      ? '<div class="post-filters" role="group" aria-label="Filter articles by service">' +
        '<button type="button" class="post-filter is-on" data-service="all" aria-pressed="true">All</button>' +
        present
          .map((k) => '<button type="button" class="post-filter" data-service="' + k + '" aria-pressed="false">' + esc(SERVICES[k].label) + "</button>")
          .join("") +
        "</div>"
      : "";

  const body = live.length
    ? filters +
      (featured
        ? '<a class="post-feature" data-service="' + featured.service + '" href="/resources/blog/' + featured.slug + '/">' +
          '<span class="post-card-cat">Latest &middot; ' + esc(featured.category) + "</span>" +
          "<h2>" + esc(featured.title) + "</h2><p>" + esc(featured.description) + "</p>" +
          '<span class="post-card-meta"><time datetime="' + featured.date + '">' +
          prettyDate(featured.date) + "</time> &middot; " + featured.readingTime +
          " min read</span></a>"
        : "") +
      (rest.length ? '<div class="post-card-grid">' + rest.map(cardHtml).join("") + "</div>" : "")
    : '<p class="post-empty">The first article publishes shortly. Check back soon.</p>';

  return (
    head({
      title: "LiVEUO Blog — pharmacy software, billing, e-commerce, automation & marketing guides",
      description: BLOG_DESCRIPTION,
      canonical: ORIGIN + "/resources/blog/",
      keywords: [
        "pharmacy billing software",
        "pharCare",
        "GST billing software",
        "e-commerce development India",
        "custom software development",
        "business process automation",
        "digital marketing for small business"
      ],
      ogType: "website",
      jsonLd: jsonLd
    }) +
    "<body>" +
    chrome.nav +
    '<div class="page-hero"><div class="container">' +
    '<div class="breadcrumb"><a href="/">Home</a> / <a href="/resources/">Resources</a> / <span>Blog</span></div>' +
    '<h1 style="max-width:700px">Guides &amp; articles.</h1>' +
    '<p class="lede">Practical, India-specific guidance on pharmacy software, GST billing, e-commerce, custom software, automation and digital marketing &mdash; a new article every day.</p>' +
    '<div class="post-count">' + live.length + " article" + (live.length === 1 ? "" : "s") + " published</div>" +
    "</div></div>" +
    '<section><div class="container">' + body + "</div></section>" +
    '<section style="padding-top:0"><div class="container"><div class="cta-banner"><div>' +
    '<div class="eyebrow" style="color:#A9B2C3">Ready when you are</div>' +
    "<h2>Talk to us about your business.</h2>" +
    '<a class="btn btn-light" style="margin-top:10px" href="/contact/">Book a free demo</a></div>' +
    '<div class="cta-contact"><div>EMAIL<strong>info@liveuo.com</strong></div>' +
    '<div>PHONE<strong><a href="tel:+918050718269">+91 80507 18269</a></strong></div>' +
    // NAP must match the PostalAddress in the homepage JSON-LD, the visible
    // address on /contact/, and the Google Business Profile listing. Unlike the
    // nav and footer above, this block is not lifted from a live page, so it
    // does not follow an address change automatically - update it here too.
    "<div>OFFICE<strong>3500, 3rd Main Rd, 1st Phase Girinagar, Phase 4, " +
    "Banashankari 3rd Stage, Banashankari, Bengaluru, Karnataka 560085, India" +
    "</strong></div></div></div></div></section>" +
    chrome.footer +
    // Service filter. Without this script every article still shows.
    (filters
      ? "<script>(function(){var b=document.querySelectorAll('.post-filter'),c=document.querySelectorAll('.post-feature,.post-card');" +
        "b.forEach(function(x){x.addEventListener('click',function(){var s=x.getAttribute('data-service');" +
        "b.forEach(function(y){var on=y===x;y.classList.toggle('is-on',on);y.setAttribute('aria-pressed',on?'true':'false');});" +
        "c.forEach(function(el){el.hidden=s!=='all'&&el.getAttribute('data-service')!==s;});});});})();</script>"
      : "") +
    chrome.scripts +
    "</body></html>"
  );
}

/* ------------------------------------------------------------- feed + map */

function renderFeed(live) {
  const items = live.slice(0, 25).map(
    (p) =>
      "<item>" +
      "<title>" + esc(p.title) + "</title>" +
      "<link>" + p.url + "</link>" +
      '<guid isPermaLink="true">' + p.url + "</guid>" +
      "<description>" + esc(p.description) + "</description>" +
      "<category>" + esc(p.category) + "</category>" +
      "<pubDate>" + new Date(p.date + "T09:00:00Z").toUTCString() + "</pubDate>" +
      "</item>"
  );

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n' +
    "<title>LiVEUO Blog</title>\n" +
    "<link>" + ORIGIN + "/resources/blog/</link>\n" +
    "<description>" + BLOG_DESCRIPTION + "</description>\n" +
    "<language>en-in</language>\n" +
    "<lastBuildDate>" + new Date().toUTCString() + "</lastBuildDate>\n" +
    '<atom:link href="' + ORIGIN + '/feed.xml" rel="self" type="application/rss+xml"/>\n' +
    items.join("\n") +
    "\n</channel>\n</rss>\n"
  );
}

/*  Rewrites the blog block of sitemap.xml in place. Non-blog URLs are left
 *  exactly as they are - this only owns the lines between its own markers,
 *  so hand edits elsewhere in the file survive. */
const SITEMAP_START = "  <!-- blog:start (generated by scripts/publish-daily-post.js) -->";
const SITEMAP_END = "  <!-- blog:end -->";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function updateSitemap(live, today) {
  const file = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");

  const block =
    SITEMAP_START + "\n" +
    live
      .map(
        (p) =>
          "  <url><loc>" + p.url + "</loc><lastmod>" + (p.updated || p.date) + "</lastmod>" +
          "<changefreq>monthly</changefreq><priority>0.6</priority></url>"
      )
      .join("\n") +
    (live.length ? "\n" : "") +
    SITEMAP_END;

  const existing = new RegExp(escapeRe(SITEMAP_START) + "[\\s\\S]*?" + escapeRe(SITEMAP_END));

  if (existing.test(xml)) {
    xml = xml.replace(existing, block);
  } else {
    xml = xml.replace("</urlset>", block + "\n</urlset>");
  }

  // The blog hub's lastmod changes every time a post lands.
  xml = xml.replace(
    /(<url><loc>https:\/\/www\.liveuo\.com\/resources\/blog\/<\/loc><lastmod>)[^<]*(<\/lastmod>)/,
    "$1" + today + "$2"
  );

  fs.writeFileSync(file, xml, "utf8");
  return file;
}

/* ---------------------------------------------------------------- writing */

function writeAll(posts, state) {
  const live = publishedPosts(posts, state);
  const written = [];

  for (const post of live) {
    // Same-service posts first (newest first), then anything else.
    const others = live.filter((p) => p.slug !== post.slug);
    const related = others.filter((p) => p.service === post.service).concat(others.filter((p) => p.service !== post.service)).slice(0, 2);
    const dir = path.join(BLOG_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "index.html");
    fs.writeFileSync(file, renderPost(post, related), "utf8");
    written.push(file);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(BLOG_DIR, "index.html"), renderIndex(live), "utf8");
  fs.writeFileSync(path.join(ROOT, "feed.xml"), renderFeed(live), "utf8");
  written.push(path.join(BLOG_DIR, "index.html"), path.join(ROOT, "feed.xml"));

  return { live: live, written: written };
}

module.exports = {
  ORIGIN,
  ROOT,
  POSTS_DIR,
  STATE_FILE,
  loadAllPosts,
  readState,
  writeState,
  publishedPosts,
  nextUnpublished,
  writeAll,
  updateSitemap,
  renderPost,
  renderIndex,
  renderFeed,
  // Shared with build-demos.js so the demo page keeps the live nav/footer.
  getChrome,
  SERVICES
};
