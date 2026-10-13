/*  Content for /services/digital-marketing/ - rendered by
 *  scripts/build-digital-marketing.js. Edit copy here, then `npm run build`.
 *
 *  Icons are 24x24 stroke paths (inner SVG markup), keyed by name.
 */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path>',
  target: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle>',
  share: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"></path>',
  pen: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M22 6l-10 7L2 6"></path>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
  star: '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"></polygon>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"></path><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"></path>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8M12 17v4"></path>',
  cart: '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
  play: '<rect x="2" y="4" width="20" height="16" rx="3"></rect><polygon points="10 9 15 12 10 15 10 9"></polygon>',
  shield: '<path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z"></path><path d="M9 12l2 2 4-4"></path>',
  refresh: '<path d="M21 12a9 9 0 1 1-3.5-7.1M21 3v6h-6"></path>',
  spark: '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"></path>',
  chart: '<path d="M3 3v18h18"></path><path d="M7 15l4-4 3 3 6-7"></path>',
  cap: '<path d="M22 10L12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"></path>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>',
  home: '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-8h6v8"></path>',
  bag: '<path d="M6 2l1.5 6h9L18 2M4 8h16l-1.5 12a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L4 8z"></path>',
  code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
  factory: '<path d="M2 21V10l6 3V7l6 3V4l7 5v12H2z"></path>',
  globe: '<circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"></path>',
  card: '<rect x="2" y="6" width="20" height="13" rx="2"></rect><path d="M2 11h20"></path>',
  car: '<path d="M3 13l2-6h14l2 6v5H3z"></path><circle cx="7.5" cy="16" r="1.5"></circle><circle cx="16.5" cy="16" r="1.5"></circle>',
  cup: '<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"></path><path d="M17 9h2a2 2 0 0 1 0 5h-2"></path><path d="M6 2v3M10 2v3M14 2v3"></path>',
  tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"></path><circle cx="7" cy="7" r="1"></circle>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13C4 7 10 4 20 4c0 10-3 16-9 16z"></path><path d="M4 20l8-8"></path>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2"></rect><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"></path>',
  users: '<circle cx="9" cy="8" r="4"></circle><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"></path><path d="M17 10a4 4 0 0 0 0-8"></path><path d="M23 21v-1a6 6 0 0 0-4.5-5.8"></path>',
  landmark: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-7 10 7z"></path>',
  signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"></path>',
  zap: '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"></path>',
  pill: '<path d="M10.5 20.5a5 5 0 0 1-7-7l9-9a5 5 0 0 1 7 7z"></path><path d="M8.5 8.5l7 7"></path>',
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>',
  gamepad: '<rect x="2" y="6" width="20" height="12" rx="4"></rect><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"></path>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
  eye: '<path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z"></path><circle cx="12" cy="12" r="3"></circle>',
  filter: '<path d="M4 4h16l-6 8v6l-4 2v-8L4 4z"></path>',
  trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  coin: '<path d="M12 1v22M17 5H9.500a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v4"></path>',
  layers: '<path d="M12 2l10 5-10 5L2 7l10-5z"></path><path d="M2 12l10 5 10-5M2 17l10 5 10-5"></path>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path>'
};

const SERVICES = [
  ["search", "Search Engine Optimization (SEO)", "Technical fixes, on-page structure, content and local listings so you are found for the searches your customers already make."],
  ["target", "SEM & Google Ads", "Search, Shopping and Performance Max campaigns built around intent, with conversion tracking set up before the first rupee is spent."],
  ["share", "Social Media Marketing (SMM)", "Organic publishing and paid campaigns on Instagram, Facebook, LinkedIn and YouTube, matched to where your buyers spend time."],
  ["pen", "Content Marketing & Blogging", "Articles, guides and landing pages that answer real buyer questions and keep earning traffic after they are published."],
  ["mail", "Email Marketing", "Welcome flows, newsletters and win-back sequences sent to a list you own, segmented by what each subscriber has done."],
  ["chat", "WhatsApp Marketing", "Opt-in broadcasts, order updates and click-to-WhatsApp ads on the WhatsApp Business Platform, with replies routed to your team."],
  ["star", "Influencer Marketing", "Creator shortlisting, briefs and tracked links, with paid partnerships clearly disclosed as advertising guidelines require."],
  ["link", "Affiliate Marketing", "Partner programmes that pay on results, with clean attribution so you know which affiliates bring customers that stay."],
  ["monitor", "Website Design & Development", "Fast, mobile-first sites and landing pages built to convert, with analytics and SEO foundations in place from day one."],
  ["cart", "E-commerce Marketing", "Product feeds, marketplace listings, cart-recovery flows and shopping ads tuned to margin, not just revenue."],
  ["play", "Video Marketing & YouTube Ads", "Short-form reels, explainers and YouTube campaigns planned around the first three seconds and a single clear action."],
  ["shield", "Online Reputation Management (ORM)", "Review generation, response playbooks and monitoring so what people find about you is current and fair."],
  ["refresh", "Marketing Automation & CRM", "Lead capture wired into a CRM, with scoring, follow-ups and hand-off to sales happening without manual chasing."],
  ["spark", "AI-Powered Marketing & Personalization", "AI-assisted audience segmentation, creative variations and on-site personalisation, reviewed by a person before it ships."],
  ["chart", "Analytics, Reporting & CRO", "GA4 and tag setup, dashboards you can read, and structured A/B tests that improve the pages you already have."]
];

