---json
{
  "title": "GST invoice numbering rules, and how to set up series that work",
  "description": "What the GST rules require of invoice numbers, how to structure series for branches, counters and document types, and the mistakes that cause trouble later.",
  "category": "GST & Tax",
  "service": "billing",
  "keywords": [
    "GST invoice number format",
    "invoice numbering rules India",
    "invoice series GST",
    "financial year invoice number",
    "GST billing software"
  ],
  "faq": [
    {
      "q": "What does GST require of an invoice number?",
      "a": "A consecutive serial number, unique for the financial year, up to 16 characters, using letters, numbers, hyphens or slashes. It can have one or more series."
    },
    {
      "q": "Can I use different series for different branches?",
      "a": "Yes. Many businesses use a separate series per branch, counter or document type, as long as each number is unique within the financial year for that registration."
    },
    {
      "q": "Do invoice numbers need to restart every financial year?",
      "a": "They must be unique within the financial year. Most businesses include the year in the prefix, such as 2627, so numbers restart cleanly without duplicating last year's."
    },
    {
      "q": "What should I do with a cancelled invoice?",
      "a": "Keep the number in the series and mark the invoice as cancelled rather than deleting it or reusing the number, so the series remains consecutive and auditable."
    }
  ]
}
---
Invoice numbers look like a formality until someone has to explain a gap, a duplicate, or why two branches issued "INV-1045" on the same day. Under GST, invoice numbering has clear rules, and getting the structure right at the start saves effort every year after.

## What the rules require

For tax invoices, the number must be:

- **consecutive** within its series
- **unique** for the financial year
- **no more than 16 characters**
- made of letters, numbers, hyphens (-) and slashes (/)

You may use **more than one series**. Credit notes, debit notes and bills of supply each need their own numbers as well.

Invoice numbers are also reported in GST returns and, for e-invoicing businesses, validated by the invoice registration portal — duplicates there cause rejections.

## Designing a series

A practical format combines a few elements:

**[document type][branch or counter][year]/[number]**

Examples:

| Purpose | Example | Length |
|---|---|---|
| Tax invoice, main branch | `TI-MB2627/00145` | 15 |
| Tax invoice, counter 2 | `TIC2-2627/0089` | 14 |
| Credit note | `CN-2627/00012` | 13 |
| Bill of supply | `BS-2627/00031` | 13 |

Count characters before you settle on a format. Long prefixes plus large numbers can exceed 16 characters later in the year.

### Include the financial year

Including the year — such as `2627` for 2026-27 — lets numbers restart at 1 each April without colliding with last year's.

### Separate series by branch or counter

If several counters or branches bill at the same time, a shared series needs a central system that hands out numbers one at a time. Separate series per counter or branch avoid conflicts, especially when a location works offline.

## Mistakes that cause trouble

- **Deleting invoices.** A deleted invoice leaves a gap. Cancel instead, and keep it on record.
- **Reusing numbers** after cancellation.
- **Manual numbering** in a spreadsheet or invoice book alongside the software.
- **Changing format mid-year** without a clean break and a note of the change.
- **Duplicates across branches** sharing one series without central control.
- **Exceeding 16 characters** as numbers grow.

## How billing software should handle numbering

- generate numbers automatically, never typed by hand
- support multiple series by branch, counter and document type
- reset by financial year using a format you define
- block duplicates within a year
- keep cancelled invoices in the series, marked cancelled
- record who created and who cancelled each invoice
- handle offline billing with a separate series per device, so numbers never clash when they sync

## Year-end checklist

Before 1 April:

1. Confirm the new year's prefix in each series.
2. Make sure the software resets numbers on the right date.
3. Close or archive last year's series.
4. Check no counter is still using an old series after the change.

## Explaining gaps

If a gap appears, you should be able to explain it from the system: an invoice cancelled, a voided draft, a series changed. Software that keeps every number — including cancelled ones — makes that easy. Software that lets users delete invoices makes it impossible.

Invoice numbering is a small design decision with long consequences. Set the structure once, let the software enforce it, and it becomes something nobody has to think about.
