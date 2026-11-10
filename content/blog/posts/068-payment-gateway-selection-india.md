---json
{
  "title": "Choosing a payment gateway for an Indian online store",
  "description": "What to compare when choosing a payment gateway in India: payment methods, success rates, fees, settlement time, refunds, checkout experience and support.",
  "category": "E-commerce",
  "service": "ecommerce",
  "keywords": [
    "payment gateway India",
    "best payment gateway for ecommerce",
    "UPI payment gateway",
    "payment success rate",
    "ecommerce website development"
  ],
  "faq": [
    {
      "q": "Which payment methods must an Indian store support?",
      "a": "UPI is essential for most Indian shoppers, along with debit and credit cards and net banking. Wallets, EMI and pay-later options can help depending on your customers and order values."
    },
    {
      "q": "Is the gateway with the lowest fee the best choice?",
      "a": "Not necessarily. A small difference in payment success rate can matter more than a small difference in fees, because every failed payment risks a lost order."
    },
    {
      "q": "How long does settlement take?",
      "a": "Settlement timelines vary by gateway and plan, typically a few working days, with faster settlement sometimes available at extra cost. Check the terms before signing."
    },
    {
      "q": "Can I use more than one payment gateway?",
      "a": "Yes. Some stores use two gateways and route payments based on method or performance, which also provides a fallback if one has an outage."
    }
  ]
}
---
The payment gateway is the last step between a shopper and an order. A good one makes paying quick and reliable. A poor one fails at the worst moment — after the customer has decided to buy.

Fees are what most people compare first. They're rarely what matters most.

## 1. Payment methods

Indian shoppers expect:

- **UPI** — collect, intent (opening the UPI app) and QR
- **debit and credit cards**, including RuPay
- **net banking** across major banks
- **wallets**, where your customers use them
- **EMI and pay-later**, for higher order values

UPI deserves special attention: on mobile, the intent flow that opens the customer's UPI app directly is usually the smoothest experience.

## 2. Success rate

Ask each gateway about payment success rates by method, and how they handle bank downtime. Even a small difference in success rate can outweigh a small difference in fees on your monthly revenue.

After launch, monitor success rates daily. A sudden drop usually means a technical or bank issue to escalate quickly.

## 3. Fees

Compare:

- transaction fee by method — UPI, cards, international cards, EMI
- setup or annual fees
- fees on refunds
- charges for faster settlement
- GST on fees

Model the cost on your actual payment mix, not the headline rate.

## 4. Settlement

How soon does money reach your bank? Standard settlement takes a few working days; faster settlement may cost extra. For a growing store, cash flow matters.

## 5. Refunds and disputes

- how easily can you issue full and partial refunds?
- how long do refunds take to reach customers?
- how are chargebacks handled, and what support do you get?

Slow refunds create angry customers and support work.

## 6. Checkout experience

- does payment happen on your site, in a popup, or by redirect?
- how does it look and perform on mobile?
- can customers save cards securely for next time?
- what happens after a failed payment — can they retry easily?

## 7. Integration

Check:

- plugins or SDKs for your platform
- webhooks for payment status, so orders update even if the customer closes the browser
- test mode for development
- documentation quality

Webhook handling is where many custom integrations go wrong. Orders must be marked paid based on the gateway's confirmation, not just the customer returning to your site.

## 8. Compliance and security

The gateway handles card data under its own compliance, which reduces your burden. Make sure your integration never stores card details itself, and that you follow current rules on card tokenisation and recurring payments.

## 9. Onboarding and support

- documents required and time to go live
- support channels and response times
- a named account manager at higher volumes

## Consider two gateways

Some stores use two gateways — one primary, one for specific methods or as a fallback during outages. It adds a little complexity but protects revenue on high-traffic days.

## A comparison template

| | Gateway A | Gateway B |
|---|---|---|
| UPI intent on mobile | | |
| Success rate (as claimed) | | |
| Fee — UPI / cards / EMI | | |
| Settlement time | | |
| Refund process | | |
| Platform integration | | |
| Support | | |

Choose on reliability and customer experience first, then on cost. A payment step that just works is one of the quietest, most valuable parts of an online store.
