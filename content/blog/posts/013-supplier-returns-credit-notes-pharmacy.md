---json
{
  "title": "Supplier returns and credit notes: recovering expiry value",
  "description": "Distributor return windows, breakage claims, and the paperwork that decides whether a credit note actually arrives. Running pharmacy returns as a real process.",
  "category": "Purchasing",
  "keywords": [
    "pharmacy supplier returns",
    "distributor credit note pharmacy",
    "near expiry return policy",
    "pharmacy breakage claim",
    "pharCare"
  ],
  "faq": [
    {
      "q": "What is a typical distributor return window for near-expiry medicine?",
      "a": "It varies by distributor and by the terms you negotiated, commonly somewhere between three and six months before expiry. Because it varies, the near-expiry alert in your software should be set per supplier rather than as one global figure."
    },
    {
      "q": "Why do credit notes for returns so often go missing?",
      "a": "Because the return is dispatched without a tracked document reference, and nobody reconciles credits received against returns sent. A monthly reconciliation of returns dispatched versus credits received is what converts returns from hopeful to reliable."
    },
    {
      "q": "How should a supplier return be recorded for GST?",
      "a": "The return is documented through a credit note from the supplier or a debit note raised by you, depending on the arrangement, and must be linked to the original purchase batch so the input tax credit adjustment is traceable."
    },
    {
      "q": "Does pharCare track returns against credits received?",
      "a": "Yes. Returns are raised against the original purchase batch, tracked as outstanding until the supplier credit is recorded against them, and reported as an ageing list so unclaimed credits stay visible."
    }
  ]
}
---
Returning near-expiry stock to a distributor is the difference between recovering most of an item's cost and writing all of it off. Yet returns are usually run informally — stock is put in a box, the box goes back with the delivery driver, and someone hopes a credit appears. A meaningful share of those credits never arrive, and nobody notices because nothing is tracking them.

Run properly, returns are a small monthly process with a direct margin impact.

## The four kinds of return, which are not the same

**Near-expiry returns.** Saleable stock approaching expiry, returned within the distributor's window under your commercial terms. This is the big one by value and the one worth building process around.

**Damaged or breakage claims.** Stock damaged in transit or found damaged on receipt. Time-critical — most distributors require the claim within a short window of delivery, sometimes 24 to 48 hours.

**Wrong supply.** Items you did not order, wrong strength, wrong pack. Should be identified at goods receipt, which is an argument for checking receipts against the order rather than signing the delivery note and unpacking later.

**Recalls.** Manufacturer or regulator-initiated. These follow their own process and are not commercial returns — traceability to the affected batch is the requirement, which is only possible with [batch-level records](/resources/blog/batch-wise-inventory-tracking-pharmacy/).

## Know your window, per supplier

The return window is a commercial term, and it differs. Some distributors accept returns up to six months before expiry; some three; some only on specified lines; some deduct a handling percentage.

Three things to do about that:

1. **Write the terms down**, per distributor, somewhere your team can see them
2. **Set the near-expiry alert threshold per supplier**, at their deadline plus your own dispatch time
3. **Negotiate the term explicitly** at renewal. Return policy is a real cost line and it is rarely discussed with the same energy as rate — which is why it is often where the most improvement is available

## The process that makes credits actually arrive

The failure is almost never in identifying the stock. It is in the paperwork after dispatch.

**1. Generate the return list from the system,** filtered by days-to-expiry and by supplier. Not from a walk around the shelves.

**2. Raise a return document with a reference number** — item, batch, expiry, quantity, purchase rate, original purchase invoice reference. This is the document that makes the claim provable.

**3. Get an acknowledgement on dispatch.** A signature from the driver against the return document. Without proof of dispatch, a disputed claim ends in your favour approximately never.

**4. Record the return as outstanding.** It sits on a list until a credit is matched against it.

**5. Match credits received to returns dispatched.** Monthly, line by line.

**6. Age the unmatched.** Anything outstanding beyond a set period goes on a chase list with the reference number attached.

> The single change that recovers the most money is step four. Returns that are not recorded as receivables are, functionally, donations. Everything else in the process exists to make that record enforceable.

## What the reconciliation should show

| Metric | Why it matters |
|---|---|
| Value returned in period | The recovery you achieved |
| Credits received in period | What actually came back |
| Outstanding returns by age | Money currently at risk |
| Return rate by supplier | Which distributor's stock ages on your shelf |
| Rejected returns and reasons | Whether you are returning outside terms |

The last two are diagnostic. A supplier whose stock consistently needs returning is either supplying short-dated batches or supplying lines that do not move for you — and both are conversations worth having at the next negotiation.

## The tax side

A return of goods to a supplier has a tax consequence. The usual mechanism is a credit note issued by the supplier, adjusting the original supply, which flows through to your input tax credit. Where the arrangement calls for you to raise a debit note instead, the same principle applies from the other direction.

Two requirements on your records:

- The return must be **linked to the original purchase invoice and batch**, so the adjustment is traceable
- The **tax value** of the return must be identifiable, so your input tax credit position is correct

Stock that expires on the shelf and is destroyed rather than returned is a different case, and may require reversal of the credit already claimed. Your system needs to report on that separately — see the [GST filing guide](/resources/blog/pharmacy-gstr1-gstr3b-filing-guide/) for how that fits the return.

## Breakage and damage: speed is everything

Damage claims fail on timing more than on evidence. A practical routine:

- **Check on receipt**, before the driver leaves, for visible damage
- **Photograph** damaged stock immediately, with the batch and the packaging visible
- **Raise the claim the same day**, referencing the delivery note
- **Quarantine** the stock physically so it is not sold or discarded before the claim resolves

A pharmacy that checks receipts properly at the door recovers materially more than one that unpacks in the afternoon.

## Making it a habit, not a project

The whole thing runs on a weekly and a monthly rhythm:

**Weekly:** pull the near-expiry list, decide return versus transfer versus discount, dispatch returns with documents.

**Monthly:** reconcile credits against returns, age the outstanding, chase with references, review return rate by supplier.

Thirty minutes a week and an hour a month, against a recovery that for most pharmacies runs into a meaningful fraction of what would otherwise be written off.

## How pharCare handles it

[pharCare](/products/pharcare/) generates return lists filtered by days-to-expiry and supplier, raises return documents carrying item, batch, expiry, quantity, rate and the original purchase reference, and tracks each return as outstanding until a supplier credit is matched to it. Outstanding returns are aged, return rate by supplier is reportable, and the tax value of returns and of write-offs is available separately for input tax credit treatment.

To see the return workflow against your current supplier terms, [book a demo](/contact/).