const GROUPS = [
  ["consumer", "Consumer & retail"],
  ["care", "Health & education"],
  ["b2b", "B2B & industrial"],
  ["services", "Services & finance"],
  ["public", "Public & social"],
  ["emerging", "Emerging"]
];

/*  One entry per industry. Keep every field specific to that industry -
 *  if a line could be pasted under any other sector, rewrite it. */
const INDUSTRIES = [
  {
    id: "education", icon: "cap", group: "care", name: "Education",
    who: "Schools, colleges, universities, coaching centres and online courses",
    goal: "Fill seats for the next intake with applicants who are actually eligible.",
    audience: "Parents of school-age children, Class 10–12 students, graduates comparing programmes, and working professionals looking to upskill.",
    challenges: "Enquiries bunch into a short admission season, the parent and the student decide together, and many leads never complete an application.",
    channels: ["Local SEO", "Google Search Ads", "YouTube", "Instagram", "WhatsApp"],
    ideas: ["Admission-season search campaigns by course and city", "Faculty and alumni video stories", "Virtual open days with WhatsApp reminders"],
    kpis: ["Cost per enquiry", "Enquiry-to-application rate", "Campus visits booked", "Enrolments by source"],
    example: "A coaching centre runs a free mock-test landing page before results season, then follows up each registrant on WhatsApp with their score, a counselling slot and the batch that fits.",
    benefit: "A steadier flow of qualified applications and less dependence on agents and walk-ins."
  },
  {
    id: "healthcare", icon: "heart", group: "care", name: "Healthcare",
    who: "Hospitals, clinics, dental practices, diagnostic centres and wellness services",
    goal: "Turn local searches for a treatment or doctor into booked appointments.",
    audience: "Patients and caregivers searching by symptom, speciality or locality, plus referring doctors and corporate HR teams buying health checks.",
    challenges: "Trust is decided by reviews and doctor credentials, medical advertising is regulated, and patient data must be handled carefully.",
    channels: ["Google Business Profile", "Local SEO", "Search Ads", "Doctor-led video", "ORM"],
    ideas: ["Speciality pages with doctor profiles and appointment booking", "Preventive health-check campaigns by season", "Post-visit review requests"],
    kpis: ["Appointments booked", "Calls and direction requests", "Cost per appointment", "Review rating and volume"],
    example: "A dental clinic builds a page for each treatment, answers common questions in short doctor videos, and runs call-only search ads limited to a 5 km radius during clinic hours.",
    benefit: "More appointments from nearby patients and a public profile that reflects the care actually given."
  },
  {
    id: "real-estate", icon: "home", group: "services", name: "Real Estate",
    who: "Residential and commercial projects, builders and property consultants",
    goal: "Generate site visits from buyers with the budget and intent to purchase.",
    audience: "First-time home buyers, investors, NRIs, and businesses looking for office or retail space.",
    challenges: "Long decision cycles, high cost per lead, many duplicate or low-intent enquiries from portals, and RERA disclosure rules on advertising.",
    channels: ["Google Search Ads", "Meta lead ads", "Project microsites", "YouTube walkthroughs", "WhatsApp"],
    ideas: ["Location-and-budget landing pages per project", "Video walkthroughs and construction updates", "NRI campaigns timed to visit seasons"],
    kpis: ["Cost per qualified lead", "Site visits booked", "Lead-to-visit rate", "Bookings by source"],
    example: "A builder launching a 2 and 3 BHK project qualifies leads with a three-question form on budget, timeline and loan status, then sends only the qualified ones to the sales team with a WhatsApp brochure.",
    benefit: "Sales teams spend their time on fewer, better leads, and spend can be tied to bookings rather than form fills."
  },
  {
    id: "retail-ecommerce", icon: "bag", group: "consumer", name: "Retail & E-commerce",
    who: "Online stores, supermarkets, fashion, electronics and consumer products",
    goal: "Grow profitable orders and bring first-time buyers back for a second purchase.",
    audience: "Online shoppers comparing price and delivery, marketplace buyers, and local customers who research online before visiting a store.",
    challenges: "Rising ad costs, thin margins, cart abandonment, returns, and competing with marketplaces on the same products.",
    channels: ["Google Shopping", "Meta catalogue ads", "Email and WhatsApp flows", "Marketplace ads", "SEO"],
    ideas: ["Abandoned-cart and back-in-stock flows", "Festive sale calendar with early-access lists", "Store-visit campaigns for local inventory"],
    kpis: ["ROAS by category", "Conversion rate", "Average order value", "Repeat purchase rate", "Cart abandonment"],
    example: "An electronics store feeds live stock and prices into Shopping ads, bids higher on high-margin accessories, and recovers abandoned carts with a WhatsApp reminder an hour later.",
    benefit: "Revenue that holds up after ad costs and returns, and a customer list that can be marketed to without paying again."
  },
  {
    id: "it-technology", icon: "code", group: "b2b", name: "IT & Technology",
    who: "Software companies, SaaS platforms, IT services and technology startups",
    goal: "Build a pipeline of demo requests and trials from the right company profile.",
    audience: "Founders, CTOs, IT managers and functional heads, usually researching as a buying committee over several weeks.",
    challenges: "Long B2B sales cycles, technical buyers who distrust marketing copy, crowded categories, and attribution across many touchpoints.",
    channels: ["SEO and comparison content", "LinkedIn Ads", "Google Search Ads", "Webinars", "Email nurture"],
    ideas: ["Problem-led guides and integration pages", "Product-led demo videos", "Account-based campaigns to a named target list"],
    kpis: ["Demo requests", "Trial-to-paid rate", "Marketing-qualified leads", "Pipeline value", "CAC payback"],
    example: "A SaaS company publishes a guide for each job its product does, retargets readers on LinkedIn with a two-minute demo, and nurtures trial sign-ups with onboarding emails tied to feature use.",
    benefit: "A predictable pipeline and content that keeps generating demand between campaigns."
  },
  {
    id: "manufacturing", icon: "factory", group: "b2b", name: "Manufacturing & Industrial",
    who: "Factories, industrial equipment, machinery and B2B suppliers",
    goal: "Reach procurement and engineering buyers and win requests for quotation.",
    audience: "Purchase managers, plant heads, design engineers, distributors and export buyers.",
    challenges: "Niche search volumes, technical specifications that are hard to present online, and heavy reliance on trade fairs and existing dealers.",
    channels: ["Technical SEO", "Google Search Ads", "LinkedIn", "B2B marketplaces", "Email"],
    ideas: ["Specification-rich product pages with downloadable datasheets", "Application case notes by industry", "Pre- and post-trade-fair campaigns"],
    kpis: ["RFQs received", "Catalogue downloads", "Qualified enquiries by region", "Dealer enquiries"],
    example: "A pump manufacturer turns its PDF catalogue into searchable product pages by flow rate and application, so an engineer searching a specification lands on the exact model and an enquiry form.",
    benefit: "Enquiries from new regions and buyers who have never met a sales representative."
  },
  {
    id: "travel-hospitality", icon: "globe", group: "consumer", name: "Travel & Hospitality",
    who: "Hotels, resorts, restaurants, travel agencies and tourism operators",
    goal: "Increase direct bookings and reduce commission paid to online travel agencies.",
    audience: "Leisure travellers, families, couples, corporate travel planners and event organisers.",
    challenges: "Seasonal demand, dependence on OTAs, price comparison, and reviews that directly shape occupancy.",
    channels: ["Google Hotel and Search Ads", "Instagram and Reels", "SEO", "Email", "ORM"],
    ideas: ["Direct-booking offers with a best-rate promise", "Destination guides and itineraries", "Off-season packages for nearby cities"],
    kpis: ["Direct booking share", "Cost per booking", "Occupancy by season", "Average daily rate", "Review score"],
    example: "A hill resort promotes a midweek work-from-the-hills package to nearby metros in the off-season, sends past guests an early-access rate, and answers every review within two days.",
    benefit: "A larger share of bookings that arrive without commission, and fuller rooms outside peak season."
  },
  {
    id: "finance-insurance", icon: "card", group: "services", name: "Finance & Insurance",
    who: "Financial services, insurance agencies, fintech and investment services",
    goal: "Acquire verified customers at a sustainable cost while staying compliant.",
    audience: "Salaried professionals, business owners, first-time investors and families comparing loans, policies or investment products.",
    challenges: "Strict advertising and disclosure rules, low trust in unfamiliar brands, drop-off during KYC, and expensive search keywords.",
    channels: ["SEO and calculators", "Google Search Ads", "YouTube education", "Email", "Affiliate partners"],
    ideas: ["EMI, premium and SIP calculators that capture intent", "Plain-language explainer series", "Onboarding drop-off recovery flows"],
    kpis: ["Cost per approved application", "KYC completion rate", "Approval rate", "Customer lifetime value"],
    example: "An insurance agency builds a term-plan comparison guide with a premium calculator, and follows up visitors who started but did not finish a quote with a call-back offer, with all required disclaimers on the page.",
    benefit: "Customers who arrive informed, fewer abandoned applications, and campaigns that pass compliance review."
  },
  {
    id: "automotive", icon: "car", group: "consumer", name: "Automotive",
    who: "Car dealerships, manufacturers, vehicle servicing and spare parts",
    goal: "Drive test drives and service bookings for the local dealership.",
    audience: "First-time buyers, upgraders, fleet owners, and existing customers due for a service.",
    challenges: "A long research phase done mostly online, heavy brand-level advertising to compete with, and low retention after the warranty ends.",
    channels: ["Google Search and vehicle ads", "YouTube", "Meta lead ads", "WhatsApp", "Google Business Profile"],
    ideas: ["Model-comparison and on-road price pages", "Test-drive booking campaigns by locality", "Service reminders based on purchase date"],
    kpis: ["Test drives booked", "Cost per lead", "Lead-to-sale rate", "Service bookings", "Showroom visits"],
    example: "A dealership runs a festive exchange-offer campaign with an on-road price calculator, and sends service reminders on WhatsApp at the intervals the manufacturer recommends.",
    benefit: "More showroom footfall from buyers who are ready to decide, and a workshop that stays busy between sales."
  },
  {
    id: "food-beverage", icon: "cup", group: "consumer", name: "Food & Beverage",
    who: "Restaurants, cafes, cloud kitchens, catering and packaged food brands",
    goal: "Increase orders and repeat visits without giving all the margin to aggregators.",
    audience: "Nearby diners, office teams ordering lunch, families planning events, and shoppers trying a new packaged brand.",
    challenges: "High aggregator commissions, intense local competition, the need for constant fresh visuals, and quick reactions to reviews.",
    channels: ["Instagram and Reels", "Google Business Profile", "Local influencers", "WhatsApp ordering", "Aggregator ads"],
    ideas: ["Weekday lunch and combo offers to nearby offices", "Behind-the-kitchen short videos", "Direct-order loyalty programme"],
    kpis: ["Orders by channel", "Direct-order share", "Repeat order rate", "Average order value", "Review rating"],
    example: "A cloud kitchen adds a QR card to every delivery offering a discount on the next direct order, building a WhatsApp list it can message when a new menu launches.",
    benefit: "A base of regulars who order directly, and better margins on each order."
  },
  {
    id: "fashion-beauty", icon: "tag", group: "consumer", name: "Fashion & Beauty",
    who: "Clothing brands, salons, cosmetics, skincare and beauty services",
    goal: "Build a recognisable brand and convert social attention into sales and bookings.",
    audience: "Style-conscious shoppers who discover on Instagram and YouTube, and local clients looking for a salon or treatment.",
    challenges: "Short trend cycles, high return rates on apparel, a crowded creator space, and claims about skincare results that must be accurate.",
    channels: ["Instagram and Reels", "Influencer partnerships", "Meta catalogue ads", "YouTube", "Email"],
    ideas: ["Creator try-on and routine videos", "User-generated content with a branded hashtag", "Seasonal drops with waitlists"],
    kpis: ["ROAS", "New-customer rate", "Return rate", "Engagement rate", "Salon bookings"],
    example: "A skincare brand sends products to micro-creators with the right skin concerns, turns the best videos into ads with disclosure labels, and offers a routine-builder quiz that recommends a starter kit.",
    benefit: "Lower dependence on discounts and a community that sells the product for you."
  },
  {
    id: "professional-services", icon: "briefcase", group: "services", name: "Professional Services",
    who: "Lawyers, accountants, consultants, architects and business advisors",
    goal: "Be the first credible name a prospect finds when the need arises.",
    audience: "Business owners, finance heads, individuals with a specific legal or tax problem, and developers hiring design firms.",
    challenges: "Buying is based on trust and referral, services are hard to differentiate, and some professions restrict solicitation and advertising.",
    channels: ["SEO and expert articles", "LinkedIn", "Google Business Profile", "Email newsletter", "Webinars"],
    ideas: ["Answer-the-question articles on regulatory changes", "Partner-led LinkedIn commentary", "Client briefings and checklists"],
    kpis: ["Consultation requests", "Enquiry quality", "Newsletter subscribers", "Referral share"],
    example: "An accounting firm publishes a short, dated note each time a GST rule changes and emails it to clients and prospects, positioning its partners as the people to call. Promotion stays within professional-body rules.",
    benefit: "Inbound enquiries from people who already trust your expertise before the first meeting."
  },
  {
    id: "agriculture", icon: "leaf", group: "b2b", name: "Agriculture",
    who: "Agribusiness, agricultural equipment, farming inputs and agri-tech",
    goal: "Reach farmers and dealers in specific regions and crops, in their own language.",
    audience: "Farmers, farmer producer organisations, input dealers, and institutional buyers.",
    challenges: "Regional languages, patchy connectivity, purchase decisions tied to crop seasons, and a strong role for the local dealer.",
    channels: ["YouTube in regional languages", "WhatsApp", "Facebook", "Local SEO", "Dealer locator pages"],
    ideas: ["Crop-stage advisory videos", "Season-timed product campaigns by district", "Dealer-finder with click-to-call"],
    kpis: ["Dealer enquiries", "Video watch time by region", "Calls generated", "Seasonal sales lift"],
    example: "A seed company publishes sowing-season advisory videos in three regional languages and links each one to the nearest dealer, with a WhatsApp number for crop questions.",
    benefit: "Awareness and trust built before the buying season, and dealers who receive ready demand."
  },
  {
    id: "logistics", icon: "truck", group: "b2b", name: "Logistics & Transportation",
    who: "Courier services, freight, shipping and supply chain businesses",
    goal: "Win contract enquiries from businesses that ship regularly.",
    audience: "E-commerce sellers, manufacturers, exporters and supply chain managers.",
    challenges: "A price-driven market, service that is hard to prove before the first shipment, and public complaints when a delivery goes wrong.",
    channels: ["Google Search Ads", "SEO by lane and service", "LinkedIn", "Email", "ORM"],
    ideas: ["Route and service pages with rate-request forms", "Seller onboarding guides", "On-time performance reports as content"],
    kpis: ["Quote requests", "Quote-to-contract rate", "Cost per qualified lead", "Review sentiment"],
    example: "A regional freight operator creates a page for each major lane it serves with transit times and a quote form, and targets search ads only at those origin–destination pairs.",
    benefit: "Enquiries that match the lanes you run profitably, and proof of reliability that supports pricing."
  },
  {
    id: "fitness-wellness", icon: "activity", group: "care", name: "Fitness & Wellness",
    who: "Gyms, yoga studios, fitness trainers and wellness centres",
    goal: "Convert trial visitors into members and keep them past the third month.",
    audience: "Working adults within a few kilometres, beginners, and people returning to fitness with a specific goal.",
    challenges: "January and pre-summer spikes followed by churn, heavy local competition, and results that depend on the member showing up.",
    channels: ["Instagram and Reels", "Google Business Profile", "Meta lead ads", "WhatsApp", "Referral offers"],
    ideas: ["Free trial class campaigns by locality", "Member transformation stories, with consent", "30-day challenge with daily check-ins"],
    kpis: ["Trial sign-ups", "Trial-to-member rate", "Member retention", "Referral joins", "Cost per member"],
    example: "A yoga studio runs a 21-day beginner challenge promoted to a 4 km radius, uses WhatsApp for daily reminders, and offers a membership rate that expires when the challenge ends.",
    benefit: "A fuller schedule and members who stay because they joined a routine, not just a discount."
  },
  {
    id: "entertainment-media", icon: "film", group: "consumer", name: "Entertainment & Media",
    who: "Artists, production houses, event organisers and content creators",
    goal: "Build an audience you can reach directly and sell tickets or views to.",
    audience: "Fans by genre and city, event-goers, sponsors and brand partners.",
    challenges: "Short promotional windows, platform algorithm changes, and audiences that follow but do not buy.",
    channels: ["YouTube", "Instagram and Reels", "Meta event ads", "Email and WhatsApp lists", "Creator collaborations"],
    ideas: ["Teaser-to-release content countdowns", "Early-bird ticket campaigns to past attendees", "Behind-the-scenes series"],
    kpis: ["Tickets sold", "Cost per ticket", "Subscribers and followers", "Watch time", "Sponsor enquiries"],
    example: "An event organiser announces a concert to last year's attendees first with an early-bird window, then uses artist clips as ads to lookalike audiences in the host city.",
    benefit: "An owned audience that lowers the cost of promoting each new release or event."
  },
  {
    id: "ngo-nonprofit", icon: "users", group: "public", name: "NGOs & Nonprofits",
    who: "Charities, social initiatives, fundraising and awareness campaigns",
    goal: "Raise funds and volunteers while showing donors where their money goes.",
    audience: "Individual donors, CSR teams, volunteers, and the communities the organisation serves.",
    challenges: "Small budgets, donor fatigue, the need for transparent reporting, and telling stories with dignity and consent.",
    channels: ["Google Ad Grants", "Email", "Social storytelling", "WhatsApp", "Crowdfunding pages"],
    ideas: ["Monthly-giving campaigns with impact updates", "Year-end and tax-season appeals", "Volunteer recruitment drives"],
    kpis: ["Donations raised", "Recurring donors", "Cost per donation", "Volunteer sign-ups", "Email engagement"],
    example: "An education nonprofit applies for search ad grants, sends monthly donors a short update on one classroom they support, and runs a year-end appeal built around a specific funding goal.",
    benefit: "More predictable income from recurring donors and reporting that sponsors can rely on."
  },
  {
    id: "government", icon: "landmark", group: "public", name: "Government & Public Services",
    who: "Public awareness, citizen engagement and digital information campaigns",
    goal: "Get accurate information to the right citizens and make services easier to use.",
    audience: "Citizens across languages, ages and levels of digital access, plus specific beneficiary groups.",
    challenges: "Multilingual reach, accessibility requirements, misinformation, and procurement and approval processes.",
    channels: ["Accessible websites", "Search", "YouTube and social", "SMS and WhatsApp", "Regional-language content"],
    ideas: ["Scheme-eligibility explainers in regional languages", "Deadline and enrolment reminders", "Myth-versus-fact series"],
    kpis: ["Reach among target groups", "Service applications started and completed", "Helpline calls", "Content accessibility score"],
    example: "A municipal body runs a property-tax deadline campaign with a simple how-to-pay video in two languages, search ads on related queries, and an SMS reminder with the payment link.",
    benefit: "Higher uptake of services and fewer avoidable queries at offices and helplines."
  },
  {
    id: "telecom", icon: "signal", group: "services", name: "Telecommunications",
    who: "Internet providers, telecom operators and communication services",
    goal: "Acquire subscribers in serviceable areas and reduce churn.",
    audience: "Households and businesses comparing plans, and existing subscribers considering a switch.",
    challenges: "Coverage that varies street by street, plans that look alike, and service complaints that play out in public.",
    channels: ["Google Search Ads", "Local SEO by area", "Social customer care", "WhatsApp", "Email"],
    ideas: ["Availability-check landing pages by pin code", "Upgrade offers to existing users", "Speed and uptime proof content"],
    kpis: ["New connections", "Cost per acquisition", "Churn rate", "ARPU", "Complaint resolution time"],
    example: "A broadband provider advertises only in pin codes where fibre is live, sends visitors to an availability checker, and offers existing subscribers an upgrade before their plan renews.",
    benefit: "Marketing spend limited to areas you can actually serve, and fewer subscribers lost at renewal."
  },
  {
    id: "startups-smb", icon: "zap", group: "services", name: "Startups & Small Businesses",
    who: "Local businesses, entrepreneurs and new brands",
    goal: "Get the first steady stream of customers on a limited budget.",
    audience: "Customers in the immediate locality or niche who have not heard of the business yet.",
    challenges: "A small budget, no brand recognition, little time for marketing, and no historical data to learn from.",
    channels: ["Google Business Profile", "Local SEO", "WhatsApp", "Instagram", "Small search campaigns"],
    ideas: ["A complete, reviewed Google Business Profile", "One clear offer on a single landing page", "Referral rewards for early customers"],
    kpis: ["Calls and messages", "Leads per week", "Cost per lead", "Reviews gained", "Repeat customers"],
    example: "A new neighbourhood bakery claims its Google profile, asks each customer for a review, and runs a small search campaign on birthday-cake searches within 3 km.",
    benefit: "Visible local presence and a few channels that work, before money is spread across many."
  },
  {
    id: "pharmacy", icon: "pill", group: "care", name: "Pharmacies & Pharma Retail",
    who: "Retail pharmacies, pharmacy chains, distributors and OTC brands",
    goal: "Bring nearby customers in for refills and wellness products, within advertising rules.",
    audience: "Patients on long-term medication, caregivers, and local shoppers buying wellness and OTC products.",
    challenges: "Prescription medicines cannot be promoted to the public, competition from online pharmacies, and health claims that must be accurate.",
    channels: ["Google Business Profile", "Local SEO", "WhatsApp refill reminders", "Loyalty messaging"],
    ideas: ["Opt-in refill reminders for chronic patients", "Home-delivery and store-hours visibility", "Seasonal wellness and OTC offers"],
    kpis: ["Repeat customers", "Refill adherence", "Calls and direction requests", "Home-delivery orders"],
    example: "A pharmacy chain keeps each branch's hours and stock services current on Google, and sends opt-in refill reminders to chronic patients a few days before their medicine runs out.",
    benefit: "Higher repeat business from existing patients and a stronger position against online-only competitors."
  },
  {
    id: "renewable-ev", icon: "sun", group: "emerging", name: "Renewable Energy & EV",
    who: "Solar installers, EV makers, charging networks and energy services",
    goal: "Educate first-time buyers and generate site-survey or test-ride requests.",
    audience: "Homeowners, housing societies, factory owners, fleet operators and early EV adopters.",
    challenges: "A new category with many buyer doubts, subsidy and policy details that change, and a long payback explanation.",
    channels: ["SEO and calculators", "YouTube explainers", "Google Search Ads", "Meta lead ads", "WhatsApp"],
    ideas: ["Savings and payback calculators", "Subsidy explainers kept up to date", "Customer installation stories"],
    kpis: ["Site surveys booked", "Cost per qualified lead", "Calculator completions", "Quote-to-install rate"],
    example: "A rooftop solar installer offers a bill-based savings calculator, follows up with a site-survey booking link, and keeps a dated page explaining the current subsidy process.",
    benefit: "Buyers who arrive understanding the product, and a shorter path from enquiry to installation."
  },
  {
    id: "gaming-esports", icon: "gamepad", group: "emerging", name: "Gaming & Esports",
    who: "Game studios, esports teams, tournaments and gaming creators",
    goal: "Grow installs and an engaged community that keeps playing.",
    audience: "Mobile and PC gamers by genre, stream viewers, and brands looking for sponsorships.",
    challenges: "High install costs, low day-30 retention, communities that reject overt advertising, and age-appropriate marketing.",
    channels: ["YouTube and streaming creators", "Discord and community", "App install ads", "Instagram and Reels"],
    ideas: ["Creator gameplay launches", "Community tournaments with leaderboards", "Update and season trailers"],
    kpis: ["Cost per install", "Day-7 and day-30 retention", "Community size and activity", "Sponsor enquiries"],
    example: "An indie studio gives early access to mid-size streamers in its genre, runs a launch-week tournament on Discord, and uses the best clips as install ads.",
    benefit: "Players who arrive through people they trust and stay because there is a community to join."
  },
  {
    id: "home-services", icon: "tool", group: "emerging", name: "Home Services & Local Trades",
    who: "Interior designers, electricians, plumbers, cleaning, pest control and repairs",
    goal: "Be chosen when someone nearby searches for an urgent or planned job.",
    audience: "Homeowners, tenants, housing societies and facility managers within the service area.",
    challenges: "Urgent, location-bound demand, lead-selling apps taking a cut, and trust decided almost entirely by reviews and photos.",
    channels: ["Google Business Profile", "Local Services and Search Ads", "WhatsApp", "Before-and-after reels"],
    ideas: ["Service-area pages by locality", "Before-and-after project galleries", "Annual maintenance contract offers"],
    kpis: ["Calls and WhatsApp enquiries", "Jobs booked", "Cost per job", "Review rating", "Repeat contracts"],
    example: "A pest-control company runs call-only ads during working hours in the pin codes it covers, and follows each job with a review request and an annual-contract offer.",
    benefit: "Direct enquiries you do not pay a platform commission on, and repeat contracts from one-off jobs."
  }
];

