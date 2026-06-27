// Make the Case — AI feedback proxy (Cloudflare Worker)
//
// The workbook's "Read my draft" (Activity 1) and "Check my mapping" (Activity 2)
// buttons POST a prompt here; this Worker forwards it to the Anthropic Messages API
// and returns the coaching text. The Anthropic API key lives as a Worker SECRET
// (ANTHROPIC_API_KEY) — it is never in the page or the repo.
//
// Deploy:  npx wrangler deploy
// Secret:  npx wrangler secret put ANTHROPIC_API_KEY

const ALLOWED_ORIGINS = new Set([
  "https://akesha.github.io", // GitHub Pages site that serves the workbook
]);

// Short, encouraging coaching — Haiku is fast and cheap and plenty for this.
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 400;
const MAX_PROMPT = 4000;

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://akesha.github.io";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "POST only" }, 405, cors);
    }

    let prompt;
    try {
      const body = await request.json();
      prompt = body && typeof body.prompt === "string" ? body.prompt : "";
    } catch {
      return json({ error: "bad JSON" }, 400, cors);
    }
    if (!prompt || prompt.length > MAX_PROMPT) {
      return json({ error: "prompt missing or too long" }, 400, cors);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "server not configured (set ANTHROPIC_API_KEY)" }, 500, cors);
    }

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!r.ok) {
        const detail = await r.text();
        return json({ error: "upstream " + r.status, detail }, 502, cors);
      }
      const data = await r.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      return json({ text }, 200, cors);
    } catch (err) {
      return json({ error: "proxy failure", detail: String(err) }, 502, cors);
    }
  },
};
