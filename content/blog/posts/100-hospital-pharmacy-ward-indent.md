---json
{
  "title": "Hospital pharmacy ward indents: issuing stock without losing track",
  "description": "How hospital pharmacies manage ward and department indents: requests, batch-wise issue, patient billing links, returns from wards and reconciliation of ward stock.",
  "category": "Hospital Pharmacy",
  "service": "pharmacy-suite",
  "keywords": [
    "hospital pharmacy indent",
    "ward stock management",
    "hospital pharmacy software",
    "inpatient medicine billing",
    "complete pharmacy management software"
  ],
  "faq": [
    {
      "q": "What is a ward indent?",
      "a": "A request from a ward, OT or department to the hospital pharmacy for medicines and consumables, either for general ward stock or for specific patients."
    },
    {
      "q": "Should medicines be billed to patients at issue or at use?",
      "a": "It depends on the hospital's process. Patient-specific issues are often billed at issue; ward stock is billed when used. The software should support the process the hospital chooses, consistently."
    },
    {
      "q": "How are unused medicines returned from wards?",
      "a": "Through a return entry against the original issue, with batch details, after checking condition and expiry. Returned items credited to patient bills where they were charged."
    },
    {
      "q": "How can ward stock losses be reduced?",
      "a": "Regular ward stock counts, minimum and maximum levels for ward stock, batch-wise issue, and reconciliation of issues against usage and patient billing."
    }
  ]
}
---
A hospital pharmacy runs two businesses at once: a retail counter for outpatients, and an internal supply operation for wards, ICUs, operation theatres and departments. The second is where most losses and billing gaps occur — medicines issued to a ward but never billed, returned stock that never comes back into the system, and ward cupboards that hold far more than anyone recorded.

## Two kinds of indents

### Patient-specific indents

Medicines requested for a named inpatient, often against a doctor's order. These should be issued against the patient's record so they appear on the patient's bill.

### Ward stock indents

General stock for the ward — common medicines, IV fluids, consumables — kept in the ward for immediate use. These need tracking of usage and periodic reconciliation.

Each needs its own process.

## A sound indent process

1. **Request** — ward or department raises an indent in the system, with patient details for patient-specific items.
2. **Approve** — where required, for high-value or controlled items.
3. **Issue** — pharmacy issues against the indent, with batch and expiry for each item.
4. **Receive** — ward confirms receipt.
5. **Bill** — patient-specific issues are charged to the patient; ward stock is charged when used, as per hospital policy.
6. **Return** — unused items come back against the original issue.

## Batch-wise issue

Every issue should carry batch and expiry. This matters for:

- recalls — knowing which wards or patients received a batch
- expiry — ward stock expiring in cupboards
- returns — matching returned items to what was issued

## Linking to patient billing

Gaps between issue and billing are a major source of revenue loss. The system should:

- show patient-specific issues on the patient's running bill automatically
- flag issues not yet billed at discharge
- process returns as credits on the patient's bill

## Controlled and high-value items

Narcotic and psychotropic drugs, expensive injectables and implants need tighter control:

- issue only against valid orders
- record administration and wastage as required
- keep registers as the rules require
- reconcile frequently

See [narcotic and psychotropic register software](/resources/blog/narcotic-psychotropic-register-software/).

## Ward stock levels and counts

- set minimum and maximum levels for each ward's stock
- replenish against usage rather than ad-hoc requests
- count ward stock regularly
- reconcile issues, usage and billing

Differences point to unbilled usage, wastage or loss.

## Returns from wards

Returned medicines should be checked for condition, packaging and expiry before going back into pharmacy stock. Items that can't be reused are recorded and disposed of properly.

## Reports

- issues by ward and department
- unbilled patient issues
- ward stock value and near-expiry items
- returns by ward
- controlled drug reconciliation

## The result

A hospital pharmacy that runs indents through the system — issue, receipt, billing and return — knows where every unit went. That protects revenue, supports compliance and, most importantly, ensures the right medicine is available on the ward when a patient needs it.

For the broader picture, see [hospital pharmacy vs retail pharmacy software](/resources/blog/hospital-pharmacy-vs-retail-pharmacy-software/).