const GOALS = [
  ["eye", "Increase brand awareness", "Video, social and display campaigns that put the brand in front of a defined audience often enough to be remembered."],
  ["filter", "Generate qualified leads", "Search ads, landing pages and forms that ask the questions sales needs, so fewer leads are wasted."],
  ["trend", "Drive website traffic", "SEO and content that bring visitors searching for what you sell, alongside paid traffic you can switch on or off."],
  ["cart", "Increase sales and online purchases", "Shopping ads, product-page improvements and cart-recovery flows that move visitors to checkout."],
  ["refresh", "Improve engagement and retention", "Email, WhatsApp and loyalty messaging that give existing customers a reason to come back."],
  ["shield", "Build trust and reputation", "Reviews, case notes and consistent answers across every place a customer might check before buying."],
  ["globe", "Expand into new markets", "Localised landing pages, regional-language content and geo-targeted tests before committing a full budget."],
  ["pin", "Generate local customers", "Local SEO and a complete Google Business Profile so you appear in map results for nearby searches."],
  ["coin", "Improve return on investment", "Tracking that ties spend to revenue, so budget moves from channels that cost to channels that earn."]
];

const PROCESS = [
  ["Business & market research", "We learn what you sell, your margins and how customers buy today."],
  ["Target audience identification", "Who decides, who influences, and where each of them looks for answers."],
  ["Competitor analysis", "What rivals rank for, advertise on and say, and where they leave gaps."],
  ["Strategy development", "Channels, budget split, messages and targets written into one plan."],
  ["Website & landing page optimization", "Speed, clarity and tracking fixed before traffic is sent."],
  ["Campaign creation & execution", "Creatives, ads and content launched on an agreed calendar."],
  ["Performance tracking & analytics", "Results reported against the KPIs chosen at the start."],
  ["Continuous optimization & growth", "Budget shifts to what works; what does not is changed or stopped."]
];

