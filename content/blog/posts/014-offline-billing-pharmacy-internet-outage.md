---json
{
  "title": "What happens to your pharmacy when the internet goes down?",
  "description": "Cloud pharmacy software is only as available as your connection. How offline billing should work, what must sync on reconnect, and what to ask a vendor first.",
  "category": "Operations",
  "keywords": [
    "offline pharmacy billing software",
    "pharmacy software without internet",
    "cloud vs local pharmacy billing",
    "pharmacy business continuity",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Can cloud pharmacy software work without internet?",
      "a": "Only if it was designed to. Software that keeps a local copy of the data it needs to bill can continue through an outage and sync afterwards; software that queries a server for every action cannot. This is an architecture decision, not a setting, so ask before buying."
    },
    {
      "q": "What can and cannot be done offline?",
      "a": "Billing, stock deduction and printing should continue. Anything needing a live external service — cross-branch stock lookup, online payment authorisation, e-invoice generation where applicable — cannot, and the system should say so clearly rather than appear to succeed."
    },
    {
      "q": "Is there a risk of duplicate invoice numbers after an outage?",
      "a": "There is, if numbering is naive. Well-designed systems allocate number ranges per counter or per branch in advance so offline bills cannot collide with online ones. Ask specifically how numbering is handled during a disconnection."
    },
    {
      "q": "How does pharCare behave during an outage?",
      "a": "Billing continues locally with stock deducted against the local position, and transactions reconcile automatically when the connection returns. A visible sync status shows each counter whether it is current or has pending transactions."
    }
  ]
}
---
A pharmacy that cannot bill is a pharmacy that is closed. Which makes internet dependency a strange risk to accept quietly — yet it is routinely accepted, because outage behaviour is almost never demonstrated during a software evaluation and almost always discovered on a Saturday evening.

This is what to check, and why the answer matters more than most features on a comparison sheet.

## The three architectures, and how they behave

**Server-dependent cloud.** Every action queries a remote server. When the link drops, billing stops. Simplest to build, and entirely dependent on your ISP being better than it is.

**Local-first with sync.** The billing station holds the data it needs — item master, prices, current stock position — locally. Transactions are written locally and pushed to the central system when connectivity allows. Billing continues through an outage.

**On-premise.** Everything runs on a machine or server in the shop. Immune to internet outages, exposed instead to hardware failure, and it moves backup and update responsibility onto you.

For a retail pharmacy, local-first with sync is usually the right answer: it survives the failure mode that actually occurs weekly, without taking on the server administration burden that on-premise implies.

## What must keep working

During an outage, these are non-negotiable:

- **Complete a sale** and deduct stock
- **Print a compliant bill**, with the correct GST breakup
- **Capture prescriber and patient details** for [Schedule H1 items](/resources/blog/schedule-h-h1-h1x-pharmacy-billing-software/) — compliance does not pause for an ISP
- **Look up price, batch and expiry** from the local position
- **Take cash payment** and record it

If any of those fail, staff will fall back to handwritten bills — and handwritten bills entered later, from memory, at the end of a shift, are where stock accuracy and compliance records both come apart.

## What legitimately cannot work

Be suspicious of a vendor claiming full offline capability. These genuinely require connectivity:

- **Cross-branch stock lookup** — the other branch's position is not local
- **Card and UPI authorisation** — the payment network is the dependency, not your software
- **E-invoice generation** where it applies to your B2B supplies, since the portal must be reached
- **Central price updates** pushed from head office
- **Anything involving a customer's online order**

The right behaviour is to **say so clearly**. A system that silently appears to succeed at something it did not do is worse than one that reports the limitation.

## The three things that go wrong on reconnect

Offline billing is the easy half. Syncing correctly is where implementations fail.

### 1. Invoice number collisions

Two counters billing offline, both continuing a sequence, both syncing. If numbering is allocated centrally at the moment of billing, this breaks. The fix is **pre-allocated ranges** per counter or branch, so offline numbers cannot collide. Gaps in a sequence are explainable; duplicates are a serious problem.

### 2. Stock going negative

Two counters each sell the last three units of an item while offline. On sync, stock is minus three. The system cannot prevent this — the sale already happened — but it must **surface it clearly** as a reconciliation item rather than silently clamping to zero, which would leave your stock position wrong.

### 3. Silent partial sync

The worst failure: some transactions sync, some do not, and nothing says so. Days later the totals disagree and nobody knows which bills are missing.

> The requirement is a **visible sync status per counter** — current, or *N* transactions pending — plus an alert when pending transactions exceed a threshold or an age. Staff should never have to wonder whether the system is up to date.

## Questions to put to a vendor

Ask these before signing, and ask for a demonstration rather than an assurance:

1. **Disconnect the network mid-bill.** What happens to that bill?
2. Bill ten items offline. **Reconnect.** Show me the sync, and show me where I can see it completed.
3. How are **invoice numbers** allocated so two offline counters cannot collide?
4. What happens if stock goes **negative** on sync? Show me the report.
5. How long can a counter stay offline before something breaks?
6. If the central system is down but the internet is fine, what happens?

The first is the most revealing. A system that loses an in-progress bill on disconnect will lose bills regularly.

## Reducing the frequency, not just surviving it

Software resilience is one half; the other is not being offline as often.

- A **second connection** on a different medium — a mobile data failover — costs little and removes most single-ISP outages
- A **UPS** on the counter machine and the router, sized for at least the length of a typical power cut
- **Router and modem** that are not the ISP's cheapest supplied unit, which is a surprisingly common cause of "internet problems"
- A written **fallback procedure** staff have actually practised, for the case where everything fails

The fallback procedure is worth ten minutes of everyone's time once a year. The failure mode you want to avoid is staff improvising during a queue.

## How pharCare handles it

[pharCare](/products/pharcare/) bills locally against a local stock position, so an outage does not stop the counter, and reconciles automatically on reconnect. Invoice numbering uses pre-allocated ranges per counter so offline bills cannot collide, sync status is visible at each counter with pending-transaction counts, and post-sync exceptions — including negative stock arising from concurrent offline sales — are reported rather than silently absorbed. Schedule H1 capture is enforced offline exactly as it is online.

To see the outage behaviour demonstrated rather than described, [book a demo](/contact/) and ask us to pull the cable.
