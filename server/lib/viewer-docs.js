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
 *  Re-read on every call rather than cached: editing the JSON on the server
 *  takes effect immediately, with no restart. The file is tiny and this is not
 *  a hot path - a human is typing an email address at the time.
 */

const fs = require("fs");
const path = require("path");

const PRIVATE_DIR = path.join(__dirname, "..", "private");
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
  if (!doc || !doc.file) return null;

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

function isAllowed(doc, email) {
  if (!doc || !Array.isArray(doc.allow)) return false;
  const wanted = String(email).trim().toLowerCase();
  return doc.allow.some((a) => String(a).trim().toLowerCase() === wanted);
}

module.exports = { getDoc, resolveFile, isAllowed, PRIVATE_DIR };
