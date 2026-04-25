import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />
      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Indian indie hackers
          </div>
          <div className="relative inline-block">
            {/* Subtle orange glow behind headline */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 blur-3xl opacity-50 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 40%, hsl(19 91% 47% / 0.55), transparent 55%), radial-gradient(ellipse at 75% 70%, hsl(19 95% 60% / 0.4), transparent 60%)",
              }}
            />
            <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              Keyword to Ranked Article —{" "}
              <span className="bg-orange-gradient bg-clip-text text-transparent">You Stay in Control</span>
            </h1>
          </div>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Khoji analyzes your competitors, finds their content gaps, and writes SEO articles you approve before they go live. Built for Indian founders. ₹799/month.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            3-day free trial · No credit card to start · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};