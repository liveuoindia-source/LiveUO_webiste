#!/usr/bin/env node
/*  Generates structured data from the rendered page.
 *
 *  This site has no template layer - the exported HTML files are the source.
 *  So rather than keeping JSON-LD in a parallel data file that drifts out of
 *  sync with what visitors actually see, this reads the visible breadcrumb
 *  and the visible Q&A out of each page and regenerates the markup from
 *  them. The two cannot disagree, because one is derived from the other.
 *
 *  Managed node types: BreadcrumbList, FAQPage.
 *  Everything else already in a page's @graph (Organization,
 *  SoftwareApplication, ...) is preserved untouched.
 *
 *  Usage: node scripts/build.js [--check]
 *         --check exits non-zero if any file would change (for CI).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ORIGIN = "https://www.liveuo.com";

// Directories that are not public pages.
const SKIP_DIRS = new Set(["node_modules", "_next", "server", "data", "docs", "scripts", "uploads", ".claude", "404", "_not-found"]);

const checkOnly = process.argv.includes("--check");

function findPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      findPages(path.join(dir, entry.name), out);
    } else if (entry.name === "index.html") {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

/* Turn a fragment of rendered HTML into the plain text a reader sees, so the
 * JSON-LD carries the same words as the page. */
function toText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

/* The visible "Home / Resources / Case Studies" trail. The final crumb is a
 * <span> (no link) and resolves to the page's own URL. */
function buildBreadcrumb(html, pageUrl) {
  const block = html.match(/<div class="breadcrumb">([\s\S]*?)<\/div>/);
  if (!block) return null;

  const items = [];
  const re = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>|<span[^>]*>([\s\S]*?)<\/span>/g;
  let m;
  while ((m = re.exec(block[1])) !== null) {
    const name = toText(m[2] !== undefined ? m[2] : m[3]);
    if (!name) continue;
    const href = m[1] !== undefined ? m[1] : null;
    items.push({ name, url: href ? new URL(href, ORIGIN).href : pageUrl });
  }
  if (items.length < 2) return null;

  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url
    }))
  };
}

/* Every visible accordion entry, in page order. */
function buildFaq(html) {
  const re = /<div class="faq-item">\s*<button class="faq-q">([\s\S]*?)<span class="plus">[\s\S]*?<\/button>\s*<div class="faq-a">([\s\S]*?)<\/div>\s*<\/div>/g;
  const questions = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const name = toText(m[1]);
    const text = toText(m[2]);
    if (!name || !text) continue;
    questions.push({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text }
    });
  }
  if (!questions.length) return null;
  return { "@type": "FAQPage", mainEntity: questions };
}

/* Read whatever JSON-LD the page already has, as a flat node list. */
function readGraph(html) {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) return { nodes: [], raw: null };
  let parsed;
  try {
    parsed = JSON.parse(m[1]);
  } catch (err) {
    throw new Error(`existing JSON-LD is not valid JSON: ${err.message}`);
  }
  const nodes = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
  return { nodes: nodes.filter(Boolean), raw: m[0] };
}

function pageUrlFor(file) {
  const rel = path.relative(ROOT, path.dirname(file)).split(path.sep).join("/");
  return rel === "" ? `${ORIGIN}/` : `${ORIGIN}/${rel}/`;
}

const MANAGED = new Set(["BreadcrumbList", "FAQPage"]);

let changed = 0;
let skipped = 0;
const report = [];

for (const file of findPages(ROOT)) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const pageUrl = pageUrlFor(file);

  const breadcrumb = buildBreadcrumb(html, pageUrl);
  const faq = buildFaq(html);

  const { nodes, raw } = readGraph(html);

  // Keep every node this script does not own, in their original order.
  const preserved = nodes.filter((n) => !MANAGED.has(n["@type"]));
  const generated = [breadcrumb, faq].filter(Boolean);

  if (!generated.length) {
    if (!raw) skipped++;
    continue;
  }

  const graph = [...preserved, ...generated];
  const payload =
    graph.length === 1
      ? { "@context": "https://schema.org", ...graph[0] }
      : { "@context": "https://schema.org", "@graph": graph };

  const block = `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;

  let next;
  if (raw) {
    next = html.replace(raw, block);
  } else if (html.includes("</head>")) {
    next = html.replace("</head>", `${block}</head>`);
  } else {
    report.push(`  ${rel}: no </head> and no existing block - skipped`);
    continue;
  }

  const types = generated.map((g) => g["@type"]).join(" + ");
  const detail = faq ? ` (${faq.mainEntity.length} Q&A)` : "";

  if (next !== html) {
    if (!checkOnly) fs.writeFileSync(file, next, "utf8");
    changed++;
    report.push(`  ${rel}: ${types}${detail}`);
  }
}

console.log(checkOnly ? "structured data - check" : "structured data - build");
report.forEach((line) => console.log(line));
console.log(`  ${changed} page(s) ${checkOnly ? "would be updated" : "updated"}, ${skipped} without breadcrumb or FAQ`);

if (checkOnly && changed > 0) {
  console.error("\nStructured data is stale. Run: npm run build");
  process.exit(1);
}
