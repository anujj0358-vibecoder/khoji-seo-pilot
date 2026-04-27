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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured in edge function environment");
      return json({ error: "GEMINI_API_KEY not configured on the server" }, 500);
    }
    console.log(`[research-article] keyword="${keyword}" key_present=true key_length=${GEMINI_API_KEY.length}`);

    const systemPrompt = `You are a senior SEO content writer for the Indian market. Write a complete, original, well-researched article (~1500 words minimum) in Markdown based on the provided brief and target keyword. Use the exact title as # H1, use each H2 as ## sections in order, write substantial paragraphs (no fluff), include concrete India-specific examples, INR pricing where relevant, and finish with a ## FAQ section answering each provided FAQ. Do not include meta-commentary. Output Markdown only.`;

    const userPrompt = `Keyword: "${keyword}"

Brief:
- Title: ${brief.title}
- Meta: ${brief.meta}
- Target word count: ${brief.wordCount}
- H2s: ${brief.h2.map((h: string, i: number) => `${i + 1}. ${h}`).join("\n  ")}
- FAQs: ${(brief.faqs || []).map((q: string) => `- ${q}`).join("\n  ")}`;

    const requestBody = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
      },
    };

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    console.log(`[research-article] Gemini response status: ${aiRes.status}`);

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`[research-article] Gemini API error ${aiRes.status}:`, errorText);
      if (aiRes.status === 400) {
        return json({ error: "Invalid request or GEMINI_API_KEY. Please check the key in Lovable Cloud secrets.", details: errorText }, 400);
      }
      if (aiRes.status === 429) {
        return json({ error: "Gemini rate limit or quota exceeded.", details: errorText }, 429);
      }
      return json({ error: `Gemini API error (${aiRes.status})`, details: errorText }, 502);
    }
    const data = await aiRes.json();
    const article = data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
    if (!article) {
      console.error("[research-article] Empty article content:", JSON.stringify(data).slice(0, 500));
      return json({ error: "Gemini returned empty article", details: JSON.stringify(data).slice(0, 500) }, 500);
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