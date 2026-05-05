import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

type Row = { id: string; keyword: string; status: string; created_at: string };
const HistoryPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Past Briefs</h1>
        <p className="mt-2 text-muted-foreground">Every keyword you've researched and the briefs Khoji built for them.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">You haven't researched anything yet.</p>
            <Button asChild variant="hero" className="mt-4">
              <Link to="/dashboard/research">Start your first research</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-background/50 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-semibold">Keyword</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="text-sm hover:bg-background/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{row.keyword}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">
                      {row.status === "article_written" ? "Article Written" : "Brief Generated"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
  <Button variant="ghost" size="sm" className="text-foreground" onClick={() => navigate(`/dashboard/research/${row.id}`)}>
    <Eye className="h-3.5 w-3.5" /> View
  </Button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
