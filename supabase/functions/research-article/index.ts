import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } }
    );
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    // Enforce active subscription server-side
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: sub } = await admin
      .from("subscriptions")
      .select("status, expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    const active = sub?.status === "active" &&
      (!sub.expires_at || new Date(sub.expires_at) > new Date());
    if (!active) return json({ error: "Subscription required" }, 403);

    const { keyword, brief } = await req.json();
    if (!keyword || !brief?.title || !Array.isArray(brief?.h2)) {
      return json({ error: "Invalid payload" }, 400);
    }

    // Validate / cap inputs to mitigate prompt injection and quota abuse
    const sanitize = (s: unknown, max: number) =>
      String(s ?? "").slice(0, max).replace(/[`]/g, "").replace(/\r/g, "");
    if (typeof keyword !== "string" || keyword.length > 200) {
      return json({ error: "Invalid keyword" }, 400);
    }
    if (brief.h2.length > 12 || (brief.faqs && brief.faqs.length > 12)) {
      return json({ error: "Brief too large" }, 400);
    }
    const safeKeyword = sanitize(keyword, 200);
    const safeBrief = {
      title: sanitize(brief.title, 200),
      meta: sanitize(brief.meta, 300),
      wordCount: Math.min(Number(brief.wordCount) || 1500, 3000),
      h2: brief.h2.slice(0, 12).map((h: unknown) => sanitize(h, 150)),
      faqs: (brief.faqs || []).slice(0, 12).map((q: unknown) => sanitize(q, 200)),
    };

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY not configured in edge function environment");
      return json({ error: "GROQ_API_KEY not configured on the server" }, 500);
    }
    console.log(`[research-article] keyword="${safeKeyword}" key_present=true`);

    const systemPrompt = `You are a senior SEO content writer for the Indian market. Write a complete, original, well-researched article (~1500 words minimum) in Markdown based on the provided brief and target keyword. Use the exact title as # H1, use each H2 as ## sections in order, write substantial paragraphs (no fluff), include concrete India-specific examples, INR pricing where relevant, and finish with a ## FAQ section answering each provided FAQ. Do not include meta-commentary. Output Markdown only.`;

    const userPrompt = `Keyword: "${safeKeyword}"

Brief:
- Title: ${safeBrief.title}
- Meta: ${safeBrief.meta}
- Target word count: ${safeBrief.wordCount}
- H2s: ${safeBrief.h2.map((h: string, i: number) => `${i + 1}. ${h}`).join("\n  ")}
- FAQs: ${safeBrief.faqs.map((q: string) => `- ${q}`).join("\n  ")}`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    console.log(`[research-article] Groq response status: ${aiRes.status}`);

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`[research-article] Groq API error ${aiRes.status}:`, errorText);
      if (aiRes.status === 429) {
        return json({ error: "Service is busy. Please try again shortly." }, 429);
      }
      return json({ error: "Upstream AI service error" }, 502);
    }
    const data = await aiRes.json();
    const article = data.choices?.[0]?.message?.content as string | undefined;
    if (!article) {
      console.error("[research-article] Empty article content:", JSON.stringify(data).slice(0, 500));
      return json({ error: "Empty response from AI" }, 500);
    }
    return json({ article }, 200);
  } catch (err) {
    console.error("[research-article] Unexpected error:", err);
    return json({ error: "An unexpected error occurred. Please try again." }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}