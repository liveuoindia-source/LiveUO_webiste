---json
{
  "title": "Choosing pharmacy software: an evaluation checklist",
  "description": "Vendor demos are rehearsed. The scenarios to insist on, the questions that reveal architecture, and the reference checks worth making before you sign anything.",
  "category": "Buying Guide",
  "keywords": [
    "how to choose pharmacy software",
    "pharmacy software evaluation checklist",
    "pharmacy management software comparison",
    "pharmacy billing software selection",
    "pharCare"
  ],
  "faq": [
    {
      "q": "What should I insist on seeing in a pharmacy software demo?",
      "a": "Your own data, and your own awkward scenarios — a mixed-rate bill, a loose strip sale, a Schedule H1 line, a near-expiry return, and the system behaving during a network disconnection. A demo on the vendor's sample data proves only that the sample data works."
    },
    {
      "q": "How important are reference calls with existing customers?",
      "a": "Very, and ask for a pharmacy of similar size and structure rather than the flagship account. The two questions worth asking are what went wrong during implementation, and what they would check more carefully if choosing again."
    },
    {
      "q": "Should I choose software based on feature count?",
      "a": "No. Feature lists are close to worthless for comparison because every vendor claims every feature. What differentiates is how well the handful of things you do a thousand times a day actually work, and whether the structural capabilities — batch-level stock, compliance registers, offline billing — are genuinely present."
    },
    {
      "q": "What should I check about data ownership before signing?",
      "a": "That you can export your complete data — items, batch-level stock, transactions, customers, registers — in a usable format, at any time, without a fee or a notice period. Get it in the contract, not in an email."
    }
  ]
}
---
Every pharmacy software vendor will tell you they do GST billing, expiry tracking, multi-branch and compliance. On a feature list they are indistinguishable. The differences only appear when you put a real scenario in front of the system, and vendor demos are specifically designed to avoid that.

This is a structured way to evaluate, built around scenarios rather than features.

## Step 1: write down what you actually do

Before speaking to anyone, document your own operation in one page:

- Branch count, counter count per branch, peak bills per hour
- Approximate SKU count and how many are loose-strip lines
- Proportion of business that is B2B — clinics, institutions
- Whether you do home delivery, credit sales, or online orders
- Which drug schedules you handle, including whether you hold Schedule X
- What your accountant currently spends time fixing every month

This page is your evaluation criteria. Without it you will be shown features and end up comparing what vendors chose to demonstrate.

## Step 2: the six scenarios to insist on

Do not accept a scripted walkthrough. Ask for these, in this order, on data resembling yours.

**Scenario 1 — the messy bill.** Five items across three GST rates, one sold as a loose strip, one Schedule H1 item, a customer with a GSTIN, split payment across cash and UPI. Time it. This is your Saturday evening.

**Scenario 2 — goods receipt with batch.** Receive a distributor invoice with ten lines, batch numbers, expiry dates, two rate changes and a bonus quantity. Watch how much typing is involved. This is where [batch data quality](/resources/blog/batch-wise-inventory-tracking-pharmacy/) is won or lost.

**Scenario 3 — the near-expiry cycle.** Show me everything expiring in 90 days with its value, generate a supplier return, and show me the return tracked until credit is received.

**Scenario 4 — the compliance register.** Generate the Schedule H1 register for a date range, in the format an inspector expects. Then edit a past bill and show me what the audit trail records.

**Scenario 5 — pull the cable.** Disconnect the network mid-bill. Complete the bill. Reconnect. Show me the sync and where I can verify it completed. [Outage behaviour](/resources/blog/offline-billing-pharmacy-internet-outage/) is rarely volunteered and is one of the highest-consequence differences between systems.

**Scenario 6 — month end.** Export the sales register split by rate and by B2B/B2C, with credit notes referencing originals and an HSN summary.

> If a vendor resists running your scenarios and steers back to the prepared demo, that resistance is itself the answer. The scenarios above are ordinary pharmacy operations, not edge cases.

## Step 3: the questions that reveal architecture

Feature answers are easy to give. These are harder to fake.

1. Is stock held **per batch** or per product? Show me the data model.
2. Is MRP held per batch or per product?
3. Does batch selection at billing use **earliest expiry** or receipt order?
4. How are **invoice numbers allocated** so two offline counters cannot collide?
5. What exactly stops working without internet?
6. Are **user logins individual**, and is every action attributable?
7. Can a past transaction be **deleted**, or only reversed?
8. How do I **export all my data**, and what does that cost?
9. When a GST rate changes, how do I **bulk update** by HSN?
10. What is your **release cadence**, and how did you handle the last regulatory change?

Question 7 matters more than it looks. A system that permits hard deletion of transactions cannot support a defensible compliance record.

## Step 4: cost over three years, not year one

Build the comparison on total cost including migration, training, hardware, support tier, and — critically — the manual work each option leaves you doing, costed at staff hours over 36 months. The [pricing guide](/resources/blog/pharmacy-billing-software-pricing-india/) sets out the full structure.

## Step 5: reference calls

Ask for two references: one similar in size to you, one that implemented in the last six months. Then ask:

- What went wrong during implementation, and how was it handled?
- How long until staff were back at normal speed?
- What do you still do manually that you expected the software to do?
- How responsive is support at 8pm?
- Knowing what you know now, what would you check more carefully?

The last question produces the most useful answer in the whole evaluation. People are candid about it in a way they are not about direct criticism.

## Step 6: read the contract for four things

**Data export.** Complete data, usable format, any time, no fee, no notice period. In writing.

**Price escalation.** What can the renewal price rise by, and with how much notice?

**Support scope.** Hours, response times, what counts as support versus chargeable work.

**Termination.** Notice required, what happens to your data, how long they retain it after you leave.

## The red flags

- Will not demonstrate on your data
- Cannot answer the batch-level questions clearly
- Quotes a price without asking your branch and counter count
- No named implementation owner
- Migration described as "we'll import your file" with no cleanup discussion
- Support that is a single mobile number belonging to one person
- Reluctance to put data export terms in the contract

## The green flags

- Asks about your operation before demonstrating anything
- Volunteers what the software does *not* do
- Has a written implementation plan with dates and owners
- Offers a reference of similar size without being pushed
- Discusses item master cleanup as real work rather than a formality
- Demonstrates the failure cases, not just the happy path

## How pharCare evaluates

[pharCare](/products/pharcare/) demos are run against a sample of your own data where you can provide it, including the awkward scenarios above — mixed-rate bills, loose strips, Schedule H1 capture, near-expiry returns, and the disconnection test. Pricing is scoped to your branch and counter count rather than quoted from a list, and migration scope is discussed as the work it actually is.

If you are running an evaluation, [book a demo](/contact/) and bring your one-page operation summary — it makes the hour far more useful for both sides.
