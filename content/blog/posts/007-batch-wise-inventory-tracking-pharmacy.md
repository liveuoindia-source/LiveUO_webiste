---json
{
  "title": "Why product-level stock tracking fails in a pharmacy",
  "description": "Two batches of one medicine can carry different MRPs, expiry dates and costs. Why batch is the correct unit of pharmacy stock, and what breaks without it.",
  "category": "Inventory",
  "keywords": [
    "batch wise inventory pharmacy software",
    "batch and expiry tracking",
    "pharmacy stock management India",
    "drug recall traceability",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Why can't I just track stock at product level and check expiry on the shelf?",
      "a": "Because you cannot answer three questions that matter daily: which batch is nearest expiry, what did this specific stock cost you, and which customers received a batch that gets recalled. Shelf checking finds expiry after the return window has closed."
    },
    {
      "q": "What happens when the same product has two MRPs on the shelf?",
      "a": "Both are legitimate — MRP is fixed at the time of packing and changes between batches. Software must hold MRP per batch and bill the customer at the MRP printed on the pack they receive, which requires batch selection at the point of sale."
    },
    {
      "q": "How does batch tracking help with a drug recall?",
      "a": "A recall names a specific batch number. If sales lines record the batch, you can produce the exact list of affected transactions and contact those customers. Without batch on the sale line, you can only identify everyone who ever bought that product."
    },
    {
      "q": "Does pharCare track every item by batch?",
      "a": "Yes. Batch number, expiry date, purchase rate and MRP are held per batch, carried onto the sale line, and used for FEFO batch selection at billing."
    }
  ]
}
---
In most retail businesses, stock is a number against a product. In a pharmacy it cannot be, because two boxes of the same medicine sitting side by side may have different expiry dates, different MRPs and different purchase costs. The correct unit of inventory in a pharmacy is the **batch**, and software that models stock at product level will fail at four specific things — expiry control, accurate pricing, true margin, and recall traceability.

## What a batch actually is

A batch is a manufacturing lot. It carries:

- A **batch number** printed on the pack
- A **manufacturing date** and an **expiry date**
- The **MRP** fixed at the time of packing
- Your **purchase rate**, which depends on when and from whom you bought it

Every one of those varies between batches of the same product. A price revision means the batch you bought in March has a lower MRP than the one you bought in September, and both are on your shelf.

## What breaks without batch-level stock

### Expiry management becomes guesswork

If the system says "Amoxicillin 500 — 84 units", nobody can tell you how many of those expire in sixty days. Near-expiry alerts are impossible, FEFO dispensing is impossible, and supplier returns get missed because the return window closes before anyone notices. This is the root cause behind most [expiry write-offs](/resources/blog/reduce-expired-stock-write-offs-pharmacy/).

### Pricing goes wrong at the counter

The customer receives a pack with an MRP printed on it. If the system holds one MRP per product, the bill will sometimes disagree with the pack. Staff then override the price manually, and manual overrides are where both disputes and margin leakage start.

### Margin reporting is fiction

Margin is selling price minus **what you actually paid for that unit**. With product-level stock and a single average cost, your margin report is an approximation that drifts further from reality every time purchase rates change or a scheme lands.

### Recalls cannot be executed

A recall notice names a batch. With batch on the sale line, you produce the affected transactions in seconds. Without it, you have a choice between contacting every customer who ever bought that product or not contacting anyone — and neither is a good position.

## What batch-level tracking requires operationally

Batch discipline starts at goods receipt, not at billing.

**At purchase entry**, capture batch number, expiry, quantity, purchase rate and MRP per line. This is more keystrokes than a product-level entry, and it is the price of everything above. Barcode scanning and distributor file imports remove most of that burden.

**At billing**, the system selects the batch — by earliest expiry — and carries the batch onto the sale line. Staff should not have to choose in the normal case.

**At transfer**, between branches, the batch record moves intact rather than being re-created.

**At return**, whether customer or supplier, the return is linked to the originating batch so stock and tax both reconcile.

> If any one of those four points loses the batch, the chain breaks and every downstream capability degrades. Batch integrity is a property of the whole workflow, not a feature of the billing screen.

## FEFO, and why it is not FIFO

First-Expiry-First-Out dispenses the batch nearest expiry first. First-In-First-Out dispenses the batch received first. In a pharmacy these routinely disagree — a consignment received later can carry an earlier expiry, particularly when a distributor clears short-dated stock.

Software that picks batches by receipt date is doing FIFO and calling it good practice. Check which one your system does; it is a one-line question with a large consequence.

## The counter-side objection, and the answer

The common resistance is that batch entry slows down goods receipt. It does, if done manually. The mitigations are practical:

1. **Import distributor invoices** as files where the supplier provides them, rather than keying
2. **Scan barcodes** at receipt; many packs carry batch and expiry in the 2D code
3. **Default the expiry** by shelf-life for products where the pattern is stable, with a confirm step
4. **Enter at receipt, once** — as opposed to reconstructing batch data during a stock audit, which is far slower

The time cost is real but it is front-loaded and bounded. The alternative cost — write-offs, price disputes, unusable margin data — is recurring and unbounded.

## What good looks like

A system doing this properly lets you answer, in one screen each:

| Question | Answer needs |
|---|---|
| What expires in the next 90 days, and what is it worth? | Batch + expiry + purchase rate |
| Which batch will this bill draw from? | FEFO selection visible at billing |
| What did we actually make on this sale? | Batch purchase rate on the sale line |
| Who received batch ABC123? | Batch recorded on sale lines |
| How much of this item do we hold across branches, by batch? | Batch + branch dimensions together |

If a vendor cannot demonstrate all five against sample data, the batch model is incomplete somewhere.

## How pharCare implements it

[pharCare](/products/pharcare/) holds batch number, expiry date, purchase rate and MRP against every batch, captures them at goods receipt with barcode and import support, selects batches by FEFO at billing with logged overrides, preserves the batch record through inter-branch transfers and returns, and records the batch on every sale line so recall traceability and true margin both work.

To see it against your own stock file, [book a demo](/contact/).
