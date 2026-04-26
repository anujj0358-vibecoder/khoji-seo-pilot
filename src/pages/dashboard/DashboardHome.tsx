import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, History, FileText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

type Row = { id: string; keyword: string; status: string; created_at: string };

const DashboardHome = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!session?.user) return;
      const { data } = await supabase
        .from("researches")
        .select("id, keyword, status, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setRows((data as Row[]) ?? []);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const searches = rows.length;
  const briefs = rows.filter((r) => r.status === "brief_generated" || r.status === "article_written").length;
  const articles = rows.filter((r) => r.status === "article_written").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back 👋</h1>
        <p className="mt-2 text-muted-foreground">Pick up where you left off, or start a new keyword research.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={Search} label="Keyword searches" value={loading ? null : searches} />
        <Stat icon={FileText} label="Briefs generated" value={loading ? null : briefs} />
        <Stat icon={History} label="Articles written" value={loading ? null : articles} />
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
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : rows.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No research yet. <Link to="/dashboard/research" className="text-primary hover:underline">Start your first one →</Link>
            </div>
          ) : (
            rows.slice(0, 3).map((row) => (
              <div key={row.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{row.keyword}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{new Date(row.created_at).toLocaleDateString()}</div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-medium">
                  {row.status === "article_written" ? "Article Written" : "Brief Generated"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | null }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
    <Icon className="h-5 w-5 text-primary mb-3" />
    {value === null ? (
      <Skeleton className="h-9 w-12" />
    ) : (
      <div className="text-3xl font-bold text-foreground">{value}</div>
    )}
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

export default DashboardHome;
