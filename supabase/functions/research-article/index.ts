import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const { keyword, brief } = await req.json();
    if (!keyword || !brief?.title || !Array.isArray(brief?.h2)) {
      return json({ error: "Invalid payload" }, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);

    const systemPrompt = `You are a senior SEO content writer for the Indian market. Write a complete, original, well-researched article (~1500 words minimum) in Markdown based on the provided brief and target keyword. Use the exact title as # H1, use each H2 as ## sections in order, write substantial paragraphs (no fluff), include concrete India-specific examples, INR pricing where relevant, and finish with a ## FAQ section answering each provided FAQ. Do not include meta-commentary. Output Markdown only.`;

    const userPrompt = `Keyword: "${keyword}"

Brief:
- Title: ${brief.title}
- Meta: ${brief.meta}
- Target word count: ${brief.wordCount}
- H2s: ${brief.h2.map((h: string, i: number) => `${i + 1}. ${h}`).join("\n  ")}
- FAQs: ${(brief.faqs || []).map((q: string) => `- ${q}`).join("\n  ")}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (aiRes.status === 429) return json({ error: "Rate limit — please try again in a moment." }, 429);
    if (aiRes.status === 402) return json({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }, 402);
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return json({ error: "AI gateway error" }, 500);
    }
    const data = await aiRes.json();
    const article = data.choices?.[0]?.message?.content as string | undefined;
    if (!article) return json({ error: "Empty article" }, 500);
    return json({ article }, 200);
  } catch (err) {
    console.error("research-article error", err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}