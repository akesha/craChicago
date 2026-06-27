# Make the Case — AI feedback proxy

A tiny Cloudflare Worker that lets the workbook's **"Read my draft"** and
**"Check my mapping"** buttons work on the public GitHub Pages site. It forwards each
prompt to the Anthropic Messages API and returns the coaching text. The Anthropic API
key is stored as a Worker **secret**, never in the page or this repo.

## One-time deploy

From this `worker/` folder:

```bash
npx wrangler login                          # opens a browser to authorize Cloudflare
npx wrangler deploy                         # deploys the Worker, prints its URL
npx wrangler secret put ANTHROPIC_API_KEY   # paste your Anthropic API key when prompted
```

The deploy prints a URL like
`https://make-the-case-feedback.<your-subdomain>.workers.dev`. Put that URL into
`MTC_FEEDBACK_URL` near the top of `../Make the Case.dc.html`, copy the file to
`../index.html`, and push — then the buttons call this Worker.

## How the page picks a backend

In `getFb()` the workbook tries, in order:

1. `window.claude.complete` — present only inside Claude's artifact host.
2. `window.MTC_FEEDBACK_URL` — this Worker, used on the public site.
3. Otherwise it shows a self-review fallback message.

## Notes

- **Model:** `claude-haiku-4-5-20251001` (fast, cheap, good for short coaching). Change
  `MODEL` in `src/index.js` to upgrade quality.
- **CORS** is locked to `https://akesha.github.io`. Add origins to `ALLOWED_ORIGINS`
  in `src/index.js` if you host the page elsewhere.
- **Cost** is usage-based and tiny for a workshop. The Worker itself runs on
  Cloudflare's free tier. Watch usage at console.anthropic.com.
- The Worker rejects prompts over 4000 chars and only accepts POST.
