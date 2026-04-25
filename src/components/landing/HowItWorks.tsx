import { Search, Lightbulb, CheckCircle2 } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Enter a keyword",
    desc: "Type any topic you want to rank for. Hinglish and Indian niches supported.",
  },
  {
    n: "02",
    icon: Lightbulb,
    title: "See competitor gaps",
    desc: "Khoji analyzes top-ranking pages and surfaces what they all missed.",
  },
  {
    n: "03",
    icon: CheckCircle2,
    title: "Approve and publish",
    desc: "Review the brief, tweak it, then approve. Khoji writes the full article.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="container py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">How it works</h2>
        <p className="mt-4 text-muted-foreground text-lg">From keyword to published article in three steps.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.n} className="group relative rounded-2xl border border-border bg-card p-8 shadow-card hover:border-primary/50 transition-colors">
            <div className="text-5xl font-extrabold text-primary/30 group-hover:text-primary/60 transition-colors mb-4">{step.n}</div>
            <step.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};