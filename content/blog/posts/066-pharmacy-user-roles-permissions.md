---json
{
  "title": "User roles in pharmacy software: who should be allowed to do what",
  "description": "A practical permission setup for pharmacies — counter staff, pharmacist, purchase, manager, owner — that prevents misuse without slowing the counter.",
  "category": "Operations",
  "service": "pharcare",
  "keywords": [
    "pharmacy software user roles",
    "pharmacy staff permissions",
    "billing software access control",
    "pharmacy audit trail",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Why shouldn't pharmacy staff share one login?",
      "a": "Shared logins make it impossible to know who created, edited or cancelled a bill, which turns every discrepancy into guesswork. Individual logins cost nothing and make every action traceable."
    },
    {
      "q": "Who should be able to cancel a bill?",
      "a": "Counter staff can cancel a bill before payment. After payment, cancellation should need a supervisor or pharmacist, with a reason recorded."
    },
    {
      "q": "Should counter staff see purchase rates and margins?",
      "a": "Usually not. Counter staff need MRP, stock and substitutes; purchase rates and margins belong to purchase staff, managers and owners."
    },
    {
      "q": "Does pharCare keep an audit trail?",
      "a": "Yes. pharCare records who created, edited or cancelled bills, purchases and stock adjustments, with date and time, and permissions can be set per role."
    }
  ]
}
---
In many pharmacies, everyone uses the same login. It's convenient — until a bill is cancelled after payment, a discount looks wrong, or stock is adjusted without explanation. Then nobody knows who did it, and the conversation becomes uncomfortable for everyone, including the honest staff.

Roles and permissions aren't about distrust. They make every action traceable and protect staff as much as the business.

## Start with individual logins

Every person who uses the system gets their own login, with a password they don't share. That alone transforms accountability: every bill, edit and cancellation carries a name.

## A typical role setup

| Role | Can do | Can't do |
|---|---|---|
| Counter staff | Create bills, take payments, check stock, search substitutes | See purchase rates, cancel paid bills, change prices, adjust stock |
| Pharmacist | Everything counter staff can, plus approve scheduled-drug sales, cancel bills with reason, record prescriptions | Change masters or margins |
| Purchase staff | Purchase entry, supplier returns, purchase orders | Cancel sales, adjust stock without approval |
| Manager | Approve discounts, cancellations, stock adjustments; view reports | Delete audit history |
| Owner | Everything, including user and permission management | — |

Adjust to your pharmacy, but keep the principle: each role gets what it needs to do the job, and no more.

## Permissions that matter most

### Discounts

Set a maximum discount the counter can give. Anything above needs a manager's approval in the system. Unchecked discounting is one of the biggest silent margin leaks.

### Cancellations and edits

- before payment: counter can cancel
- after payment: supervisor or pharmacist, with a reason
- edits to saved bills: restricted, and always logged

### Price and master changes

Changing MRP, selling price, tax rate or item details should be limited to a small number of people. A wrong tax rate on an item master affects every future bill.

### Stock adjustments

Adjustments for breakage, expiry or audit differences should need a reason and approval. Free-form adjustments are where stock losses hide.

### Reports

Margin, purchase rate and profit reports belong to managers and owners. Counter staff rarely need them.

## The audit trail

Permissions limit what people can do; the audit trail records what they did. A good system logs:

- who created, edited or cancelled each bill
- changes to rates, prices and masters
- stock adjustments with reasons
- logins, including time and device

Review exceptions weekly — cancellations after payment, large discounts, adjustments — and the log becomes a deterrent as much as a record.

## Keep the counter fast

Permissions shouldn't slow down a normal sale. Design approvals for exceptions only: a manager PIN for a large discount, a reason for a cancellation. Ordinary billing should need no extra steps.

## When staff leave

Disable their login the same day. Shared passwords that ex-employees still know are a real risk, especially with cloud access.

## Set it up once, review twice a year

Roles drift as staff change jobs or someone is given "temporary" access that's never removed. Review users and permissions every six months.

Clear roles make a pharmacy easier to manage. When something goes wrong, you'll know exactly where to look — and honest staff will never be under suspicion for someone else's mistake.

For the counter-closing side of the same controls, see [day-end cash reconciliation](/resources/blog/pharmacy-day-end-cash-reconciliation/).
