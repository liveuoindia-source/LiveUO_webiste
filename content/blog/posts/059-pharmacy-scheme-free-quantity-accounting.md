---json
{
  "title": "Accounting for distributor schemes and free quantity in a pharmacy",
  "description": "How to record free goods and schemes on purchase so stock, cost and margin stay correct, and how to judge whether a scheme is actually worth taking.",
  "category": "Purchasing",
  "service": "pharcare",
  "keywords": [
    "pharmacy free quantity",
    "distributor scheme accounting",
    "pharmacy purchase cost",
    "pharmacy margin calculation",
    "pharCare"
  ],
  "faq": [
    {
      "q": "How should free quantity be recorded in a purchase entry?",
      "a": "As a separate free quantity on the same line, with the same batch and expiry, so stock increases by billed plus free units while the cost is spread over all of them."
    },
    {
      "q": "Does free quantity change my cost per unit?",
      "a": "Yes. If you receive 11 units for the price of 10, your effective cost per unit is lower. Margin reports should use this effective cost, not the invoice rate."
    },
    {
      "q": "Is a scheme always worth taking?",
      "a": "Only if you can sell the extra stock before it expires, at your normal price, without tying up cash you need elsewhere. A scheme on a slow item often costs more than it saves."
    },
    {
      "q": "How does pharCare handle free goods?",
      "a": "Purchase entry has a separate free quantity field per line. Stock, batch and expiry update for the total, and cost reports use the effective cost after free goods."
    }
  ]
}
---
"Ten plus one free" sounds simple. In a pharmacy's books, it's one of the most common sources of wrong stock figures and misleading margin reports. The free strip has to go somewhere: into stock, into cost, and into the decision about whether the scheme was worth it at all.

## How free quantity goes wrong

- **Not entered at all.** The free strip is put on the shelf but not in the system, so stock shows less than reality. When it's sold, stock goes negative or a different batch is reduced.
- **Entered as a separate zero-rate purchase.** Stock is right, but cost reports show two prices for the same item.
- **Entered as billed quantity.** Stock is right, but the system thinks you paid for eleven, overstating cost and understating margin.
- **Wrong batch.** Free goods often come from a different batch than the billed ones. Entered under the wrong batch, expiry tracking breaks.

## The right way to record it

On the purchase line, record:

- **billed quantity:** 10
- **free quantity:** 1
- **rate:** the invoice rate per billed unit
- **batch and expiry** for each, separately if they differ

Stock increases by 11. The **effective cost per unit** becomes the total paid divided by 11. That effective cost is what margin and stock valuation should use.

## Worked example

| | Value |
|---|---|
| Billed quantity | 10 strips |
| Free quantity | 1 strip |
| Rate | ₹90 per strip |
| Total paid (before tax) | ₹900 |
| Effective cost | ₹900 ÷ 11 = ₹81.82 per strip |
| MRP | ₹120 per strip |

Without the scheme, margin on MRP is ₹30 per strip. With it, the effective margin is about ₹38 per strip — **if** all eleven sell before expiry.

## Other scheme types

- **Extra discount on quantity.** Recorded as a discount on the line; effective cost is straightforward.
- **Free goods of a different item.** Record the free item as its own line with zero rate, and decide how to value it — at zero, or by allocating part of the invoice cost. Be consistent.
- **Turnover or target schemes** paid later as credit notes. Record the credit note when received, against the distributor, and don't anticipate it in stock cost unless your accountant advises otherwise.

## GST on free goods

Free goods supplied as part of a scheme are generally priced into the transaction rather than taxed separately, but treatment can depend on how the scheme is structured and invoiced. Follow the distributor's invoice and confirm any unusual cases with your tax adviser.

## Is the scheme worth it?

Before accepting, compare the scheme quantity with what you actually sell.

| Question | Why it matters |
|---|---|
| Monthly sales of this item? | Tells you how long the stock will last |
| Remaining shelf life? | Must sell well before expiry |
| Cash available? | Scheme stock ties up money |
| Return terms? | Can you return excess if it doesn't sell? |

A simple test: **will the extra stock sell before your expiry return deadline?** If the answer is "probably not", the scheme turns a discount into a future write-off.

Schemes on fast movers usually pay. Schemes on slow movers often don't. See [dead stock in a pharmacy](/resources/blog/pharmacy-dead-stock-slow-moving/) for what happens when they don't.

## Track scheme benefit

Over a quarter, compare:

- free goods and scheme discounts received, by distributor
- expiry write-offs on scheme items

If scheme items show up regularly in write-offs, tighten the rule on which schemes you accept.

## The habit that fixes it

Enter free quantity on every purchase, on the right batch, at the moment of receipt. Let the software calculate effective cost. Then your stock figures match the shelf, your margin reports reflect what you actually paid, and scheme decisions are based on data rather than the size of the offer.
