---json
{
  "title": "Training pharmacy staff on new billing software without losing a week",
  "description": "Most software rollouts fail at the counter, not in the data. A training approach built around the twenty actions staff actually perform, with a realistic first-week plan.",
  "category": "Migration",
  "keywords": [
    "pharmacy software training",
    "pharmacy staff onboarding billing system",
    "pharmacy software rollout",
    "counter staff training pharmacy",
    "pharCare"
  ],
  "faq": [
    {
      "q": "How long does it take to train pharmacy counter staff on new software?",
      "a": "For core billing, most counter staff are competent within two or three shifts if training focuses on the specific actions they perform rather than a full feature tour. Confidence — working at their old speed — usually takes two to three weeks."
    },
    {
      "q": "Should everyone be trained on everything?",
      "a": "No. Train by role. Counter staff need billing, returns and lookups. The person on goods receipt needs purchase entry and batch capture. The owner needs reports. A single all-hands session covering everything teaches nobody anything."
    },
    {
      "q": "What is the most common reason a software rollout fails at the counter?",
      "a": "Speed. Staff can complete every task but each one takes longer than before, so during a rush they revert to workarounds. Almost always the fix is keyboard shortcuts and screen defaults, not more training."
    },
    {
      "q": "Does pharCare include training?",
      "a": "Yes. Onboarding includes role-based training sessions and a supported first week at the counter, because the first week is when habits form and when problems are cheapest to fix."
    }
  ]
}
---
Software rollouts in pharmacies rarely fail because the software cannot do the job. They fail at 6pm on a Saturday, when there are nine people waiting, the new system takes four seconds longer per bill, and someone decides to write it on paper and enter it later. Everything downstream — stock accuracy, compliance records, the month's reporting — degrades from that moment.

Training is the control for this, and most of it is done wrong: a two-hour session covering every feature, delivered a week before go-live, to everybody at once.

## Train the twenty actions, not the software

A counter assistant performs roughly twenty distinct actions, over and over. List them for your own shop; it will look something like:

1. Find an item by name
2. Find an item by short code
3. Scan an item
4. Change quantity
5. Sell a loose strip rather than a pack
6. Apply a discount
7. Add a customer to the bill
8. Capture prescriber and patient for a Schedule H1 item
9. Take cash and give change
10. Take card or UPI
11. Split payment across two methods
12. Put a bill on hold and start another
13. Recall a held bill
14. Cancel a line
15. Cancel a whole bill
16. Process a customer return
17. Reprint a bill
18. Check stock of an item not on the bill
19. Check price without billing
20. Close and reconcile the till

That list is the entire training curriculum for that role. Anything else can be learned later or asked about. A trainer who covers reporting, purchase entry and user administration with counter staff is spending goodwill on material those people will never use.

## Train by role, in short sessions

| Role | Needs | Session |
|---|---|---|
| Counter staff | The twenty actions | 60 min, hands-on, plus a practice shift |
| Goods receipt | Purchase entry, batch and expiry capture, order matching | 60 min |
| Pharmacist in charge | Compliance capture, registers, controlled substances | 45 min |
| Owner / manager | Reports, pricing control, user administration | 45 min |

Short and specific beats long and comprehensive. Two focused hours across two sessions retains far more than one four-hour session.

## Hands on keys, on real data

Nobody learns billing software by watching a demonstration. The session should be: trainer does it once, then each person does it themselves, three times, on a training environment with **your own item master** in it.

Practising on sample data with unfamiliar product names adds a layer of difficulty that has nothing to do with the software. Practising on your own stock means the muscle memory built is the muscle memory needed.

## Speed is the real acceptance criterion

Being able to complete a bill is not the bar. Completing it **at counter pace** is.

Before go-live, time it. Take a representative five-item bill with a card payment and a Schedule H1 line, and have each counter person do it. Compare against the old system.

If the new system is significantly slower, do not train harder — **fix the configuration**:

- **Keyboard shortcuts** for the top five actions, and make sure staff know them. Most counter speed lives here.
- **Default the common case** — the usual payment method, the usual quantity, the cursor landing in the search field.
- **Reduce keystrokes** on mandatory fields by recalling repeat customers and prescribers rather than re-typing.
- **Short codes** on the item master for the two hundred fastest-moving lines.

> A rollout that is 30% slower per bill will be abandoned during the first rush, regardless of how good the training was. Speed is not a nice-to-have to be optimised later; it is the acceptance criterion.

## The first week, planned

**Days −7 to −1: parallel running.** Bill in both systems for a few days. Tedious, and it is what surfaces the problems while the old system is still there to fall back on. This should overlap with the data checks in your [migration plan](/resources/blog/marg-erp-to-pharcare-migration-checklist/).

**Day 1: over-staff.** One extra person on the floor whose only job is to help. Not billing — helping.

**Days 1–3: a visible cheat sheet.** One page, laminated, at each counter, listing the shortcuts for the top actions. It will be used constantly for a week and ignored after that, which is exactly right.

**Day 3: a fifteen-minute huddle.** What is slow, what is confusing, what workaround has someone invented. Workarounds invented in week one become permanent if not caught.

**Day 7: review the overrides.** Price overrides, cancelled bills, manual batch selections. Spikes indicate a misunderstanding or a configuration gap, and both are cheap to fix now.

**Week 3: a short follow-up session.** Now that basics are automatic, teach the shortcuts and the second-tier functions. Retention at this point is much higher than it was pre-go-live.

## Plan for turnover

Pharmacy counter staff turn over. If training exists only in the heads of the people who attended the sessions, you will be paying for training repeatedly.

Build, once:

- A **one-page cheat sheet** per role
- A short **screen recording** of the twenty actions
- A **training environment** a new hire can practise in without touching live data
- A named **internal champion** who is the first line of questions

That is a few hours of work, and it is the difference between onboarding a new hire in a day and doing it in a week.

## The signals that training has landed

- Bills per hour back at pre-migration levels within two to three weeks
- Price overrides and cancellations back to baseline
- Compliance fields being captured without prompting
- Help requests dropping to near zero by week three
- No handwritten bills

The last one is binary and it is the one to watch. A single handwritten bill in week two is a symptom worth investigating the same day.

## How pharCare approaches it

[pharCare](/products/pharcare/) onboarding is role-based rather than a single all-hands session, run against your own migrated item master, with the first week supported at the counter — because that is when habits form and when a workaround becomes permanent. Keyboard shortcuts and screen defaults are configured to your workflow before go-live rather than left at defaults, and a training environment stays available for new hires.

To plan a rollout around your shift pattern, [book a demo](/contact/).
