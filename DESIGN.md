# Design

Source of truth: the brand artboards in `screenshots/` (Artboard 1 copy-100.jpg = homepage, Artboard 1-100.jpg = case-study template). When this file and the artboards disagree, the artboards win.

## Theme

Bold color-field poster: each section is a full-bleed drench in one saturated brand color, with a straight cut between fields. Serif conviction on top of flat, loud color. Light theme only.

## Color

Strategy: **Drenched, per section**. The page reads as stacked color fields: red hero, violet founders, paper work/services band, yellow contact.

- `--red`: #dd0a12 (hero field, "Design" chip; deep variant `--red-deep` #a90810 for the hero gradient)
- `--violet`: #6018f8 — electric violet (founders field, primary work tile)
- `--yellow`: #f9cd3f (contact field, "Engineering" chip, hero CTA)
- `--ink`: #211f1e; `--coal`: #282828 (dark case-study tiles)
- `--paper`: #fdfcfa (light sections; the case-study template uses #f0f0f0)

Rules: white text on red and violet (both pass AA), ink text on yellow and paper. Chips pair founder roles to brand colors: Design = red, Engineering = yellow.

## Typography

- Display: **PT Serif** bold — headlines, names, nav, buttons, chips. The wordmark serif voice extended to the page. Hero ~clamp(2.5rem, 5.5vw, 4.25rem), leading ~1.06.
- Body: **Fira Sans Condensed** 400/500 — condensed grotesque counterpoint, 46–52ch measure.
- The wordmark is the inline SVG (`app/components/Wordmark.tsx`, from `screenshots/colormath logo.svg`), recolorable via `currentColor`: white on color fields, ink on light.

## Imagery

- Section backgrounds are exported gradient plates from the brand files: `public/img/hero-red.png` (purple-to-red, hero) and `public/img/room-blue.png` (violet room with horizon, founders), applied as cover backgrounds over the matching solid fallback color.
- Founder photos are full-body cutouts (transparent PNGs in `public/img/`, exported from the brand files), floated directly on the room background, no frames or crops.
- The mockup's hero photo (blue hands / yellow glass) is a third-party image: local reference only, never commit or ship it. The hero is text-only until licensed imagery exists.
- Case-study template: duotone-violet engraving collage hero, per the second artboard.

## Geometry & ornament

- Sharp corners everywhere; no borders, no shadows. Color fields meet in straight cuts.
- Role chips: solid color block behind serif bold text, tight padding.
- Work/services tiles: flat color blocks (violet, red, yellow) in a mosaic grid, one large + stacked small.

## Motion

One staggered fade-up on first load (hero only), 650ms, ease-out. Full stop under prefers-reduced-motion.

## Components

- Buttons: flat color block, serif bold label, no border or radius. Yellow/ink on red; ink/paper on yellow.
- Nav items: serif bold, prefixed with a slash (`/ Work with Us`), echoing the wordmark slash.
- Founder blocks: photo cutout, serif name, color chip role, condensed bio.
