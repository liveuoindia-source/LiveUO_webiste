# Site map & information architecture

## Primary nav

```
Home
Products ▾ (mega-menu)
Solutions ▾
Resources ▾
Company ▾
[ Book a demo ]  ← persistent CTA button, not a nav item
```

## Products mega-menu

Four columns: **Flagship** gets its own visually distinct column (larger card, "Most popular"
badge) so it doesn't get lost next to four equal-weight links — this is the #1 fix for a mega-menu
that's supposed to sell one product harder than the rest.

```
Products
├── FLAGSHIP
│   └── pharCare — Pharmacy billing & management software  [Most popular]
├── Pharmacy
│   ├── Complete Pharmacy Management Software (multi-store/warehouse suite)
│   └── pharCare vs Marg ERP (comparison landing page)
├── Commerce & Billing
│   ├── E-commerce Platform
│   └── Billing Application
└── Services
    └── Custom Application Development
```

URLs:
- `/products/pharcare`
- `/products/complete-pharmacy-software`
- `/products/pharcare-vs-marg-erp`
- `/products/ecommerce-platform`
- `/products/billing-software`
- `/products/custom-application-development`

## Solutions menu (buyer-segment landing pages — thin pages that route into the right product)

```
Solutions
├── For Independent Pharmacies
├── For Pharmacy Chains
├── For Hospital Pharmacies
└── For Retail & D2C Brands (e-commerce buyer segment)
```

URLs: `/solutions/independent-pharmacies`, `/solutions/pharmacy-chains`,
`/solutions/hospital-pharmacies`, `/solutions/retail-ecommerce`

These exist because "chain pharmacy manager" and "independent pharmacy owner" search and buy
differently (chain buyers care about multi-branch sync and procurement; independent owners care
about price and setup speed) — one product page can't lead with both problems at once. Each
solution page reuses pharCare's feature content but re-orders the hero and proof section per
segment, and is the natural landing page for paid search / segment-specific campaigns.

## Resources menu

```
Resources
├── Blog / Articles
├── Case Studies
├── Guides & Comparisons
├── Brochures & Fliers  ← powered by the admin Downloads Manager (see 05)
│   ├── Company
│   ├── pharCare
│   ├── Complete Pharmacy Suite
│   ├── E-commerce & Billing
│   ├── Custom Applications
│   └── Fliers
└── FAQ
```

URL: `/resources`, `/resources/blog`, `/resources/case-studies`, `/resources/guides`,
`/resources/downloads` (auto-generated cards, see 05), `/resources/faq`

## Company menu

```
Company
├── About Us
├── Careers            (omit if not hiring publicly — don't ship an empty page)
├── Partners           (omit unless a channel/reseller program exists)
└── Contact
```

URL: `/about`, `/careers`, `/partners`, `/contact`

## Utility / legal (footer only, not in primary nav)

```
Privacy Policy · Terms of Service · Security & Compliance · Sitemap (HTML)
```

## Full flat site map

```
/                                    Home
/products/pharcare                   pharCare (flagship)
/products/pharcare-vs-marg-erp       Comparison landing page
/products/complete-pharmacy-software Complete Pharmacy Management Software
/products/ecommerce-platform         E-commerce Platform
/products/billing-software           Billing Application
/products/custom-application-development  Custom Application Development
/solutions/independent-pharmacies
/solutions/pharmacy-chains
/solutions/hospital-pharmacies
/solutions/retail-ecommerce
/resources
/resources/blog
/resources/blog/[slug]
/resources/case-studies
/resources/case-studies/[slug]
/resources/guides
/resources/guides/[slug]
/resources/downloads                 Brochures & Fliers (auto-generated, see 05)
/resources/faq
/about
/careers
/partners
/contact
/privacy
/terms
/security
```

## Notes carried into later sections

- Every `/products/*` and `/solutions/*` page ends in the same single CTA: **Book a demo** — per
  the brief's "ONE clear call-to-action" rule. Secondary links (download brochure, read case study)
  are allowed inline but the button styling is reserved for the demo CTA only.
- `/products/pharcare-vs-marg-erp` exists specifically to capture "Marg ERP alternative" /
  "pharCare vs Marg" search intent — see keyword list in 02.
- The current repo's `/services/*` routes (`ecommerce`, `pharma`, `automation`, `custom`) map
  roughly onto `/products/ecommerce-platform`, `/products/pharcare` +
  `/products/complete-pharmacy-software`, (drop — automation isn't in the liveuo product list),
  and `/products/custom-application-development`. Plan 301 redirects from the old paths if this
  URL structure ships.
