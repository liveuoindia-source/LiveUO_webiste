---json
{
  "title": "Two MRPs on one shelf: handling price revisions correctly",
  "description": "When a manufacturer revises MRP, existing stock keeps its printed price. Why batch-level MRP is the only correct model, and the counter conversation it creates.",
  "category": "Operations",
  "keywords": [
    "MRP change pharmacy stock",
    "batch wise MRP software",
    "medicine price revision India",
    "pharmacy pricing software",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Can two packs of the same medicine on my shelf have different MRPs?",
      "a": "Yes, and it is entirely normal. MRP is printed at the time of packing, so stock bought before a price revision carries the old MRP and stock bought after carries the new one. Both are legitimate and both must be billed at the price printed on the pack supplied."
    },
    {
      "q": "Should I charge the new MRP on old stock after a price increase?",
      "a": "No. The maximum you may charge is the MRP printed on that pack. Charging more than the printed MRP is not permitted, regardless of what a later batch is priced at."
    },
    {
      "q": "What happens when a price is revised downward?",
      "a": "Existing stock carries a higher printed MRP than new stock. You may sell at or below the printed MRP, so the old stock can be sold at the new lower price — and for price-controlled products a downward revision may require you to do so. Confirm the specific requirement when a revision is notified."
    },
    {
      "q": "Does pharCare hold MRP per batch?",
      "a": "Yes. MRP and purchase rate are held against each batch, and the batch selected at billing determines the price on the line — so the bill always agrees with the pack handed over."
    }
  ]
}
---
A manufacturer revises the MRP on a product. Your existing stock still carries the old price printed on the pack. New stock arrives with the new price. For the next several months, two packs of the same medicine sit on your shelf at two different prices — and both are correct.

This is ordinary in Indian pharmacy retail, and it is the single clearest reason why product-level pricing does not work.

## Why MRP belongs to the batch, not the product

MRP is fixed at the time of packing. It is printed on the pack. It travels with that batch for its whole life.

If your software holds one MRP per product, then at any given moment it is wrong about some of your stock. Three consequences follow, all of them bad:

**The bill disagrees with the pack.** The customer reads the strip, reads the bill, and questions it. Occasionally they are right and you have overcharged, which is a serious problem, not merely an awkward one.

**Staff override prices manually.** Once overriding is routine, it stops being noticed — and manual overrides are where both margin leakage and genuine errors hide.

**Margin reporting breaks.** Margin needs the actual selling price against the actual purchase rate of the batch dispensed. Product-level pricing gives you neither reliably.

The correct model is straightforward: **MRP and purchase rate are attributes of a batch.** The batch is selected at billing, and the price on the line comes from that batch. This is the same structural argument that underpins [expiry management and true margin](/resources/blog/batch-wise-inventory-tracking-pharmacy/).

## Upward revision: what you may and may not do

When the price goes up:

- **New stock** carries the new, higher MRP
- **Old stock** carries the old, lower MRP
- You may charge **up to** the printed MRP on the pack you supply — no more

Charging the new MRP on an old pack is overcharging, whatever the system suggests. If billing software prices from a product-level MRP that has been updated, it will do this automatically and silently, on every unit of old stock, until the old stock runs out.

That is not a hypothetical failure. It is the default behaviour of any system without batch-level MRP after a price increase.

## Downward revision: the more complicated case

When the price falls, existing stock carries a **higher** printed MRP than new stock.

You may always sell at or below the printed MRP, so the old stock can be sold at the new lower price. Whether you **must** depends on the product — for price-controlled formulations under the applicable price control order, a notified ceiling change may require compliance on existing stock within a defined period, sometimes with a requirement to display revised pricing.

The practical position:

1. When a revision is notified, **check whether it is a price-controlled product**
2. If it is, confirm the compliance requirement and timeline for existing stock
3. Apply the revised price where required, and record that you did

> Downward revisions on price-controlled products are the ones that create actual regulatory exposure. Upward revisions create customer disputes; downward ones can create a compliance finding. Treat them differently.

## Handling the counter conversation

A customer who bought at ₹120 last month and is charged ₹138 today will ask, and they are entitled to.

What helps:

**The bill shows the MRP of the pack supplied.** If the bill and the strip agree, the conversation is short.

**Staff can explain it in one sentence.** "The manufacturer revised the price; this pack is printed at the new rate." Most people accept this immediately when it is stated plainly.

**Old stock is dispensed first.** FEFO does this naturally for expiry, and it has the side effect of clearing older, cheaper stock before newer, dearer stock — which delays the conversation and is also correct inventory practice.

**Nobody argues about who is right.** If the pack says ₹120, the customer pays ₹120, whatever the system said.

## What the system must do

| Requirement | Why |
|---|---|
| MRP held per batch | The only model that matches physical reality |
| Batch selected at billing determines the line price | Bill agrees with pack, without an override |
| Purchase rate held per batch | Margin computed against actual cost |
| Bulk MRP update by product for a **new** batch only | Update forward without rewriting existing stock |
| Report: items with multiple active MRPs | Know where the conversations will happen |
| Price override logged with user and reason | Overrides become reviewable rather than habitual |

The fourth row is worth checking specifically during an evaluation. Some systems offer a bulk price update that rewrites MRP across all existing stock — which is exactly the wrong behaviour, and it is offered as a convenience feature.

## Also worth knowing

**Print MRP on the bill line.** Not just the amount charged. It makes the bill self-explanatory and settles disputes without a conversation.

**Watch the multiple-MRP report before a busy season.** Knowing which fast movers currently have two prices on the shelf lets you brief staff in advance rather than have them improvise.

**Purchase rate usually changes with MRP.** A revision typically moves both, so your [margin by item](/resources/blog/pharmacy-margin-analysis-reports/) shifts too — worth a look at the affected lines rather than assuming the percentage held.

**Old stock at the old MRP is not a loss.** You bought it at the old purchase rate. The rupee margin is broadly preserved; only the percentage optics change.

## How pharCare handles it

[pharCare](/products/pharcare/) holds MRP and purchase rate against each batch, and the batch selected at billing sets the price on the line — so the bill always matches the pack handed over, with no override required. Bulk price updates apply to incoming stock rather than rewriting existing batches, a report lists items currently holding more than one active MRP, MRP is printed on the bill line, and any manual price override is logged with user and reason.

To see how your current stock would look under batch-level pricing, [book a demo](/contact/).

---

*Price control obligations vary by product and are set by notification. Confirm the requirement applying to a specific formulation with your association or advisor when a revision is announced.*