const TRENDS = [
  ["spark", "Artificial intelligence in marketing", "Ad platforms now automate bidding and targeting, which makes clean conversion data and good creative the main levers."],
  ["pen", "Generative AI for content", "Faster first drafts and variations, with human editing for accuracy, brand voice and originality."],
  ["search", "SEO and AI-assisted search visibility", "Clear, well-structured, expert content is more likely to be cited in AI-generated answers as well as ranked in results."],
  ["play", "Short-form video", "Reels and Shorts are where discovery happens for many categories; the first seconds decide everything."],
  ["bag", "Social commerce", "Product tagging, creator storefronts and in-chat ordering shorten the path from seeing to buying."],
  ["users", "Personalization and segmentation", "Messages that change by behaviour and stage outperform one broadcast to everyone."],
  ["refresh", "Marketing automation", "Triggered journeys handle follow-up consistently and free people for conversations that need them."],
  ["lock", "First-party data and privacy", "With stricter consent rules, including India's DPDP Act, the data customers choose to share is the most dependable."],
  ["mic", "Voice and conversational search", "Longer, question-style queries reward pages that answer plainly and locally."],
  ["layers", "Omnichannel experiences", "Customers move between store, site, app and chat; the offer and the record should follow them."]
];

const TOOLS = [
  ["Analytics", ["Google Analytics 4", "Google Search Console", "Looker Studio"]],
  ["Advertising", ["Google Ads", "Meta Ads Manager", "LinkedIn Campaign Manager"]],
  ["SEO", ["Semrush", "Ahrefs", "Screaming Frog"]],
  ["Email marketing", ["Mailchimp", "Brevo", "Similar platforms"]],
  ["CRM & automation", ["HubSpot", "Zoho CRM", "WhatsApp Business Platform"]],
  ["Creative", ["Canva", "Adobe Express", "Video-editing tools"]]
];

