---json
{
  "title": "Schedule H, H1 and H1X: what pharmacy software must track",
  "description": "Schedule H, H1 and H1X carry different record-keeping duties. Exactly what your pharmacy billing software must capture at the counter, and for how long.",
  "category": "Compliance",
  "keywords": [
    "Schedule H1 register software",
    "Schedule H compliance pharmacy software",
    "pharmacy billing software India",
    "drug schedule record keeping",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Is a digital Schedule H1 register acceptable to a drug inspector?",
      "a": "A digital register is widely accepted provided it captures every prescribed field, cannot be silently edited, and can be produced on demand — usually as a printed, signed extract. Because inspector practice varies by state, most pharmacies keep the software as the system of record and print a periodic hard copy that the registered pharmacist signs."
    },
    {
      "q": "How long must Schedule H1 records be retained?",
      "a": "The Schedule H1 register must be maintained for three years and be open to inspection. Schedule X records are retained for two years, and the prescription copy itself must also be kept."
    },
    {
      "q": "What happens if a Schedule H1 drug is billed without prescriber details?",
      "a": "The sale is non-compliant. The practical risk is a deficiency noted during inspection, which can escalate to licence action for repeat findings. Software that makes prescriber capture mandatory at the point of sale removes the possibility of the field being skipped during a busy counter hour."
    },
    {
      "q": "Does pharCare handle Schedule H, H1 and H1X separately?",
      "a": "Yes. Each item carries its schedule classification in the product master, and pharCare enforces the record-keeping rules that apply to that specific schedule at the point of sale, then generates the register in the inspection-ready format."
    }
  ]
}
---
Under the Drugs and Cosmetics Rules, 1945, a retail pharmacy in India must record prescription-only sales — but the depth of record required is not the same for every drug. Schedule H needs a valid prescription and a sales record. Schedule H1 needs a **separate, bound register** capturing the prescriber, the patient, the drug, the quantity and the date, retained for three years. Schedule X is stricter still. Billing software that treats all three the same is not compliant software; it is billing software with a compliance-shaped gap.

This guide sets out what each schedule actually demands, and what that translates into as a software requirement.

## The three schedules, and what separates them

**Schedule H** covers the broad body of prescription-only medicines — most antibiotics, cardiac drugs, hormones and sedatives. The obligation is that the drug is dispensed only against a valid prescription from a registered medical practitioner, and that the sale is recorded in the pharmacy's records.

**Schedule H1** is a narrower list, introduced in 2013 to slow antimicrobial resistance and misuse. It covers third- and fourth-generation antibiotics, certain anti-TB drugs, and some habit-forming psychotropics. Schedule H1 adds a specific duty: a **separate register** distinct from ordinary sales records.

**Schedule X** covers a short list of psychotropic substances with high abuse potential. It requires a duplicate copy of the prescription to be retained, separate storage under lock, and separate purchase and sale records.

The label "H1X" that circulates informally in the trade is shorthand for stock that falls under both the H1 register duty and the tighter Schedule X handling rules. It is not a separate legal schedule — but it is a useful operational category, because those items need every control at once.

## What the Schedule H1 register must contain

For every Schedule H1 sale, the register must show:

- The **date of supply**
- The **name and address of the prescriber**
- The **name of the patient**
- The **name of the drug** and the quantity supplied

The register is retained for **three years** and must be open to inspection. A drug inspector can ask for it without notice.

> Two failure modes cause almost every H1 deficiency found on inspection: a field left blank because the counter was busy, and a register that cannot be reconciled against the actual stock movement. Both are software problems before they are staff problems.

## Translating the rules into software requirements

A billing system genuinely built for Indian pharmacy compliance needs six things.

### 1. Schedule classification on the item master

Every product record carries its schedule — H, H1, X, or none. This has to be a field on the drug, not a habit in someone's head. Staff turnover is the enemy of memorised compliance.

### 2. Enforcement at the point of sale, not after it

When an H1 item is scanned, the bill should refuse to close until prescriber name, prescriber address and patient name are captured. A warning that can be dismissed will be dismissed. A hard stop is the only control that survives a queue of twelve people.

### 3. A register that generates itself

The register should be a **view of the transaction data**, not a second thing someone types up on Saturday. If the register is re-keyed, it will disagree with the bills, and that disagreement is exactly what an inspection surfaces.

### 4. An audit trail on edits

If a bill is amended or cancelled after the fact, the change must be visible — who changed it, when, and what it was before. A register that can be silently rewritten is worth very little as evidence of compliance.

### 5. Prescriber and patient reuse

Regular patients and local prescribers recur constantly. Storing them once and recalling them by a few keystrokes is what makes mandatory capture survivable at the counter. Compliance that costs forty seconds per bill gets worked around.

### 6. Inspection-ready output

A dated range, printed in the prescribed column order, ready for the registered pharmacist to sign. Being able to produce that in under a minute changes the character of an inspection.

## The retention question

| Schedule | Record required | Retention |
|---|---|---|
| H | Prescription-backed sale recorded in pharmacy records | As per general record rules |
| H1 | Separate register: date, prescriber, patient, drug, quantity | 3 years |
| X | Duplicate prescription retained; separate purchase/sale records; locked storage | 2 years |

Retention is where paper registers quietly fail. Three years of bound registers is a physical storage problem, and water damage, fading thermal ink and misfiling are all real. A digital register with a verifiable backup removes an entire category of risk — provided the backup is actually tested, which is a separate discipline worth its own review.

## How pharCare implements this

[pharCare](/products/pharcare/) carries the schedule classification on every item in the drug master and applies the matching rule set at billing time. Scanning an H1 product makes prescriber and patient capture mandatory before the invoice can be saved; the Schedule H1 register is then generated directly from those saved transactions, for any date range, in the column order an inspector expects. Amendments are versioned rather than overwritten, so the audit trail stays intact.

Because the register is derived from billing data rather than maintained alongside it, the two cannot drift apart — which is the single most common reason a well-run pharmacy still fails an inspection.

## A closing caution

Drug schedules are revised. Items move onto Schedule H1, and the list has expanded more than once since 2013. Treat your item master as something that needs periodic review against the current schedule lists published by CDSCO, not as a one-time setup task. Software can enforce the rule you configured; it cannot know that the rule changed.

If you want to see the H1 register generated against your own product list, [book a demo](/contact/) and bring a sample of your current stock file.
