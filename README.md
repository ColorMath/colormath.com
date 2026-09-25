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

GitHub Pages doesn't watch Sanity, so the site is rebuilt for you: every 10
minutes `.github/workflows/sanity-watch.yml` asks Sanity when content was last
published and, if that's newer than the last successful deploy, runs
**Deploy to GitHub Pages**. It uses the public dataset and the workflow's own
token, so no secrets are needed. A publish shows up on the site within about
10–15 minutes. To rebuild immediately, run the Deploy workflow by hand
(Actions → Deploy to GitHub Pages → Run workflow).

## Notes

- The embedded Studio is a client-side app; enter it at `/studio` (deep links like `/studio/structure/...` won't survive a hard refresh on GitHub Pages).
- Brand assets live in `public/img`; `wordmark-mark.png` and `logo-mark.png` are transparent-background crops extracted from the originals.
- Design context for AI-assisted work: `PRODUCT.md` and `DESIGN.md`.
