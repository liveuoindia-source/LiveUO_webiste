/*  Registry for the secure document viewer.
 *
 *  No database by design: documents are added by hand on the server. The
 *  registry and the PDFs both live in server/private/, which is outside the
 *  web root and gitignored, so neither the file nor the client email addresses
 *  are ever served by IIS or committed to a public repo.
 *
 *  server/private/viewers.json:
 *
 *    {
 *      "project-requirement": {
 *        "title":   "LiVEUO - Project Requirement",
 *        "file":    "project-requirement.pdf",
 *        "allow":   ["client@example.com"],
 *        "expires": "2026-10-31"
 *      }
 *    }
 *
 *  Three kinds of entry, told apart by their fields:
 *
 *    "file": "x.pdf"                         a PDF, rendered page by page
 *    "file": "clip.mp4"                      a video, played in the viewer.
 *    "file": "videos/intro/index.m3u8"       HLS works too; the playlist's
 *                                            segments sit beside it.
 *    "library": "demos/media"                a whole folder of HLS videos
 *                                            played by a page elsewhere on the
 *                                            site (the pharCare demo page).
 *                                            Relative to the project root.
 *
 *  Every kind shares the same email allow-list + OTP gate.
 *
 *  Re-read on every call rather than cached: editing the JSON on the server
 *  takes effect immediately, with no restart. The file is tiny and this is not
 *  a hot path - a human is typing an email address at the time.
 */

const fs = require("fs");
const path = require("path");

const PRIVATE_DIR = path.join(__dirname, "..", "private");
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const REGISTRY = path.join(PRIVATE_DIR, "viewers.json");

function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY, "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("viewer: could not parse server/private/viewers.json -", err.message);
    }
    return {};
  }
}

function getDoc(docId) {
  if (!docId || !/^[a-z0-9-]{1,64}$/.test(docId)) return null;
  const doc = loadRegistry()[docId];
  if (!doc || (!doc.file && !doc.library)) return null;

  // An expired document behaves exactly as one that does not exist.
  if (doc.expires && Date.now() > Date.parse(doc.expires + "T23:59:59Z")) return null;

  return doc;
}

/*  Path traversal guard: `file` comes from a hand-edited JSON file, but a
 *  stray "../../.env" there must not become readable over HTTP. Resolve and
 *  confirm the result is still inside server/private/.
 */
function resolveFile(doc) {
  const full = path.resolve(PRIVATE_DIR, doc.file);
  const root = path.resolve(PRIVATE_DIR) + path.sep;
  if (!full.startsWith(root)) return null;
  if (!fs.existsSync(full)) return null;
  return full;
}

function kindOf(doc) {
  if (doc.library) return "library";
  if (/\.(mp4|m3u8)$/i.test(doc.file)) return "video";
  return "pdf";
}

/*  A file belonging to a video or library entry, named by a path relative to
 *  that entry's folder: "seg_004.m4s" for a video, "dashboard/index.m3u8" for
 *  a library. Every segment is checked against a strict pattern first, and the
 *  result must still sit inside the folder - the same traversal guard as
 *  resolveFile, for the same reason.
 */
function resolveMedia(doc, rel) {
  const parts = String(rel || "").split("/");
  if (!parts.length || parts.length > 2) return null;
  if (!parts.every((p) => /^[A-Za-z0-9_-][A-Za-z0-9._-]{0,99}$/.test(p) && p.indexOf("..") === -1)) return null;

  let base;
  if (kindOf(doc) === "library") {
    base = path.resolve(PROJECT_ROOT, doc.library);
    // A library must be a folder of the site, never server/ itself.
    if (!base.startsWith(path.resolve(PROJECT_ROOT) + path.sep)) return null;
    if (base.startsWith(path.resolve(PROJECT_ROOT, "server") + path.sep)) return null;
  } else if (kindOf(doc) === "video") {
    const file = resolveFile(doc);
    if (!file) return null;
    base = path.dirname(file);
  } else {
    return null;
  }

  const full = path.resolve(base, ...parts);
  if (!full.startsWith(base + path.sep)) return null;
  try {
    if (!fs.statSync(full).isFile()) return null;
  } catch {
    return null;
  }
  return full;
}

function isAllowed(doc, email) {
  if (!doc || !Array.isArray(doc.allow)) return false;
  const wanted = String(email).trim().toLowerCase();
  return doc.allow.some((a) => String(a).trim().toLowerCase() === wanted);
}

module.exports = { getDoc, resolveFile, resolveMedia, kindOf, isAllowed, PRIVATE_DIR };
