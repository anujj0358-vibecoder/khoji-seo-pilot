import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Unlimited keyword searches",
  "SERP analysis for any keyword",
  "Competitor gap finder",
  "Article brief generator",
  "Full AI article writing",
  "Razorpay + UPI payment",
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Simple, founder-friendly pricing</h2>
        <p className="mt-4 text-muted-foreground text-lg">One plan. Everything included. Cancel anytime.</p>
      </div>
      <div className="max-w-md mx-auto">
        <div className="relative rounded-3xl border border-primary/40 bg-card p-8 shadow-glow">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-gradient px-4 py-1 text-xs font-bold text-primary-foreground">
            MOST POPULAR
          </div>
          <h3 className="text-2xl font-bold text-foreground">Khoji Pro</h3>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-foreground">₹799</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">3-day free trial · Cancel anytime</p>
          <ul className="mt-8 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-foreground">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="hero" size="lg" className="mt-8 w-full">
            <Link to="/auth">Start Free Trial</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};