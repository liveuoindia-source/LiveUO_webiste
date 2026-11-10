---json
{
  "title": "User acceptance testing: how to check software before you go live",
  "description": "A practical guide to UAT for business software: who should test, writing test cases from real work, logging issues clearly, and deciding when it's ready.",
  "category": "Delivery",
  "service": "custom",
  "keywords": [
    "user acceptance testing",
    "UAT checklist",
    "software testing before go live",
    "acceptance criteria",
    "custom application development"
  ],
  "faq": [
    {
      "q": "Who should do user acceptance testing?",
      "a": "The people who will use the software every day, plus a manager who can decide on priorities. The developer's testers check that it works technically; UAT checks it works for your business."
    },
    {
      "q": "How long should UAT take?",
      "a": "It depends on the size of the system. For a typical business application, plan one to three weeks, including time for fixes and retesting."
    },
    {
      "q": "Should we test with real data?",
      "a": "Use realistic data — ideally a copy of real data with sensitive details protected. Real cases reveal problems that invented examples miss."
    },
    {
      "q": "What if we find many issues?",
      "a": "Classify them by severity. Fix critical issues before go-live; agree a plan for minor ones. Going live with known, minor issues is common and acceptable if they are documented."
    }
  ]
}
---
User acceptance testing — UAT — is the step where the business checks that the software does what it needs, before real work depends on it. It's often rushed: the developer is ready, the launch date is close, and testing becomes a quick click-through.

That's when problems that should have been caught in a test environment are discovered at the counter instead.

## What UAT is for

Developer testing checks the software works as built. UAT checks it works **for your business**:

- do the workflows match how people actually work?
- are the rules right?
- do the reports show the right numbers?
- can staff use it without confusion?

## Who should test

- **daily users** from each role — counter, accounts, operations, managers
- **one decision-maker** who can prioritise issues and sign off
- **someone who knows the exceptions** — the person everyone asks when something unusual happens

## Write test cases from real work

Base test cases on actual transactions from recent weeks:

| Test | Steps | Expected result |
|---|---|---|
| Normal sale | Create invoice for a regular customer | Correct rates, tax, total |
| Partial payment | Record payment less than invoice | Balance shown as outstanding |
| Credit limit | Bill a customer over limit | Warning or block |
| Return | Return part of an invoice | Credit note, stock updated |
| Month-end report | Run sales report for last month | Matches existing figures |

Include exceptions. The unusual cases are where most problems hide.

## Use realistic data

Test with data that resembles reality: real item names, real customers, real volumes. A copy of real data is ideal, with personal details protected where needed.

## Log issues clearly

For each issue, record:

- what you did, step by step
- what you expected
- what happened
- screenshot
- severity

Severity levels:

- **Critical** — blocks work or produces wrong financial results
- **Major** — work possible but with significant difficulty
- **Minor** — cosmetic or a small inconvenience
- **Change** — works as specified, but you want it different

Separating defects from change requests keeps the conversation fair.

## Retest fixes

Every fix needs retesting by the person who reported it — and a quick check that it didn't break something else.

## Reconcile numbers

If the new system replaces an old one, compare totals: sales, stock, outstanding balances. Differences must be explained before going live.

## Decide when it's ready

Agree criteria before UAT starts, for example:

- no open critical issues
- major issues fixed or with agreed workarounds
- reports reconciled
- users trained

Then sign off formally.

## Common mistakes

- testing only the main path
- testing by the project manager alone, not real users
- no realistic data
- treating change requests as bugs, or bugs as change requests
- skipping retesting

Good UAT turns launch day from a gamble into a formality. The time spent is small compared to fixing problems once the whole business depends on the software.

See also [scoping a first release](/resources/blog/mvp-scope-business-software/).
