# liveuo relaunch — content, SEO & admin downloads plan

This folder is the working deliverable for the liveuo content/SEO/admin-downloads brief.
Read in this order:

1. [01-sitemap.md](01-sitemap.md) — full site IA, mega-menu structure
2. [02-home-and-pharcare.md](02-home-and-pharcare.md) — Home + pharCare (flagship) page copy, SEO metadata, schema, FAQ
3. [03-product-pages.md](03-product-pages.md) — Complete Pharmacy Suite, E-commerce, Billing App, Custom Development
4. [04-seo-content-clusters.md](04-seo-content-clusters.md) — pillar/cluster plan, technical SEO checklist
5. [05-admin-downloads-manager.md](05-admin-downloads-manager.md) — IA, admin screens, DB schema, API, tech recommendation

## Assumptions locked in before writing (confirmed with the user)

| Item | Decision |
|---|---|
| Primary buyers | Chain pharmacy managers (primary), independent pharmacy owners, hospital pharmacy admins |
| Market/region | India — DPDP Act 2023, GST-compliant billing, Schedule H/H1/H1X drug rules |
| Named competitor | Marg ERP / Marg Pharmacy Software (positioned against generically — see 02) |
| Downloads Manager stack | Lightweight Node/Express + SQLite, self-hosted, layered onto the existing static export |

## Reality check on the current codebase (read before assuming any of this is "just an edit")

The live repo at the project root is **not** liveuo content today — it's a static Next.js export
branded "Nexora Systems" with generic pillars (E-Commerce, Pharma Care, Automation, Custom Apps).
There is no pharCare product anywhere in the current HTML, and no backend/database of any kind —
[server.js](../../server.js) is a zero-dependency static file server. Two consequences that shape
everything below:

- This is a **full rebrand + restructure**, not a copy edit. New IA, new nav, new URLs
  (`/services/*` → `/products/*`), new brand name and footer contact details throughout.
- The admin Downloads Manager is a **from-scratch backend build**, not a plug-in to something
  existing. Section 05 designs it to bolt onto `server.js` with the smallest possible footprint
  (Express + SQLite) rather than assuming any CMS is already in place.

Nothing below fabricates client names, stats, or logos as if they were verified facts — the
placeholder proof points (client counts, uptime %, case-study metrics) are marked `[VERIFY]` and
must be replaced with real numbers before publishing. Do not ship placeholder trust signals as
real ones.
