---json
{
  "title": "GSTR-1 and GSTR-3B for pharmacies: getting to a clean monthly filing",
  "description": "What your billing system must produce for a pharmacy GST return to reconcile first time: rate-wise splits, B2B separation, linked credit notes, HSN summaries.",
  "category": "GST & Tax",
  "keywords": [
    "GSTR-1 pharmacy",
    "GSTR-3B filing pharmacy",
    "pharmacy GST return software",
    "GST reconciliation pharmacy",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Why does my pharmacy GST return never reconcile first time?",
      "a": "Almost always because the sales register is not split the way the return needs it — B2B and B2C merged, credit notes not linked to original invoices, or HSN summaries missing. The fix is in how the billing system exports, not in how the return is prepared."
    },
    {
      "q": "How should B2B pharmacy sales be identified?",
      "a": "By the presence of the buyer's GSTIN on the invoice. Capturing GSTIN must be a one-field action at the counter, because if it is awkward staff will skip it and the sale lands in B2C, where it cannot be corrected without amending the invoice."
    },
    {
      "q": "Do expired stock write-offs affect my GST return?",
      "a": "They can. Input tax credit claimed on goods that are subsequently destroyed or written off may require reversal. You need a report of the tax value of stock written off in the period, which many pharmacy systems do not produce."
    },
    {
      "q": "Does pharCare export data for GST filing?",
      "a": "Yes. Sales and purchase registers export split by tax rate and by B2B/B2C, with credit and debit notes carrying their original invoice reference and an HSN-wise summary, in a form an accountant or filing tool can use directly."
    }
  ]
}
---
A pharmacy GST return should be a twenty-minute exercise of reviewing figures your system already produced. When it takes a day, the cause is nearly always the same: the billing system exports a flat list of bills, and someone has to reshape that list by hand into what the return actually needs. This article sets out the shape the return needs, so you can check whether your software produces it.

## What the two returns are asking for

**GSTR-1** is the statement of outward supplies. It wants your sales, categorised — B2B invoices individually, B2C consolidated by rate, credit and debit notes referenced to their originals, exports and exempt supplies separated, and an HSN-wise summary of what you sold.

**GSTR-3B** is the summary return through which tax is actually paid. It wants totals: outward taxable supplies by category, input tax credit available and reversed, and net tax payable.

The two must be consistent with each other and with your books. Inconsistency between them is one of the most commonly flagged discrepancies.

## The six things your sales register must contain

Check your export against this list. Each missing item translates directly into manual work every month.

**1. Rate-wise split per invoice.** Not an invoice total with an average rate. A pharmacy bill routinely spans several slabs, and the return needs taxable value and tax amount per rate.

**2. B2B and B2C separated, by GSTIN presence.** B2B invoices are reported individually with the counterparty GSTIN. B2C is consolidated. If your register does not distinguish them, someone is sorting bills by hand.

**3. Place of supply.** Usually your own state for counter sales, but institutional supply across a state line changes the tax type from CGST/SGST to IGST, and that must be on the record rather than inferred later.

**4. Credit and debit notes linked to originals.** A credit note in GSTR-1 must reference the invoice it adjusts. A register that lists credit notes as standalone documents forces a manual matching exercise.

**5. HSN-wise summary.** Quantity, taxable value and tax by HSN code, at the digit length your turnover requires. This is only possible if HSN is populated on every item — which is why blank HSN on the item master is a filing problem, not just an untidiness problem.

**6. A serial number sequence with no unexplained gaps.** Cancellations should be recorded as cancelled, retaining the number, rather than deleted.

## The purchase side, and input tax credit

The purchase register drives your ITC claim, and it needs:

- **Supplier GSTIN** on every line, without exception
- Rate-wise taxable value and tax
- Invoice number and date exactly as the supplier issued them
- Credit notes received, linked to the original purchase

That last detail — invoice number **exactly** as issued — is what determines whether your claim matches what the supplier reported. A trailing space, a missing prefix, or a re-typed number produces a mismatch in the auto-populated statement, and chasing those consumes more accountant time than anything else in the process.

> The practical rule: never re-key a supplier invoice number. Import it, or scan it. Manual entry of a reference that must match a third party's record exactly is a process designed to fail a small percentage of the time.

## The pharmacy-specific complications

### Expiry write-offs and ITC reversal

Stock that expires on your shelf and is destroyed rather than returned may require reversal of the input tax credit claimed on it. To handle this you need a report of **write-offs in the period, with the tax value**. Many pharmacy systems record a stock adjustment without a tax dimension, which leaves your accountant estimating.

### Supplier returns of near-expiry stock

Returning stock to a distributor is a documented transaction with a tax consequence, and it must be linked to the original purchase batch so the credit is traceable. This is another reason [batch-level tracking](/resources/blog/batch-wise-inventory-tracking-pharmacy/) matters beyond inventory.

### Mixed-rate bills at volume

Nothing conceptually hard, but at a few hundred bills a day the rate-wise split has to be produced by the system correctly every time. Verify it on a sample before you trust it at scale.

### Institutional and clinic supply

Regular B2B business for most pharmacies. If capturing a GSTIN takes more than one field and one keystroke, it will be skipped during busy periods and the sale will be misclassified.

## A month-end routine that works

| Day | Task |
|---|---|
| Last working day | Ensure all purchases for the period are entered; no goods-in-transit unrecorded |
| Day 1 | Export sales register, purchase register, credit/debit notes, HSN summary |
| Day 1 | Reconcile sales register total against the books and against cash/card settlements |
| Day 2 | Reconcile purchase register against the auto-populated inward statement; chase mismatches |
| Day 3 | Review write-offs and ITC reversals for the period |
| Day 4 | File |

The reconciliation on day 1 — register against books — is the step that catches problems while there is still time to fix them. Filing from an unreconciled register means discovering the problem after submission.

## What to ask a vendor

Four questions that separate systems that will help from systems that will not:

1. Show me a sales register export **split by rate and by B2B/B2C**
2. Show me a credit note in that export **carrying its original invoice reference**
3. Show me the **HSN-wise summary** for a month
4. Show me the **tax value of stock written off** in a period

If any of the four requires a spreadsheet built by hand, that is a recurring monthly cost you are agreeing to.

## How pharCare handles it

[pharCare](/products/pharcare/) produces sales and purchase registers split by rate and by B2B/B2C, with place of supply recorded, credit and debit notes carrying their originating invoice reference, an HSN-wise summary at the required digit length, and a write-off report with tax values for ITC reversal. GSTIN capture is a single field at the counter, and supplier invoice references are imported rather than re-keyed wherever the distributor provides a file. The broader mechanics of getting the invoice itself right are covered in the [GST invoicing guide](/resources/blog/gst-invoicing-for-pharmacies/).

To see the exports against your own data, [book a demo](/contact/).

---

*Return formats, thresholds and rates change by notification. Confirm current requirements with your tax advisor or the CBIC before relying on any specific detail here.*
