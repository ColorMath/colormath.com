# colormath.com

Landing page for ColorMath, a product design & engineering studio. Next.js (static export) + Sanity CMS, deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev        # http://localhost:3000, Studio at /studio
```

The site renders fallback copy (from `sanity/lib/content.ts`) until Sanity is connected, so it always builds.

## Connect Sanity (one-time)

1. Create a project: `npx sanity init --bare` (log in when prompted) and note the project ID.
2. Put the ID in `.env.local` (copy `.env.local.example`).
3. Allow the sites to talk to the API at https://www.sanity.io/manage → project → API → CORS origins: add `http://localhost:3000` and `https://colormath.com` (with credentials).
4. Seed the initial content: `npx sanity dataset import sanity/seed.ndjson production` (run from the repo root; needs `SANITY_STUDIO_PROJECT_ID`/`--project` if not inferred).
5. Edit content at `/studio`. The landing page picks changes up at the next build.

## Deploy (GitHub Pages)

Deploys run from `.github/workflows/deploy.yml` on every push to `main`.

One-time repo setup:

1. GitHub repo → Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets and variables → Actions → **Variables** → add `NEXT_PUBLIC_SANITY_PROJECT_ID` (the dataset defaults to `production`).
3. Custom domain stays `colormath.com` via `public/CNAME`.

### Rebuild when content is published

GitHub Pages doesn't watch Sanity, so publishing content requires a rebuild. Either re-run the workflow (Actions → Deploy to GitHub Pages → Run workflow), or wire it up automatically:

1. Create a GitHub fine-grained PAT with `contents: read/write` on this repo.
2. In Sanity → API → Webhooks, add a webhook that POSTs to
   `https://api.github.com/repos/<owner>/colormath.com/dispatches` with header
   `Authorization: Bearer <PAT>` and body `{"event_type": "sanity-publish"}`,
   filtered to `_type == "landingPage"`.

## Notes

- The embedded Studio is a client-side app; enter it at `/studio` (deep links like `/studio/structure/...` won't survive a hard refresh on GitHub Pages).
- Brand assets live in `public/img`; `wordmark-mark.png` and `logo-mark.png` are transparent-background crops extracted from the originals.
- Design context for AI-assisted work: `PRODUCT.md` and `DESIGN.md`.
