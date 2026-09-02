---json
{
  "title": "Pharmacy data: backups that work and DPDP obligations you already have",
  "description": "Patient data in a pharmacy is personal data under the DPDP Act 2023. What that means in practice, plus a backup regime that survives the failure it is meant to survive.",
  "category": "Compliance",
  "keywords": [
    "DPDP Act pharmacy",
    "pharmacy data protection India",
    "pharmacy software backup",
    "patient data privacy pharmacy",
    "pharCare"
  ],
  "faq": [
    {
      "q": "Does the DPDP Act apply to a small independent pharmacy?",
      "a": "The Act applies to the processing of digital personal data, and a pharmacy holding customer names, phone numbers, prescriber details and purchase history is processing personal data. Obligations scale with the nature and volume of processing, but the baseline duties — purpose limitation, security safeguards, and acting on data principal requests — are not limited to large organisations."
    },
    {
      "q": "How often should pharmacy data be backed up?",
      "a": "Daily at minimum, with at least one copy held off-site or in a separate cloud location. The frequency question matters less than the restore question — an untested backup is an assumption, not a safeguard."
    },
    {
      "q": "Is a backup on the same computer sufficient?",
      "a": "No. A backup on the same machine protects against accidental deletion and nothing else. Hardware failure, theft, fire, flood and ransomware all take the original and the copy together."
    },
    {
      "q": "How does pharCare handle backups and access control?",
      "a": "Data is backed up automatically with off-site copies, access is role-based under individual user logins, and actions are logged so who saw or changed what is answerable rather than assumed."
    }
  ]
}
---
A pharmacy holds a quantity of sensitive personal information that would make most businesses nervous: names, phone numbers, addresses, prescriber details, and a purchase history that reveals medical conditions. Under the **Digital Personal Data Protection Act, 2023**, that is personal data and you are the entity responsible for it. Separately and more immediately, it is data whose loss would stop your business — and the most common cause of that loss is a backup regime that nobody ever tested.

Two related disciplines, worth taking together.

## Part one: backups that actually restore

### The rule that matters

A backup you have never restored is not a backup. It is a file you believe in. The single most valuable thing in this article is: **restore from your backup, to a different machine, once a quarter, and time how long it takes.**

Pharmacies discover backup failures at exactly the moment they can least afford to — the file was corrupt, the job had been failing silently for eleven weeks, the backup contained the database but not the attachments, or nobody knew the password.

### A regime that holds up

Three copies, two media, one off-site — the standard shorthand, and it is sound:

| Element | Requirement |
|---|---|
| Frequency | Daily minimum; more often if a day's billing is material to you |
| Retention | Enough history to recover from a problem discovered late — a month of dailies plus monthly archives |
| Location | At least one copy physically or logically separate from the shop |
| Verification | Automated check that the job ran **and** that the file is valid |
| Restore test | Quarterly, to a different machine, timed |
| Access | Backup credentials known to more than one person, stored securely |

### The ransomware consideration

Ransomware encrypts what it can reach, including network drives and mapped backup folders. A backup that is continuously connected to the machine being backed up is within the blast radius.

The mitigations: at least one copy that is **immutable or offline**, and versioned backups so you can go back to a point before the encryption started.

### Retention is also a legal question

Drug-schedule records carry retention obligations — three years for the [Schedule H1 register](/resources/blog/schedule-h-h1-h1x-pharmacy-billing-software/), two for Schedule X records, and your tax records have their own periods. Your backup retention has to be at least as long as the longest obligation applying to the data it contains. A 30-day backup rotation does not satisfy a three-year record-keeping duty.

## Part two: DPDP obligations in practical terms

The Act is principles-based, and the principles translate into a short list of things to actually do.

### Collect for a purpose, and only what you need

Ask why each field exists. A phone number for refill reminders and delivery is purposeful. Collecting a date of birth because the form has a box for it is not. Every field you hold is a field you must protect and may have to produce.

### Tell people what you do with it

A plainly worded notice — what you collect, why, and how to contact you about it. For a pharmacy this can be a short printed notice at the counter and a page on your website. It does not need to be long; it needs to be accurate.

### Secure it with reasonable safeguards

The controls that matter operationally:

- **Individual logins.** A shared account means no audit trail and no accountability. This is the most common gap in small pharmacies and the easiest to fix.
- **Role-based access.** Counter staff do not need the customer database export function.
- **Logging.** Who viewed, changed or exported what. Without it you cannot investigate an incident or answer a question about one.
- **Encryption** of backups and of data in transit.
- **Access removal on exit.** A departed employee's login should be disabled the day they leave, not eventually.

### Be able to answer a request

A person can ask what data you hold about them, ask for corrections, and in defined circumstances ask for erasure. You need to be able to find everything about one individual — which requires that customer records are linked rather than scattered across bills.

Erasure requests interact with your retention obligations: where a record must be kept under drug or tax rules, that obligation generally governs. Being able to explain the distinction is part of responding properly.

### Have a plan for a breach

The Act contemplates notification of personal data breaches. In practice you need to know, in advance: who decides it is a breach, who is notified, what is recorded, and who communicates. Deciding this during an incident does not go well.

> The controls that satisfy DPDP overlap almost entirely with the controls that make your business run properly — individual logins, role-based access, audit logs, tested backups. This is not a separate compliance project bolted onto operations. It is operations done properly.

## The uncomfortable questions worth asking now

1. If the counter machine died tonight, how long until you are billing again — and do you know, or are you guessing?
2. When did you last restore from backup?
3. How many people know the login you are all using?
4. Can you produce everything you hold about one named customer?
5. Does a former employee still have access to anything?

Most pharmacies find at least two uncomfortable answers in that list. All five are fixable in an afternoon.

## How pharCare handles it

[pharCare](/products/pharcare/) backs up automatically with off-site copies and versioned retention, enforces individual user logins with role-based access rather than a shared admin account, and logs access and changes so incidents are investigable. Customer records are linked, so a data-principal request can be answered from one place, and record retention aligns to the statutory periods for drug and tax records rather than to a generic rotation.

To review your current backup and access position, [book a demo](/contact/) — it is usually a short conversation with a couple of surprises in it.

---

*This article describes obligations in general terms and is not legal advice. Confirm your specific position under the DPDP Act and its rules with a qualified advisor.*
