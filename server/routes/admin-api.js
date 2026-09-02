const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { db, UPLOADS_DIR } = require("../db");
const { requireAuth, requireAdmin, login } = require("../auth");

const router = express.Router();

/* ---------- auth ---------- */
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = login(email, password);
  if (!user) return res.status(401).json({ error: "Invalid email or password" });
  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.email = user.email;
  res.json({ id: user.id, email: user.email, role: user.role });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ email: req.session.email, role: req.session.role });
});

/* ---------- categories ---------- */
router.get("/categories", requireAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM categories ORDER BY sort_order").all());
});

/* ---------- assets ---------- */
const ASSET_ADMIN_SELECT = `
  SELECT a.*, c.slug AS category_slug, c.name AS category_name,
         v.version_label, v.file_name, v.file_size, v.mime_type,
         (SELECT COUNT(*) FROM downloads_log d WHERE d.asset_id = a.id) AS download_count
  FROM assets a
  JOIN categories c ON c.id = a.category_id
  LEFT JOIN asset_versions v ON v.id = a.current_version_id
  WHERE a.archived_at IS NULL
`;

router.get("/assets", requireAuth, (req, res) => {
  const { category, status } = req.query;
  let sql = ASSET_ADMIN_SELECT;
  const params = [];
  if (category) {
    sql += " AND c.slug = ?";
    params.push(category);
  }
  if (status) {
    sql += " AND a.status = ?";
    params.push(status);
  }
  sql += " ORDER BY a.updated_at DESC";
  res.json(db.prepare(sql).all(...params));
});

router.get("/assets/:id", requireAuth, (req, res) => {
  const asset = db
    .prepare(ASSET_ADMIN_SELECT + " AND a.id = ?")
    .get(req.params.id);
  if (!asset) return res.status(404).json({ error: "Not found" });
  const versions = db
    .prepare(
      "SELECT id, version_label, file_name, file_size, mime_type, uploaded_at FROM asset_versions WHERE asset_id = ? ORDER BY uploaded_at DESC"
    )
    .all(req.params.id);
  res.json({ ...asset, versions });
});

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.post("/assets", requireAuth, (req, res) => {
  const { title, category_slug, description, product_tag, requires_lead } = req.body || {};
  if (!title || !category_slug) {
    return res.status(400).json({ error: "Title and category are required" });
  }
  const category = db
    .prepare("SELECT * FROM categories WHERE slug = ?")
    .get(category_slug);
  if (!category) return res.status(400).json({ error: "Unknown category" });

  let slug = slugify(title);
  const exists = db.prepare("SELECT 1 FROM assets WHERE slug = ?").get(slug);
  if (exists) slug = slug + "-" + Date.now().toString(36);

  const info = db
    .prepare(
      `INSERT INTO assets (title, slug, description, category_id, product_tag, requires_lead, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(title, slug, description || null, category.id, product_tag || null, requires_lead ? 1 : 0, req.session.userId);

  res.status(201).json({ id: info.lastInsertRowid, slug });
});

router.patch("/assets/:id", requireAuth, (req, res) => {
  const asset = db.prepare("SELECT * FROM assets WHERE id = ? AND archived_at IS NULL").get(req.params.id);
  if (!asset) return res.status(404).json({ error: "Not found" });

  const { title, description, category_slug, product_tag, requires_lead, status } = req.body || {};

  if (status === "published" && !asset.current_version_id) {
    return res.status(400).json({ error: "Upload a file version before publishing" });
  }

  let categoryId = asset.category_id;
  if (category_slug) {
    const category = db.prepare("SELECT * FROM categories WHERE slug = ?").get(category_slug);
    if (!category) return res.status(400).json({ error: "Unknown category" });
    categoryId = category.id;
  }

  db.prepare(
    `UPDATE assets SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      category_id = ?,
      product_tag = COALESCE(?, product_tag),
      requires_lead = COALESCE(?, requires_lead),
      status = COALESCE(?, status),
      updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title || null,
    description || null,
    categoryId,
    product_tag || null,
    requires_lead === undefined ? null : (requires_lead ? 1 : 0),
    status || null,
    req.params.id
  );

  res.json({ ok: true });
});