const METRICS = [
  ["Website traffic", "How many people visit and where they come from. Useful only alongside what they then do."],
  ["Search rankings & organic visibility", "Where your pages appear for target searches, and how many impressions and clicks that earns."],
  ["Click-through rate (CTR)", "The share of people who saw an ad or listing and clicked. A signal of relevance."],
  ["Cost per lead (CPL)", "Total spend divided by leads generated. Compare it with lead quality, not in isolation."],
  ["Conversion rate", "The share of visitors who complete the action you want, such as an enquiry or purchase."],
  ["Customer acquisition cost (CAC)", "Everything spent on marketing and sales to win one new customer."],
  ["Return on ad spend (ROAS)", "Revenue attributed to ads divided by ad spend. It does not account for margin."],
  ["Return on investment (ROI)", "Profit generated relative to total marketing cost, including fees and tools."],
  ["Customer lifetime value (CLV)", "What a customer is worth over the whole relationship; it sets how much you can afford to pay to win one."]
];

const CASES = [
  {
    sector: "Healthcare", title: "A multi-speciality clinic with empty weekday slots",
    challenge: "Weekend appointments are full while weekday mornings sit empty, and most new patients come only by referral.",
    strategy: "Capture nearby treatment searches and steer them towards weekday availability.",
    execution: "Treatment pages with doctor profiles, a completed Google Business Profile per speciality, and search ads scheduled for weekday slots with online booking.",
    measure: "Appointments booked by day of week, cost per appointment, and review volume."
  },
  {
    sector: "Retail & E-commerce", title: "A D2C brand that depends on discounts",
    challenge: "Sales spike during offers and fall away afterwards, and most buyers never return.",
    strategy: "Shift spend from one-time acquisition to repeat purchase.",
    execution: "Post-purchase email and WhatsApp flows, a replenishment reminder timed to product life, and catalogue ads that exclude recent buyers.",
    measure: "Repeat purchase rate, share of revenue from existing customers, and ROAS after discounts."
  },
  {
    sector: "Manufacturing", title: "An equipment maker reliant on trade fairs",
    challenge: "Almost all enquiries arrive at two annual exhibitions, leaving the sales team idle in between.",
    strategy: "Make the catalogue discoverable to engineers searching by specification.",
    execution: "Product pages with datasheets, application notes by industry, and LinkedIn campaigns to purchase and plant heads in target regions.",
    measure: "RFQs per month, enquiries from new regions, and datasheet downloads."
  }
];

