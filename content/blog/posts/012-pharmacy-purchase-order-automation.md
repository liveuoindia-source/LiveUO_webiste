---json
{
  "title": "Purchase order automation: ordering from data, not memory",
  "description": "Reorder levels, movement-based suggestions, scheme evaluation and distributor comparison — replacing the habit that causes stockouts and expiry at the same time.",
  "category": "Purchasing",
  "keywords": [
    "pharmacy purchase order software",
    "automatic reorder pharmacy",
    "pharmacy procurement automation",
    "distributor ordering software India",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Should reorder levels be fixed or calculated?",
      "a": "Calculated, from trailing movement and lead time, and refreshed periodically. A fixed reorder level set once becomes wrong as demand shifts, and it is usually wrong in the expensive direction — too high on the slow movers and too low on the fast ones."
    },
    {
      "q": "How do I evaluate a distributor scheme properly?",
      "a": "Convert it to an effective per-unit cost, then check how many days of cover the order represents and how much shelf life the batch has. A ten percent effective saving on stock that takes fourteen months to sell is not a saving."
    },
    {
      "q": "Can purchase orders be raised automatically without review?",
      "a": "They should be generated automatically and released manually. Automation should produce the suggestion — nobody wants a system that independently commits money to a distributor without a person confirming quantity, price and shelf life."
    },
    {
      "q": "Does pharCare generate purchase suggestions?",
      "a": "Yes. Purchase suggestions are built from trailing movement, current stock including in-transit, supplier lead time and configured cover targets, and can be reviewed and adjusted before the order is released."
    }
  ]
}
---
Most pharmacy purchasing runs on memory. Someone walks the shelves, notices gaps, and orders roughly what was ordered last time. It works, in the sense that the shop stays stocked. It also produces both of the expensive failure modes simultaneously — stockouts on the lines that matter and slow-moving overstock that eventually expires — because memory is good at noticing empty shelves and bad at noticing fourteen months of cover on a shelf that looks fine.

Ordering from data fixes both. Here is what that requires.

## The calculation underneath a good purchase suggestion

For each item, four inputs:

**Average movement.** Units sold per day over a trailing window. Use a window long enough to smooth noise but short enough to track change — 60 to 90 days suits most pharmacy lines, shorter for seasonal ones.

**Lead time.** Days from order to shelf, per supplier. Measure it rather than assuming it; the difference between a two-day and a six-day distributor changes your required cover materially.

**Current position.** Stock on hand **plus stock on order not yet received**. Missing the in-transit component is the classic cause of double-ordering.

**Target cover.** How many days of stock you want to hold, which should differ by item class rather than being one global number.

The suggestion is then: *(average movement × (lead time + target cover)) − current position*, rounded to the supplier's pack multiple.

## Target cover should not be one number

This is where most implementations go wrong. A single "keep 30 days of stock" rule applied across the whole master overstocks the tail and understocks the head.

| Item class | Characteristic | Reasonable cover |
|---|---|---|
| Fast movers, always stocked | Daily movement, short lead time | Short — frequent small orders |
| Regular lines | Weekly movement | Moderate |
| Slow movers | Monthly or less | Minimal; order to demand |
| Life-saving / must-not-stockout | Low movement, high consequence | Higher despite slow movement |
| Seasonal | Movement varies by month | Track the season, not the average |

The fifth row matters in Indian retail pharmacy specifically — antipyretic and respiratory demand is strongly seasonal, and a trailing 90-day average lags the turn badly at the start of a season.

## Shelf life belongs in the ordering decision

A purchase suggestion that ignores expiry creates the write-off problem it should prevent. Two rules worth enforcing:

1. **Never order more cover than the batch's remaining shelf life**, less a safety margin. Thirty units at two-a-month is fifteen months; if the batch has ten months left, you have bought a write-off.
2. **Check shelf life on scheme purchases specifically.** Distributors clear short-dated stock through attractive schemes, and that is exactly when the discipline is most needed.

> Every rupee of expiry write-off was authorised by a purchase order. The counter did not cause it and the shelf did not cause it — the order quantity did. This is why [expiry control](/resources/blog/reduce-expired-stock-write-offs-pharmacy/) is a purchasing discipline as much as an inventory one.

## Evaluating schemes without fooling yourself

Distributor schemes — bonus quantity, slab discounts, credit terms — are real value, but they must be converted to a comparable number.

**Effective unit cost** = total amount paid ÷ total units received, after bonus.

Then apply three tests:

- What is the **days of cover** at current movement?
- What is the **remaining shelf life** of the batch offered?
- What is the **working capital** tied up, and for how long?

A scheme that passes all three is worth taking. A scheme that fails the second or third is a distributor moving their inventory problem onto your balance sheet.

## Comparing distributors on more than rate

Rate is one column. The full comparison:

- **Effective rate** after schemes
- **Fill rate** — what proportion of ordered lines actually arrive. A cheaper distributor who delivers 80% of lines causes stockouts that cost more than the rate difference.
- **Lead time**, measured
- **Credit terms**
- **Return policy for near-expiry stock** — frequently ignored, and it directly determines your recoverable write-off
- **Quality of the invoice file** — whether they provide importable data with batch and expiry

Fill rate and return policy are the two that pharmacies systematically under-weight, and both have larger financial consequences than a percentage point on rate.

## What the workflow should look like

1. System generates suggestions overnight, grouped by preferred supplier
2. Buyer reviews on one screen: suggested quantity, movement, current cover, last purchase rate, shelf-life constraint
3. Buyer adjusts where local knowledge applies — a prescriber starting a new line, a festival week, a bulk enquiry
4. Order released to the distributor
5. **Goods receipt matched against the order** — quantity, rate and batch — with discrepancies flagged rather than silently accepted
6. Rate variance against the order reported, because unagreed rate increases arrive quietly on invoices

Step six is worth building into the routine. Purchase rate creep is invisible at the line level and material at the year level.

## The judgement that should stay human

Automation should generate the suggestion, not release the order. Four things a system does not know:

- A local doctor has started prescribing something new
- A festival or local event is about to change demand
- A distributor is about to have a supply problem
- A competitor closed and your footfall is about to change

The right division of labour: the system handles the arithmetic across three thousand SKUs; the buyer applies judgement to the thirty that need it.

## How pharCare handles it

[pharCare](/products/pharcare/) builds purchase suggestions from trailing movement, current stock including in-transit, measured supplier lead time and cover targets set by item class, with shelf-life constraints applied so an order cannot quietly create an expiry position. Orders are reviewed and released by a person; goods receipt matches back to the order with quantity, rate and batch discrepancies flagged, and rate variance against agreed pricing is reportable.

To see suggestions generated against your own movement history, [book a demo](/contact/).
