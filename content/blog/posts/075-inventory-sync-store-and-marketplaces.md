---json
{
  "title": "Syncing inventory across your store, marketplaces and shop",
  "description": "How to keep stock accurate when selling on your own website, marketplaces and in a physical shop — one source of truth, buffers, and handling orders that clash.",
  "category": "E-commerce",
  "service": "ecommerce",
  "keywords": [
    "inventory sync ecommerce",
    "multichannel inventory India",
    "marketplace stock sync",
    "overselling prevention",
    "ecommerce development"
  ],
  "faq": [
    {
      "q": "What is overselling?",
      "a": "Selling more units than you have, because two channels each think the stock is available. It leads to cancelled orders, unhappy customers and sometimes marketplace penalties."
    },
    {
      "q": "How often should stock sync between channels?",
      "a": "As close to real time as possible for fast-moving items. Delays of even an hour can cause oversells during busy periods."
    },
    {
      "q": "Should every channel see all my stock?",
      "a": "Not always. Many sellers keep a buffer or allocate stock per channel for fast movers, so a sync delay doesn't cause oversells."
    },
    {
      "q": "What should be the source of truth for stock?",
      "a": "One system — usually your inventory or billing system — that every channel reads from and reports sales to."
    }
  ]
}
---
Selling on more channels brings more customers, and one very common problem: the same unit sold twice. A customer buys the last piece in your shop while an online order for it is coming in. A marketplace order arrives before your website stock updates. Each oversell means a cancelled order, an apology, and on marketplaces, possibly a penalty.

## One source of truth

The rule that prevents most problems: **one system owns the stock number.** Every channel — website, marketplaces, shop counter — reads stock from it and reports sales back to it.

If each channel has its own stock figure, updated by hand, overselling is a matter of time.

## How sync works

1. A sale happens on any channel.
2. That channel reports it to the central system.
3. The central system reduces stock.
4. The new figure is pushed to every other channel.

The speed of steps 2 and 4 decides how often you oversell. Near-real-time sync through APIs is the goal; scheduled updates every few hours are risky for fast movers.

## Buffers and allocation

Even fast sync has delays. Protect yourself:

- **Buffer stock** — show channels slightly less than you have for fast-moving items. If you have 10, show 8.
- **Channel allocation** — reserve some stock for specific channels during big sales.
- **Hide low stock** — stop selling online when only one or two units remain, if the shop sells them quickly.

## Returns and cancellations

Returned and cancelled items must come back into stock correctly:

- cancelled before dispatch — back to saleable stock immediately
- returned and checked — back to saleable stock after inspection
- returned damaged — to a separate non-saleable location

Many stock mismatches come from returns that were never added back, or were added back without checking.

## Warehouses and locations

If you hold stock in more than one place — a shop and a warehouse, or a marketplace fulfilment centre — track stock by location. Online orders can then be fulfilled from the right place, and marketplace-held stock isn't double-counted.

## Product mapping

Each product needs a consistent SKU across channels. Marketplaces often have their own product IDs; your system should map them to your SKU, including variants like size and colour. Mapping errors cause stock to update on the wrong item.

## Handle clashes quickly

When an oversell happens anyway:

1. detect it immediately — negative stock should trigger an alert
2. decide which order to fulfil, based on channel rules and penalties
3. contact the other customer quickly with an alternative or refund
4. find the cause — sync delay, mapping error, unrecorded shop sale

## Daily checks

- items with negative stock
- differences between channel stock and central stock
- orders not yet reported to the central system
- failed sync events

## The outcome

With one source of truth, fast sync, sensible buffers and careful handling of returns, multichannel selling stops being a juggling act. Customers get what they ordered, and you can add channels without adding chaos.

For the bigger strategic question, see [own online store or marketplace](/resources/blog/own-online-store-vs-marketplace/).
