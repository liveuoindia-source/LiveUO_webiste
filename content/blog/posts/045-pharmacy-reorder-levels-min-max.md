---json
{
  "title": "Setting reorder levels in a pharmacy: min, max and safety stock",
  "description": "How to set minimum and maximum stock levels per item from real sales, lead time and supplier frequency, so you order less often and run out less.",
  "category": "Inventory",
  "service": "pharcare",
  "keywords": [
    "pharmacy reorder level",
    "min max stock pharmacy",
    "safety stock calculation",
    "pharmacy inventory management",
    "pharCare"
  ],
  "faq": [
    {
      "q": "What is a reorder level?",
      "a": "The stock quantity at which an item should be reordered. When stock falls to this level, there should be just enough left to cover sales until the next delivery arrives, plus a small safety buffer."
    },
    {
      "q": "How often should reorder levels be reviewed?",
      "a": "Review fast movers monthly and the rest quarterly, and always before seasonal changes such as monsoon or winter, when demand for certain categories shifts sharply."
    },
    {
      "q": "Should every item have a reorder level?",
      "a": "Regular, repeat-selling items should. Rare or one-off items are better ordered against a specific prescription or customer request rather than kept in stock."
    },
    {
      "q": "Can pharCare suggest reorder quantities?",
      "a": "Yes. pharCare can generate a purchase suggestion from current stock, recent sales and the minimum and maximum levels set for each item, which the purchaser reviews before ordering."
    }
  ]
}
---
Most pharmacies reorder by looking at the shelf. When something looks low, it goes on the list. It works until the person who "just knows" is on leave, or until the range grows to a few thousand items and nobody can keep it all in their head.

Reorder levels replace that judgment with a simple rule per item. They don't need to be perfect to be a big improvement.

## Three numbers per item

For each regularly sold item, set:

- **Minimum (reorder level):** when stock falls to this, reorder.
- **Maximum:** the most you want to hold after a delivery.
- **Safety stock:** a buffer inside the minimum for days when demand spikes or a delivery is late.

The order quantity is simply *maximum minus current stock*, rounded to the pack size.

## Working out the minimum

The minimum must cover sales from the moment you order until the stock is on the shelf, plus safety stock:

**Minimum = average daily sales × lead time in days + safety stock**

For example, an item that sells 6 strips a day, with a distributor who delivers the next day (lead time of 1 day) but sometimes takes 2:

- cover for lead time: 6 × 1 = 6 strips
- safety stock for a delayed day: 6 strips
- minimum: 12 strips

### Lead time is not just delivery time

Include the time until you actually *place* the order. If you order once a day in the evening, an item that hits its minimum in the morning waits most of a day before being ordered. Count that.

### Safety stock should reflect the risk

Give more safety stock to:

- items whose sales vary a lot from day to day
- items from distributors who often short-supply
- critical items where a stockout means sending a regular patient elsewhere — chronic medicines, insulin, common antibiotics

Give less to slow, expensive or short-shelf-life items, where excess stock is the bigger risk.

## Working out the maximum

The maximum decides how much you buy each time. It depends on how often you order:

**Maximum = minimum + average daily sales × days between orders**

If you order an item every 3 days, the maximum for the example above is 12 + (6 × 3) = 30 strips.

Higher maximums mean fewer orders and better schemes, but more money tied up in stock and more expiry risk. For slow movers and items with short shelf life, keep the maximum tight.

## Use sales data, not memory

Calculate average daily sales from the last 60–90 days of billing data. Exclude unusual spikes — a one-off bulk order for a clinic — or the levels will be too high for the rest of the year.

Adjust for season. Anti-allergy, cough and cold, anti-diarrhoeal and ORS products swing sharply with weather. Raise their levels ahead of the season and lower them after.

## Group items by how they move

You don't need the same attention on every item:

| Group | Typical share of items | Approach |
|---|---|---|
| Fast movers | Small | Tight levels, reviewed monthly |
| Regular movers | Large | Levels from sales, reviewed quarterly |
| Slow movers | Large | Low or zero minimum; order on demand |
| One-off items | Some | Order against a specific request |

Slow and one-off items are where pharmacies lose the most to expiry. Keeping them at zero minimum and ordering only for a known customer is often the right answer.

## Let the system build the order

Once levels are set, the billing software should:

- list every item at or below its minimum
- suggest the quantity to reach the maximum
- show current stock, recent sales and last purchase rate alongside
- let the purchaser adjust and convert it into a purchase order

The purchaser still reviews the list — a distributor scheme or an upcoming festival may justify a change — but nothing is forgotten because it wasn't on someone's mental list.

## Review and refine

Every month, look at:

- **stockouts:** items that ran out despite having levels — raise their minimum or safety stock
- **excess:** items consistently far above maximum — lower their levels or stop stocking them
- **expiry:** items that expired on the shelf — their maximum is too high

Reorder levels are never finished. But a pharmacy using rough levels, refined monthly, will run out less and hold less dead stock than one ordering by eye — and it won't depend on one person's memory to keep the shelves full.

For the purchase side, see [pharmacy purchase order automation](/resources/blog/pharmacy-purchase-order-automation/).
