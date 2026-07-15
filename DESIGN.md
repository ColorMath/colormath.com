# Design

## Theme

Bauhaus print poster, set in pastel: flat geometric shapes, black linework, warm cream paper. Light theme only (it is printed matter; a dark mode would break the paper metaphor). The existing brand supplies the system: a "color/math" black serif wordmark, a pencil-shaped logo mark built from a triangle + circle + shield, and a repeating pattern tile.

## Color

Strategy: **Full palette** (Bauhaus-poster reference, pastel register). Every section commits to a role; pastels are surfaces and shapes, black is ink, cream is paper.

- `--paper`: oklch(97.5% 0.008 75) — warm cream, page background (from brand assets)
- `--ink`: oklch(22% 0.01 60) — warm near-black, all text and linework
- `--butter`: oklch(92% 0.07 85) — pale yellow (logo triangle)
- `--peony`: oklch(88% 0.06 5) — pink (logo wedge)
- `--periwinkle`: oklch(83% 0.06 265) — pale blue (logo circle-left)
- `--mauve`: oklch(68% 0.06 330) — dusty purple (logo circle-right)
- `--marigold`: oklch(82% 0.13 75) — saturated yellow-orange (pattern ground); the CTA color

Rules: text is always ink on paper or ink on pastel (all pastels pass AA against ink). Pastels never used for text. Marigold is reserved for the single email CTA and small punctuation moments.

## Typography

- Display: **Bricolage Grotesque** (Google Fonts, variable) — chunky, warm grotesque with personality; headings, nav, buttons. Weight 600–800, tight tracking on large sizes.
- Body: **Hanken Grotesk** (Google Fonts, variable) — humanist, quiet, precise. Weight 400/500, 65ch max line length.
- The serif voice belongs exclusively to the wordmark image; no serif webfont, so the wordmark stays a distinct brand moment.
- Scale: fluid clamp() steps, ratio ≥1.3. Hero display ~clamp(2.8rem, 8vw, 6rem).

## Geometry & ornament

- Linework: 2px solid ink borders, sharp corners (radius 0 to 4px max) — printed-poster edges, not soft SaaS pills.
- The logo's shapes (half-circle, triangle, quarter-circle wedges) are the ornament vocabulary for section dividers and accents; build them in CSS/SVG, flat fills + ink strokes.
- The pattern tile (public/img/pattern.png) appears as a band, never a full-page background.

## Motion

One staggered fade-up on first load (hero only), 500ms, ease-out-quint. No scroll-triggered choreography. Full stop under prefers-reduced-motion.

## Components

- Buttons: ink background / paper text, or marigold background / ink text for the primary email CTA. 2px ink border, sharp corners, subtle 2px translate press.
- Section headers: oversized Bricolage heading, left-aligned; no repeated kicker-label grammar.
- Founder blocks: asymmetric two-up, pastel shape behind each portrait (periwinkle for one, mauve for the other, echoing the logo circle halves).
