#!/usr/bin/env node
/*  Builds the two legal pages:
 *    privacy-policy/index.html and terms-and-conditions/index.html
 *
 *  Static output served by IIS like every other page. As with the blog and
 *  demo generators, the nav and footer are lifted from a live page. Edit the
 *  wording here, change EFFECTIVE when the meaning changes, then `npm run build`.
 *
 *  The privacy section describes what this site really does (see
 *  server/routes/contact-public.js, downloads-public.js and viewer.js). If a
 *  form, tracker or provider changes, update it here too.
 *
 *  Usage: node scripts/build-legal.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const blog = require("./lib/blog");

const ROOT = path.join(__dirname, "..");
const ORIGIN = "https://www.liveuo.com";
const EFFECTIVE = "2 November 2026";
const OFFICE = "3500, 3rd Main Rd, 1st Phase Girinagar, Phase 4, Banashankari 3rd Stage, Banashankari, Bengaluru, Karnataka 560085, India";
const MAIL = '<a href="mailto:info@liveuo.com">info@liveuo.com</a>';
const PHONE = '<a href="tel:+918050718269">+91 80507 18269</a>';

const PRIVACY = {
  slug: "privacy-policy",
  crumb: "Privacy Policy",
  heading: "Privacy Policy",
  title: "Privacy Policy | LiVEUO",
  description: "How LiVEUO collects, uses, shares and protects personal data when you use our website, software and services, and the rights you have over it.",
  lede: "This policy explains what personal data LiVEUO collects through our website, software and services, why we use it, who receives it, and the choices you have.",
  sections: [
    ["who-we-are", "Who we are", `
      <p>LiVEUO (“LiVEUO”, “we”, “us”) builds and supplies pharmacy software, billing applications, e-commerce platforms, custom applications, automation and digital marketing services from Bengaluru, India. We decide how and why personal data is used for the purposes in this policy, except where section 5 says we act for a customer.</p>
      <p>This policy applies to <a href="/">liveuo.com</a>, our forms, demos and business dealings with customers and prospects.</p>`],
    ["what-we-collect", "Data we collect", `
      <p><strong>Data you give us:</strong></p>
      <ul>
        <li><strong>Contact form:</strong> name, email address, company, the service you are interested in, and your message.</li>
        <li><strong>Downloads:</strong> name, email address and phone number, where a brochure or file asks for them.</li>
        <li><strong>Demos and secure documents:</strong> your email address and the one-time code sent to it.</li>
        <li><strong>Customers:</strong> business contact details, billing and GST details, contract records, and support requests.</li>
        <li><strong>Direct messages:</strong> anything you send us by email, phone or WhatsApp.</li>
      </ul>
      <p><strong>Data collected automatically:</strong></p>
      <ul>
        <li>Pages visited, referring site, device and browser details, and approximate location, through Google Analytics.</li>
        <li>IP address, processed for security and abuse prevention. We store contact and download records with a hashed version of the IP address rather than the address itself.</li>
        <li>For secure documents and demo videos, an access log of the email address, IP address and time of viewing. Documents may carry this information as a visible watermark.</li>
      </ul>`],
    ["how-we-use", "How we use your data", `
      <p>We use personal data to:</p>
      <ul>
        <li>reply to enquiries and arrange demos or consultations;</li>
        <li>provide, support and maintain software and services, and send invoices;</li>
        <li>control access to demos and protected documents;</li>
        <li>send service messages and, where permitted, information about our products, which you can opt out of at any time;</li>
        <li>understand how the website is used, and improve it;</li>
        <li>prevent spam, fraud and misuse; and</li>
        <li>meet legal, tax and accounting obligations.</li>
      </ul>
      <p>We process personal data with your consent, which you may withdraw at any time, or for other purposes permitted by law, such as performing a contract or complying with a legal duty. Withdrawing consent does not affect processing that has already taken place.</p>`],
    ["cookies", "Cookies and similar technologies", `
      <ul>
        <li><strong>Essential:</strong> a session cookie that keeps secure areas working. It expires within 8 hours.</li>
        <li><strong>Analytics:</strong> Google Analytics cookies that help us measure use of the website.</li>
        <li><strong>Security:</strong> Google reCAPTCHA, which protects our forms from automated abuse. Its use is subject to Google’s <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" rel="noopener" target="_blank">Terms</a>.</li>
        <li><strong>Browser storage:</strong> the demo video player saves your viewing progress in your own browser.</li>
      </ul>
      <p>You can block or delete cookies in your browser settings. Forms or secure areas may stop working if you do.</p>`],
    ["customer-data", "Data in our software", `
      <p>When a customer uses our software or asks us to host or support it, records entered into it may include personal data about that customer’s own patients, clients, staff or suppliers. The customer decides how that data is used and is responsible for having a lawful basis to use it. We handle it only as needed to provide the service, on the customer’s instructions and under our agreement.</p>
      <p>If you are an individual whose data is held by one of our customers, such as a pharmacy, please contact that business first.</p>`],
    ["sharing", "Who we share data with", `
      <p>We do not sell personal data. We share it only as needed with:</p>
      <ul>
        <li><strong>Service providers</strong> that support us, including website hosting, content delivery and security (such as Cloudflare), email delivery, analytics and anti-spam (such as Google), and messaging services;</li>
        <li><strong>Professional advisers</strong> such as accountants, auditors and lawyers;</li>
        <li><strong>Authorities</strong> where the law or a valid legal request requires it, or where needed to protect rights and safety; and</li>
        <li><strong>A successor business</strong> if LiVEUO is reorganised, merged or sold.</li>
      </ul>
      <p>Some providers may process data outside India. Where they do, we rely on the transfer being permitted by applicable law.</p>`],
    ["retention", "How long we keep data", `
      <p>We keep personal data only for as long as needed for the purpose it was collected for: enquiries for as long as the conversation or a likely business relationship continues, customer records for the contract and any period required by tax, accounting or other law, and access logs for as long as needed for security and traceability. We then delete or anonymise it.</p>`],
    ["security", "How we protect data", `
      <p>We use reasonable technical and organisational safeguards, including encrypted connections, access controls, hashed IP addresses and one-time codes for protected content. No system is completely secure, so we cannot guarantee absolute security. If a breach affects your data, we will notify you and the authorities where the law requires it.</p>`],
    ["rights", "Your rights", `
      <p>Subject to applicable law, including India’s Digital Personal Data Protection Act, 2023, you may ask us to:</p>
      <ul>
        <li>tell you what personal data we hold about you and how it is used;</li>
        <li>correct, complete, update or erase your data;</li>
        <li>stop using your data where you withdraw consent, including for marketing;</li>
        <li>address a grievance about how we handled your data; and</li>
        <li>act on behalf of a person you nominate, in the event of death or incapacity.</li>
      </ul>
      <p>Email ${MAIL} to make a request. We may need to verify your identity, and may keep data the law requires us to keep. If you are not satisfied with our response, you may be able to complain to the Data Protection Board of India.</p>`],
    ["children", "Children", `
      <p>Our website and services are intended for businesses and are not directed at children. We do not knowingly collect personal data from anyone under 18. If you believe a child has given us data, contact us and we will delete it.</p>`],
    ["third-party", "Other websites", `
      <p>Our website links to third-party sites and services, including WhatsApp and Google. Their own privacy policies apply when you use them.</p>`],
    ["changes", "Changes to this policy", `
      <p>We may update this policy from time to time. The latest version will always be on this page, with its effective date at the top.</p>`],
    ["contact", "Contact and grievances", `
      <p>For privacy questions, requests or grievances, contact:</p>
      <p>LiVEUO<br/>${OFFICE}<br/>Email: ${MAIL}<br/>Phone: ${PHONE}</p>`]
  ]
};

const TERMS = {
  slug: "terms-and-conditions",
  crumb: "Terms & Conditions",
  heading: "Terms & Conditions",
  title: "Terms & Conditions | LiVEUO",
  description: "The terms that apply when you use the LiVEUO website or buy our software, custom development, support, hosting and digital marketing services.",
  lede: "These terms apply when you use our website or buy software and services from LiVEUO. Please read them carefully. They limit our liability in section 11.",
  sections: [
    ["acceptance", "Agreement to these terms", `
      <p>By using <a href="/">liveuo.com</a>, or by signing a proposal, order or statement of work (an “Order”) with LiVEUO (“LiVEUO”, “we”, “us”), you (“you”, “Customer”) agree to these terms. If you accept on behalf of a business, you confirm that you have authority to bind it.</p>
      <p>If an Order or a separate signed agreement conflicts with these terms, the Order or agreement prevails for that engagement.</p>`],
    ["services", "Our software and services", `
      <p>We supply packaged software such as pharCare, billing and e-commerce applications, as well as custom development, automation and analytics, digital marketing, implementation, hosting and support. The scope, price, timeline and deliverables for each engagement are set out in its Order. Website descriptions are general information and do not form an offer or a commitment.</p>`],
    ["licence", "Software licence", `
      <p>Once the applicable fees are paid, we grant you a non-exclusive, non-transferable licence to use the software for your internal business purposes, within the term, users, branches or other limits in your Order.</p>
      <p>Unless the law allows it or we agree in writing, you must not:</p>
      <ul>
        <li>copy, resell, sublicense or rent the software;</li>
        <li>reverse engineer it, or attempt to extract its source code;</li>
        <li>remove proprietary notices, or bypass licence or security controls; or</li>
        <li>use it to build a competing product.</li>
      </ul>`],
    ["custom", "Custom development", `
      <p>Each Order defines the deliverables and any acceptance process. Work outside the agreed scope is a change request, and may affect price and timeline. Our timelines depend on you providing information, access, data and approvals when needed.</p>
      <p>Deliverables are treated as accepted if you use them in live operation, or do not report a material defect within the period in the Order, or within 15 days of delivery if the Order states none.</p>`],
    ["ip", "Intellectual property", `
      <p>LiVEUO and its licensors keep all rights in our software, tools, frameworks, know-how and pre-existing materials. Unless an Order says otherwise, once all fees are paid you own the deliverables written specifically for you, excluding those pre-existing materials, which we license to you for use with the deliverables. Open-source components stay under their own licences.</p>
      <p>You keep all rights in your data, content and branding, and allow us to use them as needed to provide the services. If you send us feedback, we may use it without obligation to you.</p>`],
    ["fees", "Fees and payment", `
      <p>Fees and payment milestones are stated in your Order and are exclusive of GST and other applicable taxes unless stated otherwise. Unless your Order says otherwise, invoices are due within 15 days of the invoice date. If an undisputed amount is overdue, we may suspend services after giving written notice.</p>
      <p>Advertising budgets and third-party charges, such as ad platforms, domains, cloud hosting, SMS or WhatsApp messaging, are your responsibility unless your Order includes them. Except where the Order or the law requires otherwise, fees for work performed or licences delivered are non-refundable.</p>`],
    ["responsibilities", "Your responsibilities", `
      <p>You agree to:</p>
      <ul>
        <li>keep login details secure, and be responsible for activity under your accounts;</li>
        <li>make sure your data is accurate and that you have the right to use it, including any consents needed from your customers or patients;</li>
        <li>keep your own regular backups, unless your Order makes us responsible for backups;</li>
        <li>comply with the laws that apply to your business; and</li>
        <li>not use our software, services or website unlawfully, or to send spam, spread malicious code, disrupt systems or gain unauthorised access.</li>
      </ul>
      <p><strong>Compliance remains your responsibility.</strong> Features such as GST invoices, Schedule H registers and reports are tools to support your processes. You remain responsible for your filings, licences, record-keeping and professional decisions. Our software does not provide medical, legal, tax or financial advice.</p>`],
    ["support", "Support and hosting", `
      <p>Support, maintenance and hosting are provided as described in your Order, including any service levels. We aim to keep hosted services available, but do not promise uninterrupted operation: planned maintenance and events outside our control, including failures of internet or third-party services, may affect them.</p>`],
    ["marketing", "Digital marketing results", `
      <p>Marketing results depend on factors including your industry, budget, competition and platform decisions. We do not guarantee any specific ranking, traffic, lead volume, sales or return on investment. Any forecasts are estimates only. You are responsible for the accuracy of claims about your business, and must approve content where your sector regulates advertising.</p>`],
    ["data", "Confidentiality and data protection", `
      <p>Each party will protect the other’s confidential information, and use it only to perform or receive the services. This does not apply to information that is public, already known, independently developed, or that must be disclosed by law.</p>
      <p>Where we handle personal data on your behalf, we do so on your instructions, as needed to provide the services, and with reasonable safeguards. Our <a href="/privacy-policy/">Privacy Policy</a> explains how we handle personal data for our own purposes.</p>`],
    ["warranty", "Warranties and liability", `
      <p>We will provide services with reasonable skill and care. Except as stated in an Order and to the extent the law allows, software, services and the website are otherwise provided “as is”, without warranties of uninterrupted or error-free operation or fitness for a particular purpose.</p>
      <p>To the extent the law allows, neither party is liable for indirect or consequential loss, or for loss of profit, revenue, goodwill or data. Our total liability arising from an Order is limited to the fees you paid under that Order in the 12 months before the event giving rise to the claim.</p>
      <p>Nothing in these terms limits liability that cannot be limited by law, your obligation to pay fees, or liability for fraud or misuse of the other party’s intellectual property.</p>`],
    ["termination", "Term and termination", `
      <p>Each Order runs for the term it states. Either party may terminate an Order by written notice if the other materially breaches it and does not fix the breach within 30 days of being told about it. We may suspend access immediately where needed to prevent security risk, unlawful use or serious harm.</p>
      <p>On termination, licences granted under that Order end unless they are stated to be perpetual, and you must pay for work performed and fees due up to that date. On request made within 30 days, we will make your hosted data available for export in a commonly used format, after which we may delete it, unless the law requires us to keep it.</p>`],
    ["website", "Using this website", `
      <p>Website content, including text, graphics, logos and demo videos, belongs to LiVEUO or its licensors. You may view it for your own business evaluation, but may not copy, redistribute or scrape it without permission. Access to protected demos and documents is personal to you and must not be shared. Website content, including blog articles, is general information and not professional advice. Links to third-party sites are for convenience, and we are not responsible for those sites.</p>`],
    ["general", "General", `
      <ul>
        <li><strong>Force majeure:</strong> neither party is liable for delay caused by events beyond its reasonable control. This does not excuse payment obligations.</li>
        <li><strong>Assignment:</strong> you may not transfer your rights without our written consent, which we will not unreasonably withhold.</li>
        <li><strong>Subcontractors:</strong> we may use subcontractors, and remain responsible for their work.</li>
        <li><strong>Severability and waiver:</strong> if part of these terms is unenforceable, the rest continues. A delay in enforcing a right is not a waiver of it.</li>
        <li><strong>Changes:</strong> we may update these terms by publishing a new version here. Changes apply to new Orders and to later use of the website; an existing Order changes only as agreed by both parties.</li>
      </ul>`],
    ["law", "Governing law and disputes", `
      <p>These terms are governed by the laws of India. The parties will first try to resolve any dispute through good-faith discussion. Subject to that, the courts in Bengaluru, Karnataka have exclusive jurisdiction.</p>`],
    ["contact", "Contact", `
      <p>LiVEUO<br/>${OFFICE}<br/>Email: ${MAIL}<br/>Phone: ${PHONE}</p>`]
  ]
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function versioned(asset) {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, asset.replace(/^\//, "")))).digest("hex");
  return asset + "?v=" + hash.slice(0, 10);
}

function render(page) {
  const chrome = blog.getChrome();
  const url = `${ORIGIN}/${page.slug}/`;
  const head =
    `<!DOCTYPE html>\n<html lang="en">\n<head>` +
    `<script async src="https://www.googletagmanager.com/gtag/js?id=G-B27YZ8EL0J"></script>` +
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-B27YZ8EL0J");</script>\n` +
    `<meta charSet="utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n` +
    `<meta name="robots" content="index, follow"/>\n<meta name="author" content="LiVEUO"/>\n<meta name="theme-color" content="#3a6cb5"/>\n` +
    `<link rel="canonical" href="${url}"/>\n` +
    `<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml"/>\n<link rel="apple-touch-icon" href="/assets/logo-mark.svg"/>\n` +
    `<meta property="og:type" content="website"/>\n<meta property="og:site_name" content="LiVEUO"/>\n<meta property="og:url" content="${url}"/>\n` +
    `<meta property="og:title" content="${esc(page.title)}"/>\n<meta property="og:description" content="${esc(page.description)}"/>\n` +
    `<link rel="stylesheet" href="/_next/static/chunks/3plzysnn66upc.css" data-precedence="next"/>\n` +
    `<link rel="preconnect" href="https://fonts.googleapis.com"/>\n` +
    `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=Inter:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>\n` +
    `<link rel="stylesheet" href="${versioned("/assets/legal.css")}"/>\n` +
    `<title>${esc(page.title)}</title>\n<meta name="description" content="${esc(page.description)}"/>\n` +
    `</head>\n<body>\n`;

  const hero =
    `\n<div class="page-hero"><div class="container">` +
    `<div class="breadcrumb"><a href="/">Home</a> / <span>${esc(page.crumb)}</span></div>` +
    `<div class="accent-bar" style="background:#5cc4f1"></div>` +
    `<h1 class="legal-title">${esc(page.heading)}</h1>` +
    `<p class="lede">${esc(page.lede)}</p>` +
    `<p class="legal-date">Effective ${EFFECTIVE}</p>` +
    `</div></div>\n`;

  const toc = page.sections
    .map(([id, title], i) => `<li><a href="#${id}">${i + 1}. ${esc(title)}</a></li>`)
    .join("");
  const body = page.sections
    .map(([id, title, html], i) => `<section class="legal-section" id="${id}"><h2>${i + 1}. ${esc(title)}</h2>${html.trim()}</section>`)
    .join("\n");

  const main =
    `\n<div class="legal-wrap"><div class="container legal-grid">` +
    `<nav class="legal-toc" aria-label="On this page"><h2>On this page</h2><ol>${toc}</ol></nav>` +
    `<article class="legal-body">\n${body}\n</article>` +
    `</div></div>\n`;

  return head + chrome.nav + hero + main + chrome.footer + "\n" + chrome.scripts + "\n</body>\n</html>\n";
}

for (const page of [PRIVACY, TERMS]) {
  const file = path.join(ROOT, page.slug, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const html = render(page);
  const before = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  // scripts/build.js adds the BreadcrumbList JSON-LD afterwards, so compare without it.
  const strip = (s) => s.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
  if (strip(before) !== strip(html)) fs.writeFileSync(file, html, "utf8");
  console.log(`legal page -> ${page.slug}/index.html`);
}
