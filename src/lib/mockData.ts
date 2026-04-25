export const mockSerp = [
  { site: "zoho.com/in/books", words: 2840, summary: "Promotes Zoho Books with feature comparison and India GST coverage." },
  { site: "tallysolutions.com", summary: "Brand-led pitch for TallyPrime; weak on cloud-first comparisons.", words: 1920 },
  { site: "quickbooks.intuit.com/in", words: 2150, summary: "Generic top-10 list, light on Indian compliance specifics." },
  { site: "g2.com/categories/accounting-india", words: 3420, summary: "Listicle with reviews; thin original analysis." },
  { site: "techjockey.com/blog", words: 2010, summary: "SEO-led roundup; outdated screenshots and pricing." },
];

export const mockGaps = [
  "No comparison of UPI auto-reconciliation across the top 5 tools",
  "Missing pricing breakdown in INR including GST",
  "No mention of CA/Tally migration paths for SMBs",
  "Zero coverage of e-invoicing readiness (B2B turnover > ₹5 Cr)",
  "Mobile app workflows for field-sales founders ignored",
  "No section on multi-GSTIN handling for cross-state sellers",
  "Refund and credit-note flow comparisons are completely absent",
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

Picking accounting software in India isn't just about double-entry bookkeeping anymore. Between GST returns, e-invoicing thresholds, UPI-led collections and the pressure to keep monthly costs sane, Indian founders need a tool that fits the local reality — not one designed for a Delaware C-Corp.

## What Indian founders actually need in 2025

If you're a bootstrapped founder, your accounting stack has to do five things well: GST-ready invoicing, UPI auto-reconciliation, e-invoicing for B2B, multi-GSTIN support, and a clean export to your CA's Tally file. Anything else is a bonus.

## How we evaluated each tool

We scored Zoho Books, TallyPrime, QuickBooks India, Vyapar and Marg ERP across pricing in INR (including GST), UPI reconciliation, e-invoicing readiness, multi-GSTIN handling and CA-friendliness.

## Top 5 accounting software compared

Zoho Books wins on cloud-first UX and UPI auto-match. TallyPrime stays unbeatable for CA hand-off. QuickBooks India is a strong middle ground if you want global aesthetics. Vyapar is the best value under ₹5,000/year for solo founders. Marg ERP shines for inventory-heavy businesses.

## Migration from Tally or Excel

A clean migration takes 2–4 days for most pre-Series A startups. Export your Tally data as XML, map ledgers to Zoho/QuickBooks chart of accounts, and reconcile opening balances at the start of a fiscal quarter — not mid-month.

## Which tool to pick based on your stage

Pre-revenue: Vyapar or Zoho Books free tier. ₹50L–5Cr ARR: Zoho Books Standard. ₹5Cr+: Zoho Books Premium or TallyPrime with a competent CA.

## FAQ

**Is Zoho Books or TallyPrime better for a small Indian startup?** Zoho Books for cloud-first teams; TallyPrime if your CA insists.

**Do I need e-invoicing under ₹5 Cr turnover?** No, but enabling it early avoids a scramble later.

**Can I import Tally data into Zoho Books?** Yes, via XML export and the Zoho migration utility.`;

export const mockHistory = [
  { id: "1", keyword: "best accounting software india", date: "2025-04-22", status: "Article Written" as const },
  { id: "2", keyword: "razorpay vs cashfree", date: "2025-04-19", status: "Brief Generated" as const },
  { id: "3", keyword: "gst registration for freelancers", date: "2025-04-15", status: "Article Written" as const },
  { id: "4", keyword: "upi for saas billing", date: "2025-04-10", status: "Brief Generated" as const },
];