router.delete("/assets/:id", requireAuth, (req, res) => {
  db.prepare("UPDATE assets SET archived_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get("/assets/:id/stats", requireAuth, (req, res) => {
  const total = db
    .prepare("SELECT COUNT(*) AS n FROM downloads_log WHERE asset_id = ?")
    .get(req.params.id).n;
  const byDay = db
    .prepare(
      `SELECT date(downloaded_at) AS day, COUNT(*) AS n
       FROM downloads_log WHERE asset_id = ?
       GROUP BY day ORDER BY day DESC LIMIT 30`
    )
    .all(req.params.id);
  res.json({ total, byDay });
});

/* ---------- versions (file upload) ---------- */
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(UPLOADS_DIR, String(req.params.id));
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_"));
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post("/assets/:id/versions", requireAuth, upload.single("file"), (req, res) => {
  const asset = db.prepare("SELECT * FROM assets WHERE id = ? AND archived_at IS NULL").get(req.params.id);
  if (!asset) return res.status(404).json({ error: "Not found" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const versionLabel = req.body.version_label || "v1";
  const info = db
    .prepare(
      `INSERT INTO asset_versions (asset_id, version_label, file_path, file_name, file_size, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(asset.id, versionLabel, req.file.path, req.file.originalname, req.file.size, req.file.mimetype, req.session.userId);

  db.prepare("UPDATE assets SET current_version_id = ?, updated_at = datetime('now') WHERE id = ?").run(
    info.lastInsertRowid,
    asset.id
  );

  res.status(201).json({ id: info.lastInsertRowid });
});

router.post("/assets/:id/versions/:vid/restore", requireAuth, (req, res) => {
  const version = db
    .prepare("SELECT * FROM asset_versions WHERE id = ? AND asset_id = ?")
    .get(req.params.vid, req.params.id);
  if (!version) return res.status(404).json({ error: "Version not found" });
  db.prepare("UPDATE assets SET current_version_id = ?, updated_at = datetime('now') WHERE id = ?").run(
    version.id,
    req.params.id
  );
  res.json({ ok: true });
});

/* ---------- leads ---------- */
router.get("/leads", requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT l.*, a.title AS asset_title FROM leads l
       JOIN assets a ON a.id = l.asset_id
       ORDER BY l.created_at DESC`
    )
    .all();

  if (req.query.format === "csv") {
    const header = "name,email,phone,asset,source_page,created_at\n";
    const body = rows
      .map((r) =>
        [r.name, r.email, r.phone || "", r.asset_title, r.source_page || "", r.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    return res.send(header + body);
  }
  res.json(rows);
});

/* ---------- users ---------- */
router.get("/users", requireAuth, requireAdmin, (req, res) => {
  res.json(db.prepare("SELECT id, email, role, active, created_at FROM users ORDER BY created_at").all());
});

router.post("/users", requireAuth, requireAdmin, (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password || !["admin", "marketing"].includes(role)) {
    return res.status(400).json({ error: "email, password, and a valid role are required" });
  }
  const hash = bcrypt.hashSync(password, 10);
  try {
    const info = db
      .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
      .run(email, hash, role);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "A user with that email already exists" });
  }
});

router.patch("/users/:id", requireAuth, requireAdmin, (req, res) => {
  const { role, active } = req.body || {};
  db.prepare(
    "UPDATE users SET role = COALESCE(?, role), active = COALESCE(?, active) WHERE id = ?"
  ).run(role || null, active === undefined ? null : (active ? 1 : 0), req.params.id);
  res.json({ ok: true });
});

module.exports = router;
