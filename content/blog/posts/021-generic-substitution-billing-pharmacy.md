---json
{
  "title": "Generic substitution: what software should not decide",
  "description": "Salt-based search, brand alternatives and price comparison help staff answer a common question fast. Where the line sits before it becomes a clinical decision.",
  "category": "Operations",
  "keywords": [
    "generic substitution pharmacy software",
    "salt based search pharmacy",
    "generic medicine alternatives India",
    "pharmacy billing software substitution",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Can pharmacy software automatically substitute a generic for a branded medicine?",
      "a": "It should not. Substitution is a decision for the registered pharmacist, within what the prescription and applicable rules permit. Software's proper role is to surface the alternatives with their composition, strength, form and price so the pharmacist decides quickly and accurately."
    },
    {
      "q": "What is salt-based search?",
      "a": "Searching by active ingredient and strength rather than brand name, so a request for one brand surfaces every product with the same composition. It is the mechanism behind both substitution suggestions and finding an alternative when a brand is out of stock."
    },
    {
      "q": "Why do substitution suggestions need strength and form, not just the molecule?",
      "a": "Because the same molecule at a different strength, or in a different dosage form, is a different medicine. A suggestion list matched on molecule alone will offer products that are not equivalent, which shifts risk onto whoever is reading the screen during a rush."
    },
    {
      "q": "Does pharCare support salt-based search?",
      "a": "Yes. Items carry composition, strength and dosage form, so alternatives can be surfaced with matching strength and form alongside stock position and price — as information for the pharmacist, not as an automatic substitution."
    }
  ]
}
---
"Is there something cheaper with the same salt?" is one of the most frequently asked questions at an Indian pharmacy counter, and one of the slowest to answer well. Answering it requires knowing the composition of the prescribed product, finding every alternative with the same composition **and the same strength and form**, checking which are in stock, and comparing prices — in the time a customer is willing to wait.

Software can make that a three-second lookup. What it must not do is make the decision.

## The line, stated plainly

**Software's job:** find and present the alternatives, accurately, fast, with everything needed to judge them.

**The pharmacist's job:** decide whether substitution is appropriate for this prescription and this patient, and take responsibility for it.

That division is not a technicality. Substitution can be clinically inappropriate for narrow-therapeutic-index drugs, for patients stabilised on a particular product, where excipients matter, or simply where the prescriber has indicated otherwise. A system that auto-substitutes has made a clinical decision from a database, and the person who hands the bag over carries the consequence.

> Any feature that changes what goes in the bag without a human deciding is in the wrong place. Suggest, do not substitute.

## What a good alternatives list requires

The data model has to carry more than a molecule name.

| Field | Why it is essential |
|---|---|
| Active ingredient(s) | The basis of equivalence |
| Strength per unit | 500 mg and 650 mg are not alternatives |
| Dosage form | Tablet, capsule, syrup, injection — not interchangeable |
| Combination composition | For FDCs, every component and every strength must match |
| Pack size | Determines the price comparison the customer actually cares about |
| Manufacturer | Customers and prescribers have preferences, legitimately |

Combination products are where naive matching fails most often. A two-molecule combination has to match on **both** molecules and **both** strengths. Matching on the primary ingredient alone will produce a list containing products that are not equivalent, presented to a person under time pressure — which is precisely the situation where a bad suggestion turns into an error.

## Comparing on the right price

A customer asking for something cheaper means cheaper for **their course of treatment**, not cheaper per pack.

The comparison should show:

- **MRP per pack** and **price per unit**
- What they would pay for the **quantity actually needed**
- **Stock availability** — an alternative you do not have is noise, and offering it wastes counter time
- Batch **expiry**, since a short-dated alternative may not suit a long course

Price per unit is the number that makes the comparison honest. A larger pack at a higher MRP is frequently the cheaper option per tablet, and neither the customer nor a hurried assistant will work that out unaided.

## The other use of the same feature

Salt-based search earns its place even when nobody is asking about price: **stockouts**.

A prescription arrives for a brand you do not have. Without composition search, that is a lost sale and a customer who goes elsewhere — and having gone elsewhere once, may not come back. With it, the pharmacist can immediately see equivalent products in stock and have a sensible conversation.

For many pharmacies this recovers more value than the substitution use case does.

## Where the commercial incentive needs watching

Generics typically carry higher percentage margin than branded equivalents. That is a genuine commercial fact and it creates a genuine tension.

The safeguards worth having:

- Alternatives listed **by relevance and price**, never ranked by your margin
- **No prompt** pushing staff toward the higher-margin option
- Substitution rate **visible in reporting**, so a sudden change is noticed
- The customer told what they are being offered and why

A pharmacy that substitutes because it is right for the customer builds a business. One that substitutes because the screen nudged it will eventually be noticed, and the reputational cost in a neighbourhood pharmacy is not recoverable.

## What to record

Whatever is decided, the record should show what actually left the shop:

- The **product dispensed**, with its batch — not the product prescribed
- That a **substitution occurred**, if it did
- **Who** dispensed it, under their own login

This matters for recall traceability — a recall names a batch, and the batch that matters is the one the patient received. It also matters if a question arises later about what was supplied. The [drug-schedule record requirements](/resources/blog/schedule-h-h1-h1x-pharmacy-billing-software/) apply to the product actually dispensed, which is another reason the dispensed item, not the prescribed one, is the record.

## Making it fast enough to use

A feature that takes fifteen seconds will be skipped at 7pm. Practical requirements:

- **One keystroke** from the billing line to the alternatives list
- List **pre-filtered to in-stock items**, with an option to see all
- Substituting into the bill in **one action**, carrying the batch
- **No modal dialogue** that loses the bill in progress

Ask to see this timed during an evaluation. It is a good proxy for how much attention the vendor has paid to counter reality generally.

## How pharCare handles it

[pharCare](/products/pharcare/) holds composition, strength and dosage form on the item master, so alternatives are matched on full composition including every component of a combination — not on molecule name alone. The list shows MRP, price per unit, cost for the quantity needed, stock position and batch expiry, ordered by relevance and price rather than by margin. Substitution is a pharmacist action, recorded against the transaction with the dispensed batch, under the individual user's login.

To see salt-based search against your own item master, [book a demo](/contact/).

---

*Substitution is subject to professional judgement and applicable regulation. This article describes software behaviour, not clinical or legal guidance on when substitution is permissible.*
