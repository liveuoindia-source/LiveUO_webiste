---json
{
  "title": "Scoping a first release: what to build now and what can wait",
  "description": "How to cut a custom software project to a first release people will use — one core workflow, real users, and a clear list of what comes later.",
  "category": "Planning",
  "service": "custom",
  "keywords": [
    "MVP scope",
    "minimum viable product business software",
    "software first release",
    "custom software planning",
    "custom application development"
  ],
  "faq": [
    {
      "q": "What is a minimum viable product for internal business software?",
      "a": "The smallest version that lets real users complete one important workflow from start to finish, reliably. It is not a demo or prototype — it is used for real work."
    },
    {
      "q": "Won't users be disappointed by a smaller first release?",
      "a": "Usually less than by a late, buggy large release. Users accept a focused first version when it clearly makes their main task easier and they can see what comes next."
    },
    {
      "q": "How long should a first release take?",
      "a": "For many small and mid-sized business applications, a focused first release can be delivered in weeks to a few months. If the estimate is much longer, the scope is probably too big."
    },
    {
      "q": "What should definitely be in the first release?",
      "a": "The core workflow end to end, the data it needs, basic user roles, the one or two reports people check daily, and data backup. Everything else can usually wait."
    }
  ]
}
---
Most custom software projects start with a list of everything the business wants. That list is useful — and a dangerous thing to build all at once. Large first releases take longer, cost more, and are often wrong in ways nobody could predict until people used them.

A better approach is a focused first release: the smallest version that does one important job well, used by real people for real work.

## Start with the core workflow

Ask: **which single workflow, if it worked smoothly, would make the biggest difference?**

For a distributor, it might be order to invoice. For a service business, enquiry to job completion. For a clinic, appointment to bill. Pick one, and make sure the first release covers it completely — no step left to a spreadsheet.

## The first-release test

For each feature on the wish list, ask:

1. Can users complete the core workflow without it?
2. Is there a simple manual workaround for the first few months?
3. Does it matter to most users, or a few?
4. Is it needed for compliance or data safety?

If the answer to 1 and 2 is yes, and 4 is no, it can probably wait.

## What typically belongs in release one

- the core workflow, end to end
- master data it depends on — customers, products, price lists
- basic roles and permissions
- the one or two reports people check daily
- import of existing data
- backups and basic audit history

## What can usually wait

- advanced reports and dashboards
- rarely used exceptions with manual workarounds
- integrations that can be bridged with an export for now
- mobile apps, if a mobile-friendly web version covers the need
- automation of edge cases
- custom themes and visual polish beyond clear and usable

## Write the "later" list down

A first release only works if people trust that the rest is coming. Keep a visible, prioritised list of what's planned next. When someone asks for a feature, it goes on the list with a reason — not into the current release.

## Involve real users early

Choose a few people who'll use the system daily, and involve them from the start:

- walk through screens with them before development
- show working software every couple of weeks
- let them test with real data before launch

They will find the exceptions your requirements missed, while changes are still cheap.

## Plan the rollout

- **Pilot first.** One branch, one team, or one product line.
- **Run in parallel briefly** if the risk is high, then switch fully — long parallel runs exhaust everyone.
- **Support closely** for the first weeks: someone available to answer questions and fix small problems fast.
- **Collect feedback** in one place, and review it weekly.

## Use the first release to plan the second

After a month of real use, you'll know:

- which features people actually asked for
- which workarounds are painful and which are fine
- which reports matter
- where the system is slow or confusing

That evidence is far better than the original wish list for deciding what to build next.

## Signs your scope is too big

- the estimate runs to many months for a small team
- nobody can describe the core workflow in a few sentences
- every department has "must-have" features
- the plan has no pilot

Cutting scope feels like losing something. In practice, it's how projects stay on budget, launch on time, and end up with software people actually use.

See also [build vs buy](/resources/blog/build-vs-buy-business-software/) and [fixed price vs time and material](/resources/blog/fixed-price-vs-time-and-material/).
