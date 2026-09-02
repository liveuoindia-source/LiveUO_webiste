#!/usr/bin/env node
/*  Validates the post bank before anything is published.
 *
 *  The daily job runs unattended, so a broken post must fail here - in CI, on
 *  a pull request - rather than at 07:00 IST when nobody is watching.
 *
 *  Checks:
 *    - every post parses (front matter is valid JSON, required fields present)
 *    - slugs are unique
 *    - every internal /resources/blog/<slug>/ link points at a post that
 *      exists AND sits EARLIER in the publishing queue, so a link is never
 *      live before its target is
 *    - every other internal link points at a real page in the repo
 *    - state.json only references posts that still exist
 *
 *  Usage: node scripts/check-blog.js
 */

const fs = require("fs");
const path = require("path");
const blog = require("./lib/blog");

const ORIGIN = blog.ORIGIN;
const ROOT = blog.ROOT;

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error("  ERROR  " + msg);
  errors++;
}
function warn(msg) {
  console.warn("  WARN   " + msg);
  warnings++;
}

let posts;
try {
  posts = blog.loadAllPosts();
} catch (err) {
  console.error("Post bank failed to load: " + err.message);
  process.exit(1);
}

console.log("Checking " + posts.length + " post(s) in the bank\n");

const order = new Map(posts.map((p, i) => [p.slug, i]));

for (const [index, post] of posts.entries()) {
  // Metadata sanity - these are SEO-visible, so bad values are worth catching.
  if (post.title.length > 70) {
    warn(post.file + ": title is " + post.title.length + " chars (>70 may be truncated in results)");
  }
  if (post.description.length < 70 || post.description.length > 175) {
    warn(post.file + ": description is " + post.description.length + " chars (aim for 70-175)");
  }
  if (post.words < 400) {
    warn(post.file + ": only " + post.words + " words");
  }
  if (!post.faq.length) {
    warn(post.file + ": no FAQ block - loses the FAQPage schema");
  }
  for (const item of post.faq) {
    if (!item || !item.q || !item.a) fail(post.file + ": an FAQ entry is missing q or a");
  }

  // Internal links.
  const links = [...post.body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
  for (const href of links) {
    const clean = href.split("#")[0];
    if (!clean) continue;

    const blogMatch = clean.match(/^\/resources\/blog\/([^/]+)\/$/);
    if (blogMatch) {
      const target = blogMatch[1];
      if (!order.has(target)) {
        fail(post.file + ": links to /resources/blog/" + target + "/ which is not in the bank");
      } else if (order.get(target) >= index) {
        // Posts publish in queue order, so a forward link would 404 for days.
        fail(
          post.file + ": links FORWARD to " + target +
            " (queue position " + (order.get(target) + 1) + " vs this post's " + (index + 1) + ")"
        );
      }
      continue;
    }

    // Any other internal link must resolve to a file that exists.
    const rel = clean.replace(/^\//, "").replace(/\/$/, "");
    const candidates = [
      path.join(ROOT, rel, "index.html"),
      path.join(ROOT, rel),
      path.join(ROOT, rel + ".html")
    ];
    if (!candidates.some((c) => fs.existsSync(c))) {
      fail(post.file + ": links to " + clean + " which does not exist in the repo");
    }
  }
}

// State must not reference posts that were renamed or deleted.
const state = blog.readState();
const known = new Set(posts.map((p) => p.slug));
for (const entry of state.published) {
  if (!known.has(entry.slug)) {
    fail('state.json references published slug "' + entry.slug + '" with no matching post file');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
    fail('state.json entry "' + entry.slug + '" has an invalid date: ' + entry.date);
  }
}

const dates = state.published.map((e) => e.date);
if (new Set(dates).size !== dates.length) {
  warn("state.json has more than one post published on the same date");
}

const live = state.published.length;
const left = posts.length - live;

console.log("");
console.log("  " + live + " published, " + left + " remaining (" + left + " day(s) of runway)");
if (left === 0) {
  warn("the bank is empty - add posts to keep the daily cadence running");
} else if (left <= 7) {
  warn("fewer than 7 posts left - add more to content/blog/posts/");
}

console.log("");
console.log(errors ? errors + " error(s), " + warnings + " warning(s)" : "OK - " + warnings + " warning(s)");
process.exit(errors ? 1 : 0);
