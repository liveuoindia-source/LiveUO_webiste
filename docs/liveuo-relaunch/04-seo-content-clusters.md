# SEO content cluster plan & technical SEO checklist

Hub-and-spoke model: one pillar page per product (the `/products/*` pages from 02/03) links out to
4-6 supporting articles under `/resources/blog` or `/resources/guides`; every supporting article
links back to its pillar with the target keyword as anchor text. pharCare's cluster is built out
first and deepest, per priority.

## Pillar 1 — pharCare (priority — build first)

Pillar: `/products/pharcare` — target: `pharCare`, `pharmacy billing software`

Supporting articles:
1. **"Schedule H, H1 & H1X: what pharmacy billing software must track by law"** — intent:
   compliance research; strong AI-answer candidate (direct-answer format).
2. **"GST invoicing for pharmacies: a practical guide"** — intent: category + compliance.
3. **"How to reduce expired-stock write-offs in a retail pharmacy"** — intent: problem-aware,
   pre-purchase research; ties directly to pharCare's batch/expiry feature.
4. **"Switching from Marg ERP to pharCare: a migration checklist"** — intent: competitive/switching,
   captures bottom-of-funnel searchers already using a named competitor.
5. **"Multi-branch pharmacy billing: what to look for in software"** — intent: category, chain-
   manager buyer persona.
6. **"Pharmacy billing software pricing in India: what actually drives the cost"** — intent:
   pricing research, common pre-demo search.

## Pillar 2 — Complete Pharmacy Management Software

Pillar: `/products/complete-pharmacy-software`

1. "When does a pharmacy chain need warehouse management software, not just billing?"
2. "Distributor billing vs. retail billing: what pharmacy software needs to handle both"
3. "Consolidated GST reporting across multiple pharmacy branches"
4. "Demand forecasting for pharmacy stock: reducing both stockouts and overstock"

## Pillar 3 — E-Commerce Platform

Pillar: `/products/ecommerce-platform`

1. "Headless commerce vs. traditional storefronts: which fits a growing D2C brand?"
2. "How to prepare an e-commerce site for a high-traffic sale event"
3. "Inventory sync between an online store and physical stock: common failure points"
4. "Choosing a payment gateway for an Indian e-commerce business"

## Pillar 4 — Billing Application

Pillar: `/products/billing-software`

1. "GST e-invoicing explained for small and mid-size businesses"
2. "Multi-user billing software: managing role-based access without slowing down billing"
3. "Recurring billing for subscription businesses in India"
4. "Billing software vs. accounting software: what's the actual difference?"

## Pillar 5 — Custom Application Development

Pillar: `/products/custom-application-development`

1. "Signs your business has outgrown off-the-shelf software"
2. "Legacy system modernization without a full rebuild: how it actually works"
3. "Fixed-scope vs. retainer: how custom software engagements get priced"
4. "What to include in an RFP for a custom software vendor"

## Cluster mechanics

- Every article: short direct-answer opening paragraph under the H1 (answers the query in the
  first 2-3 sentences — this is what gets lifted into AI Overviews/ChatGPT/Perplexity answers),
  then expands with H2 sections, then an FAQ block, then a CTA back to the relevant pillar page.
- Internal linking: pillar → all its spokes (in a "related reading" module), every spoke → its
  pillar (contextual in-body link, not just a footer link), and cross-links between the pharCare
  and Complete Pharmacy Suite clusters where genuinely relevant (e.g. article 4 in Pillar 1 also
  fits Pillar 2's audience).
- Publishing cadence suggestion: pharCare cluster first (6 articles), then one article/week across
  the remaining clusters until all 22 supporting articles are live — gives the flagship a ~6-week
  head start in indexing and topical authority before the rest compete for crawl budget.

## Technical SEO — do not skip these

- **XML sitemap** (`/sitemap.xml`) generated from the actual route list in 01, resubmitted to
  Google Search Console after the URL restructure (`/services/*` → `/products/*`) ships.
- **301 redirects** from every old `/services/*` path to its new `/products/*` equivalent —
  without this, the rebrand loses whatever link equity/indexing the current Nexora-branded pages
  have.
- **Canonical tags** on every page, self-referencing, especially important once solution pages
  (`/solutions/*`) reuse pharCare content — avoid duplicate-content signals between a solution page
  and the pillar it reuses copy from.
- **Robots.txt** — confirm it isn't accidentally blocking `/products/` or `/resources/` (worth a
  direct check once the new routes exist).
- **Core Web Vitals** — flag: the current build ships a Next.js client bundle with animation
  libraries (`motion` in [package.json](../../package.json)) on a marketing site that should be
  close to static. Audit LCP/CLS on the hero animation (the SVG network diagram) specifically —
  animated hero graphics are a common LCP/CLS regression source on marketing sites.
- **Mobile-first** — the bento-grid/card layout the brief asks for needs an explicit mobile
  breakpoint plan (cards stack to single column, mega-menu collapses to an accordion) — don't treat
  this as "responsive CSS will handle it," verify the mega-menu specifically since multi-column
  mega-menus are the most common mobile-nav failure point.
- **Structured data validation** — run every page through Google's Rich Results Test before launch;
  `FAQPage` and `SoftwareApplication` schema both have strict field requirements that silently fail
  to render as rich results if malformed.
- **Image alt text & file naming** — particularly on the pharCare feature screenshots/demo
  carousel — this is low-effort, real SEO value that's easy to skip under deadline pressure.
- **hreflang** — not needed now (single India-English target), but worth noting as a gap if the
  "global" expansion mentioned in the original brief context ever becomes real.
