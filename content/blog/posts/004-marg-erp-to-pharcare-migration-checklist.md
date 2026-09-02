---json
{
  "title": "Switching from Marg ERP to pharCare: a migration checklist",
  "description": "What to export, what to clean, what to reconcile, and how to run a parallel week — a step-by-step checklist for moving a pharmacy off Marg ERP safely.",
  "category": "Migration",
  "keywords": [
    "Marg ERP alternative",
    "migrate from Marg ERP",
    "pharmacy software migration",
    "pharCare vs Marg ERP",
    "pharmacy data migration checklist"
  ],
  "faq": [
    {
      "q": "How long does a migration from Marg ERP usually take?",
      "a": "For a single-branch pharmacy with a clean stock file, plan on one to two weeks from export to go-live, most of which is data cleanup and verification rather than the import itself. Multi-branch rollouts are usually staged branch by branch over three to six weeks."
    },
    {
      "q": "Will I lose my old billing and compliance history?",
      "a": "No. Historical transactions are imported as read-only history so registers and past invoices remain retrievable. Separately, keep an archived copy of the original database — retention obligations sit with you regardless of which software you run."
    },
    {
      "q": "Can stock be migrated with batch numbers and expiry dates intact?",
      "a": "Yes, provided the source data holds them. Batch-level export is the single most important item in the migration, because rebuilding batch and expiry data by hand across thousands of SKUs is not realistic."
    },
    {
      "q": "Do I have to stop billing during the switchover?",
      "a": "No. The standard approach is a parallel week where both systems run, followed by a cutover at a natural low point — typically a month end after stock is reconciled."
    }
  ]
}
---
Migrating a pharmacy off an incumbent system is not primarily a software task — it is a data quality task with a deadline. The import itself takes hours. The work that determines whether the switch succeeds is what happens to your item master, your batch data and your outstanding balances in the two weeks before it. This checklist covers that work in the order it needs to happen.

## Phase 1 — Export everything, before you change anything

Take a complete export while the old system is still your live system. You want, at minimum:

- **Item master** — code, name, manufacturer, pack size, HSN, GST rate, schedule classification
- **Current stock by batch** — batch number, expiry date, quantity, purchase rate, MRP
- **Suppliers** — name, address, GSTIN, payment terms, outstanding balance
- **Customers** — name, phone, GSTIN where applicable, credit balance
- **Open purchase orders** and goods-in-transit
- **Transaction history** — sales and purchases for the retention period you are obliged to keep
- **Compliance registers** — Schedule H1 and Schedule X records

> Take a full database backup as well, not just the exports. Once you cut over, the old system becomes your only route back to anything the exports missed — and something is always missed.

## Phase 2 — Clean the item master

This is where most of the effort goes, and it is worth doing properly. Migrating a messy master means paying for the mess forever.

**Deduplicate.** Years of counter-side item creation produce three versions of the same product with different spellings. Merge them, keeping the code that appears in the most transactions.

**Retire dead items.** Anything with zero stock and no movement in eighteen months does not need to come across. A master trimmed by thirty percent is materially faster to search at the counter.

**Fill in HSN and GST rate.** Every item, no exceptions. Blank HSN codes are the top cause of a painful first GST filing on a new system.

**Set the schedule classification.** H, H1, X or none, on every item. If this field was never maintained in the old system, this is the moment to fix it — you are otherwise migrating a compliance gap.

**Standardise pack representation.** Decide whether you bill in strips, tablets or boxes, and make the master consistent. Mixed conventions cause stock arithmetic errors that surface weeks later.

## Phase 3 — Reconcile stock physically

Do not migrate a stock figure you have not verified.

1. Freeze purchases for a short window
2. Run a **physical count**, batch by batch, for at least your top-moving and highest-value lines
3. Reconcile the count against the export; investigate variances above a threshold you set
4. Adjust in the **old** system so the export and reality agree
5. Re-export the corrected stock file

Migrating an unverified stock position means every discrepancy discovered later gets blamed on the new software, and you will never be able to prove otherwise.

## Phase 4 — Import and verify

Import in dependency order: items, then suppliers and customers, then opening stock by batch, then open balances, then history.

Then verify with checks that would catch a silent failure:

| Check | What it proves |
|---|---|
| Total SKU count matches export | No rows dropped on import |
| Total stock value matches to the rupee | Rates and quantities mapped correctly |
| Batch count per top-50 item matches | Batch structure preserved, not flattened |
| Supplier outstanding total matches | Balances carried, not reset |
| Sample 20 items: MRP, GST, HSN, schedule | Field mapping is correct, not merely populated |

The fourth column of a spreadsheet landing in the fifth field of the target is the classic migration failure, and totals alone will not reveal it. Spot-check actual records.

## Phase 5 — Run a parallel week

For five to seven working days, bill in both systems. It is genuinely tedious and it is the step that prevents a bad month.

What you are looking for:
- **Daily sales totals match** between systems
- **Stock movement matches** for a sample of items
- **Staff can complete a bill unaided** in the new system by day three
- **The GST breakup on printed bills is identical**

If staff cannot bill unaided by day three, the problem is usually shortcut keys and screen layout, not capability — worth resolving before cutover rather than after.

## Phase 6 — Cut over

Pick a **month end**. The tax period boundary keeps your filings clean and gives your accountant a single clear line between systems.

On the day:
- Final export and delta import of anything transacted since the main import
- Final physical spot count on high-value lines
- Old system moved to read-only, retained for the full record-retention period
- New invoice serial series started, documented for your accountant

## What people forget

**Printer and hardware settings.** Bill format, paper size, barcode scanner profiles, cash drawer triggers. Trivial individually, and collectively a full day of frustration if left to go-live morning.

**Prescriber and patient records.** If your H1 register depends on repeat prescriber data, migrate it. Re-keying prescriber addresses at the counter will make compliance feel like a punishment.

**Scheme and discount structures.** Distributor schemes and customer discount slabs need to be reconstructed deliberately, not discovered when a bill prints wrong.

**Who owns the old data.** Confirm your export rights and archive access before you give notice on the old contract, not after.

## How pharCare approaches it

[pharCare](/products/pharcare/) onboarding includes the migration itself — stock with batch and expiry intact, customer and supplier masters, outstanding balances, and transaction history imported as retrievable read-only records. The item master cleanup is done collaboratively, because deduplication decisions need someone who knows the counter, not just the data.

If you are weighing the move, the [pharCare vs Marg ERP comparison](/products/pharcare-vs-marg-erp/) covers the functional differences, and a [demo](/contact/) can be run against a sample of your own export so you can see your actual data in the new system before committing.
