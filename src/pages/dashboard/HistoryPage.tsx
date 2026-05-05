import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, FileText, Lightbulb, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Row = { id: string; keyword: string; status: string; created_at: string };
type SerpRow = { site: string; words: number; summary: string };
type Brief = {
  title: string;
  meta: string;
  wordCount: number;
  h2: string[];
  faqs: string[];
  serp?: SerpRow[];
  gaps?: string[];
};
type FullResearch = {
  id: string;
  keyword: string;
  status: string;
  created_at: string;
  brief: Brief | null;
  article: string | null;
};

const HistoryPage = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<FullResearch | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const handleView = async (id: string) => {
    setOpenId(id);
    setDetail(null);
    setDetailLoading(true);
    const { data, error } = await supabase
      .from("researches")
      .select("id, keyword, status, created_at, brief, article")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) setDetail(data as unknown as FullResearch);
    setDetailLoading(false);
  };

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
                    <Button variant="ghost" size="sm" className="text-foreground" onClick={() => handleView(row.id)}>
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => { if (!o) { setOpenId(null); setDetail(null); } }}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detail?.keyword ?? "Research"}</DialogTitle>
            <DialogDescription>
              {detail ? new Date(detail.created_at).toLocaleString() : "Loading saved research…"}
            </DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!detailLoading && detail && (
            <div className="space-y-6">
              {detail.brief?.serp && detail.brief.serp.length > 0 && (
                <section className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-primary/10">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> SERP Analysis
                    </h3>
                  </div>
                  <div className="divide-y divide-border">
                    {detail.brief.serp.map((row, i) => (
                      <div key={i} className="px-5 py-3 flex items-start gap-4">
                        <div className="text-lg font-bold text-muted-foreground/60 w-6">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                            {row.site}
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{row.summary}</p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">~{row.words.toLocaleString()} words</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {detail.brief?.gaps && detail.brief.gaps.length > 0 && (
                <section className="rounded-xl border border-primary/40 bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-orange-gradient">
                    <h3 className="text-sm font-bold text-primary-foreground flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Competitor Gaps
                    </h3>
                  </div>
                  <ul className="p-5 space-y-2">
                    {detail.brief.gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {detail.brief && (
                <section className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-primary/10 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Article Brief
                    </h3>
                    <span className="text-xs text-muted-foreground">~{detail.brief.wordCount} words target</span>
                  </div>
                  <div className="p-5 space-y-4 text-sm">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Title</div>
                      <div className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">{detail.brief.title}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Meta description</div>
                      <div className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">{detail.brief.meta}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">H2 sections</div>
                      <ul className="space-y-1.5">
                        {detail.brief.h2?.map((h, i) => (
                          <li key={i} className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">{i + 1}. {h}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Suggested FAQs</div>
                      <ul className="space-y-1.5">
                        {detail.brief.faqs?.map((q, i) => (
                          <li key={i} className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {detail.article && (
                <section className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-primary/10 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-primary">Full Article</h3>
                    <span className="text-xs text-muted-foreground">{detail.article.trim().split(/\s+/).length} words</span>
                  </div>
                  <article className="p-6">
                    <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed text-sm bg-transparent border-0 p-0">{detail.article}</pre>
                  </article>
                </section>
              )}

              {!detail.brief && !detail.article && (
                <p className="text-sm text-muted-foreground text-center py-8">No saved data for this research.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
