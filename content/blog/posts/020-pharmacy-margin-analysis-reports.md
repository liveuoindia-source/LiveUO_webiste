---json
{
  "title": "Where pharmacy margin goes: five reports worth running",
  "description": "Gross margin percentage hides more than it reveals. The reports that show where margin actually leaks — discount, rate creep, mix shift, expiry and dead stock.",
  "category": "Reporting",
  "keywords": [
    "pharmacy margin analysis",
    "pharmacy profitability reports",
    "pharmacy gross margin India",
    "pharmacy business analytics",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Why is my pharmacy turnover growing but profit flat?",
      "a": "Usually mix shift or discount creep. Growth concentrated in low-margin categories, or discretionary discounting that expanded quietly, will both raise turnover while holding profit still. Both are visible in a month-on-month margin-by-category and discount-by-user report."
    },
    {
      "q": "What margin should a retail pharmacy expect?",
      "a": "It varies substantially by mix — branded ethical lines, generics, OTC and general merchandise carry very different margins, so a single benchmark is not useful. The number that matters is your own trend, and whether it is explained by mix or by leakage."
    },
    {
      "q": "How do I measure margin accurately?",
      "a": "Against the actual purchase rate of the batch dispensed, not an average cost across the product. Average costing drifts from reality as purchase rates change, and it drifts in the direction that flatters the report."
    },
    {
      "q": "Does pharCare report margin at batch level?",
      "a": "Yes. Margin is computed against the purchase rate of the batch actually dispensed, and is reportable by item, category, branch, user and period."
    }
  ]
}
---
Most pharmacies look at one margin number a month, note whether it moved, and carry on. That number is an average of thousands of transactions across categories with wildly different economics, and it is almost perfectly designed to hide the specific thing that changed. Margin does not usually fall for one big reason. It leaks, in five places, and each leak has its own report.

## First, get the measurement right

Margin is selling price minus **what you actually paid for the unit you sold**. That means the purchase rate of the specific batch dispensed.

Systems using a single average cost per product produce a number that drifts from reality every time purchase rates move — and it drifts optimistically, because average costing smooths recent increases. If your reporting is built on average cost, everything below will be approximately right and precisely wrong. Batch-level costing is the prerequisite, which is one more reason [batch is the correct unit of stock](/resources/blog/batch-wise-inventory-tracking-pharmacy/).

## Report 1: margin by category, month on month

The mix report. Set it out as category, revenue, revenue share, margin percentage, margin value — for this month and the prior three.

What you are looking for is **share movement**. If a low-margin category grew its share of revenue, your blended margin fell without a single item's economics changing. That is a mix outcome, not a leak, and it calls for a different response — usually a merchandising or purchasing decision rather than a control.

The distinction matters. Treating a mix shift as a discipline problem produces pressure on staff that will not fix anything.

## Report 2: discount given, by user and by branch

Discount as a percentage of gross sales, broken down by the person who applied it.

Almost every pharmacy has more discretionary discounting than the owner believes. It is rarely dishonest — it is a counter assistant keeping a regular customer happy, repeated four hundred times a month.

What to look at:

- Discount percentage **by user**, ranked
- **Trend** over six months — creep is gradual and invisible month to month
- Discount **by item**, to find lines being routinely discounted (often a price positioning problem)
- Discounts **above the authorised slab**, which should be a short list with reasons

> The objective is not zero discount. It is that discretion is visible, bounded by role, and reviewed. Uncontrolled discount is the single largest recoverable margin leak in most independent pharmacies.

## Report 3: purchase rate variance

Rate creep is the quietest of the five. A distributor raises a rate by two percent; nobody notices on a single invoice; it compounds across a year.

The report: for your top 200 items by purchase value, current purchase rate against the rate 3, 6 and 12 months ago, with the annualised rupee impact of each change.

Also worth running: **rate variance against the purchase order**. Invoiced rates that differ from the agreed order rate should be flagged at goods receipt, not discovered in a review. If your system accepts a receipt at whatever rate is on the invoice without comparison, that is a gap worth closing.

## Report 4: expiry and dead stock as a margin item

Expiry write-off is usually recorded as a stock adjustment and left out of the margin conversation entirely. It should not be — it is a direct reduction of the margin you earned on everything else.

Run monthly:

- **Write-off value** for the period, and as a percentage of purchases
- **Stock currently within 120 days of expiry** — your leading indicator
- **Zero-movement stock value** — capital that is not working
- **Value recovered through supplier returns** — the offset you achieved

Presenting write-off next to margin makes a point that a stock adjustment report never does: a pharmacy earning a healthy percentage and writing off one percent of purchases is giving back a substantial share of what it earned. The [expiry control mechanisms](/resources/blog/reduce-expired-stock-write-offs-pharmacy/) are where the fix lives.

## Report 5: margin by item, top and bottom

The tails, not the middle.

**Top 50 by margin value** — not percentage. These are what actually fund the business, and they deserve stock priority, never-out discipline, and attention in supplier negotiation.

**Bottom 50 by margin value** — including negatives. Items sold at or below cost. There are legitimate reasons for a few of them (loss leaders, patient service, life-saving lines you stock regardless), but every one should be there deliberately.

Negative-margin lines almost always come from one of three causes: a purchase rate that rose while the selling price did not, a scheme calculation applied wrongly, or a discount slab set below cost. All three are fixable in an afternoon once visible.

## Putting it into a routine

| Frequency | Review |
|---|---|
| Monthly | Margin by category with share movement; discount by user; write-off and near-expiry value |
| Quarterly | Purchase rate variance on top 200; bottom-50 margin items; dead stock |
| Half-yearly | Supplier terms review armed with rate variance and return-rate data |

Half an hour a month and two hours a quarter. The quarterly supplier review is the one that most directly converts analysis into money, because it is the only point in the cycle where you have leverage and evidence at the same time.

## The number to actually manage by

If you track one thing, track **margin value per month, decomposed** — how much came from volume, how much from mix, how much was lost to discount, and how much to write-off.

That decomposition tells you what to do. A margin percentage, on its own, tells you only that something happened.

## How pharCare reports it

[pharCare](/products/pharcare/) computes margin against the purchase rate of the batch actually dispensed, and reports it by item, category, branch, user and period. Discount is reportable by user with override logging, purchase rate variance against both history and the originating order is available, and write-off and near-expiry values sit alongside margin rather than in a separate stock adjustment screen.

To see these reports run against your own transaction history, [book a demo](/contact/).
