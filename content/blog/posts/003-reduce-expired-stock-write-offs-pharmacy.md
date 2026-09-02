---json
{
  "title": "How to reduce expired-stock write-offs in a retail pharmacy",
  "description": "Expired stock is pure margin loss and most of it is preventable. Batch discipline, near-expiry alerts, supplier return windows, and the buying that causes it.",
  "category": "Inventory",
  "keywords": [
    "pharmacy expiry management software",
    "reduce expired medicine stock",
    "batch and expiry tracking",
    "pharmacy inventory control India",
    "pharCare"
  ],
  "faq": [
    {
      "q": "What is a normal expiry write-off rate for a retail pharmacy?",
      "a": "Well-run independent pharmacies typically keep expiry losses to a fraction of a percent of purchases. Anything approaching one to two percent usually points to a specific correctable cause — over-ordering slow movers, missed supplier return windows, or no near-expiry alerting — rather than to unavoidable wastage."
    },
    {
      "q": "How far in advance should near-expiry alerts fire?",
      "a": "Align the alert to your distributor's return window rather than to a round number of days. If a supplier accepts returns up to 90 days before expiry, an alert at 120 days gives you time to act; an alert at 60 days is already too late to return the stock."
    },
    {
      "q": "Does FEFO always beat FIFO in a pharmacy?",
      "a": "Yes. First-Expiry-First-Out is the correct rule for dated stock, and it is not the same as First-In-First-Out — a batch received later can easily expire earlier. Software that picks batches by receipt date rather than expiry date will quietly build up short-dated stock."
    },
    {
      "q": "Can pharCare flag near-expiry stock automatically?",
      "a": "Yes. Every item is tracked by batch and expiry date, with configurable alert thresholds, a near-expiry worklist, and automatic FEFO batch selection at billing so short-dated stock moves first."
    }
  ]
}
---
Expired stock is the cleanest loss in a pharmacy: you paid full cost, you recovered nothing, and it consumed shelf space and working capital on the way out. It is also, unlike most losses, largely preventable — not by working harder at the counter, but by fixing four specific mechanisms. Batch-level visibility, alerting tied to the supplier return window, disciplined FEFO dispensing, and a purchasing rule that stops creating the problem upstream.

## Why the problem builds up invisibly

Nobody decides to let stock expire. It happens because the information arrives too late to act on.

A box of a slow-moving formulation arrives in March with a 14-month shelf life. It sells two units a month against an order of thirty. By the time anyone notices, it is inside the supplier's no-return window, and the only remaining options are discounting it below cost or writing it off.

The failure was not in December when it was spotted. It was in March, when thirty units were ordered against a two-a-month movement rate, and in June, when nothing surfaced the fact that the batch was tracking toward expiry.

## Mechanism 1: batch-level tracking is non-negotiable

If your system holds stock as "Product X: 46 units", you cannot manage expiry at all. You need:

- **Batch number** and **expiry date** on every receipt
- Quantity held **per batch**, not per product
- **MRP and purchase rate per batch**, because both change across batches
- Batch carried through to the sale line, so a recall or return is traceable

This is the foundation. Everything below depends on it, and a system without it can only ever produce guesses.

## Mechanism 2: alert against the return window, not a round number

Most distributors accept returns of near-expiry stock within a defined window — commonly somewhere between three and six months before expiry, subject to the terms you negotiated. Outside that window, the stock is yours.

> Set your near-expiry alert threshold to your **supplier's return deadline plus your own action time**. If returns close at 90 days and it takes you two weeks to assemble and dispatch a return, alert at 120 days. Alerting at 60 days is a report on a loss you have already taken.

Because return terms differ by distributor, the threshold ideally sits per supplier rather than globally. At minimum, set the global threshold to your *tightest* supplier window.

## Mechanism 3: FEFO at the counter, enforced by software

First-Expiry-First-Out means the batch nearest expiry is dispensed first. This is **not** the same as FIFO — a consignment received in August can easily carry an earlier expiry than one received in May.

Manual FEFO fails, reliably, because the person at the counter reaches for the accessible box. The fix is for the billing screen to select the batch automatically by earliest expiry, and to require a deliberate override with a reason if staff pick a different one. Overrides then become a report you can review, rather than an invisible habit.

## Mechanism 4: stop over-ordering slow movers

Most expiry loss is created at the purchase order, months before it is recognised.

The buying rule that prevents it:

1. Calculate **average monthly movement** over a trailing period, per item
2. Set a **maximum cover** — for example, no more than 60 days of movement for slow movers, more for fast ones
3. Check the **shelf life of the batch being offered**. A scheme price on stock with eight months remaining, ordered at six months of cover, is not a saving
4. Treat **scheme and bonus offers** with suspicion on slow movers. "Buy 10 get 2" on an item selling two a month is a fifteen-month position

A purchase suggestion built from actual movement, rather than from the last order quantity, removes most of this by default.

## The near-expiry worklist

Once alerting works, you need a routine that acts on it. A workable weekly cycle:

| Days to expiry | Action |
|---|---|
| 150–120 | Review; stop reordering the item |
| 120–90 | Return to supplier where terms allow; transfer to a branch with movement |
| 90–45 | Discount, bundle, or promote to prescribers who use it |
| Under 45 | Segregate physically; plan write-off and ITC reversal |

The segregation step matters more than it looks. Short-dated stock left in the main shelf will eventually be dispensed to a patient — which is a compliance and safety problem, not just a commercial one.

## Multi-branch changes the arithmetic

If you run more than one outlet, a batch that is dead stock at one branch is often ordinary stock at another. Visibility of **stock by batch across branches**, with an internal transfer that moves the batch record rather than re-keying it, converts a portion of what would have been write-off into ordinary sales. Without shared visibility, each branch independently orders and independently writes off.

## Measuring whether any of this is working

Track three numbers monthly:

- **Expiry write-off as a percentage of purchases** — the headline
- **Value returned to suppliers** — the recovery you would otherwise have lost
- **Value of stock currently inside 120 days** — the leading indicator, which moves before the write-off number does

The third is the one to manage by. The first only tells you about decisions made a year ago.

## How pharCare handles it

[pharCare](/products/pharcare/) tracks every item by batch and expiry, holds MRP and purchase rate per batch, and selects batches by FEFO automatically at billing with logged overrides. Near-expiry thresholds are configurable, the worklist is filtered by days-to-expiry so the weekly routine is a single screen, and multi-branch deployments see batch-level stock across outlets so short-dated stock can be transferred rather than written off. Write-offs generate the records your accountant needs for the corresponding input tax credit treatment.

To see your own expiry exposure mapped out, [book a demo](/contact/) — bring a current stock file and we will run it through.
