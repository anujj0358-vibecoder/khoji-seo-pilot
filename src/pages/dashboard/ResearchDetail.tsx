import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Lightbulb, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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

const ResearchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<FullResearch | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase
        .from("researches")
        .select("id, keyword, status, created_at, brief, article")
        .eq("id", id)
        .maybeSingle();
      if (!cancelled) {
        setDetail((data as unknown as FullResearch) ?? null);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 space-y-4">
        <p className="text-muted-foreground">Research not found.</p>
        <Button asChild variant="hero">
          <Link to="/dashboard/history">Back to Past Briefs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
            <Link to="/dashboard/history">
              <ArrowLeft className="h-4 w-4" /> Back to Past Briefs
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{detail.keyword}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Researched on {new Date(detail.created_at).toLocaleString()}
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium whitespace-nowrap">
          {detail.status === "article_written" ? "Article Written" : "Brief Generated"}
        </span>
      </div>

      {detail.brief?.serp && detail.brief.serp.length > 0 && (
        <section className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
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
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  ~{row.words.toLocaleString()} words
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {detail.brief?.gaps && detail.brief.gaps.length > 0 && (
        <section className="rounded-xl border border-primary/40 bg-card overflow-hidden shadow-card">
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
        <section className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
          <div className="px-5 py-3 border-b border-border bg-primary/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <FileText className="h-4 w-4" /> Article Brief
            </h3>
            <span className="text-xs text-muted-foreground">~{detail.brief.wordCount} words target</span>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Title</div>
              <div className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">
                {detail.brief.title}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Meta description</div>
              <div className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">
                {detail.brief.meta}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">H2 sections</div>
              <ul className="space-y-1.5">
                {detail.brief.h2?.map((h, i) => (
                  <li key={i} className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">
                    {i + 1}. {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Suggested FAQs</div>
              <ul className="space-y-1.5">
                {detail.brief.faqs?.map((q, i) => (
                  <li key={i} className="rounded-lg bg-background border border-border px-3 py-2 text-foreground">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {detail.article && (
        <section className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
          <div className="px-5 py-3 border-b border-border bg-primary/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary">Full Article</h3>
            <span className="text-xs text-muted-foreground">
              {detail.article.trim().split(/\s+/).length} words
            </span>
          </div>
          <article className="p-6">
            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed text-sm bg-transparent border-0 p-0">
              {detail.article}
            </pre>
          </article>
        </section>
      )}

      {!detail.brief && !detail.article && (
        <p className="text-sm text-muted-foreground text-center py-8">No saved data for this research.</p>
      )}
    </div>
  );
};

export default ResearchDetail;