---json
{
  "title": "Inter-branch stock transfers without losing track of stock",
  "description": "How pharmacy chains should move stock between branches — requests, batch-level transfers, in-transit tracking and receipt confirmation — so nothing disappears between stores.",
  "category": "Multi-branch",
  "service": "pharmacy-suite",
  "keywords": [
    "pharmacy stock transfer",
    "inter branch transfer",
    "multi-store pharmacy software",
    "pharmacy chain inventory",
    "complete pharmacy management software"
  ],
  "faq": [
    {
      "q": "Why do stock transfers between branches go missing?",
      "a": "Usually because the transfer is recorded at the sending branch but never confirmed at the receiving one, or is done informally by phone and bag. Without a receipt step, losses are invisible until an audit."
    },
    {
      "q": "Do inter-branch transfers need batch numbers?",
      "a": "Yes. Without batches, recalls cannot be traced and expiry dates at the receiving branch are unknown. Every transfer line should carry batch, expiry and MRP."
    },
    {
      "q": "What GST document is needed for a branch transfer?",
      "a": "It depends on whether both branches are under the same GSTIN. Transfers between different registrations are generally treated as supplies needing a tax invoice; within the same registration a delivery challan is common. Confirm with your tax adviser."
    },
    {
      "q": "How should near-expiry stock be moved between branches?",
      "a": "Use transfers to move slow, near-expiry stock to the branch most likely to sell it in time, well before it reaches your supplier return window."
    }
  ]
}
---
In a pharmacy chain, stock moves between branches all the time. One store is out of an antibiotic that another has plenty of. Near-expiry stock moves to a busier branch. A new branch is stocked from an existing one. Each movement is reasonable. Done informally — a phone call, a carry bag, a note in a register — they become one of the biggest sources of unexplained stock difference in a chain.

A transfer needs the same discipline as a purchase or a sale.

## How informal transfers go wrong

- **Sent but not received.** The sending branch reduces stock; the receiving branch never adds it.
- **Received but not sent.** Stock arrives and is sold, but the sending branch still shows it.
- **Wrong batch.** The receiving branch enters a different batch, so expiry and recall tracking break.
- **Short in transit.** Five strips sent, four arrive, and nobody notices.
- **Wrong value.** Stock moves at the wrong cost, distorting each branch's margin.

None of these show in chain-wide totals. They show in branch audits, months later, as differences nobody can explain.

## A transfer process that holds up

### 1. Request

The receiving branch raises a transfer request in the system: item, quantity, urgency. This creates a record before anything moves.

### 2. Approve and pick

The sending branch (or warehouse) approves the request and picks the stock. If it can't send everything, it sends what it can and the shortfall is recorded.

### 3. Transfer document

The system generates a transfer document with:

- item, batch, expiry and MRP for every line
- quantity and transfer value
- sending and receiving branch
- date and the user who prepared it

The stock leaves the sending branch's inventory and moves to **in transit**.

### 4. Receive and confirm

The receiving branch counts the stock against the transfer document and confirms receipt in the system. Only then does it join their saleable stock. Any shortfall or damage is recorded at this point, against the specific line.

### 5. Close out differences

Differences go to a manager for resolution the same day. A transfer that stays in transit for more than a day or two should appear on someone's exception report.

## Batch, expiry and MRP must travel with the stock

Transfers are where batch tracking most often breaks in a chain. If a branch enters received stock under a generic batch or skips the expiry date:

- recalls can't be traced to that store
- near-expiry alerts at that branch are wrong
- supplier returns can't be matched to the right batch

Transfers should select the exact batch from the sending branch's stock, and the receiving branch should never retype batch details by hand.

## Get the paperwork right

Whether a branch transfer needs a delivery challan or a tax invoice depends on whether both branches share a GST registration. Transfers between different registrations — typically branches in different states — are generally treated as supplies. Agree the correct document with your tax adviser and configure the software to produce it automatically.

Drug-licence records also matter: the stock at each licensed premises should be traceable.

## Use transfers to reduce expiry

Transfers aren't only for stockouts. They're one of the best tools against expiry losses:

- run a monthly report of slow-moving stock expiring within your chosen window
- compare it with sales of the same items at other branches
- move stock to where it sells, early enough to sell before expiry or still return to the supplier

See [reducing expired-stock write-offs](/resources/blog/reduce-expired-stock-write-offs-pharmacy/) for the wider approach.

## Reports owners should watch

- **In-transit stock** older than a set number of days
- **Transfer differences** by branch and by user
- **Transfer volume** between branches, to spot recurring imbalances that should be fixed in purchasing
- **Stock received but not yet confirmed**

A chain that keeps transfers clean can trust its branch-level stock figures. That trust is what lets owners make purchasing, pricing and staffing decisions with confidence instead of instinct.
