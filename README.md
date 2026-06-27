# craChicago — Make the Case

An interactive participant workbook for a faculty-development workshop on building a
**teaching portfolio as an argument, not an archive**. Built for teaching-track
computer science faculty preparing a promotion case.

## Live site

Published via GitHub Pages: https://akesha.github.io/craChicago/

## What it is

A single-page interactive workbook with:

- **Welcome** — the one idea (Claim · Evidence · Reasoning) and session framing
- **Live Wall** — a warm-up where the room posts what guidance they've been given and
  watches it appear live on a projected screen (optional Firebase backend — see below)
- **01 · Narrative core** — draft your "I am an effective teacher because…" sentence
- **02 · Evidence map** — map evidence items to your institution's promotion criteria
- **03 · 90-day plan** — three concrete moves, mentors, and an accountability partner
- **Hard parts**, **Take-home** checklist, **Resources**, and a generated **skeleton**
- Built-in activity timers and a **Present mode**

Entries are kept in-browser for the session. An optional "Read my draft" coaching
feature uses the host's `window.claude.complete` when available and degrades
gracefully (a self-review prompt) when run as a plain static page.

## Live Wall (optional)

The warm-up's Live Wall uses **Google Firebase (Firestore)** on the free Spark plan so
the room can share responses to one projected screen. Until you paste your Firebase
config into `Make the Case.dc.html`, the warm-up still works — it just saves on each
person's own device and the Live Wall shows the setup guide. Full instructions are in
[`LIVE_WALL_SETUP.md`](LIVE_WALL_SETUP.md) and in the app's "Live Wall" tab.

## Files

- `index.html` — the workbook (served by GitHub Pages); a copy of `Make the Case.dc.html`
- `Make the Case.dc.html` — original authored source (edit Firebase config here)
- `support.js` — the dc-runtime that renders the `<x-dc>` template (loads React/ReactDOM/Babel from unpkg)
- `LIVE_WALL_SETUP.md` — one-time Firebase setup for the Live Wall

## Running locally

It's a static page — open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
# then visit http://localhost:8000/
```
