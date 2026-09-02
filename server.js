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
app.use("/api/admin", adminApiRouter);
app.use("/admin", adminPagesRouter);

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
