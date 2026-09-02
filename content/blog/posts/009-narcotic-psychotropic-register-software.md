---json
{
  "title": "Schedule X and narcotic registers: controlled-substance records",
  "description": "Duplicate prescriptions, locked storage, separate records and zero tolerance for variance. What controlled-substance record-keeping demands of your software.",
  "category": "Compliance",
  "keywords": [
    "Schedule X register software",
    "narcotic register pharmacy",
    "controlled substance records India",
    "NDPS compliance pharmacy",
    "pharCare"
  ],
  "faq": [
    {
      "q": "How is Schedule X different from Schedule H1?",
      "a": "Schedule H1 requires a separate register of supply retained for three years. Schedule X goes further: the prescription is issued in duplicate with one copy retained by the pharmacy for two years, stock must be stored under lock and key, and separate purchase and sale records are maintained."
    },
    {
      "q": "Can Schedule X records be kept digitally?",
      "a": "Practice varies by state and inspectors commonly expect to see physical records alongside the retained prescription copies. The workable approach is to treat the software as the operational system of record — enforcing capture and reconciliation — while producing signed printed registers for the physical file."
    },
    {
      "q": "What happens if a Schedule X stock count does not reconcile?",
      "a": "Unlike ordinary stock variance, this is not something to adjust away. Discrepancies in controlled substances need immediate investigation and escalation, with the discrepancy and the investigation both documented. Silent adjustment is the finding an inspector is looking for."
    },
    {
      "q": "Does pharCare handle Schedule X separately from other schedules?",
      "a": "Yes. Schedule X items carry their own classification, enforce duplicate-prescription capture and dispensing controls at the point of sale, maintain separate purchase and sale records, and reconcile against a dedicated stock position."
    }
  ]
}
---
Controlled-substance record-keeping is the part of pharmacy compliance where the consequences of getting it wrong are not commercial. Schedule X drugs under the Drugs and Cosmetics Rules, and substances covered by the **NDPS Act, 1985**, carry obligations that go beyond a register entry — restricted storage, retained prescriptions, separate records, and a reconciliation standard that admits no rounding.

This is what the obligations are in practice, and what software has to do to support them rather than get in the way.

## What Schedule X actually requires

Four things that distinguish it from ordinary prescription-only stock:

**A duplicate prescription.** The prescription is issued in duplicate; the pharmacy retains one copy for **two years** and it must be produced on demand.

**Separate storage.** Schedule X stock is kept under lock and key, physically segregated from general stock, with controlled access.

**Separate purchase and sale records.** Not lines in the general register — dedicated records for acquisition and supply of these substances.

**Licensing.** Dealing in Schedule X requires the appropriate licence endorsement; it is not covered by a general retail drug licence alone.

NDPS-scheduled substances add further layers, including stricter authorisation and reporting, and the penalties under that Act are of a different order entirely.

## The three failure modes

Almost every controlled-substance finding traces to one of three things.

### 1. The record and the physical stock diverge quietly

A dispensing that was not entered, or entered against the wrong batch, creates a gap. In ordinary stock this is an adjustment. Here, an unexplained gap in a controlled substance is a serious finding, and the fact that it went unnoticed for six weeks makes it worse than the gap itself.

The control is **frequent reconciliation** — daily or per-shift for these lines, not at the annual count.

### 2. The prescription copy cannot be produced

The register says the supply happened; the retained prescription for that supply cannot be found. Physical filing of two years of duplicate prescriptions is a real logistical burden, and it fails through ordinary disorganisation rather than intent.

The control is **linking the physical file reference to the transaction** — record where the copy is filed, so retrieval is a lookup rather than a search.

### 3. Access is not actually controlled

A locked cabinet whose key sits in a drawer that everyone can open is not controlled storage. Equally, a software user account shared across four staff makes every audit trail entry meaningless, because "who dispensed this" has no answer.

The control is **individual logins** and role-restricted dispensing rights.

> If your system cannot tell you which named individual dispensed a given controlled-substance transaction, you do not have an audit trail. You have a log of what happened, with the most important column missing.

## What software should enforce

A billing system supporting controlled substances properly does six things.

**1. Classifies at item level.** Schedule X and NDPS-scheduled items are flagged on the master, not remembered by staff.

**2. Restricts who can dispense.** Only users with the right granted can complete a controlled-substance line, under their own login.

**3. Makes capture mandatory and non-dismissible.** Prescriber details, patient details, prescription reference and the physical file location — required before the transaction can be saved. A dismissible warning is not a control.

**4. Maintains separate registers.** Purchase and sale records generated for these substances specifically, in the prescribed format, derived from transactions rather than typed in parallel.

**5. Makes edits impossible to hide.** Amendments to a controlled-substance transaction should be versioned with user, timestamp and prior value retained. Deletion should not be available at all.

**6. Reconciles on a short cycle.** A daily controlled-substance position — opening, received, dispensed, closing — that a named person confirms. Discrepancies surface within a day rather than at year end.

## The reconciliation routine

A practical daily routine takes ten minutes:

1. Open the controlled-substance stock position for the day
2. Physically count the segregated cabinet, by batch
3. Compare against the system's closing position
4. Any difference: stop, investigate, document — do not adjust
5. Two named people sign off the count

The signature matters. It converts an informal check into a record, and a record is what protects you when something does go wrong later.

## Retention, and where paper still wins

| Record | Retention | Practical form |
|---|---|---|
| Schedule X duplicate prescription | 2 years | Physical file, indexed by transaction |
| Schedule X purchase and sale records | 2 years | System-generated, printed and signed |
| Schedule H1 register | 3 years | System-generated, printed and signed |
| Controlled-substance count sheets | Keep as long as the related records | Signed hard copy |

Digital records are operationally superior and are what should drive your process. But for controlled substances specifically, the pragmatic position is to keep a signed physical file as well, because inspector expectations vary by state and the cost of the belt-and-braces approach is small relative to the risk.

## How pharCare handles it

[pharCare](/products/pharcare/) carries schedule classification on every item and applies Schedule X rules distinctly from [Schedule H and H1 handling](/resources/blog/schedule-h-h1-h1x-pharmacy-billing-software/). Dispensing rights are granted per user under individual logins, prescription and file-reference capture is mandatory and non-dismissible, purchase and sale records generate in the prescribed format from the underlying transactions, amendments are versioned rather than overwritten, and a daily controlled-substance position is available for sign-off reconciliation.

To review your controlled-substance workflow against it, [book a demo](/contact/).

---

*This article describes the structure of the obligations, not legal advice. Requirements are enforced by state drug control authorities and interpretations vary — confirm your specific position with your licensing authority or legal advisor.*
