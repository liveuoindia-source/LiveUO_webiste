#!/usr/bin/env node
/*  Fails the build when draft notes to the author would ship to the public site.
 *
 *  Four pages once carried "[VERIFY]" and "replace ... before publishing"
 *  markers live for weeks. This is the guard against that recurring.
 *
 *  Usage: node scripts/check-placeholders.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// Not part of the public output, or not authored by hand.
const SKIP_DIRS = new Set(["node_modules", "_next", "server", "data", "docs", "scripts", "uploads", ".claude", ".git"]);

// Public output that a human writes. Next.js RSC payloads (.txt) are excluded:
// they are stale generated artifacts, already marked noindex in web.config.
const EXTENSIONS = new Set([".html", ".xml"]);

const PATTERNS = [
  { label: "[VERIFY] marker", re: /\[VERIFY/i },
  { label: "TODO", re: /\bTODO\b/i },
  { label: "FIXME", re: /\bFIXME\b/i },
  { label: '"before publishing"', re: /before publishing/i },
  { label: '"Placeholder projects"', re: /placeholder projects/i }
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const failures = [];

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  lines.forEach((line, i) => {
    for (const { label, re } of PATTERNS) {
      if (!re.test(line)) continue;
      const col = line.search(re);
      failures.push({
        file: rel,
        line: i + 1,
        label,
        excerpt: line.slice(Math.max(0, col - 40), col + 90).trim()
      });
    }
  });
}

if (failures.length) {
  console.error(`\nBuild blocked: ${failures.length} unfinished editorial note(s) in public output.\n`);
  for (const f of failures) {
    console.error(`  ${f.file}:${f.line}  ${f.label}`);
    console.error(`      ...${f.excerpt}...`);
  }
  console.error("\nRemove the note, or replace it with real content, before shipping.");
  console.error('If real content is not available yet, delete the section and leave a "NEEDS REAL CONTENT" comment.\n');
  process.exit(1);
}

console.log("placeholder check - clean");
