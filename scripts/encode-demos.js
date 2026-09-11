#!/usr/bin/env node
/*  Converts pharCare demo recordings into streamable HLS for the demo page.
 *
 *  WHY HLS RATHER THAN A PLAIN MP4
 *  A single .mp4 on the web server is one URL that shows up in the browser's
 *  network tab, and saving it is one click. HLS cuts each video into short
 *  segments listed by a playlist, so there is no single file to save - taking
 *  a copy needs a dedicated tool. That is the practical "view, don't download"
 *  control. It deters; it does not prevent (nothing stops a screen recording),
 *  and the page never claims otherwise.
 *
 *  COPY WHEN POSSIBLE, RE-ENCODE ONLY WHEN NEEDED
 *  Screen recordings of a desktop app are mostly static UI and compress to
 *  ~100-200 kb/s at 1080p already. Re-encoding them costs quality exactly where
 *  it matters - the small text of the app's own screens - for no size benefit.
 *  So when the source is H.264 yuv420p at up to 1080p, which every browser
 *  plays, the video stream is copied into the HLS segments untouched. Anything
 *  else (HEVC, 10-bit, 4K...) is re-encoded to H.264 at up to 1080p.
 *  --reencode forces the second path.
 *
 *  SOURCE LAYOUT
 *  Either loose files in demos-src/ or one folder per module:
 *      demos-src/01_Login/01_Login_and_Getting_Started.mp4
 *      demos-src/01_Login/script.md
 *  Folders starting with "_" or "." are skipped (tooling, not content). When a
 *  script.md sits beside a video, its "# Title - Recording Script" heading and
 *  "**Purpose:**" line become the title and description of a NEW entry, so a
 *  re-recorded module arrives already described.
 *
 *  The leading number of the file name sets the order and is dropped from the
 *  slug: "01_Login_and_Getting_Started.mp4" -> "login-and-getting-started".
 *
 *  demos/media/ and demos-src/ are gitignored. Video never travels through git:
 *  it would bloat the repository and every Plesk pull along with it.
 *
 *  Options:
 *    --force              redo videos whose output already exists
 *    --reencode           re-encode even when the source could be copied
 *    --src <dir>          source folder       (default demos-src/)
 *    --manifest <file>    manifest to update  (default content/demos/videos.json)
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null;
};

const FORCE = args.includes("--force");
const REENCODE = args.includes("--reencode");
const SRC = path.resolve(opt("--src") || path.join(ROOT, "demos-src"));
const MANIFEST = path.resolve(opt("--manifest") || path.join(ROOT, "content", "demos", "videos.json"));
const OUT = path.join(ROOT, "demos", "media");
const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"]);

/* Ceiling for both the copy test and the re-encode path. Software UI needs
 * its text legible, and at these bitrates 1080p costs almost nothing. */
const MAX_HEIGHT = 1080;

const rel = (p) => path.relative(ROOT, p) || ".";
const extOf = (f) => path.extname(f).toLowerCase();

function run(cmd, cmdArgs, cwd) {
  const r = spawnSync(cmd, cmdArgs, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error) {
    throw new Error(cmd + " could not be started (" + r.error.code + "). Is ffmpeg installed and on PATH?");
  }
  if (r.status !== 0) {
    const tail = String(r.stderr || "").trim().split("\n").slice(-8).join("\n");
    throw new Error(cmd + " exited with " + r.status + ":\n" + tail);
  }
  return r.stdout;
}

const stripOrder = (base) => base.replace(/^\s*\d+\s*[-._)]*\s*/, "");

