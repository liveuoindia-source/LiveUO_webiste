/*  LiVEUO — static marketing site + Downloads Manager backend.
 *  Marketing pages remain plain static HTML/CSS/JS served from the project
 *  root. This file adds just enough Express around that to support the
 *  admin Downloads Manager: a session-authenticated admin UI + JSON API,
 *  backed by SQLite (see server/db.js).
 *
 *  Usage:  npm run dev      (or)   node server.js
 *  Port:   3000 by default, or set PORT (e.g. `set PORT=8080 && npm run dev`)
 */
require("dotenv").config();
const path = require("path");
const express = require("express");
const { sessionMiddleware } = require("./server/auth");
const downloadsPublicRouter = require("./server/routes/downloads-public");
const contactPublicRouter = require("./server/routes/contact-public");
const adminApiRouter = require("./server/routes/admin-api");
const adminPagesRouter = require("./server/routes/admin-pages");
const viewerApiRouter = require("./server/routes/viewer");
const viewerPageRouter = require("./server/routes/viewer-page");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");

// Legacy URL structure -> new IA. 301s run before static serving so both
// direct visits and crawlers get a real redirect, not just the meta-refresh
// stub left in the old file for defense-in-depth.
const LEGACY_REDIRECTS = {
  "/services/ecommerce": "/products/ecommerce-platform/",
  "/services/ecommerce/": "/products/ecommerce-platform/",
  "/services/pharma": "/products/pharcare/",
  "/services/pharma/": "/products/pharcare/",
  "/services/custom": "/products/custom-application-development/",
  "/services/custom/": "/products/custom-application-development/",
  "/services/automation": "/products/custom-application-development/",
  "/services/automation/": "/products/custom-application-development/",
  "/case-studies": "/resources/case-studies/",
  "/case-studies/": "/resources/case-studies/"
};
app.use((req, res, next) => {
  const target = LEGACY_REDIRECTS[req.path];
  if (target) return res.redirect(301, target);
  next();
});

app.use(express.json());
app.use(sessionMiddleware);

app.use("/api", downloadsPublicRouter);
app.use("/api", contactPublicRouter);
app.use("/api", viewerApiRouter);
app.use("/api/admin", adminApiRouter);
app.use("/admin", adminPagesRouter);

// Secure document viewer. Mounted BEFORE express.static so /viewer/<id> is
// always resolved by this router - a stray viewer/ directory in the web root
// must never be able to shadow it and serve a document ungated.
app.use("/viewer", viewerPageRouter);

/*  Everything below this point is served straight off disk, and ROOT is the
 *  whole project - so without this guard express.static happily hands out
 *  server/, the SQLite database, the blog source, and package.json. It was
 *  doing exactly that: /server/auth.js and /server/private/<the gated PDF>
 *  both answered 200, which made the document viewer's OTP gate pointless.
 *
 *  This used to be web.config's <hiddenSegments>, but that only ever applied
 *  to IIS - and that file's own header records it being inert in production
 *  anyway. Enforcing it here means the rule travels with the app.
 *
 *  Deny by prefix, not by extension: the point is that server/private/ is
 *  unreachable whatever is put inside it.
 */
const BLOCKED_PREFIXES = [
  "/server/", "/data/", "/uploads/", "/scripts/", "/content/",
  "/node_modules/", "/docs/", "/.git/", "/.github/", "/.claude/",
  // iisnode writes stdout/stderr here. Under the all-requests-to-node rewrite
  // these would otherwise be readable over HTTP, and they contain stack traces.
  "/iisnode-logs/", "/iisnode/"
];
const BLOCKED_EXACT = new Set([
  "/server.js", "/package.json", "/package-lock.json", "/web.config"
]);
const BLOCKED_EXT = /\.(zip|db|db-wal|db-shm|bak|log|env|pem|key)$/i;

app.use((req, res, next) => {
  // decodeURIComponent so /server%2Fauth.js cannot slip past the prefix test.
  let p;
  try {
    p = decodeURIComponent(req.path).replace(/\\/g, "/").toLowerCase();
  } catch {
    return res.status(400).end();
  }
  const blocked =
    BLOCKED_EXACT.has(p) ||
    BLOCKED_EXT.test(p) ||
    BLOCKED_PREFIXES.some((prefix) => p.startsWith(prefix));

  // 404, not 403: a 403 confirms the path exists.
  if (blocked) return res.status(404).sendFile(path.join(ROOT, "404.html"), () => res.end());
  next();
});

app.use(
  express.static(ROOT, {
    dotfiles: "ignore",
    extensions: ["html"]
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, "404.html"), (err) => {
    if (err) res.status(404).send("404 Not Found");
  });
});

app.listen(PORT, () => {
  console.log("\n  LiVEUO site is running:");
  console.log("  → http://localhost:" + PORT);
  console.log("  → Admin: http://localhost:" + PORT + "/admin/login\n");
  console.log("  Press Ctrl+C to stop.\n");
});
