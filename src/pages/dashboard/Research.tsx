import { useEffect, useRef, useState } from "react";
import { Search, Edit3, Copy, Download, FileText, TrendingUp, Lightbulb, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockSerp, mockGaps, mockBrief, mockArticle } from "@/lib/mockData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Research = () => {
  const { session } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [researching, setResearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [writing, setWriting] = useState(false);
  const [approved, setApproved] = useState(false);
  const researchIdRef = useRef<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const k = keyword.trim();
    if (!k) return;
    setResearching(true);
    setShowResults(false);
    setApproved(false);
    researchIdRef.current = null;

    await new Promise((r) => setTimeout(r, 2000));

    // persist research to supabase
    if (session?.user) {
      const { data, error } = await supabase
        .from("researches")
        .insert({
          user_id: session.user.id,
          keyword: k,
          status: "brief_generated",
          brief: mockBrief as any,
        })
        .select("id")
        .maybeSingle();
      if (error) {
        toast.error("Could not save research");
      } else if (data) {
        researchIdRef.current = data.id;
      }
    }

    setSubmittedKeyword(k);
    setResearching(false);
    setShowResults(true);
    toast.success("SERP analyzed — brief ready");
  };

  const handleApprove = async () => {
    setWriting(true);
    await new Promise((r) => setTimeout(r, 3000));

    if (researchIdRef.current && session?.user) {
      await supabase
        .from("researches")
        .update({ status: "article_written", article: mockArticle })
        .eq("id", researchIdRef.current);
    }

    setWriting(false);
    setApproved(true);
    toast.success("Brief approved — article generated");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockArticle);
    toast.success("Article copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([mockArticle], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${submittedKeyword.replace(/\s+/g, "-") || "article"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Keyword Research</h1>
        <p className="mt-2 text-muted-foreground">Enter a keyword and Khoji will analyze the SERP, find gaps, and draft a brief.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword to research… e.g. best accounting software India"
            className="h-14 pl-12 text-base bg-card border-border text-foreground"
            disabled={researching}
          />
        </div>
        <Button type="submit" variant="hero" size="xl" disabled={researching || !keyword.trim()}>
          {researching ? (<><Loader2 className="h-4 w-4 animate-spin" /> Researching…</>) : "Research"}
        </Button>
      </form>

      {!showResults && !researching && (
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, label: "SERP Analysis" },
            { icon: Lightbulb, label: "Competitor Gaps" },
            { icon: FileText, label: "Article Brief" },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
              <c.icon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-medium text-muted-foreground">{c.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">Run a search to see results</div>
            </div>
          ))}
        </div>
      )}

      {researching && (
        <div className="rounded-2xl border border-border bg-card p-16 flex flex-col items-center justify-center shadow-card">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <div className="mt-4 text-foreground font-medium">Analyzing top-ranking pages…</div>
          <div className="mt-1 text-sm text-muted-foreground">Reading SERPs, finding gaps, drafting your brief.</div>
        </div>
      )}

      {showResults && (
        <>
          {/* SERP Analysis */}
          <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
            <div className="px-6 py-4 border-b border-border bg-primary/10">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Top Ranking Pages
              </h2>
            </div>
            <div className="divide-y divide-border">
              {mockSerp.map((row, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <div className="text-2xl font-bold text-muted-foreground/60 w-8">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      {row.site}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{row.summary}</p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">~{row.words.toLocaleString()} words</div>
                </div>
              ))}
            </div>
          </section>

          {/* Gaps */}
          <section className="rounded-2xl border border-primary/40 bg-card overflow-hidden shadow-glow">
            <div className="px-6 py-4 border-b border-border bg-orange-gradient">
              <h2 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> What They All Missed
              </h2>
            </div>
            <ul className="p-6 space-y-3">
              {mockGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Brief */}
          <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
            <div className="px-6 py-4 border-b border-border bg-primary/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" /> Article Brief
              </h2>
              <span className="text-xs text-muted-foreground">~{mockBrief.wordCount} words target</span>
            </div>
            <div className="p-6 space-y-6">
              <BriefField label="Title" value={mockBrief.title} />
              <BriefField label="Meta description" value={mockBrief.meta} />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-foreground">H2 sections</div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
                <ul className="space-y-2">
                  {mockBrief.h2.map((h, i) => (
                    <li key={i} className="rounded-lg bg-background border border-border px-4 py-2.5 text-sm text-foreground">
                      {i + 1}. {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-foreground">Suggested FAQs</div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
                <ul className="space-y-2">
                  {mockBrief.faqs.map((q, i) => (
                    <li key={i} className="rounded-lg bg-background border border-border px-4 py-2.5 text-sm text-foreground">{q}</li>
                  ))}
                </ul>
              </div>
              {!approved && (
                <Button onClick={handleApprove} variant="hero" size="xl" className="w-full" disabled={writing}>
                  {writing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Writing your article…</>) : "Approve Brief & Write Article"}
                </Button>
              )}
            </div>
          </section>

          {writing && (
            <div className="rounded-2xl border border-border bg-card p-16 flex flex-col items-center justify-center shadow-card">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <div className="mt-4 text-foreground font-medium">Writing your article…</div>
              <div className="mt-1 text-sm text-muted-foreground">Drafting H2s, FAQs and intro. About 3 seconds.</div>
            </div>
          )}

          {approved && (
            <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
              <div className="px-6 py-4 border-b border-border bg-primary/10 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Full Article</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{mockArticle.split(/\s+/).length} words</span>
                  <Button onClick={handleCopy} variant="ghost" size="sm" className="text-foreground">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button onClick={handleDownload} variant="ghost" size="sm" className="text-foreground">
                    <Download className="h-3.5 w-3.5" /> .txt
                  </Button>
                </div>
              </div>
              <article className="p-8 prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed text-[15px] bg-transparent border-0 p-0">{mockArticle}</pre>
              </article>
            </section>
          )}
        </>
      )}
    </div>
  );
};

const BriefField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        <Edit3 className="h-3.5 w-3.5" /> Edit
      </Button>
    </div>
    <div className="rounded-lg bg-background border border-border px-4 py-3 text-foreground">{value}</div>
  </div>
);

export default Research;
