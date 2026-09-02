# Admin Downloads Manager — IA, admin screens, DB schema, API, stack

Confirmed stack: **lightweight Node/Express + SQLite, self-hosted**, layered onto the existing
static export rather than replacing it — the current site has zero backend
([server.js](../../server.js) is a plain static file server), so this section designs the smallest
addition that gets the feature working without pulling in a CMS or a hosted database service.

## 1. IA / menu structure

### Public side — Resources → Brochures & Fliers

```
/resources/downloads                     All downloads, grouped by category
/resources/downloads?category=pharcare   Filtered view (also linkable from pharCare product page)
```

Categories (fixed set, matches the brief): `Company`, `pharCare`, `Complete Pharmacy Suite`,
`E-commerce & Billing`, `Custom Applications`, `Fliers`.

Auto-generated download cards: title, product/category tag, file type + size, version, "Updated
[date]" — download count is **not** shown publicly (internal metric only, showing it publicly
invites gaming/comparison anxiety with no buyer benefit). Card action is either a direct download
button or, if lead-capture is enabled for that asset, a "Get this brochure" button that opens the
lead form first.

Every `/products/*` page also gets a "Download brochure" link that deep-links to that product's
filtered download view — don't make buyers hunt through Resources for the one PDF relevant to the
page they're already on.

### Admin side

```
/admin/login
/admin/dashboard              Summary: total assets, downloads this week, drafts pending review
/admin/downloads               Asset list (main screen — see layout below)
/admin/downloads/new           Upload new asset
/admin/downloads/:id            Asset detail — versions, edit, download stats
/admin/leads                    Captured leads from gated downloads (if lead-capture used)
/admin/users                    User/role management (admin-only)
```

## 2. Admin screen layouts

### `/admin/downloads` — asset list

Table with filters at top (category, status: draft/published, sort by upload date or download
count) and columns:

```
[thumbnail/icon] Title | Category | Version | Status | Uploaded | Downloads | Actions
```

Actions per row: Edit, Replace file (new version), Publish/Unpublish toggle, Delete (soft-delete —
see schema notes). Bulk actions: publish/unpublish selected, change category.

### `/admin/downloads/new` and edit view

Form fields: Title, Category (dropdown, fixed list above), Description (shown on the public card,
optional), File upload, Version label (free text, e.g. "v2.1" or "July 2026"), Status
(draft/published — draft is the default on upload so nothing goes live by accident), Lead-capture
toggle (require name/email/phone before download — off by default), Product tag (for cross-linking
from `/products/*` pages).

### `/admin/downloads/:id` — asset detail

Header: current file, version, status, last updated by whom. Below: **version history** table
(every prior file replace kept, not overwritten — see `asset_versions` table) with the ability to
roll back to a previous version as the "current" file without re-uploading. Below that: a simple
download-count time series (even just a daily count table is enough — this doesn't need to be a
dashboard-grade chart).

### `/admin/leads` (only relevant if any asset uses lead-capture)

Table: Name, Email, Phone, Asset downloaded, Date, Source page — exportable to CSV. This is the
one screen that touches PII, so it's the one to restrict most tightly (see roles below) and the
one to cover explicitly in the privacy policy once DPDP Act obligations are in scope.

### `/admin/users`

Admin-only screen: list of users with role (`admin` or `marketing`), invite/deactivate. Keep this
screen minimal — this is an internal tool for a small team, not a multi-tenant product.

## 3. Roles

Two roles cover the brief's requirement ("marketing/admin only" publish access):

- **admin** — everything, including user management and permanent delete.
- **marketing** — create/edit/upload assets, toggle draft↔published, view leads and download
  stats; cannot manage users or hard-delete assets (soft-delete/archive only).

## 4. Database schema (SQLite)

