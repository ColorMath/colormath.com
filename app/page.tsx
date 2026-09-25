import type { Metadata } from "next";
import { getLandingContent } from "@/sanity/lib/fetch";
import type { Founder, Service } from "@/sanity/lib/content";
import { Wordmark } from "./components/Wordmark";
import { LoopVideo } from "./components/LoopVideo";
import { CutoutVideo } from "./components/CutoutVideo";
import { LogoMarquee } from "./components/LogoMarquee";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent();
  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url: "https://colormath.com",
      // Page-level openGraph replaces the layout's wholesale, so repeat the image.
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Color/Math" }],
    },
  };
}

/** Renders the artboard's bold-serif emphasis inside the hero body copy. */
function HeroSubheading({ text }: { text: string }) {
  const phrase = "helps teams design and build great products";
  const at = text.indexOf(phrase);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <strong className="font-display font-bold">{phrase}</strong>
      {text.slice(at + phrase.length)}
    </>
  );
}

const roleChip = [
  "bg-red text-paper",
  "bg-yellow text-ink",
  "bg-paper text-ink",
];

function FounderImage({
  founder,
  className,
  phone = false,
}: {
  founder: Founder;
  className?: string;
  /** The stacked phone-layout copy, which sits on solid violet. */
  phone?: boolean;
}) {
  if (founder.video) {
    // Phone copy: full-bleed in the padded framing on every phone, so layout
    // never depends on the device. iOS plays the solid-violet MP4 in it; other
    // phones play the transparent WebM, centred (object-contain).
    const solid = phone && founder.video.solid;
    return (
      <CutoutVideo
        webm={founder.video.webm}
        mov={founder.video.mov}
        solid={solid || undefined}
        still={founder.video.still}
        start={founder.video.start}
        label={founder.name}
        className={
          solid
            ? `-mx-6 h-auto w-[calc(100%+3rem)] max-w-none object-contain ${className ?? ""}`
            : `h-auto w-full max-w-[380px] ${className ?? ""}`
        }
        style={{ aspectRatio: solid ? founder.video.solidAspect : founder.video.aspect }}
      />
    );
  }
  if (founder.photoUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={founder.photoUrl}
        alt={founder.name}
        className={`w-full max-w-[380px] ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`flex aspect-[3/4] w-full max-w-[260px] items-center justify-center bg-[#4b0fd0] font-display text-7xl font-bold ${className ?? ""}`}
    >
      {founder.name
        .split(" ")
        .filter((part) => part[0] === part[0]?.toUpperCase())
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </div>
  );
}

/**
 * The room's floor line, as a % of the left founder's portrait height: set
 * to land at Craig's knee level (both portraits share a top edge and width).
 * Re-measure if either portrait's crop changes.
 */
const FLOOR_LINE_AT = 51.1;

/**
 * The floor line's height within the founders row, for placing the intro text
 * on it. Mirrors the row's geometry: the left portrait fills its 1fr column of
 * a 1fr/1.15fr/1fr grid with 2.5rem gaps (100cqw = the grid, an @container),
 * capped at 380px, shifted up 4rem by md:-mt-16.
 */
function floorLineY(founder?: Founder): string {
  const [w, h] = (founder?.video?.aspect ?? "822 / 1468").split("/").map(Number);
  const width = "min((100cqw - 5rem) / 3.15, 380px)";
  return `calc(-4rem + ${width} * ${((h / w) * FLOOR_LINE_AT) / 100})`;
}

/**
 * Companies the founders have built and worked with. Logos are single-colour
 * SVGs on a shared 432x218 canvas (so they read at the same optical size),
 * painted with CSS masks so they take the page's colours. Jessica's come from
 * jessicatenuta.com (traced from its PNGs); Narrative Science is Craig's
 * (its domain now redirects to Tableau, so it links to its Wikipedia page).
 */
const companies = [
  { name: "Packback", logo: "packback", url: "https://packback.co" },
  { name: "Narrative Science", logo: "narrativescience", url: "https://en.wikipedia.org/wiki/Narrative_Science" },
  { name: "Talas", logo: "talas", url: "https://talas.co" },
  { name: "Factor", logo: "factor", url: "https://www.factor75.com" },
  { name: "Snapsheet", logo: "snapsheet", url: "https://www.snapsheetclaims.com" },
  { name: "Fooda", logo: "fooda", url: "https://www.fooda.com" },
  { name: "Lightbank", logo: "lightbank", url: "https://www.lightbank.com" },
  { name: "Brad Keywell", logo: "bradkeywell", url: "https://www.bradkeywell.com" },
  { name: "Keywell Foundation", logo: "keywellfoundation", url: "https://www.bradkeywell.com" },
  { name: "Listen Ventures", logo: "listen", url: "https://www.listen.co" },
  { name: "Intendent", logo: "intendent", url: "https://www.intendent.com" },
  { name: "Impruve", logo: "impruve", url: "https://www.impruve.com" },
  { name: "Runwayz", logo: "runwayz", url: "https://runwayz.com" },
  { name: "Illinois State University", logo: "isu", url: "https://illinoisstate.edu" },
  { name: "Technori", logo: "technori", url: "https://technori.com" },
];

/**
 * Service panels: photo on top; the panel's brand color (violet = both of
 * us, red = design, yellow = engineering) carried by the text band below.
 * Photos are code-owned and keyed by title, like the founder videos.
 */
const serviceImage: Record<string, string> = {
  "Product strategy": "/img/service-strategy.webp",
  Design: "/img/service-design.webp",
  Engineering: "/img/service-engineering.webp",
};

const serviceBand = [
  "bg-violet text-paper",
  "bg-red text-paper",
  "bg-yellow text-ink",
];

export default async function Home() {
  const content = await getLandingContent();

  return (
    <>
      {/* Red field: header + hero */}
      {/* The header sits over the red hero but outside <main>, so it stays the
          page's banner landmark and "Skip to content" jumps past it. */}
      <header className="on-dark absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-6xl text-paper flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 pt-7">
          <a href="#top" aria-label="Color/Math home">
            <Wordmark className="h-10 w-auto" />
          </a>
          <a
            href="/contact/"
            className="nav-swipe font-display text-lg font-bold"
          >
            <span aria-hidden className="mr-1.5">
              /
            </span>
            Contact
          </a>
        </header>

      <main id="main" tabIndex={-1} className="outline-none">
      <div className="hero-field relative overflow-x-clip bg-red bg-[url('/img/hero-red.png')] bg-cover bg-center pt-[4.25rem] text-paper">

        <section
          id="top"
          className="relative z-20 mx-auto w-full max-w-6xl px-6 pt-10 pb-10 md:pt-16 md:pb-20"
        >
          <p className="font-display text-xl font-bold md:text-2xl">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-2 max-w-[24ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.06]">
            {content.heroHeading}
          </h1>
          <p className="mt-6 max-w-[38rem] text-base leading-relaxed md:text-lg">
            <HeroSubheading text={content.heroSubheading} />
          </p>
          {content.contactEmail && (
            <div className="mt-10">
              <a
                href={`mailto:${content.contactEmail}`}
                className="inline-block bg-yellow px-7 py-3.5 font-display text-lg font-bold text-ink transition-colors hover:bg-paper"
              >
                Email us
              </a>
            </div>
          )}
        </section>

        {/*
          Blocks film: its red-wall/violet-table horizon sits at 57.3% of the
          frame, pinned to the hero's bottom edge so the table runs on into the
          violet section. Desktop: 16:9 at 71vw (capped at 1024px so it can't outgrow
          the max-width hero copy on wide windows), nudged just past the right
          edge (clipped by the wrapper; the outermost block stays in frame),
          dropped by the table's share (42.7%) of its own height. Both copies
          are mirrored (-scale-x-100) so the hands enter from the left.
          Mobile: 4:3 crop under the
          text (object-position keeps the horizon row fixed), overhanging by
          42.7% of its height, i.e. 32% of its width.
        */}
        <div className="absolute right-[-1.5vw] bottom-0 z-10 hidden aspect-video w-[71vw] max-w-[1024px] translate-y-[42.7%] md:block">
          <LoopVideo
            src="/video/blocks.mp4"
            poster="/video/blocks.jpg"
            className="blocks-fade absolute inset-0 h-full w-full -scale-x-100 object-cover"
          />
          {/*
            Easter egg: a hotspot on the wedge block at the bottom right, which
            sits still for nearly the whole film (88.8% across, 76.7% down, in
            the mirrored frame). Hover or focus reveals the link.
          */}
          <a
            href="/work/building-blocks/"
            aria-label="See how we made this film"
            className="egg absolute left-[88.8%] top-[76.7%] z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <span aria-hidden className="egg-dot" />
            <span aria-hidden className="egg-tip font-display">
              See how we made this →
            </span>
          </a>
        </div>
        <LoopVideo
          src="/video/blocks.mp4"
          poster="/video/blocks.jpg"
          className="blocks-fade-mobile relative z-10 -mb-[32%] block aspect-[4/3] w-full -scale-x-100 object-cover md:hidden"
          style={{ objectPosition: "50% 57.3%" }}
        />
      </div>

      {/* Violet field: founders */}
      <section
        aria-labelledby="founders-heading"
        className="room relative isolate overflow-hidden bg-violet text-paper"
      >
        <div className="mx-auto w-full max-w-7xl px-6 pt-[calc(32vw+1rem)] pb-20 md:pt-[24vw] lg:pt-[23vw] md:pb-28">
          {/* Phones: the film's wedge block is cropped out, so the easter-egg
              link sits under the film as the section's first line. */}
          <a
            href="/work/building-blocks/"
            className="mb-14 inline-block font-display text-sm font-bold text-paper/90 underline decoration-1 underline-offset-4 md:hidden"
          >
            * See how we made this →
          </a>
          <div
            className="@container grid items-start gap-x-10 gap-y-10 md:grid-cols-[1fr_1.15fr_1fr]"
            style={{ "--floor-y": floorLineY(content.founders[0]) } as React.CSSProperties}
          >
            {content.founders[0] && (
              <div className="relative mx-auto hidden md:-mt-16 md:block">
                <FounderImage
                  founder={content.founders[0]}
                  className="relative z-10"
                />
                {/*
                  The room's floor line, pinned to the portraits (see
                  FLOOR_LINE_AT) so it tracks them at every width.
                */}
                <div
                  aria-hidden
                  className="room-floor"
                  style={{ top: `${FLOOR_LINE_AT}%` }}
                />
              </div>
            )}
            {/*
              From md up, the heading sits just above the floor line and the
              body just below it; stacked, it's simply the first thing.
            */}
            <div className="relative z-20 md:pt-[var(--floor-y)]">
              <div className="md:relative">
                <h2
                  id="founders-heading"
                  className="font-display text-2xl font-bold leading-tight [text-wrap:balance] md:absolute md:inset-x-0 md:bottom-full md:mb-5 md:text-[1.75rem]"
                >
                  {content.foundersHeading}
                </h2>
                <p className="mt-5 text-base leading-relaxed md:mt-5">
                  {content.foundersIntro}
                </p>
              </div>
            </div>
            {content.founders[1] && (
              <FounderImage
                founder={content.founders[1]}
                className="relative z-10 mx-auto hidden md:-mt-16 md:-translate-y-[10px] md:block"
              />
            )}
          </div>

          {/*
            relative z-10: the row above is an @container, which makes it a
            stacking context that holds the floor layer; without this, Safari
            paints that layer over the bios.
          */}
          <div className="relative z-10 mt-2 grid gap-x-16 gap-y-14 md:mt-4 md:grid-cols-2">
            {content.founders.map((founder: Founder, i: number) => (
              <article key={founder.name} className="[&>*:not(:first-child)]:relative [&>*:not(:first-child)]:z-10">
                {/* The phone copy carries 120/822 of violet padding above and below
                    the subject; pull it into the surrounding space. */}
                <FounderImage founder={founder} phone className="-mt-[14.6vw] -mb-[12vw] md:hidden" />
                <h3 className="font-display text-3xl font-bold md:text-4xl">
                  {founder.name}
                </h3>
                <p
                  className={`mt-2 inline-block px-2.5 py-0.5 font-display text-xl font-bold ${roleChip[i % roleChip.length]}`}
                >
                  {founder.role}
                </p>
                <p className="mt-5 max-w-[52ch] text-lg leading-relaxed">
                  {founder.bio}
                </p>
                {founder.url && (
                  <a
                    href={founder.url}
                    className="mt-4 inline-block font-medium underline decoration-2 underline-offset-4 hover:decoration-yellow"
                  >
                    {founder.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Paper field: services as brand tiles */}
      <section aria-labelledby="services-heading" className="bg-paper">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <h2
            id="services-heading"
            className="font-display text-4xl font-bold md:text-5xl"
          >
            {content.servicesHeading}
          </h2>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {content.services.map((service: Service, i: number) => {
              const band = serviceBand[i % serviceBand.length];
              const image = serviceImage[service.title];
              return (
                <li
                  key={service.title}
                  className="flex flex-col overflow-hidden"
                >
                  {image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="aspect-[3/2] w-full object-cover"
                    />
                  )}
                  <div className={`flex-1 p-8 ${band}`}>
                    <h3 className="font-display text-2xl font-bold md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-[40ch] text-lg leading-snug">
                      {service.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Paper field: companies we've built with */}
      <section aria-labelledby="companies-heading" className="bg-paper">
        <LogoMarquee companies={companies} />
      </section>

      {/* Yellow field: contact */}
      <section aria-labelledby="contact-heading" className="bg-yellow text-ink">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <h2
            id="contact-heading"
            className="max-w-[20ch] font-display text-4xl font-bold md:text-6xl"
          >
            {content.contactHeading}
          </h2>
          <p className="mt-6 max-w-[45ch] text-lg leading-relaxed md:text-xl">
            {content.contactBody}
          </p>
          <a
            href="/contact/"
            className="mt-10 mr-4 inline-block bg-ink px-7 py-3.5 font-display text-lg font-bold text-paper transition-colors hover:bg-coal"
          >
            Talk to us
          </a>
          {content.contactEmail && (
            <a
              href={`mailto:${content.contactEmail}`}
              className="mt-10 inline-block bg-ink px-7 py-3.5 font-display text-lg font-bold text-paper transition-colors hover:bg-coal"
            >
              Email {content.contactEmail}
            </a>
          )}
        </div>
      </section>

      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm">
        <p>© {new Date().getFullYear()} Color/Math</p>
        <nav className="flex gap-6" aria-label="Founders' sites">
          {content.founders
            .filter((f: Founder) => f.url)
            .map((f: Founder) => (
              <a
                key={f.url}
                href={f.url}
                className="underline decoration-2 underline-offset-4 hover:decoration-violet"
              >
                {f.name}
              </a>
            ))}
        </nav>
      </footer>
    </>
  );
}
