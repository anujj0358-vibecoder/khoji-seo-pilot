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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured in edge function environment");
      return json({ error: "OPENAI_API_KEY not configured on the server" }, 500);
    }
    console.log(`[research-article] keyword="${keyword}" key_present=true key_length=${OPENAI_API_KEY.length}`);

    const systemPrompt = `You are a senior SEO content writer for the Indian market. Write a complete, original, well-researched article (~1500 words minimum) in Markdown based on the provided brief and target keyword. Use the exact title as # H1, use each H2 as ## sections in order, write substantial paragraphs (no fluff), include concrete India-specific examples, INR pricing where relevant, and finish with a ## FAQ section answering each provided FAQ. Do not include meta-commentary. Output Markdown only.`;

    const userPrompt = `Keyword: "${keyword}"

Brief:
- Title: ${brief.title}
- Meta: ${brief.meta}
- Target word count: ${brief.wordCount}
- H2s: ${brief.h2.map((h: string, i: number) => `${i + 1}. ${h}`).join("\n  ")}
- FAQs: ${(brief.faqs || []).map((q: string) => `- ${q}`).join("\n  ")}`;

    const requestBody = {
      model: "gpt-4o-mini",
      max_tokens: 2000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`[research-article] OpenAI response status: ${aiRes.status}`);

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`[research-article] OpenAI API error ${aiRes.status}:`, errorText);
      if (aiRes.status === 401) {
        return json({ error: "Invalid OPENAI_API_KEY. Please check the key in Lovable Cloud secrets.", details: errorText }, 401);
      }
      if (aiRes.status === 429) {
        return json({ error: "OpenAI rate limit or quota exceeded. Check your OpenAI billing.", details: errorText }, 429);
      }
      return json({ error: `OpenAI API error (${aiRes.status})`, details: errorText }, 502);
    }
    const data = await aiRes.json();
    console.log(`[research-article] OpenAI returned, choices=${data.choices?.length}`);
    const article = data.choices?.[0]?.message?.content as string | undefined;
    if (!article) {
      console.error("[research-article] Empty article content:", JSON.stringify(data).slice(0, 500));
      return json({ error: "OpenAI returned empty article", details: JSON.stringify(data).slice(0, 500) }, 500);
    }
    return json({ article }, 200);
  } catch (err) {
    console.error("[research-article] Unexpected error:", err);
    return json({ error: "Edge function crashed", details: String(err) }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}