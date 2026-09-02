---json
{
  "title": "Drug recalls: can you identify who received the batch?",
  "description": "A recall names a batch number. What it takes to find that batch in your stock, identify the customers who received it, and document the response — in hours rather than days.",
  "category": "Compliance",
  "keywords": [
    "drug recall pharmacy India",
    "batch traceability pharmacy software",
    "medicine recall process",
    "pharmacy recall procedure",
    "pharCare"
  ],
  "faq": [
    {
      "q": "What information does a drug recall notice contain?",
      "a": "Typically the product, the manufacturer, one or more specific batch numbers, the expiry dates, the reason, and the recall class or urgency. The batch number is the operative detail — a recall almost never covers all stock of a product."
    },
    {
      "q": "How do I find out which customers received a recalled batch?",
      "a": "Only if the batch was recorded on the sale line. With batch-level sale records, it is a filtered query returning the exact transactions. Without it, you can identify everyone who bought that product in the period, which is a much larger and less useful list."
    },
    {
      "q": "How quickly should a pharmacy act on a recall?",
      "a": "Quarantine affected stock immediately on receiving the notice — that is a minutes-long task and it prevents further dispensing. Customer notification follows, with urgency proportionate to the recall class."
    },
    {
      "q": "Does pharCare record batch numbers on sale lines?",
      "a": "Yes. Every sale line records the batch dispensed, so affected transactions and the customers linked to them can be identified from a batch number directly."
    }
  ]
}
---
A recall notice arrives naming a product, a manufacturer and a batch number. Three questions follow immediately: do we have any, did we sell any, and to whom. A pharmacy with batch-level records answers all three in minutes. One without answers the first by walking the shelves and cannot answer the third at all.

This is what the capability requires, and what a workable recall procedure looks like.

## What a recall notice actually gives you

Recalls are batch-specific. The notice names:

- Product and manufacturer
- **One or more batch numbers** — the operative detail
- Expiry dates of the affected batches
- The reason and the recall class or urgency
- What to do with affected stock

The batch specificity is the whole point. A recall almost never covers every unit of a product ever made, so "we stock this product" is not the question. "Do we hold or have we sold *these batches*" is.

## The three questions, and what each needs

### Question 1: do we hold any?

Needs batch-level stock. Filter current stock by product and batch number, across every location — main shelf, back store, fridge, and every branch.

Without batch-level stock this becomes a physical search of the shelves, which is slow and unreliable, particularly when a product sits in three places.

### Question 2: did we sell any?

Needs the batch recorded on the **sale line**, not just on the stock record. Many systems track batch in inventory but write only the product onto the invoice, at which point traceability ends at the moment of sale — exactly where it becomes important.

### Question 3: who received it?

Needs the sale linked to an identifiable customer. This is where most pharmacies partially fail, and legitimately so: anonymous cash sales exist and always will.

What you can realistically achieve:

- **Chronic and repeat patients** — nearly always identifiable, and the highest-risk group because they have taken the product repeatedly
- **Customers on record** for delivery, credit or loyalty — identifiable
- **Anonymous walk-ins** — not identifiable individually; addressed by a shop notice and, where warranted, a public communication

Being able to reach the first two groups covers the majority of the risk. This is one of the underrated benefits of maintaining customer records for [refill reminders](/resources/blog/pharmacy-refill-reminders-customer-retention/) — the same data supports recall response.

## A recall procedure worth writing down

**Within the first hour**

1. **Quarantine.** Search stock by batch, physically remove from every location, label clearly, and store separately. This takes minutes and immediately stops further dispensing — do it before anything else.
2. **Block dispensing** in the system. Mark the batch so it cannot be selected at billing, in case a unit is missed on the shelf.
3. **Check every location**, including branches, fridge, and any ward or satellite stock.

**Within the first day**

4. **Query sales** for the batch across the full period it was in stock.
5. **Segregate the customer list** into identifiable and anonymous.
6. **Notify identifiable customers**, in the manner and urgency the recall class warrants. For a serious recall, a phone call, not a message.
7. **Post a notice** at the counter for the anonymous group.
8. **Notify your distributor** and follow their return instructions.

**Within the week**

9. **Return or dispose** of the quarantined stock per instructions, with documentation.
10. **Handle returns from customers**, recording each against the original sale where possible.
11. **Document the whole response** — what you held, what you sold, who was contacted, when, and the outcome.

> Step 11 is the one that gets skipped, and it is the one that matters if the recall is ever reviewed. The documented response is the evidence that you acted; without it, you acted and cannot show it.

## Communicating with customers

Difficult, and worth thinking about before you need to.

**Be direct and factual.** What the product is, that a specific batch is affected, what they should do, and how to reach you.

**Do not minimise or overstate.** Either damages trust, and trust is the entire asset a neighbourhood pharmacy has.

**Give a clear action.** Stop taking it and contact us; bring it back for replacement or refund; contact your doctor — whatever the notice specifies.

**Be reachable.** A named person and a number that is answered. A recall message with no route to a human generates anxiety and phone calls to everyone else.

**Replace or refund without argument.** The commercial cost is small; the alternative is expensive in a way that does not appear on any report.

## Testing the capability before you need it

Run a drill. Pick a batch you sold three months ago and time these:

1. How long to identify current stock of that batch, everywhere?
2. How long to list every sale of that batch?
3. How many of those customers are identifiable and contactable?
4. Can you produce a documented response pack?

If any answer is "we cannot", that is a gap to fix now rather than during an actual recall. The fix is nearly always the same: [batch-level records](/resources/blog/batch-wise-inventory-tracking-pharmacy/) carried onto the sale line, and customer identification captured for repeat patients.

## The multi-branch complication

With several outlets, stock moves between them. A recall response must therefore trace the batch across **transfers as well as purchases and sales** — which only works if [inter-branch transfers preserve the batch record](/resources/blog/multi-branch-pharmacy-billing-software/) rather than re-keying a quantity. A transfer that flattens batch data breaks the recall chain at the branch boundary.

## How pharCare handles it

[pharCare](/products/pharcare/) records batch on every stock movement and on every sale line, so a batch number resolves directly to current stock across all locations and to the exact transactions that dispensed it. Batches can be blocked from dispensing immediately, transfers preserve the batch record across branches, and customer-linked sales produce a contactable list. The resulting stock, sales and contact records form the documented response pack.

To run a recall drill against your own history, [book a demo](/contact/).
