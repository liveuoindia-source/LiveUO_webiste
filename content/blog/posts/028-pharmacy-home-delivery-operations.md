---json
{
  "title": "Pharmacy home delivery: running it without losing money",
  "description": "Order capture, prescription verification, cold chain, payment on delivery and route batching. What delivery actually costs and how to make it pay for itself.",
  "category": "Growth",
  "keywords": [
    "pharmacy home delivery software",
    "medicine delivery management",
    "pharmacy delivery operations India",
    "pharmacy order management",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Is home delivery profitable for an independent pharmacy?",
      "a": "It can be, but rarely on a single small order. It becomes profitable through batched routes, a minimum order value, and the retention effect on chronic patients — who are the highest-value customers and the ones most likely to switch to an online pharmacy if collection is difficult."
    },
    {
      "q": "How should prescriptions be handled for delivery orders?",
      "a": "Verification must happen before dispatch, not at the door. A photographed prescription reviewed by the pharmacist before the order is packed is the workable pattern, with the original collected or confirmed as required for the drugs involved."
    },
    {
      "q": "What about cold chain items?",
      "a": "Insulated packaging with a temperature indicator, a short delivery window, and a rule against leaving cold-chain items with a neighbour. If you cannot maintain the chain, do not deliver the item — offer collection instead."
    },
    {
      "q": "Does pharCare support delivery orders?",
      "a": "Yes. Orders can be captured against a customer with a delivery address and slot, picked and packed against the bill with batch recorded, assigned to a rider, and closed with payment status and proof of delivery."
    }
  ]
}
---
Home delivery arrived at independent pharmacies through competitive necessity rather than choice. Online pharmacies made it normal, and chronic patients — the most valuable customers a pharmacy has — are exactly the group for whom collection is hardest. Refusing to deliver hands them over.

The trap is that delivery is easy to start and easy to lose money on. Here is how the economics work and what the operation needs.

## The economics, plainly

A delivery has a real cost: rider time, fuel, packaging, the counter time to pick and pack, and the failed-delivery rate. On a small order at retail pharmacy margins, a single dedicated trip loses money outright.

Three things change that.

**Batching.** One rider, one route, six drops. The cost per delivery falls by most of the difference. This is the single biggest lever and it requires orders to be grouped by area and time slot rather than dispatched as they arrive.

**Minimum order value.** A threshold below which delivery is either declined or charged. Set it from your own numbers — the point at which the gross margin on the order covers the marginal delivery cost.

**Retention value.** The real return. A chronic patient delivered to monthly is a predictable multi-year customer. Judging delivery on the margin of individual orders undervalues it; judging it on retained repeat revenue is the honest calculation, and it connects directly to [refill management](/resources/blog/pharmacy-refill-reminders-customer-retention/).

## Order capture without chaos

Orders arrive by phone, message, walk-in request and sometimes an app. The failure mode is orders living in a messaging app where they get missed, duplicated or misread.

Requirements:

- **One place** where every order lands, regardless of channel
- **Customer identified**, with delivery address and phone
- **Delivery slot** agreed at capture — not "today"
- **Prescription attached** where required
- **Status visible**: received, verified, packed, dispatched, delivered, failed

The single-queue rule matters more than any feature. Orders scattered across three staff members' phones will produce misses, and a missed delivery of a chronic medication is a serious customer failure.

## Prescription verification comes before packing

This is the compliance-critical step, and it must sit before dispatch rather than at the door.

The workable pattern:

1. Customer sends a photograph of the prescription at order time
2. **Pharmacist reviews it** before the order is picked
3. Prescription details recorded against the order — prescriber, patient, drugs
4. For [Schedule H1 items](/resources/blog/schedule-h-h1-h1x-pharmacy-billing-software/), the register entry is made exactly as it would be at the counter
5. Where the original is required, arrange collection at delivery

Delivery does not relax any record-keeping duty. A rider is not in a position to assess a prescription, so nothing that requires professional judgement can be deferred to the doorstep.

## Picking, packing and the cold chain

**Pick against the bill, with batch recorded.** The batch dispensed must be on the sale line, exactly as at the counter — recall traceability does not have a delivery exemption.

**Check before sealing.** A second person verifies items against the order. Delivery errors are much more expensive than counter errors because correction requires another trip.

**Cold chain, if you do it at all, done properly:**

- Insulated box with an appropriate coolant
- A temperature indicator in the package
- Short, committed delivery window
- Never left with a neighbour or at a doorstep
- If the chain cannot be maintained, decline delivery and offer collection

Cold chain is the area where it is entirely reasonable to say no. A vaccine delivered warm is worse than a vaccine not delivered.

## Payment

**Prepaid** is better for you — UPI at order confirmation removes cash handling and failed-delivery losses.

**Cash on delivery** is what many customers want. If you offer it: give riders a way to record collection immediately, reconcile daily against dispatched orders, and treat undeposited cash as an ageing item.

**Failed deliveries** need a defined rule. One re-attempt, then return to shop and contact the customer. Open-ended re-attempts consume the margin on several successful deliveries.

## Routing without a logistics system

Most independent pharmacies do not need routing software. A workable manual approach:

| Step | Practice |
|---|---|
| Group orders | By locality, into two or three daily dispatch windows |
| Sequence | Furthest first or nearest first, consistently — pick one |
| Slot commitment | A two-hour window, not a time |
| Communicate | Message on dispatch, with rider name and number |
| Confirm | Delivery marked complete with payment status |

Two or three dispatch windows a day beats continuous dispatch on cost, and customers accept a window if it is communicated and kept.

## What to measure

- **Deliveries per route** — the batching efficiency, and the main profit lever
- **Cost per delivery**, fully loaded
- **Average order value** on delivery versus counter
- **Failed delivery rate**, and reasons
- **On-time rate** against the promised slot
- **Retention of delivery customers** versus counter-only customers

The last is the number that justifies the operation. If delivery customers churn at a materially lower rate, delivery is earning its keep even where individual orders look thin.

## When to say no

Being clear about limits protects the service:

- Below the minimum order value, unless it is a chronic patient you are retaining deliberately
- Outside your delivery radius
- Cold chain you cannot maintain to that address
- Controlled substances requiring in-person supply and verification
- Where the prescription cannot be verified before dispatch

A delivery service with clear boundaries is sustainable. One that tries to serve every request stops being profitable and then stops being reliable.

## How pharCare handles it

[pharCare](/products/pharcare/) captures delivery orders against a customer with address and slot into a single queue regardless of channel, holds the attached prescription for pharmacist verification before picking, generates the bill with batch recorded on each line, tracks status through packed, dispatched and delivered, assigns orders to riders for batched routes, and records payment status and proof of delivery for daily reconciliation. Compliance capture for scheduled drugs is enforced identically to a counter sale.

To scope a delivery operation around your area and order profile, [book a demo](/contact/).
