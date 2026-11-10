---json
{
  "title": "Day-end cash reconciliation: a pharmacy closing routine that works",
  "description": "A ten-minute counter-closing routine that matches cash, UPI, card and credit against the system, so a shortage is found the same night and not at month-end.",
  "category": "Operations",
  "service": "pharcare",
  "keywords": [
    "pharmacy cash reconciliation",
    "day end closing pharmacy",
    "pharmacy cash shortage",
    "UPI reconciliation retail",
    "pharCare"
  ],
  "faq": [
    {
      "q": "How often should a pharmacy reconcile cash?",
      "a": "At every shift change and at day-end. A gap found the same evening can usually be traced to a specific bill or refund; a gap found at month-end usually cannot."
    },
    {
      "q": "Why does UPI need reconciling if the money goes straight to the bank?",
      "a": "Because the bill and the payment are recorded separately. A bill marked UPI with no matching credit — or a credit with no bill — is exactly the kind of error that disappears if nobody checks daily."
    },
    {
      "q": "What is an acceptable cash difference?",
      "a": "Set a small tolerance for coin rounding, and treat anything above it as a reason to look, not to write off. A recurring small shortage on one counter is more important than a one-off larger one."
    },
    {
      "q": "Can pharCare produce a day-end summary automatically?",
      "a": "Yes. The day-end report splits sales by payment mode and by counter user, and lists refunds and cancelled bills, so the count is compared against one sheet instead of several."
    }
  ]
}
---
A pharmacy can do everything right at the counter all day and still lose money at closing time. Not through theft, usually — through a refund that was given in cash but recorded as UPI, a bill cancelled after the customer had already paid, or a credit sale keyed in as cash. Each is small. Together, and found three weeks later, they are impossible to explain.

The fix is a short, boring routine done the same way every night. Here is one that works.

## Why pharmacies drift out of balance

Most counters now take four kinds of payment: cash, UPI, cards, and credit for regular customers. Each has its own way of going wrong.

- **Cash** goes wrong at the drawer: wrong change, notes slipped in the wrong compartment, petty expenses paid out without a slip.
- **UPI** goes wrong in the record: the customer pays, but the bill is saved as cash, or a payment fails and the bill is saved anyway.
- **Cards** go wrong at the terminal: a transaction declined after the bill was printed, or settled into a different day's batch.
- **Credit** goes wrong at the ledger: a sale recorded as cash when it should have been posted to the customer's account.

None of these show up in total sales. Total sales will look correct. They only show up when each payment mode is compared with where the money actually landed.

## The ten-minute closing routine

### 1. Freeze the counter

Stop billing on the counter being closed. If the pharmacy stays open, switch remaining sales to another counter or user. Reconciling while new bills arrive is how numbers stop matching for reasons nobody can find.

### 2. Print the day-end summary from the system

You need one sheet showing, for this counter and user:

- sales by payment mode (cash, UPI, card, credit)
- refunds and returns, with their mode
- cancelled or voided bills
- cash paid out (petty expenses) if recorded in the system

### 3. Count the drawer

Count the cash, subtract the opening float, and subtract documented payouts. Write the number down before looking at what the system expects. Counting towards a target number is how errors get rounded away.

### 4. Match UPI and card against the source

Open the UPI merchant app or the bank statement for the day and total the credits. Do the same with the card terminal's settlement report. Both should equal the system's figure for that mode.

### 5. Check the exceptions

Look at three lists only: refunds, cancellations, and bills edited after printing. These are where nearly every gap starts. A cancelled bill with no customer signature or note deserves a question the same evening.

### 6. Record the difference and the reason

Write the variance per mode — even if it is zero — with a one-line reason for anything outside your tolerance. Over a month this log tells you whether you have a person problem, a process problem, or a terminal problem.

## A sample closing sheet

| Mode | System | Actual | Difference | Note |
|---|---|---|---|---|
| Cash | 18,450 | 18,300 | −150 | Change error, bill 4412 |
| UPI | 22,780 | 22,780 | 0 | |
| Card | 9,100 | 8,650 | −450 | Declined after print, bill 4398 |
| Credit | 3,200 | 3,200 | 0 | Posted to ledgers |

The card line is the useful one. A declined card transaction that still produced a printed bill means the customer left with medicines that were not paid for. That is recoverable the next day if you know the bill number — and not if you find it at month-end.

## Rules that keep the routine honest

**One user per counter.** If three people share one login, a shortage belongs to nobody. Separate logins cost nothing and make every number traceable.

**Refunds need a reason.** The system should not accept a refund without a reason and the original bill number. A refund linked to a bill can be checked; a free-floating one cannot.

**Cancellations need approval.** Allow the counter to cancel only before payment is taken. After payment, a supervisor should approve. It is a small friction that removes the most common route to an unexplained shortage.

**The float is fixed.** Start each day with the same float amount in the same denominations. A changing float makes every count harder.

**Petty cash goes through the system.** Tea, courier charges and auto fare taken from the drawer should be entered as payouts, with a slip. Otherwise every evening starts with a known gap that hides unknown ones.

## What to do with a persistent gap

A one-off difference of a few hundred rupees with a clear note is normal. A pattern is not. If the same counter, the same shift or the same user is short three times in a fortnight, look at:

- refunds processed by that user
- cancellations after printing
- bills where the payment mode was changed after saving

The audit trail in the billing system should show who changed what and when. If it doesn't, that is the first thing to fix, because without it the conversation becomes one person's word against another's.

## Make the routine stick

The routine fails when it depends on someone remembering. Put it on the closing checklist, give it a fixed time, and have the owner or manager review the variance log weekly — not every line, just the totals and anything with a note. Staff who know someone reads the log close more carefully.

A pharmacy's margin is thin enough that small, invisible leaks matter. Ten minutes at closing time is the cheapest control you have, and the only one that catches problems while they can still be explained.

For more on what the weekly review should cover, see [the ten numbers a pharmacy owner should see every week](/resources/blog/pharmacy-owner-kpi-dashboard/).
