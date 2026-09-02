---json
{
  "title": "Connecting pharmacy billing to your accounting system",
  "description": "Posting summaries instead of every bill, mapping ledgers correctly, and keeping stock valuation in one place. How pharmacy billing should meet Tally or any accounting system.",
  "category": "GST & Tax",
  "keywords": [
    "pharmacy software Tally integration",
    "pharmacy accounting integration",
    "billing to accounting sync",
    "pharmacy bookkeeping India",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Should every pharmacy bill be posted to accounting individually?",
      "a": "No. Retail counter sales should post as daily summaries by tax rate and payment mode. Posting several hundred B2C bills a day individually bloats the accounting file for no analytical gain — the detail already lives in the billing system. B2B invoices are the exception and should post individually."
    },
    {
      "q": "Where should stock valuation live — billing or accounting?",
      "a": "In the billing system, because that is where batch-level purchase rates are held. Accounting should receive a periodic valuation figure rather than attempt to maintain a parallel inventory, which will drift."
    },
    {
      "q": "What breaks most often in a billing-to-accounting sync?",
      "a": "Ledger mapping. A new GST rate, a new payment mode or a new expense head appears in billing with no corresponding ledger, and entries either fail or land in a suspense account. The fix is a mapping table that is reviewed, plus an exception report that is actually read."
    },
    {
      "q": "Does pharCare integrate with Tally?",
      "a": "Yes. Sales summaries by rate and payment mode, individual B2B invoices, purchases with supplier and tax detail, and credit/debit notes can be exported or posted in the structure Tally expects, with a mapping table you control."
    }
  ]
}
---
Most pharmacies run billing in one system and accounts in another, usually Tally. The connection between them is often a person, re-keying summaries at month end, and that arrangement produces exactly the failure you would expect: two sets of numbers that mostly agree, disagree occasionally, and take a day to reconcile when they do.

A proper integration is straightforward, but it depends on getting three decisions right before any data moves.

## Decision 1: what level of detail to post

The instinct is to post everything. It is the wrong instinct.

| Transaction type | Post as | Why |
|---|---|---|
| B2C counter sales | Daily summary by tax rate and payment mode | Hundreds of bills a day; detail adds nothing to the ledger |
| B2B invoices | Individually, with counterparty | Needed for GSTR-1 and for receivables tracking |
| Purchases | Individually, with supplier and tax detail | Drives input tax credit and payables |
| Credit / debit notes | Individually, referencing the original | Required for return filing |
| Stock adjustments and write-offs | Periodic summary with value | Needed for valuation and ITC reversal |
| Cash and bank settlement | Daily | Reconciliation against actual receipts |

The principle: **the billing system is the detailed record; accounting is the summarised financial position.** Duplicating transaction-level detail into accounting creates a second copy that can disagree with the first, and adds nothing you could not get from the source.

## Decision 2: where stock valuation lives

It lives in the billing system, and this should not be a debate.

Batch-level purchase rates are held in the billing system. Valuation is a function of quantity on hand per batch and what each batch cost. Accounting does not have that data and cannot maintain it correctly without receiving every batch movement — at which point you have rebuilt the inventory module in the wrong place.

What accounting should receive is a **periodic valuation figure** for the closing stock entry, derived from the billing system's batch-level position. One number, monthly, from a defensible source. Attempts to maintain inventory in both systems drift within weeks and never converge again.

## Decision 3: the ledger mapping

This is where integrations actually break, and it is unglamorous work that pays for itself.

You need a mapping table covering:

- **Sales ledgers by tax rate** — a separate ledger per rate, so the return is derivable
- **Purchase ledgers by tax rate**
- **Tax ledgers** — CGST, SGST, IGST, output and input separately
- **Payment mode ledgers** — cash, each card acquirer, each UPI channel, credit
- **Discount** as a distinct ledger, not netted into sales
- **Expiry and damage write-off**, separate from other adjustments
- **Round-off**

Two rules keep it working:

**Every new thing gets mapped before it is used.** A new GST rate, a new payment provider, a new expense head — mapped first. Unmapped items land in suspense, and suspense accounts are where reconciliation time goes to die.

**Unmapped entries produce an exception report someone reads.** Silent failure is the worst outcome; it looks like success until month end.

> Discount deserves its own ledger rather than being netted into sales. Once it is visible as a line in the accounts, discount creep becomes a number the owner sees monthly rather than something buried in an average selling price. This complements the [margin reporting](/resources/blog/pharmacy-margin-analysis-reports/) on the billing side.

## What good sync behaviour looks like

**Idempotent.** Running the same day's post twice must not create duplicate entries. This is the most common integration defect and the most damaging, because the resulting double-counting is not obvious.

**Restartable.** If a post fails halfway, you can correct and re-run without manual cleanup.

**Reconcilable.** A report showing, for a period: what billing recorded, what was posted, and the difference. Zero should be the normal state, and any non-zero should be explainable.

**Auditable.** Each accounting entry traceable back to the source day or document.

**Scheduled, not manual.** Daily, automatically, with a failure alert. A sync that requires someone to remember will be forgotten during the week that matters.

## The reconciliation that should run daily

Five minutes, and it catches nearly everything:

1. Billing system's total sales for yesterday
2. Total posted to accounting for yesterday
3. Cash counted and banked
4. Card and UPI settlement received
5. Differences, explained

The value is in the frequency. A difference found the next morning is traceable; the same difference found at month end means reviewing thirty days of transactions to locate it.

## When integration is not worth it

There are cases where a clean export beats a live integration:

- **Very small operations** where the accountant handles a modest transaction volume monthly
- **Accountants who prefer their own workflow** and will re-enter regardless
- **Non-standard chart of accounts** where mapping maintenance would exceed the keying it saves

In those cases, aim for a **clean, structured export** in the shape the accountant needs — split by rate, by B2B/B2C, with credit notes referenced — rather than a fragile automated post. That structure is the same one [GST filing](/resources/blog/pharmacy-gstr1-gstr3b-filing-guide/) requires, so it is worth having either way.

## Questions to ask a vendor

1. What granularity is posted for B2C, and can I change it?
2. Is posting idempotent — what happens if I run it twice?
3. Show me the ledger mapping table. Who maintains it?
4. What happens when an unmapped item appears?
5. Show me the reconciliation report between billing and posted totals.
6. How is closing stock valuation passed, and from which cost basis?
7. Is it scheduled and does it alert on failure?

Question 2 is the one that separates a considered integration from a script.

## How pharCare handles it

[pharCare](/products/pharcare/) posts B2C sales as daily summaries by tax rate and payment mode, B2B invoices and purchases individually with counterparty and tax detail, and credit/debit notes with their original references, into Tally or via structured export. The ledger mapping table is yours to maintain, unmapped items raise an exception report rather than failing silently, posting is idempotent and restartable, and a billing-to-posted reconciliation report is available per period. Stock valuation is derived from batch-level cost in pharCare and passed as a periodic figure rather than maintained twice.

To review your chart of accounts against it, [book a demo](/contact/).
