import { Shield, Target, Flag, IndianRupee } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Full Control",
    desc: "You approve every brief before a single word is written. No surprise content, no autopilot.",
  },
  {
    icon: Target,
    title: "Competitor Gap Finder",
    desc: "See exactly what the top-ranking articles missed — and turn those gaps into your edge.",
  },
  {
    icon: Flag,
    title: "India First",
    desc: "Razorpay, UPI, Hinglish keywords, and Indian niches are first-class citizens here.",
  },
  {
    icon: IndianRupee,
    title: "Affordable",
    desc: "₹799/month vs ₹8,000+ for Ahrefs. Built for bootstrapped founders, not enterprises.",
  },
];

export const WhyKhoji = () => {
  return (
    <section id="why" className="container py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Why Khoji</h2>
        <p className="mt-4 text-muted-foreground text-lg">An SEO co-pilot, not a black box.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-8 shadow-card hover:border-primary/40 transition-colors">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};