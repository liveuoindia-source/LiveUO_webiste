---json
{
  "title": "Moving from Excel to billing software: a migration plan",
  "description": "How to move customers, items, opening stock and outstanding balances from spreadsheets into billing software — cleanly, at the right time, and without losing history.",
  "category": "Setup",
  "service": "billing",
  "keywords": [
    "Excel to billing software",
    "billing data migration",
    "import customers and items",
    "opening balance billing software",
    "GST billing software"
  ],
  "faq": [
    {
      "q": "When is the best time to switch from Excel to billing software?",
      "a": "At the start of a month, quarter or financial year, so GST returns and reports aren't split across two systems mid-period."
    },
    {
      "q": "Should we import all our old invoices?",
      "a": "Usually not. Import masters, opening stock and outstanding balances. Keep old invoices in their original files for reference and compliance."
    },
    {
      "q": "How long does migration take?",
      "a": "For a small business, a few days of preparation and a day of import and checking. Cleaning messy spreadsheets is usually what takes longest."
    },
    {
      "q": "What if we find errors after going live?",
      "a": "Correct master data directly, and use proper documents — credit notes, journal entries — for transaction corrections rather than editing history."
    }
  ]
}
---
Spreadsheets carry many small businesses a surprisingly long way. Eventually they stop being enough: invoices take too long, stock never matches, GST returns need manual work, and only one person understands the sheet.

Moving to billing software is the fix. The move itself goes smoothly when it's planned.

## Choose the cut-over date

Pick the start of a month — ideally a quarter or financial year — so one period isn't split across two systems. Everything before the date stays in Excel; everything from that date is in the new software.

## What to migrate

| Data | Migrate? | Notes |
|---|---|---|
| Customers | Yes | Names, GSTIN, addresses, phone, credit terms |
| Suppliers | Yes | Names, GSTIN, addresses |
| Items | Yes | Names, HSN, tax rate, unit, price |
| Opening stock | Yes | Quantity, cost, batch/expiry if relevant |
| Outstanding receivables | Yes | Unpaid invoices by customer |
| Outstanding payables | Yes | Unpaid bills by supplier |
| Old invoices | Usually no | Keep files for reference |

## Clean before importing

Spreadsheets accumulate problems:

- the same customer entered several ways
- items with slightly different names
- missing GSTINs and HSN codes
- inconsistent units — "pcs", "nos", "pieces"
- old customers and items no longer used

Clean these first. Importing messy data just moves the mess.

## Use the import templates

Most billing software offers import templates for customers, items and stock. Copy cleaned data into the templates exactly as specified — column order, formats, date style. Import a small sample first and check it before importing everything.

## Opening balances

### Stock

Count physical stock on the cut-over date, not what the spreadsheet says. Enter quantity and cost, and batch and expiry where your products need them.

### Receivables and payables

Enter each unpaid invoice separately — number, date, amount — rather than one total per customer. You'll then be able to match payments to invoices and see ageing correctly.

## Check everything

Before the first live invoice:

- customer and item counts match your cleaned lists
- stock value matches your count
- total receivables and payables match your records
- tax rates and HSN codes are correct on a sample of items
- a test invoice prints correctly

## Go live

- start billing in the new software from the cut-over date
- stop updating the spreadsheet — two systems guarantee mismatches
- keep the old files read-only for reference

## The first month

- review daily sales and stock reports for anything odd
- fix master data as you find issues
- reconcile the first GST return data carefully

## Common mistakes

- switching mid-month
- importing uncleaned data
- one opening balance per customer instead of invoice-wise
- running Excel and software in parallel for too long
- skipping the physical stock count

A planned migration takes a few days of effort. It saves that time back within weeks — and gives you clean data to build on for years.

See also [choosing billing software for a small business](/resources/blog/choosing-billing-software-small-business/).
