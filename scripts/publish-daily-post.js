#!/usr/bin/env node
/*  Publishes the next pharCare article from the post bank.
 *
 *  Run once a day (see .github/workflows/daily-blog.yml). It:
 *    1. picks the first post in content/blog/posts/ that is not yet in
 *       content/blog/state.json;
 *    2. stamps it with today's date and records it in state.json;
 *    3. regenerates EVERY live post page, the /resources/blog/ listing, and
 *       /feed.xml - regenerating all of them keeps "related reading" and the
 *       listing correct without tracking which pages a new post invalidates;
 *    4. rewrites the blog block of sitemap.xml;
 *    5. runs scripts/build.js so BreadcrumbList/FAQPage JSON-LD is generated
 *       by the one script that owns it, from the visible markup.
 *
 *  Usage:
 *    node scripts/publish-daily-post.js              publish today's post
 *    node scripts/publish-daily-post.js --dry-run    show what would publish
 *    node scripts/publish-daily-post.js --regenerate rebuild pages only
 *    node scripts/publish-daily-post.js --date=YYYY-MM-DD   backdate
 *
 *  Exit codes: 0 published, 3 nothing left to publish, 4 already published
 *  today, 1 error. The workflow treats 3 and 4 as "nothing to do", not failure.
 */

const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const blog = require("./lib/blog");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const regenerateOnly = args.includes("--regenerate");
const dateArg = (args.find((a) => a.startsWith("--date=")) || "").split("=")[1];

/* Publishing cadence is anchored to Asia/Kolkata - the audience's day, and
 * the timezone every date shown on the site should agree with. */
function todayIST() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function main() {
  const today = dateArg || todayIST();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    console.error("Invalid --date value: " + today);
    process.exit(1);
  }

  const posts = blog.loadAllPosts();
  const state = blog.readState();

  if (!posts.length) {
    console.error("No posts found in " + path.relative(blog.ROOT, blog.POSTS_DIR));
    process.exit(1);
  }

  let published = null;

  if (!regenerateOnly) {
    if (state.published.some((e) => e.date === today)) {
      console.log("A post is already published for " + today + " - nothing to do.");
      finish(posts, state, today, null, true);
      process.exit(4);
    }

    const next = blog.nextUnpublished(posts, state);
    if (!next) {
      console.error(
        "Post bank is empty - all " + posts.length + " articles are published.\n" +
          "Add new .md files to " + path.relative(blog.ROOT, blog.POSTS_DIR) +
          " to keep the daily cadence running."
      );
      process.exit(3);
    }

    if (dryRun) {
      console.log("Would publish on " + today + ":");
      console.log("  " + next.title);
      console.log("  /resources/blog/" + next.slug + "/");
      console.log("  " + next.words + " words, " + next.readingTime + " min read, " + next.faq.length + " FAQs");
      console.log("  " + (remainingCount(posts, state) - 1) + " article(s) left in the bank after this one");
      return;
    }

    state.published.push({ slug: next.slug, date: today, updated: today });
    published = next;
  }

  finish(posts, state, today, published, false);
}

/* Articles still sitting unpublished in the bank, given the CURRENT state. */
function remainingCount(posts, state) {
  const done = new Set(state.published.map((e) => e.slug));
  return posts.filter((p) => !done.has(p.slug)).length;
}

function finish(posts, state, today, published, quiet) {
  if (dryRun) return;

  blog.writeState(state);
  const result = blog.writeAll(posts, state);
  blog.updateSitemap(result.live, today);

  // build.js owns BreadcrumbList + FAQPage JSON-LD across the whole site.
  execFileSync(process.execPath, [path.join(__dirname, "build.js")], { stdio: "inherit" });

  if (published) {
    console.log("\nPublished: " + published.title);
    console.log("URL:       " + published.url);
    console.log("Live posts: " + result.live.length + " | remaining in bank: " + remainingCount(posts, state));

    // Handed to the indexing step so it submits only what actually changed.
    const outFile = path.join(blog.ROOT, "content", "blog", "last-published.json");
    fs.writeFileSync(
      outFile,
      JSON.stringify(
        {
          date: today,
          slug: published.slug,
          title: published.title,
          urls: [published.url, blog.ORIGIN + "/resources/blog/", blog.ORIGIN + "/sitemap.xml"]
        },
        null,
        2
      ) + "\n",
      "utf8"
    );

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        "published=true\nslug=" + published.slug + "\ntitle=" + published.title + "\nurl=" + published.url + "\n"
      );
    }
  } else if (!quiet) {
    console.log("\nRegenerated " + result.live.length + " live post page(s), listing, feed, and sitemap.");
  }
}

try {
  main();
} catch (err) {
  console.error("publish-daily-post failed: " + err.message);
  process.exit(1);
}