function slugify(file) {
  return stripOrder(path.parse(file).name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

function titleFromFile(file) {
  const t = stripOrder(path.parse(file).name).replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* Loose files in SRC, plus videos one level down in module folders. */
function findSources() {
  const found = [];
  for (const entry of fs.readdirSync(SRC, { withFileTypes: true })) {
    if (entry.isFile() && VIDEO_EXT.has(extOf(entry.name))) {
      found.push(path.join(SRC, entry.name));
    } else if (entry.isDirectory() && !/^[_.]/.test(entry.name)) {
      const dir = path.join(SRC, entry.name);
      for (const f of fs.readdirSync(dir)) {
        if (VIDEO_EXT.has(extOf(f)) && fs.statSync(path.join(dir, f)).isFile()) found.push(path.join(dir, f));
      }
    }
  }
  return found.sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true, sensitivity: "base" })
  );
}

/* Title and purpose from a script.md written alongside the recording. */
function readScript(videoPath) {
  const dir = path.dirname(videoPath);
  const md = path.join(dir, "script.md");
  if (dir === SRC || !fs.existsSync(md)) return {};
  const text = fs.readFileSync(md, "utf8");
  const heading =
    (text.match(/^#\s+(.+?)\s+[—–-]\s+Recording Script\s*$/m) || [])[1] ||
    (text.match(/^#\s+(.+?)\s*$/m) || [])[1];
  const purpose = (text.match(/^\*\*Purpose:\*\*\s*(.+?)\s*$/m) || [])[1];
  return { title: heading || null, description: purpose || null };
}

function probe(file) {
  const out = run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration:stream=codec_type,codec_name,pix_fmt,height",
    "-of", "json",
    file
  ]);
  const data = JSON.parse(out);
  const streams = data.streams || [];
  const v = streams.find((s) => s.codec_type === "video") || {};
  const secs = parseFloat((data.format || {}).duration);
  if (!isFinite(secs) || secs <= 0) throw new Error("could not read the duration of " + file);
  return {
    secs,
    codec: v.codec_name,
    pixFmt: v.pix_fmt,
    height: v.height,
    hasAudio: streams.some((s) => s.codec_type === "audio")
  };
}

const copyable = (info) => info.codec === "h264" && info.pixFmt === "yuv420p" && info.height <= MAX_HEIGHT;

function encode(file, dir, info) {
  const copy = copyable(info) && !REENCODE;

  const video = copy
    ? ["-c:v", "copy"]
    : [
        "-vf", "scale=w=-2:h='min(" + MAX_HEIGHT + ",ih)'",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-profile:v", "high", "-pix_fmt", "yuv420p",
        // A keyframe every 2s whatever the frame rate, so segments cut cleanly
        // and a seek lands where the viewer actually clicked.
        "-force_key_frames", "expr:gte(t,n_forced*2)"
      ];

  // Audio is always normalised to AAC: it is tiny next to the video, and it
  // means a source recorded with an odd audio codec still plays everywhere.
  const audio = info.hasAudio ? ["-map", "0:a:0", "-c:a", "aac", "-b:a", "96k", "-ac", "2"] : ["-an"];

  // Run inside the output folder with relative names throughout: ffmpeg has
  // historically written the fMP4 init segment relative to the working
  // directory rather than beside the playlist.
  run(
    "ffmpeg",
    [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", file,
      "-map", "0:v:0",
      ...video,
      ...audio,
      "-f", "hls", "-hls_time", "6", "-hls_playlist_type", "vod",
      "-hls_flags", "independent_segments",
      "-hls_segment_type", "fmp4",
      "-hls_fmp4_init_filename", "init.mp4",
      "-hls_segment_filename", "seg_%03d.m4s",
      "index.m3u8"
    ],
    dir
  );
  return copy ? "copied" : "re-encoded";
}

function poster(file, dir, secs) {
  // 20% in, capped at 3s: past any fade-in, and on recordings that open with
  // a title card it lands on the card itself - the best possible thumbnail.
  const at = Math.min(3, secs * 0.2).toFixed(2);
  run(
    "ffmpeg",
    ["-y", "-hide_banner", "-loglevel", "error", "-ss", at, "-i", file,
     "-frames:v", "1", "-vf", "scale=960:-2", "-q:v", "3", "poster.jpg"],
    dir
  );
}

function folderSize(dir) {
  let bytes = 0;
  for (const f of fs.readdirSync(dir)) bytes += fs.statSync(path.join(dir, f)).size;
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

// Round the total first: rounding only the seconds turns 179.9s into "2:60".
const clock = (secs) => {
  const s = Math.round(secs);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

function readManifest() {
  if (!fs.existsSync(MANIFEST)) throw new Error("manifest not found: " + rel(MANIFEST));
  const m = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  m.sections = Array.isArray(m.sections) ? m.sections : [];
  m.videos = Array.isArray(m.videos) ? m.videos : [];
  return m;
}

function main() {
  if (!fs.existsSync(SRC)) {
    fs.mkdirSync(SRC, { recursive: true });
    console.log("Created " + rel(SRC) + "/ - put your recordings there and run this again.");
    return;
  }

  const files = findSources();
  if (!files.length) {
    console.log("No video files found in " + rel(SRC) + "/ or its module folders.");
    return;
  }

  // Two files that differ only by order number or punctuation would overwrite
  // each other's output. Refuse rather than silently lose one.
  const seen = new Map();
  for (const f of files) {
    const s = slugify(f);
    if (!s) throw new Error('"' + rel(f) + '" produces an empty slug - give it a descriptive name.');
    if (seen.has(s)) throw new Error('"' + rel(f) + '" and "' + rel(seen.get(s)) + '" both become "' + s + '" - rename one.');
    seen.set(s, f);
  }

  const manifest = readManifest();
  const bySlug = new Map(manifest.videos.map((v) => [v.slug, v]));
  const today = new Date().toISOString().slice(0, 10);
  const defaultSection = manifest.sections[0] ? manifest.sections[0].id : "";
  const added = [];
  let processed = 0;
  let skipped = 0;
  let copiedCount = 0;

  console.log("Found " + files.length + " recording(s) under " + rel(SRC) + "/\n");

  for (const f of files) {
    const slug = slugify(f);
    const dir = path.join(OUT, slug);
    const info = probe(f);
    const done = fs.existsSync(path.join(dir, "index.m3u8")) && fs.existsSync(path.join(dir, "poster.jpg"));

    if (done && !FORCE) {
      skipped++;
      console.log("  skip    " + slug + "  (already done; --force to redo)");
    } else {
      process.stdout.write("  " + slug + "  (" + clock(info.secs) + ") ... ");
      // Start clean: a shorter redo would otherwise leave the previous run's
      // surplus segments behind, and they would be uploaded too.
      fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });
      const how = encode(f, dir, info);
      if (how === "copied") copiedCount++;
      poster(f, dir, info.secs);
      processed++;
      console.log(how + ", " + folderSize(dir));
    }

    const meta = readScript(f);
    const existing = bySlug.get(slug);
    if (existing) {
      existing.duration = Math.round(info.secs);
      if (!existing.uploaded) existing.uploaded = today;
      // Fill a missing description, but never overwrite one edited by hand.
      if (!existing.description && meta.description) existing.description = meta.description;
    } else {
      const v = {
        slug,
        section: defaultSection,
        title: meta.title || titleFromFile(f),
        description: meta.description || "",
        duration: Math.round(info.secs),
        uploaded: today
      };
      manifest.videos.push(v);
      bySlug.set(slug, v);
      added.push(v);
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(
    "\n" + processed + " processed (" + copiedCount + " copied without re-encoding), " +
      skipped + " skipped. Manifest: " + rel(MANIFEST)
  );
  if (added.length) {
    console.log("\nNew entries - check each title, description and section:");
    added.forEach((v) => console.log("  - " + v.slug + '  "' + v.title + '"  section: ' + (v.section || "(none)")));
  }
  console.log(
    "\nNext:\n" +
      "  1. npm run build                 regenerates products/pharcare/demo/\n" +
      "  2. upload demos/media/<slug>/    to the same path on the server\n" +
      "  3. commit and push the manifest and page - never the media"
  );
}

try {
  main();
} catch (err) {
  console.error("\nencode-demos: " + err.message);
  process.exit(1);
}
