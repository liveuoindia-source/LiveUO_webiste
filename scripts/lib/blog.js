/*  Blog engine for the pharCare content cluster.
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
const CHROME_SOURCE = path.join(ROOT, "products", "pharcare", "index.html");

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

  const words = md.toPlainText(body).split(/\s+/).length;

  return Object.assign({}, meta, {
    slug: slug,
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
    '<a class="post-card" href="/resources/blog/' + post.slug + '/">' +
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
        about: {
          "@type": "SoftwareApplication",
          name: "pharCare",
          applicationCategory: "BusinessApplication",
          url: ORIGIN + "/products/pharcare/"
        }
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
      '<div class="eyebrow">Keep reading</div><h2>Related pharCare guides</h2>' +
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
    "<h2>pharCare handles this out of the box.</h2>" +
    "<p>GST-ready billing, batch and expiry tracking, multi-branch stock sync, and Schedule H/H1/H1X logging &mdash; built for how Indian pharmacies actually run.</p>" +
    '<div class="post-cta-actions"><a class="btn btn-primary" href="/contact/">Book a free demo</a>' +
    '<a class="btn btn-ghost" href="/products/pharcare/">Explore pharCare</a></div></div>' +
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
        name: "LiVEUO Blog — pharCare guides",
        url: ORIGIN + "/resources/blog/",
        description:
          "Daily guides on pharmacy billing, GST compliance, drug-schedule rules, and inventory control for Indian pharmacies.",
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

  const body = live.length
    ? (featured
        ? '<a class="post-feature" href="/resources/blog/' + featured.slug + '/">' +
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
      title: "pharCare Blog — pharmacy billing & compliance guides | LiVEUO",
      description:
        "Practical guides on pharmacy billing software, GST invoicing, Schedule H compliance, expiry control, and multi-branch stock for Indian pharmacies. New article every day.",
      canonical: ORIGIN + "/resources/blog/",
      keywords: [
        "pharmacy billing software",
        "pharCare",
        "GST invoicing pharmacy",
        "Schedule H compliance",
        "pharmacy inventory management India"
      ],
      ogType: "website",
      jsonLd: jsonLd
    }) +
    "<body>" +
    chrome.nav +
    '<div class="page-hero"><div class="container">' +
    '<div class="breadcrumb"><a href="/">Home</a> / <a href="/resources/">Resources</a> / <span>Blog</span></div>' +
    '<h1 style="max-width:700px">pharCare guides &amp; articles.</h1>' +
    '<p class="lede">Practical, India-specific guidance on pharmacy billing, drug-schedule compliance, GST filing, and stock control &mdash; a new article every day.</p>' +
    '<div class="post-count">' + live.length + " article" + (live.length === 1 ? "" : "s") + " published</div>" +
    "</div></div>" +
    '<section><div class="container">' + body + "</div></section>" +
    '<section style="padding-top:0"><div class="container"><div class="cta-banner"><div>' +
    '<div class="eyebrow" style="color:#A9B2C3">Ready when you are</div>' +
    "<h2>See pharCare running on your own stock list.</h2>" +
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
    "<title>LiVEUO — pharCare pharmacy software guides</title>\n" +
    "<link>" + ORIGIN + "/resources/blog/</link>\n" +
    "<description>Daily guides on pharmacy billing, GST compliance, and inventory control for Indian pharmacies.</description>\n" +
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
    const related = live.filter((p) => p.slug !== post.slug).slice(0, 2);
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
  renderFeed
};