```sql
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'marketing')),
  active        INTEGER NOT NULL DEFAULT 1,      -- 0/1 boolean
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  slug  TEXT NOT NULL UNIQUE,                     -- 'pharcare', 'complete-pharmacy-suite', ...
  name  TEXT NOT NULL,                             -- 'pharCare', 'Complete Pharmacy Suite', ...
  sort_order INTEGER NOT NULL DEFAULT 0
);
-- Seed: Company, pharCare, Complete Pharmacy Suite, E-commerce & Billing, Custom Applications, Fliers

CREATE TABLE assets (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,           -- for the public download URL
  description      TEXT,
  category_id      INTEGER NOT NULL REFERENCES categories(id),
  product_tag      TEXT,                            -- e.g. 'pharcare' — links to /products/pharcare
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  requires_lead    INTEGER NOT NULL DEFAULT 0,      -- gate behind lead-capture form
  current_version_id INTEGER,                       -- FK to asset_versions.id, set after first upload
  created_by       INTEGER NOT NULL REFERENCES users(id),
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  archived_at      TEXT                              -- soft-delete marker, NULL = active
);

CREATE TABLE asset_versions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id      INTEGER NOT NULL REFERENCES assets(id),
  version_label TEXT NOT NULL,                      -- 'v2.1', 'July 2026', free text
  file_path     TEXT NOT NULL,                       -- on-disk path, see storage note below
  file_name     TEXT NOT NULL,                       -- original filename, for download headers
  file_size     INTEGER NOT NULL,                    -- bytes
  mime_type     TEXT NOT NULL,
  uploaded_by   INTEGER NOT NULL REFERENCES users(id),
  uploaded_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE downloads_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id    INTEGER NOT NULL REFERENCES assets(id),
  version_id  INTEGER NOT NULL REFERENCES asset_versions(id),
  lead_id     INTEGER REFERENCES leads(id),          -- NULL if not a gated download
  ip_hash     TEXT,                                    -- hashed, not raw IP — DPDP-conscious
  downloaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  asset_id    INTEGER NOT NULL REFERENCES assets(id),
  source_page TEXT,                                    -- referring page, for attribution
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_versions_asset ON asset_versions(asset_id);
CREATE INDEX idx_downloads_asset ON downloads_log(asset_id);
```

Notes:
- `download_count` is **derived** (`COUNT(*) FROM downloads_log WHERE asset_id = ?`), not stored as
  a column on `assets` — avoids the count silently drifting out of sync with the log.
- Files are stored on disk (e.g. `/uploads/assets/{asset_id}/{version_id}-{filename}`), not as
  BLOBs in SQLite — keeps the database small and lets the existing static file server (or a
  reverse proxy) serve files directly if you want to skip streaming them through Node.
- `ip_hash` (not raw IP) on `downloads_log` keeps basic abuse/duplicate-detection ability without
  storing personal data unnecessarily — relevant given the DPDP Act 2023 compliance stance already
  committed to elsewhere in this content.

## 5. API endpoints

```
Public
GET  /api/downloads?category=pharcare        List published assets, optionally filtered
GET  /api/downloads/:slug                    Single asset detail (public fields only)
POST /api/downloads/:slug/request            Submit lead form for a gated asset → returns a
                                              short-lived signed download URL
GET  /api/downloads/:slug/file?token=...     Actual file stream; logs to downloads_log

Admin (all require session auth; role-checked where noted)
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/assets                     List all assets (any status)
POST   /api/admin/assets                     Create asset (draft)
PATCH  /api/admin/assets/:id                 Edit metadata, change status, toggle lead-capture
POST   /api/admin/assets/:id/versions        Upload a new file version
POST   /api/admin/assets/:id/versions/:vid/restore   Make an older version current
DELETE /api/admin/assets/:id                 Soft-delete (sets archived_at)      [admin only]
GET    /api/admin/assets/:id/stats           Download counts/time series for one asset
GET    /api/admin/leads                      List captured leads, CSV export     [admin only]
GET    /api/admin/users                      List users                          [admin only]
POST   /api/admin/users                      Create user                          [admin only]
PATCH  /api/admin/users/:id                  Change role/active status            [admin only]
```

## 6. How this bolts onto the existing static site

`server.js` today is a raw `http.createServer` static file handler with no routing framework.
Recommended integration path:

1. Replace the raw `http` server with a small **Express** app that mounts the exact same static-
   file-serving behavior as a fallback/last route (so every current page keeps working
   unchanged), plus:
   - `express.static()` (or the existing custom static handler, ported in) for the pre-built pages
   - `/api/downloads/*` and `/api/admin/*` routers for the new feature
   - `better-sqlite3` (synchronous, no separate DB server process — fits a small internal tool and
     a static-export-style deployment far better than Postgres would)
2. Admin UI (`/admin/*`) can ship as a handful of plain server-rendered HTML pages (or a small
   client-side bundle) rather than a full SPA — this is an internal tool used by a couple of
   marketing/admin users, not a customer-facing product; keep its build complexity proportional to
   that.
3. Session auth via a signed cookie (e.g. `express-session` + a SQLite session store, or a simple
   signed-cookie JWT) — no need for a full OAuth/identity provider for a 2-role internal tool.
4. File uploads via `multer`, streaming to disk under `/uploads`, with the path recorded in
   `asset_versions.file_path`.

This keeps the "static export served as static files" character of the site intact for every
marketing page while adding exactly the dynamic surface area the Downloads Manager needs — nothing
in this feature requires migrating the whole site off its current static-export model.
