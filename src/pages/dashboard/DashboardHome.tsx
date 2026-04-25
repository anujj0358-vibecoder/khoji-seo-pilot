import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, History, FileText, ArrowRight } from "lucide-react";
import { mockHistory } from "@/lib/mockData";

const DashboardHome = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back 👋</h1>
        <p className="mt-2 text-muted-foreground">Pick up where you left off, or start a new keyword research.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={Search} label="Keyword searches" value="14" />
        <Stat icon={FileText} label="Briefs generated" value="9" />
        <Stat icon={History} label="Articles written" value="5" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-card relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial pointer-events-none" />
        <div className="relative">
          <h2 className="text-xl font-bold text-foreground">Start a new keyword research</h2>
          <p className="mt-2 text-muted-foreground">Find competitor gaps and generate an SEO-ready brief in under a minute.</p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/dashboard/research">
              New Research <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent activity</h2>
          <Link to="/dashboard/history" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card divide-y divide-border">
          {mockHistory.slice(0, 3).map((row) => (
            <div key={row.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">{row.keyword}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{row.date}</div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-medium">{row.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
    <Icon className="h-5 w-5 text-primary mb-3" />
    <div className="text-3xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

export default DashboardHome;