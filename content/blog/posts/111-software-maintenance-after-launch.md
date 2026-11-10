---json
{
  "title": "After launch: planning maintenance and support for custom software",
  "description": "What custom software needs after go-live — bug fixes, updates, security, backups, monitoring and improvements — and how to plan and budget a support agreement.",
  "category": "Support",
  "service": "custom",
  "keywords": [
    "software maintenance",
    "software support agreement",
    "annual maintenance contract software",
    "post launch support",
    "custom application development"
  ],
  "faq": [
    {
      "q": "Why does working software need maintenance?",
      "a": "Operating systems, browsers, libraries and connected services change; security issues are discovered; data grows; and the business itself changes. Software that isn't maintained gradually breaks or becomes unsafe."
    },
    {
      "q": "What should a support agreement cover?",
      "a": "Bug fixes, security and dependency updates, monitoring, backups, response times by severity, and a defined allowance or rate for small changes."
    },
    {
      "q": "How much should we budget for maintenance?",
      "a": "It varies with the size and complexity of the system. Plan an annual amount from the start rather than treating launch as the end of spending."
    },
    {
      "q": "What is the difference between a bug fix and an enhancement?",
      "a": "A bug fix makes the software work as agreed. An enhancement changes or adds behaviour. Contracts should define both so there's no argument later."
    }
  ]
}
---
Launch day feels like the finish line for a software project. It's actually the start of the longest phase: years of daily use, during which the software has to keep working, stay secure and adapt as the business changes.

Planning for that phase before launch avoids the common pattern of a system that works well for a year and then slowly decays.

## What maintenance covers

### Fixes

Bugs that testing didn't catch will appear once real users and real data arrive. Early weeks usually see the most.

### Security and updates

Operating systems, frameworks and libraries release security patches. Unpatched software becomes vulnerable over time.

### Compatibility

Browsers, phones, payment gateways, messaging platforms and government portals change. Integrations need updating when they do.

### Infrastructure

Hosting, backups, monitoring, SSL certificates, domains and storage need attention. Data grows, and performance needs tuning.

### Improvements

Users will ask for changes. Some are small; some become new modules.

## Severity and response times

Agree levels in advance:

| Severity | Example | Typical response |
|---|---|---|
| Critical | System down, billing impossible | Within hours |
| High | Major feature broken, workaround hard | Same or next working day |
| Medium | Feature broken, workaround exists | Within days |
| Low | Cosmetic, minor inconvenience | Next scheduled release |

Define how issues are reported and tracked, and who can raise critical issues.

## Fixes vs changes

Agree definitions:

- **fix** — the software doesn't do what was agreed; usually covered under warranty or support
- **change** — new or different behaviour; estimated and approved separately

Many contracts include a monthly allowance of hours for small changes, which keeps improvements flowing without negotiating each one.

## Monitoring and backups

- uptime and error monitoring with alerts
- automatic, regular backups
- tested restores — a backup that's never been restored is a hope, not a plan
- logs kept for troubleshooting and audit

## Budget for it

Plan an annual maintenance budget from the start. Include:

- support agreement or retainer
- hosting and third-party services
- periodic upgrades of major components
- improvements

Treating launch as the end of spending is the fastest route to an outdated system.

## Keep documentation current

Ask for documentation to be updated as the system changes: architecture, deployment steps, integrations and credentials (stored securely). It protects you if the support team changes. See [who owns your custom software](/resources/blog/software-ownership-source-code/).

## Review quarterly

- issues raised and resolved
- performance and uptime
- security updates applied
- improvement requests and priorities

## The long view

Well-maintained software becomes more valuable over time: more reliable, better fitted to the business, easier to extend. Neglected software becomes a risk. The difference is a modest, planned investment every year — decided before launch, not after the first emergency.
