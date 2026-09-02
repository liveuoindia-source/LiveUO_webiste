const express = require("express");
const crypto = require("crypto");
const { db } = require("../db");
const downloadToken = require("../lib/download-token");

const router = express.Router();

const PUBLIC_ASSET_SELECT = `
  SELECT a.id, a.title, a.slug, a.description, a.requires_lead, a.product_tag,
         c.slug AS category, a.updated_at,
         v.version_label AS version, v.file_size, v.mime_type
  FROM assets a
  JOIN categories c ON c.id = a.category_id
  LEFT JOIN asset_versions v ON v.id = a.current_version_id
  WHERE a.status = 'published' AND a.archived_at IS NULL
`;

router.get("/downloads", (req, res) => {
  const category = req.query.category;
  let rows;
  if (category) {
    rows = db
      .prepare(PUBLIC_ASSET_SELECT + " AND c.slug = ? ORDER BY a.updated_at DESC")
      .all(category);
  } else {
    rows = db.prepare(PUBLIC_ASSET_SELECT + " ORDER BY a.updated_at DESC").all();
  }
  res.json({ items: rows });
});

router.get("/downloads/:slug", (req, res) => {
  const row = db
    .prepare(PUBLIC_ASSET_SELECT + " AND a.slug = ?")
    .get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

router.post("/downloads/:slug/request", (req, res) => {
  const asset = db
    .prepare(
      "SELECT * FROM assets WHERE slug = ? AND status = 'published' AND archived_at IS NULL"
    )
    .get(req.params.slug);
  if (!asset) return res.status(404).json({ error: "Not found" });

  const { name, email, phone, source_page } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  db.prepare(
    "INSERT INTO leads (name, email, phone, asset_id, source_page) VALUES (?, ?, ?, ?, ?)"
  ).run(name, email, phone || null, asset.id, source_page || null);

  const token = downloadToken.sign(asset.id);
  res.json({ download_url: `/api/downloads/${asset.slug}/file?token=${token}` });
});

router.get("/downloads/:slug/file", (req, res) => {
  const asset = db
    .prepare(
      "SELECT * FROM assets WHERE slug = ? AND status = 'published' AND archived_at IS NULL"
    )
    .get(req.params.slug);
  if (!asset) return res.status(404).send("Not found");

  if (asset.requires_lead && !downloadToken.verify(req.query.token, asset.id)) {
    return res.status(403).send("This download requires your details first — please request it from the Resources page.");
  }

  const version = db
    .prepare("SELECT * FROM asset_versions WHERE id = ?")
    .get(asset.current_version_id);
  if (!version) return res.status(404).send("No file uploaded for this asset yet");

  const ipHash = crypto
    .createHash("sha256")
    .update(String(req.ip || ""))
    .digest("hex");
  db.prepare(
    "INSERT INTO downloads_log (asset_id, version_id, ip_hash) VALUES (?, ?, ?)"
  ).run(asset.id, version.id, ipHash);

  res.download(version.file_path, version.file_name);
});

module.exports = router;
