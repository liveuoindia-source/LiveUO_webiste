const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(__dirname, "..", "data");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads", "assets");
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "app.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'marketing')),
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  slug  TEXT NOT NULL UNIQUE,
  name  TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS assets (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  category_id      INTEGER NOT NULL REFERENCES categories(id),
  product_tag      TEXT,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  requires_lead    INTEGER NOT NULL DEFAULT 0,
  current_version_id INTEGER,
  created_by       INTEGER NOT NULL REFERENCES users(id),
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  archived_at      TEXT
);

CREATE TABLE IF NOT EXISTS asset_versions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id      INTEGER NOT NULL REFERENCES assets(id),
  version_label TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     INTEGER NOT NULL,
  mime_type     TEXT NOT NULL,
  uploaded_by   INTEGER NOT NULL REFERENCES users(id),
  uploaded_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS downloads_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id    INTEGER NOT NULL REFERENCES assets(id),
  version_id  INTEGER NOT NULL REFERENCES asset_versions(id),
  lead_id     INTEGER REFERENCES leads(id),
  ip_hash     TEXT,
  downloaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  asset_id    INTEGER NOT NULL REFERENCES assets(id),
  source_page TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  service     TEXT,
  message     TEXT NOT NULL,
  ip_hash     TEXT,
  email_sent  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_versions_asset ON asset_versions(asset_id);
CREATE INDEX IF NOT EXISTS idx_downloads_asset ON downloads_log(asset_id);
`);

const DEFAULT_CATEGORIES = [
  { slug: "company", name: "Company" },
  { slug: "pharcare", name: "pharCare" },
  { slug: "complete-pharmacy-suite", name: "Complete Pharmacy Suite" },
  { slug: "ecommerce-billing", name: "E-Commerce & Billing" },
  { slug: "custom-applications", name: "Custom Applications" },
  { slug: "fliers", name: "Fliers" }
];
const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (slug, name, sort_order) VALUES (?, ?, ?)"
);
DEFAULT_CATEGORIES.forEach((c, i) => insertCategory.run(c.slug, c.name, i));

const userCount = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
if (userCount === 0) {
  const email = process.env.ADMIN_EMAIL || "admin@liveuo.com";
  const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString("base64url");
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO users (email, password_hash, role, active) VALUES (?, ?, 'admin', 1)"
  ).run(email, hash);
  console.log("\n  ── Downloads Manager: first-run admin account created ──");
  console.log("  Email:    " + email);
  console.log("  Password: " + password);
  console.log("  (shown once — store it; set ADMIN_EMAIL/ADMIN_PASSWORD env vars to control this)\n");
}

module.exports = { db, UPLOADS_DIR };
