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

    const { keyword } = await req.json();
    if (typeof keyword !== "string" || keyword.trim().length < 2) {
      return json({ error: "Invalid keyword" }, 400);
    }
    const kw = keyword.trim().slice(0, 200).replace(/[`"\\]/g, "").replace(/\s+/g, " ");
    if (kw.length < 2) return json({ error: "Invalid keyword" }, 400);

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
      console.error("[research-brief] Groq error", groqRes.status, await groqRes.text());
      return json({ error: "Upstream AI service error" }, 502);
    }

    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content;
    if (!text) return json({ error: "Empty response from Groq" }, 500);

    let parsed;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("[research-brief] JSON parse failed", e, text?.slice?.(0, 300));
      return json({ error: "Invalid response from AI" }, 500);
    }

    return json(parsed, 200);

  } catch (err) {
    console.error("[research-brief] Unexpected error:", err);
    return json({ error: "An unexpected error occurred. Please try again." }, 500);
  }
});