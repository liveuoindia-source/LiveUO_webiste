---json
{
  "title": "GST e-invoicing explained: who needs an IRN, and what changes",
  "description": "What e-invoicing under GST actually involves, how to check whether it applies to you, and what your billing software must do so it doesn't slow down every sale.",
  "category": "GST & Tax",
  "service": "billing",
  "keywords": [
    "GST e-invoicing",
    "IRN generation",
    "e-invoice applicability",
    "invoice registration portal",
    "GST billing software"
  ],
  "faq": [
    {
      "q": "Does e-invoicing apply to B2C sales?",
      "a": "No. E-invoicing applies to business-to-business invoices, exports and certain other supplies. Ordinary retail sales to consumers are outside it, although large businesses have separate requirements, such as a dynamic QR code on B2C invoices."
    },
    {
      "q": "How do I know if my business must issue e-invoices?",
      "a": "Applicability depends on aggregate annual turnover in any financial year since 2017-18, and the threshold has been lowered several times. Check the current notification on the GST portal or with your tax adviser, then test it against every year's turnover, not just the latest."
    },
    {
      "q": "Can an e-invoice be cancelled?",
      "a": "An IRN can be cancelled on the portal only within a short window after generation, and the invoice cannot simply be edited afterwards. Mistakes found later are corrected with a credit or debit note."
    },
    {
      "q": "Does billing software generate the IRN itself?",
      "a": "No. The IRN is issued by the Invoice Registration Portal. Good billing software sends the invoice data to the portal, directly or through a GST suvidha provider, receives the IRN and signed QR code, and prints them on the invoice."
    }
  ]
}
---
E-invoicing is often misunderstood as "creating invoices electronically". Most businesses already do that. Under GST, e-invoicing means something narrower: registering each eligible B2B invoice on a government portal, which returns a unique number and a signed QR code that must appear on the invoice.

It is a small change on paper. In practice it changes the moment an invoice becomes final, and it depends on your billing software handling the round trip quickly and reliably.

## What e-invoicing actually is

When an e-invoicing business raises a B2B invoice, it sends the invoice details in a standard format to the Invoice Registration Portal (IRP). The portal validates the data and returns:

- an **Invoice Reference Number (IRN)**, a unique hash for that invoice
- a **signed QR code** containing the key invoice details
- an acknowledgement number and date

The invoice given to the buyer must carry the IRN and QR code. The data is also passed on to the GST system, which pre-fills parts of your returns and helps generate e-way bills.

An invoice that should have been registered but was not is not treated as a valid tax invoice. For the buyer, that can put input tax credit at risk — which is why buyers increasingly check.

## Does it apply to you?

Applicability is based on **aggregate annual turnover**, assessed on a PAN basis across all your GST registrations. If your turnover crossed the notified threshold in any financial year from 2017-18 onwards, e-invoicing applies from the date specified for that threshold, and stays applicable even if turnover later falls.

The threshold has been reduced in stages over the years, so do not rely on a number you heard a while ago. Check the current notification, and check every year's turnover — a single strong year in the past is enough to bring you in.

Some categories are exempt regardless of turnover, such as certain banking, insurance and passenger transport services. If you are near the threshold, confirm your position with your tax adviser.

## Which documents are covered

E-invoicing covers more than invoices:

- tax invoices for B2B supplies
- credit notes and debit notes
- supplies to SEZ units and exports
- certain reverse-charge supplies

It does not cover ordinary B2C sales, bills of supply, or delivery challans.

## What changes in your billing process

### The invoice is final only after the IRN

Before e-invoicing, an invoice was final when you saved and printed it. Now it is final when the portal accepts it. Your process needs a clear answer to: what happens if the portal is slow, or rejects the invoice?

Good billing software queues the request, retries, and shows which invoices are still waiting for an IRN, so nothing leaves the building without one.

### Master data has to be right

The portal validates the data it receives. The most common rejections come from:

- the buyer's GSTIN entered wrongly or inactive
- incorrect or missing HSN codes
- totals that don't add up after rounding
- duplicate invoice numbers within the financial year

Clean customer and item masters remove most of these before they happen.

### Corrections become credit notes

You can cancel an IRN only within a short window after generating it, and cannot amend it on the portal. After that, errors are corrected with a credit or debit note — which, if you are under e-invoicing, also needs its own IRN.

## What to expect from billing software

If e-invoicing applies to you, your billing software should:

1. **Generate IRNs from the invoice screen**, without exporting files and uploading them separately.
2. **Print the IRN and QR code** on the invoice automatically.
3. **Show pending and failed requests** clearly, with the reason for rejection.
4. **Validate before sending** — GSTIN format, HSN code, totals — so rejections are rare.
5. **Handle credit and debit notes** through the same flow.
6. **Generate the e-way bill** from the same data when goods move.

Bulk export to an Excel template and a manual upload works at low volume. It does not work at a counter or a dispatch desk where invoices are raised all day.

## A practical rollout checklist

- Confirm applicability and the start date with your tax adviser.
- Clean your customer master: verify every B2B customer's GSTIN.
- Check every item has the correct HSN code, with the number of digits required for your turnover.
- Decide who handles rejected invoices and how quickly.
- Test with a few invoices before the start date.
- Train counter and dispatch staff on what a pending IRN looks like.

## The bottom line

E-invoicing adds one step to every B2B sale. If your software makes that step invisible — validating, registering and printing in one action — your staff will barely notice it. If it doesn't, every invoice becomes a small manual task, and small manual tasks are where errors creep in.
