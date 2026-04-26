export const mockSerp = [
  { site: "cleartax.in", words: 2640, summary: "Tax-focused explainer with GST and ITR coverage; light on tooling comparisons." },
  { site: "razorpay.com/blog", words: 2180, summary: "Brand-led post pushing Razorpay products; useful payments context, weak on alternatives." },
  { site: "zoho.com/in", words: 3050, summary: "Comprehensive Zoho-first guide with India GST and UPI workflows." },
  { site: "freshbooks.com", words: 1890, summary: "US-centric overview; misses Indian compliance like e-invoicing and multi-GSTIN." },
  { site: "quickbooks.intuit.com", words: 2920, summary: "Generic global top-10 listicle; thin on INR pricing and CA hand-off." },
];

export const mockGaps = [
  "None of the top articles cover GST filing for freelancers specifically",
  "No comparison of free vs paid tiers for Indian startups under ₹50L ARR",
  "Missing section on Razorpay vs Cashfree for small businesses",
  "Zero coverage of e-invoicing readiness once turnover crosses ₹5 Cr",
  "No realistic Tally → cloud migration timeline for bootstrapped founders",
  "Multi-GSTIN handling for cross-state sellers is completely ignored",
];

export const mockBrief = {
  title: "Best Accounting Software for Indian Startups in 2025 (with GST, UPI & E-Invoicing)",
  meta: "Compare the top accounting software for Indian startups in 2025. Real INR pricing, GST handling, UPI reconciliation, and e-invoicing readiness — reviewed for bootstrapped founders.",
  wordCount: 2800,
  h2: [
    "What Indian founders actually need from accounting software in 2025",
    "How we evaluated each tool (GST, UPI, e-invoicing, pricing)",
    "Top 5 accounting software compared (with INR pricing tables)",
    "Multi-GSTIN, e-invoicing and compliance: who handles it best?",
    "Migration from Tally or Excel: realistic timelines",
    "Which tool to pick based on your stage (pre-revenue → ₹5 Cr+)",
  ],
  faqs: [
    "Is Zoho Books or TallyPrime better for a small Indian startup?",
    "Do I need e-invoicing if my turnover is under ₹5 crore?",
    "Can I import my Tally data into Zoho Books or QuickBooks?",
  ],
};

export const mockArticle = `# Best Accounting Software for Indian Startups in 2025

Picking accounting software in India in 2025 isn't just about double-entry bookkeeping anymore. Between quarterly GST returns, the lowering e-invoicing threshold, UPI-led collections from customers and the constant pressure to keep monthly tooling costs sane, Indian founders need an accounting stack that fits the local reality — not one designed for a Delaware C-Corp running on Stripe. This guide compares the five tools most often shortlisted by Indian startups today, and tells you exactly which one to pick at each revenue stage.

## What Indian founders actually need in 2025

If you're a bootstrapped founder, your accounting stack has to do five things well, and almost nothing else matters. First, GST-ready invoicing with HSN/SAC code support and the right place-of-supply logic. Second, UPI auto-reconciliation so that ₹500 customer payments don't pile up as unmatched line items. Third, e-invoicing readiness because the threshold has been steadily falling and is already at ₹5 Cr aggregate turnover. Fourth, multi-GSTIN support if you sell into more than one state. And fifth, a clean export to whatever your CA actually opens — usually Tally. Most global tools fail on at least three of these.

## How we evaluated each tool

We scored Zoho Books, TallyPrime, QuickBooks India, Vyapar and Marg ERP across six dimensions: pricing in INR including 18% GST, UPI reconciliation accuracy on a 30-transaction sample, e-invoicing readiness (IRN generation and QR code embedding), multi-GSTIN handling for cross-state sellers, CA-friendliness measured by how cleanly data exports back to Tally, and finally the founder experience on a phone — because most Indian founders open their books on mobile, not on a desktop.

## Top 5 accounting software compared

**Zoho Books** wins on cloud-first UX and UPI auto-match — its bank feed for HDFC, ICICI and Axis is genuinely reliable, and the GST returns dashboard is the cleanest in the market. Pricing starts at ₹749/month for the Standard plan. **TallyPrime** stays unbeatable for CA hand-off and stock-heavy SMBs; it's still the default any chartered accountant in Tier-2 cities will recognise. **QuickBooks India** is a strong middle ground if you also need a polished mobile experience and you don't care that some Indian-specific edge cases need workarounds. **Vyapar** is the best value under ₹5,000/year for solo founders and freelancers — particularly strong on simple GST invoicing and WhatsApp share. **Marg ERP** shines for inventory-heavy businesses, especially in pharma and FMCG distribution where batch and expiry tracking matter.

## Multi-GSTIN, e-invoicing and compliance

Zoho Books and TallyPrime are the only two that handle multi-GSTIN cleanly without separate company files. Both also generate e-invoices with IRN and QR codes natively, which becomes mandatory once your aggregate turnover crosses ₹5 Cr. QuickBooks India supports e-invoicing through an add-on. Vyapar and Marg ERP require manual upload to the IRP portal — fine for now, painful at scale.

## Migration from Tally or Excel

A clean migration takes 2–4 days for most pre-Series A startups. Export your Tally data as XML, map ledgers to your new chart of accounts, reconcile opening balances at the start of a fiscal quarter — never mid-month — and run both systems in parallel for the first 30 days. The most common mistake is migrating without locking the prior period in Tally first; you'll end up with two slightly different trial balances and a very unhappy CA.

## Which tool to pick based on your stage

Pre-revenue or under ₹50L ARR: Vyapar, or the Zoho Books free tier if you stay under their invoice limit. ₹50L–5Cr ARR: Zoho Books Standard or Professional — the UPI auto-match alone justifies it. ₹5Cr+: Zoho Books Premium or TallyPrime paired with a competent CA who already knows your industry. Whatever you pick, commit to it for at least 18 months — switching mid-year creates more pain than it saves.

## FAQ

**Is Zoho Books or TallyPrime better for a small Indian startup?** Zoho Books for cloud-first teams that live on dashboards; TallyPrime if your CA insists or if you have heavy inventory.

**Do I need e-invoicing under ₹5 Cr turnover?** No, but enabling it early avoids a scramble the quarter you cross the threshold.

**Can I import Tally data into Zoho Books?** Yes — export as XML, use the Zoho migration utility, and reconcile opening balances on the first day of a quarter.`;

export const mockHistory = [
  { id: "1", keyword: "best accounting software india", date: "2025-04-22", status: "Article Written" as const },
  { id: "2", keyword: "razorpay vs cashfree", date: "2025-04-19", status: "Brief Generated" as const },
  { id: "3", keyword: "gst registration for freelancers", date: "2025-04-15", status: "Article Written" as const },
  { id: "4", keyword: "upi for saas billing", date: "2025-04-10", status: "Brief Generated" as const },
];