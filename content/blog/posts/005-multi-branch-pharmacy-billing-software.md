---json
{
  "title": "Multi-branch pharmacy billing: what to look for in software",
  "description": "Running three pharmacies is not running one pharmacy three times. What changes in stock visibility, transfers, pricing control, permissions and reporting.",
  "category": "Multi-branch",
  "keywords": [
    "multi-branch pharmacy software",
    "pharmacy chain billing software India",
    "centralised pharmacy stock management",
    "branch stock transfer software",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Do all branches need to be online continuously?",
      "a": "Billing should continue during an internet outage and sync when the link returns. Insist on seeing that behaviour demonstrated — a system that stops billing when connectivity drops will cost you far more in lost counter time than it saves in architecture simplicity."
    },
    {
      "q": "Should pricing be controlled centrally or per branch?",
      "a": "Centrally, with a controlled exception. Head office should set MRP and discount slabs, with branch-level overrides either disabled or logged and reportable. Uncontrolled branch pricing is the most common source of margin leakage in small chains."
    },
    {
      "q": "How are stock transfers between branches handled correctly?",
      "a": "A transfer must move the batch record — batch number, expiry, purchase rate — not just a quantity. If a transfer flattens batch data, the receiving branch loses expiry visibility and FEFO stops working for that stock."
    },
    {
      "q": "Does pharCare support multiple branches on one dashboard?",
      "a": "Yes. Stock and billing data sync across branches in real time with a consolidated head-office view, batch-preserving inter-branch transfers, and role-based access so branch staff see only their own outlet."
    }
  ]
}
---
The second branch is where pharmacy software gets tested properly. Everything that was manageable by walking to the shelf — is there stock, what did we pay, why is that price different — becomes a question that can only be answered by the system. Software that was adequate for one counter often turns out to be a single-outlet product with a branch field bolted on.

Here is what actually changes, and what to insist on before you commit.

## 1. Stock visibility must be batch-level and cross-branch

The single most valuable capability in a multi-branch pharmacy is being able to ask: *where, across all my outlets, is this item — and in which batch?*

That question drives three daily decisions:

- Can I satisfy this customer from another branch instead of losing the sale?
- Should I transfer this short-dated stock rather than write it off?
- Am I about to order something I already have sitting in another outlet?

A consolidated stock figure per product is not enough. You need **quantity by batch by branch**, because expiry management and purchasing both depend on it. Chains that only see totals reliably end up buying stock they already own and writing off stock they could have moved. That is the same [expiry problem](/resources/blog/reduce-expired-stock-write-offs-pharmacy/) amplified by branch count.

## 2. Transfers must preserve the batch record

An inter-branch transfer is not a sale and it is not a fresh purchase. Done correctly it moves the batch — number, expiry, purchase rate, MRP — from one outlet's stock to another's, leaving an auditable trail on both sides.

Done incorrectly, it is entered as an outward adjustment at one branch and an inward entry at the other, at which point:

- expiry data is lost or re-keyed wrongly
- the receiving branch's margin calculation uses a made-up cost
- the two entries can disagree, and nothing catches it

> Ask a vendor to demonstrate a transfer, then check the receiving branch's batch list. If the expiry date did not arrive intact, that is a structural limitation, not a settings issue.

## 3. Pricing and discount control belongs at head office

Once you have branches, uncontrolled discounting at the counter becomes invisible margin loss. What you want:

- **MRP and rate masters set centrally** and pushed to branches
- **Discount slabs defined by role** — what a counter assistant can give versus a branch manager
- **Overrides logged** with user, amount and reason, and reportable
- **Scheme pricing** applied consistently, not re-entered per branch

The goal is not to prevent all discretion. It is to make discretion visible, so a monthly report shows you where it is being used and whether it is winning business or just leaking.

## 4. Permissions have to be real

Branch staff should see their own branch. Managers should see their branch plus its reports. Head office sees everything. Accounts sees financial data but not necessarily patient data.

This matters legally as well as commercially: patient information is personal data under the **DPDP Act, 2023**, and "everyone can see everything" is not a defensible position once you have staff across multiple locations.

Look for role-based access with per-branch scoping, not a single shared admin login — which is what small chains drift into by default, and which makes every audit trail meaningless.

## 5. Purchasing: centralised, branch-led, or both

Three models, and the software should support whichever you pick:

| Model | How it works | Best when |
|---|---|---|
| Central | Head office raises all POs, allocates to branches | Uniform assortment, strong distributor terms |
| Branch-led | Each branch orders, head office sees the totals | Very different local demand patterns |
| Hybrid | Central for top lines and schemes, branch for the tail | Most chains of 3–15 outlets |

The hybrid model is where most chains land, and it is the one that most demands consolidated purchase reporting — you need to see total group purchases per supplier to negotiate on them, even when the ordering was local.

## 6. Reporting that compares, not just totals

Consolidated totals are the easy part. What actually changes decisions is **comparison**:

- Sales and margin **per branch**, normalised by counter hours or footfall
- **Same item, different branches** — why does one outlet sell four times as much?
- Stock cover in days **per branch**, to find the outlet quietly overstocking
- Expiry exposure per branch, so the weakest process is visible
- Discount given as a percentage of sales, per branch and per user

## 7. Offline resilience

Branches lose connectivity. If billing stops when the link drops, you have converted an ISP problem into a revenue problem, and staff will start writing bills on paper — which then get entered wrongly, or not at all.

Insist on seeing the outage behaviour demonstrated: billing continues locally, and reconciles cleanly when the connection returns, with a visible sync status so a branch knows whether it is current.

## 8. Onboarding a new branch should take a day, not a month

If your chain is growing, the cost of opening branch six matters. Item master, pricing, tax setup and user roles should be **inherited from a template**, not rebuilt. Ask specifically: what does adding a branch involve, and who does it?

## How pharCare handles it

[pharCare](/products/pharcare/) syncs stock and billing across branches in real time to a single head-office dashboard, with batch-level visibility per outlet, transfers that carry the full batch record, centrally controlled pricing with logged overrides, and role-based access scoped per branch. Branch billing continues through a connectivity outage and reconciles on reconnect.

If you are running two or more outlets today, [book a demo](/contact/) and we will set it up against your actual branch structure rather than a generic sample.
