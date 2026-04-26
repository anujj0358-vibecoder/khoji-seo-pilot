import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== "string" || keyword.trim().length < 2) {
      return json({ error: "Invalid keyword" }, 400);
    }
    const kw = keyword.trim();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured in edge function environment");
      return json({ error: "OPENAI_API_KEY not configured on the server" }, 500);
    }
    console.log(`[research-brief] keyword="${kw}" key_present=true key_length=${OPENAI_API_KEY.length}`);

    const systemPrompt = `You are an expert SEO strategist for the Indian market. For a given keyword, return:
- 5 realistic competitor websites currently ranking on Google for that keyword (use real Indian-relevant domains where applicable). For each: site domain, approximate word count (1800-3200), and a one-line summary of what they cover and what they miss.
- 6 specific content gaps — things none of those top results cover well — phrased as crisp bullets.
- An article brief: SEO-optimized title (under 70 chars), meta description (under 160 chars), target word count (~2500-3000), 6 H2 section headings, and 3 useful FAQs. All MUST be specific to the keyword, not generic.`;

    const requestBody = {
      model: "gpt-4o-mini",
      max_tokens: 2000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Keyword: "${kw}"` },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_research",
            description: "Return SERP analysis, gaps and brief for the keyword.",
            parameters: {
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
                    additionalProperties: false,
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
                  additionalProperties: false,
                },
              },
              required: ["serp", "gaps", "brief"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_research" } },
    };

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`[research-brief] OpenAI response status: ${aiRes.status}`);

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`[research-brief] OpenAI API error ${aiRes.status}:`, errorText);
      if (aiRes.status === 401) {
        return json({ error: "Invalid OPENAI_API_KEY. Please check the key in Lovable Cloud secrets.", details: errorText }, 401);
      }
      if (aiRes.status === 429) {
        return json({ error: "OpenAI rate limit or quota exceeded. Check your OpenAI billing.", details: errorText }, 429);
      }
      return json({ error: `OpenAI API error (${aiRes.status})`, details: errorText }, 502);
    }
    const data = await aiRes.json();
    console.log(`[research-brief] OpenAI returned response, choices=${data.choices?.length}`);
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("[research-brief] No tool call in response:", JSON.stringify(data));
      return json({ error: "OpenAI did not return structured output", details: JSON.stringify(data).slice(0, 500) }, 500);
    }
    const parsed = JSON.parse(toolCall.function.arguments);
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