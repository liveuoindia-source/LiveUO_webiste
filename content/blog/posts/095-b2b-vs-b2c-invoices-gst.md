---json
{
  "title": "B2B vs B2C invoices under GST: what changes on the bill",
  "description": "How invoices differ when you sell to GST-registered businesses versus consumers: buyer GSTIN, place of supply, return reporting, e-invoicing and common errors.",
  "category": "GST & Tax",
  "service": "billing",
  "keywords": [
    "B2B invoice GST",
    "B2C invoice GST",
    "place of supply GST",
    "GSTR-1 B2B B2C",
    "GST billing software"
  ],
  "faq": [
    {
      "q": "What is the main difference between a B2B and B2C invoice?",
      "a": "A B2B invoice is issued to a GST-registered buyer and includes their GSTIN, so they can claim input tax credit. A B2C invoice is issued to a consumer or unregistered buyer."
    },
    {
      "q": "Why does the buyer's GSTIN matter so much?",
      "a": "Your return reports the sale against that GSTIN, and the buyer's input tax credit depends on it. A wrong GSTIN means the buyer may not see the credit and will come back to you to correct it."
    },
    {
      "q": "How is place of supply decided?",
      "a": "For goods, it is generally where the goods are delivered; for services, rules vary by type. Place of supply decides whether CGST and SGST or IGST applies. Your tax adviser can confirm unusual cases."
    },
    {
      "q": "Does e-invoicing apply to B2C invoices?",
      "a": "No. E-invoicing applies to B2B invoices and certain other supplies. Some large businesses have separate requirements for B2C invoices, such as a dynamic QR code."
    }
  ]
}
---
Many businesses sell to both consumers and other businesses. The invoice looks similar, but under GST the two are treated differently — on the bill, in your returns, and in what your customer can do with it. Mixing them up creates corrections that take far longer than getting them right the first time.

## B2B invoices

Issued to a **GST-registered buyer**. Key requirements:

- buyer's legal name, address and **GSTIN**
- place of supply
- HSN or SAC codes, with digits as required for your turnover
- tax breakup — CGST and SGST, or IGST
- if you're under e-invoicing, an IRN and QR code from the invoice registration portal

The buyer uses your invoice to claim input tax credit. In your GSTR-1, each B2B invoice is reported invoice by invoice against the buyer's GSTIN, and appears in their auto-generated statements.

## B2C invoices

Issued to **consumers and unregistered buyers**. They need:

- your details and GSTIN
- invoice number and date
- item details, value and tax
- buyer details where required — for example, larger inter-state B2C invoices have specific reporting, and the customer's address may be needed for place of supply

In returns, most B2C sales are reported in summary, by rate and state, rather than invoice by invoice. Thresholds and formats for reporting have changed over time, so check the current GSTR-1 requirements.

## Place of supply

Place of supply decides the tax type:

| Situation | Tax |
|---|---|
| Seller and place of supply in the same state | CGST + SGST |
| Place of supply in a different state | IGST |

For goods, place of supply is generally where delivery ends. For services, rules depend on the type of service and whether the recipient is registered. Getting this wrong means paying tax to the wrong government — a correction that's slow and painful.

## Common errors

- **Missing or wrong buyer GSTIN** — the buyer's credit doesn't appear; they ask you to amend.
- **B2B sale billed as B2C** — the buyer can't claim credit.
- **Wrong place of supply** — CGST/SGST charged instead of IGST, or vice versa.
- **Inactive GSTIN** — the buyer's registration was cancelled.
- **Wrong state code** on the invoice.

## How billing software should help

- **customer master** with GSTIN, state and registration type
- **GSTIN validation** — format check, and ideally verification against the GST system
- **automatic tax type** based on place of supply
- **separate B2B and B2C reporting** in GSTR-1 data
- **e-invoicing for B2B** where it applies
- **warnings** when a B2B customer has no GSTIN, or a GSTIN appears inactive

## At the counter

For businesses with walk-in counters, train staff to ask: "Do you need a GST invoice?" If yes, take the GSTIN and verify it before saving. Converting a B2C bill to B2B afterwards is far more work than asking once.

## Monthly check with major customers

Reconcile with your largest business customers before filing returns. If their records show an invoice you haven't reported — or the reverse — fix it in the same period.

## Quick summary

| | B2B | B2C |
|---|---|---|
| Buyer GSTIN | Required | Not applicable |
| Buyer claims credit | Yes | No |
| GSTR-1 reporting | Invoice-wise | Mostly summary |
| E-invoicing | If applicable | No (separate rules for some large businesses) |
| Most common error | Wrong GSTIN | Wrong place of supply |

Set up customer masters carefully, let software decide tax type and reporting, and the difference between B2B and B2C stops being something your staff has to think about.

See also [HSN and SAC codes on GST invoices](/resources/blog/hsn-sac-codes-on-gst-invoices/).
