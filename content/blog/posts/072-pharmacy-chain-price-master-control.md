---json
{
  "title": "Keeping prices consistent across a pharmacy chain",
  "description": "How pharmacy chains manage selling prices, discounts and MRP changes centrally so every branch charges correctly — and where branches still need flexibility.",
  "category": "Multi-branch",
  "service": "pharmacy-suite",
  "keywords": [
    "pharmacy chain pricing",
    "central price master",
    "pharmacy discount control",
    "MRP update pharmacy chain",
    "complete pharmacy management software"
  ],
  "faq": [
    {
      "q": "Why do prices differ between branches of the same chain?",
      "a": "Usually because each branch maintains its own item master and discount rules, or MRP updates reach some branches and not others."
    },
    {
      "q": "Can a chain set different prices for different branches?",
      "a": "Yes, if it's deliberate — for example a hospital branch with different terms. The software should support branch-specific price lists managed centrally."
    },
    {
      "q": "How should MRP changes be handled?",
      "a": "MRP is batch-specific. New batches carry the new MRP; existing stock keeps its printed MRP. Software should handle batch-wise MRP and never sell above the printed price."
    },
    {
      "q": "How can head office control discounts?",
      "a": "By setting maximum discounts by role and category centrally, requiring approval above them, and reviewing discount reports by branch."
    }
  ]
}
---
A customer who pays one price at one branch and a different price at another starts to wonder which one was right. In a pharmacy chain, inconsistent pricing damages trust, causes complaints, and often hides margin leaks.

Most inconsistency comes from the same cause: each branch managing its own prices.

## Where inconsistency comes from

- **separate item masters** per branch, edited independently
- **local discount habits** — one branch rounds off, another gives 10% to regulars
- **MRP updates** applied at some branches but not others
- **manual price overrides** at the counter
- **promotions** that started centrally but ended at different times

## One price master

Head office should own the price master:

- item details and MRP by batch
- standard selling price or discount from MRP by category
- branch-specific price lists where deliberately needed
- promotional prices with start and end dates

Branches use the master but can't change it. Changes are requested and approved centrally, then pushed to all branches at once.

## Handling MRP correctly

MRP is printed on each pack and can differ between batches. The software must:

- record MRP per batch on purchase
- sell each batch at no more than its printed MRP
- show the counter which batch is being sold
- handle price revisions without relabelling old stock incorrectly

See [MRP price revisions and existing stock](/resources/blog/mrp-price-revision-pharmacy-stock/) for details.

## Discount policy

Write a clear discount policy and configure it:

| Rule | Example |
|---|---|
| Standard discount by category | Medicines X%, OTC Y%, FMCG Z% |
| Maximum at the counter | Counter staff up to a set limit |
| Approval above limit | Manager PIN, with reason |
| Loyalty discounts | Applied automatically by customer type |
| No discounts | Certain categories excluded |

Avoid policies that depend on staff judgment for every sale. They produce different prices for the same item.

## Promotions

Set promotions centrally with dates, branches, items and discount. They start and end automatically everywhere. No branch should be running last month's offer.

## Branch flexibility — deliberately

Some variation is legitimate:

- a hospital pharmacy branch with institutional terms
- a branch competing with a nearby discounter
- local clearance of near-expiry stock

Handle these with branch-specific price lists or approved local promotions, managed centrally and visible in reports — not with counter overrides.

## Reports to watch

- discount given by branch, user and category
- price overrides at the counter
- sales below standard price
- margin by branch

A branch with unusually high discounts or overrides is worth a conversation.

## The outcome

Consistent pricing makes the brand trustworthy, simplifies training, and turns discounting into a deliberate business decision instead of a habit. It also makes branch margins comparable — the first step to understanding why one branch earns more than another.
