---json
{
  "title": "How to write a software requirements document that works",
  "description": "A practical structure for a requirements document — users, workflows, rules, reports and integrations — for accurate quotes and fewer surprises.",
  "category": "Planning",
  "service": "custom",
  "keywords": [
    "software requirements document",
    "how to write software requirements",
    "custom software scope",
    "SRS template",
    "custom software development India"
  ],
  "faq": [
    {
      "q": "Do I need a technical background to write requirements?",
      "a": "No. Good requirements describe what the business needs and how people work. The development team turns that into a technical design."
    },
    {
      "q": "How long should a requirements document be?",
      "a": "Long enough to cover every workflow, rule and report, and no longer. For a small business application that is often 10 to 25 pages, with screenshots or sketches where they help."
    },
    {
      "q": "What if requirements change after development starts?",
      "a": "They usually do. Agree a change process up front: each change is written down, estimated, and approved before it is built, so cost and timeline stay visible."
    },
    {
      "q": "Can the development partner help write the requirements?",
      "a": "Yes. A paid discovery phase, where the developer interviews your team and writes the scope with you, often produces a better document than either side would alone."
    }
  ]
}
---
The most expensive line in a custom software project is often "we assumed". The client assumed the system would handle partial payments. The developer assumed it wouldn't. Neither wrote it down, and the gap appears in week ten.

A clear requirements document doesn't need technical language. It needs to describe your business precisely enough that someone outside it could build the right thing.

## Start with the problem, not the features

Open with a short section answering:

- What problem are we solving?
- What happens today, and what goes wrong?
- What will be different once the software is live?
- How will we measure success?

"Reduce order processing from two days to same-day" is a better goal than "build an order management system". It helps the developer make sensible choices when the document is silent.

## Describe the users

List every type of person who will use the system, and what each needs to do:

| Role | Main tasks | Access |
|---|---|---|
| Sales executive | Create quotes, track follow-ups | Own customers only |
| Branch manager | Approve discounts, view branch reports | Their branch |
| Accounts | Raise invoices, record payments | All branches |
| Owner | Dashboards, all reports | Everything |

Roles drive permissions, menus and reports. Missing a role is one of the most common causes of late changes.

## Walk through the workflows

For each main process, describe the steps in order, as they happen in real life:

1. Customer enquiry arrives by phone, email or website.
2. Sales executive creates a quote with items, rates and validity.
3. Discounts above 10% need manager approval.
4. Customer accepts; quote becomes an order.
5. Order is dispatched in one or more deliveries.
6. Invoice is raised per delivery.

Then add the exceptions: what if the customer changes the order after approval? What if stock is short? What if the payment is partial? **Exceptions are where most of the cost lies**, so spend time on them.

## Write the business rules

Rules are the "always" and "never" of your business:

- Credit customers can't place orders if overdue beyond 45 days.
- Prices come from the customer's price list, falling back to the standard list.
- Invoice numbers restart each financial year.

Write each as a single, testable sentence. If the team argues about a rule while writing it, you've found something the software would otherwise get wrong.

## List the data

What information does the system hold? Customers, products, price lists, orders, invoices, payments. For each, list the key fields and which are mandatory. Note where data comes from today — a spreadsheet, another system — because it will need migrating.

## Define reports and notifications

List every report by name, with its filters, columns and who uses it. Do the same for alerts: who is notified, about what, and how (email, SMS, WhatsApp, in-app).

Reports are often left to the end and then turn out to be the main reason the owner wanted the system.

## Integrations

List every system the new software must talk to — accounting, payment gateway, e-commerce store, WhatsApp, courier, biometric devices — and what moves in each direction. Note whether the other system offers an API and who controls it.

## Non-functional requirements

These describe how well the system must work:

- number of users at the same time
- devices and browsers it must support
- offline needs, if any
- response time expectations
- data retention and backups
- security and privacy requirements, including any personal data handled

## Priorities: must, should, could

Mark every requirement as **must have** for launch, **should have** soon after, or **could have** later. This lets the developer quote a first release you can afford and a roadmap for the rest.

## Attach examples

Include samples of the documents you use today: invoices, reports, spreadsheets, forms. Sketch key screens on paper if it helps. One real example is worth a page of description.

## Agree how changes will work

Requirements will change. Agree up front that every change is written, estimated and approved before work begins. It protects both sides and keeps the budget visible.

A good requirements document doesn't guarantee a good project, but a poor one almost guarantees a difficult one. Time spent here is the cheapest time in the whole project.
