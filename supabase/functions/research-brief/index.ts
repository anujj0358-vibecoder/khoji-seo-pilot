import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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

    const { keyword } = await req.json();
    if (!keyword || keyword.trim().length < 2) return json({ error: "Invalid keyword" }, 400);
    const kw = keyword.trim();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) return json({ error: "GROQ_API_KEY not configured" }, 500);

    const prompt = `You are an expert SEO strategist for the Indian market.

For the keyword: "${kw}"

Return a JSON object with exactly this structure:
{
  "serp": [
    { "site": "domain.com", "words": 2200, "summary": "one line about what they cover and miss" }
  ],
  "gaps": ["gap 1", "gap 2", "gap 3", "gap 4", "gap 5", "gap 6"],
  "brief": {
    "title": "SEO title under 70 chars",
    "meta": "meta description under 160 chars",
    "wordCount": 2500,
    "h2": ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5", "Section 6"],
    "faqs": ["Question 1?", "Question 2?", "Question 3?"]
  }
}

Rules:
- serp must have exactly 5 items with real Indian-relevant domains
- gaps must have exactly 6 items specific to this keyword
- All content must be specific to "${kw}" — nothing generic
- Return ONLY the JSON, no explanation, no markdown`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return json({ error: "Groq API error", details: err }, 502);
    }

    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content;
    if (!text) return json({ error: "Empty response from Groq" }, 500);

    let parsed;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return json({ error: "Invalid JSON from Groq", details: text.slice(0, 300) }, 500);
    }

    return json(parsed, 200);

  } catch (err) {
    return json({ error: "Unexpected error", details: String(err) }, 500);
  }
});