const FAQS = [
  ["What is digital marketing?", "Digital marketing is the promotion of a business through online channels such as search engines, social media, email, messaging apps and websites. Unlike most traditional advertising, it lets you target a specific audience and measure what each rupee of spend produced."],
  ["Which digital marketing services does my business need?", "It depends on how your customers buy. A local service business usually starts with a Google Business Profile, local SEO and a small search campaign. An online store needs shopping ads and retention flows. A B2B company leans on SEO, LinkedIn and email. We recommend a mix after reviewing your goals, margins and current results."],
  ["How much does digital marketing cost?", "Cost has two parts: the advertising budget paid to platforms such as Google and Meta, and the fee for strategy, creative and management. Both depend on your industry, competition, locations and targets, so we scope a plan and quote after a free consultation rather than publishing a one-size price."],
  ["How long does SEO take to show results?", "SEO is gradual. Early movement often shows within three to six months, and competitive keywords can take longer. Timing depends on the current state of your site, the competition and how consistently content and fixes are published. Paid search can bring traffic sooner while SEO builds."],
  ["Which platforms are best for my industry?", "Search works wherever people actively look for a solution. Instagram and YouTube suit visual and consumer categories. LinkedIn suits B2B. WhatsApp and Google Business Profile matter for almost every local business in India. The industry directory on this page lists recommended channels sector by sector."],
  ["How can digital marketing generate leads?", "By putting a relevant offer in front of people who are already looking, sending them to a focused landing page, and making it easy to enquire by form, call or WhatsApp. Leads are then followed up quickly, ideally through a CRM so none are lost."],
  ["How do I measure marketing ROI?", "Track conversions properly first: form submissions, calls, purchases and their value. Then compare the profit those conversions generated with the total cost of marketing, including fees. We set this tracking up at the start so reports show outcomes, not only clicks and impressions."],
  ["Can small businesses benefit from digital marketing?", "Yes. Small businesses often gain the most, because they can target a few kilometres around their shop or a narrow niche with a modest budget. The key is to start with one or two channels that match how your customers search, and expand once they are working."]
];

module.exports = { ICONS, SERVICES, GROUPS, INDUSTRIES, GOALS, PROCESS, TRENDS, TOOLS, METRICS, CASES, FAQS };
