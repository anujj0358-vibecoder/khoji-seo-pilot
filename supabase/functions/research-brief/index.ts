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

    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== "string" || keyword.trim().length < 2) {
      return json({ error: "Invalid keyword" }, 400);
    }
    const kw = keyword.trim();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured in edge function environment");
      return json({ error: "GEMINI_API_KEY not configured on the server" }, 500);
    }
    console.log(`[research-brief] keyword="${kw}" key_present=true key_length=${GEMINI_API_KEY.length}`);

    const systemPrompt = `You are an expert SEO strategist for the Indian market. For a given keyword, return:
- 5 realistic competitor websites currently ranking on Google for that keyword (use real Indian-relevant domains where applicable). For each: site domain, approximate word count (1800-3200), and a one-line summary of what they cover and what they miss.
- 6 specific content gaps — things none of those top results cover well — phrased as crisp bullets.
- An article brief: SEO-optimized title (under 70 chars), meta description (under 160 chars), target word count (~2500-3000), 6 H2 section headings, and 3 useful FAQs. All MUST be specific to the keyword, not generic.`;

    const responseSchema = {
      type: "object",
      properties: {
        serp: {
          type: "array",
          items: {
            type: "object",
            properties: {
              site: { type: "string" },
              words: { type: "number" },
              summary: { type: "string" },
            },
            required: ["site", "words", "summary"],
          },
        },
        gaps: { type: "array", items: { type: "string" } },
        brief: {
          type: "object",
          properties: {
            title: { type: "string" },
            meta: { type: "string" },
            wordCount: { type: "number" },
            h2: { type: "array", items: { type: "string" } },
            faqs: { type: "array", items: { type: "string" } },
          },
          required: ["title", "meta", "wordCount", "h2", "faqs"],
        },
      },
      required: ["serp", "gaps", "brief"],
    };

    const requestBody = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: `Keyword: "${kw}"` }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        responseMimeType: "application/json",
        responseSchema,
      },
    };

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    console.log(`[research-brief] Gemini response status: ${aiRes.status}`);

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`[research-brief] Gemini API error ${aiRes.status}:`, errorText);
      if (aiRes.status === 400) {
        return json({ error: "Invalid request or GEMINI_API_KEY. Please check the key in Lovable Cloud secrets.", details: errorText }, 400);
      }
      if (aiRes.status === 429) {
        return json({ error: "Gemini rate limit or quota exceeded.", details: errorText }, 429);
      }
      return json({ error: `Gemini API error (${aiRes.status})`, details: errorText }, 502);
    }
    const data = await aiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("[research-brief] No text in Gemini response:", JSON.stringify(data).slice(0, 500));
      return json({ error: "Gemini returned empty response", details: JSON.stringify(data).slice(0, 500) }, 500);
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("[research-brief] Failed to parse Gemini JSON:", text.slice(0, 500));
      return json({ error: "Gemini did not return valid JSON", details: text.slice(0, 500) }, 500);
    }
    return json(parsed, 200);
  } catch (err) {
    console.error("[research-brief] Unexpected error:", err);
    return json({ error: "Edge function crashed", details: String(err) }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}