import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { storyComponents } from "../../components/Story";
import { getCaseStudies, type CaseStudy } from "@/sanity/lib/caseStudies";
import { Wordmark } from "../../components/Wordmark";
import { Tags } from "../WorkParts";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

async function find(slug: string) {
  return (await getCaseStudies()).find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const study = await find((await params).slug);
  if (!study) return {};
  return {
    title: `${study.title} · Color/Math`,
    description: plain(study.dek),
    openGraph: { title: `${study.title} · Color/Math`, description: plain(study.dek), images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  };
}

/** Renders *word* as italics in short plain-text fields like the summary. */
function Emphasis({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part
  );
}

/** The summary without its *emphasis* markers, for metadata. */
const plain = (text?: string) => text?.replace(/\*/g, "");

function Credits({ study, stacked = false }: { study: CaseStudy; stacked?: boolean }) {
  if (!study.credits.length) return null;
  return (
    <dl
      className={
        stacked
          ? "mt-10 space-y-4"
          : "mt-12 grid gap-x-8 gap-y-4 border-t-2 border-ink pt-8 sm:grid-cols-[auto_1fr]"
      }
    >
      {study.credits.map((c, i) => (
        <div key={`${c.role}-${i}`} className={stacked ? "" : "contents"}>
          <dt className="font-display font-bold">{c.role}</dt>
          <dd>
            {c.url ? (
              <a href={c.url} className="underline decoration-2 underline-offset-4 hover:decoration-violet">
                {c.name}
              </a>
            ) : (
              c.name
            )}
            {c.note && (
              <span className="mt-1 block text-sm">
                {c.noteUrl ? (
                  <a href={c.noteUrl} className="underline decoration-1 underline-offset-4 hover:decoration-violet">
                    {c.note}
                  </a>
                ) : (
                  c.note
                )}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The hero scrim: darker at the top (nav), clearer through the middle, darkest
 * at the bottom and left where the title sits. Color and overall strength are
 * set per study; strength 60 is the default look.
 */
function overlayStyle(hero: {
  overlayColor?: string;
  overlayColorTo?: string;
  overlayStrength?: number;
  overlayLeft?: number;
  overlayRight?: number;
}): React.CSSProperties {
  const hex = (v?: string) => (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v ?? "") ? v! : undefined);
  const from = hex(hero.overlayColor) ?? "#211F1E";
  const to = hex(hero.overlayColorTo);
  // Explicit left/right opacities: one flat left-to-right wash, nothing else.
  if (hero.overlayLeft != null && hero.overlayRight != null) {
    const pct = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
    return {
      backgroundImage: `linear-gradient(to right, color-mix(in srgb, ${from} ${pct(hero.overlayLeft)}%, transparent), color-mix(in srgb, ${to ?? from} ${pct(hero.overlayRight)}%, transparent))`,
    };
  }
  const k = Math.min(100, Math.max(0, hero.overlayStrength ?? 60)) / 60;
  const at = (c: string, a: number) => `color-mix(in srgb, ${c} ${Math.min(100, Math.round(a * k * 100))}%, transparent)`;
  // Vertical: darken the nav strip and the bottom where the title sits.
  const vertical = `linear-gradient(to bottom, ${at(from, 0.55)} 0%, ${at(from, 0.05)} 30%, ${at(from, 0.15)} 55%, ${at(from, 0.8)} 100%)`;
  // Horizontal: one color fading out, or a two-color wash like the homepage hero.
  const horizontal = to
    ? `linear-gradient(to right, ${at(from, 0.75)} 0%, ${at(to, 0.55)} 55%, ${at(to, 0.4)} 100%)`
    : `linear-gradient(to right, ${at(from, 0.6)} 0%, ${at(from, 0.35)} 45%, transparent 75%)`;
  return { backgroundImage: `${vertical}, ${horizontal}` };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = await find((await params).slug);
  if (!study) notFound();
  const brand = study.companies.find((c) => c.slug !== "colormath")?.color;
  const accent = /^#[0-9a-f]{6}$/i.test(brand ?? "") ? brand! : "#F9CD3F";

  const rest = (
    <>
        {/* With a video: video left, story right. Without: the story takes
            two-thirds (a comfortable ~70ch measure) and the facts sit beside it. */}
        <section className="border-t-2 border-ink bg-paper">
          <div
            className={`mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:py-20 ${
              study.videoUrl
                ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
                : "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16"
            }`}
          >
            {study.videoUrl && (
              <figure className="mx-auto w-full max-w-[360px]">
                <video
                  src={study.videoUrl}
                  poster={study.posterUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[9/16] w-full bg-ink"
                />
                {study.videoCaption && <figcaption className="mt-3 text-sm">{study.videoCaption}</figcaption>}
              </figure>
            )}
            <div className="max-w-[44rem]">
              <PortableText value={study.body} components={storyComponents(accent)} />
              {study.videoUrl && <Credits study={study} />}
            </div>
            {!study.videoUrl && (
              <aside className="md:border-l-2 md:border-ink md:pl-10">
                <div className="md:sticky md:top-10">
                  {study.deliverables.length > 0 && (
                    <>
                      <h2 className="font-display text-lg font-bold">What we did</h2>
                      <ul className="mt-3 space-y-1 text-lg">
                        {study.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Credits study={study} stacked />
                </div>
              </aside>
            )}
          </div>
        </section>

        {study.shots.length > 0 && (
          /* Our own studies sit on our red; client work sits on paper so our
             brand never competes with theirs. */
          <section
            aria-labelledby="shots-heading"
            className={
              study.companies.some((c) => c.slug === "colormath")
                ? "bg-red text-paper on-dark"
                : "border-t-2 border-ink bg-paper text-ink"
            }
          >
            <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
              <h2 id="shots-heading" className="font-display text-2xl font-bold md:text-3xl">
                {study.shotsHeading || "The work"}
              </h2>
              {/* Desktop rows: a full-width shot, a wide (3:2) beside a tall
                  (cropped to 3:4) so the pair lines up, or three uncropped
                  thirds (for illustrations and anything that mustn't be cut). */}
              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {study.shots.map((photo) => (
                  <li
                    key={photo.src}
                    className={
                      photo.layout === "full"
                        ? "md:col-span-3"
                        : photo.layout === "wide"
                          ? "md:col-span-2"
                          : photo.layout === "third"
                            ? "self-center"
                            : ""
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className={`block w-full ${
                        photo.layout === "wide"
                          ? "md:aspect-[3/2] md:h-full md:object-cover"
                          : photo.layout === "tall"
                            ? "md:aspect-[3/4] md:h-full md:object-cover"
                            : ""
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {study.gallery.length > 0 && (
          <section aria-labelledby="gallery-heading" className="bg-violet text-paper on-dark">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
              <h2 id="gallery-heading" className="font-display text-2xl font-bold md:text-3xl">
                On set
              </h2>
              <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
                {study.gallery.map((photo) => (
                  <li key={photo.src} className="mb-5 break-inside-avoid">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt={photo.alt} loading="lazy" className="block w-full" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
    </>
  );

  return (
    <>
      {/* rest: the story, final work and on-set gallery, shared by both heroes */}
      {(() => {
        const hero = study.heroImage?.src ? study.heroImage : null;
        // The back link sits in the same spot on every case study: just under
        // the header, whatever the hero.
        const back = (
          <div className="mx-auto w-full max-w-6xl px-6 pt-8">
            <a
              href="/work/"
              className={`inline-flex items-center gap-2 font-display text-base font-bold underline decoration-transparent decoration-2 underline-offset-4 transition-colors ${
                hero ? "hover:decoration-yellow focus-visible:decoration-yellow" : "hover:decoration-violet focus-visible:decoration-violet"
              }`}
            >
              <svg aria-hidden viewBox="0 0 10 12" className="h-2.5 w-2 fill-current">
                <path d="M0 6 10 0v12z" />
              </svg>
              Back to Work
            </a>
          </div>
        );
        const intro = (
          <>
            {study.eyebrow ? (
              <p className="block w-fit justify-self-start self-start bg-ink px-2 py-0.5 font-display text-lg font-bold text-paper">{study.eyebrow}</p>
            ) : (
              <p className="font-display text-lg font-bold">Case study</p>
            )}
            <h1 className="mt-2 max-w-[20ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.06]">
              {study.title}
            </h1>
            {study.dek && (
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed md:text-xl">
                <Emphasis text={study.dek} />
              </p>
            )}
            <div className="mt-8">
              <Tags study={study} onDark={Boolean(hero)} />
            </div>
          </>
        );
        const nav = (
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6 pt-7">
            <a href="/" aria-label="Color/Math home">
              <Wordmark className="h-10 w-auto" />
            </a>
            <a href="/contact/" className="nav-swipe font-display text-lg font-bold">
              <span aria-hidden className="mr-1.5">/</span>
              Contact
            </a>
          </div>
        );

        if (!hero) {
          /* Light by default: paper and the ink wordmark, so our red never
             competes with the client's brand. */
          return (
            <>
              <header className="bg-paper text-ink">{nav}</header>
              <div className="bg-paper text-ink">{back}</div>
              <main id="main" tabIndex={-1} className="outline-none">
                <section className="bg-paper text-ink">
                  <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-4 md:pt-12">{intro}</div>
                </section>
                {rest}
              </main>
            </>
          );
        }

        /* With a hero image: it runs full-bleed behind the header and title,
           and our wordmark and text reverse to paper over a soft ink scrim. */
        return (
          <>
            <div className="on-dark relative isolate overflow-hidden text-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.src}
                alt={hero.alt}
                className="absolute inset-0 -z-10 h-full w-full object-cover"
                style={{ objectPosition: hero.position || "50% 50%" }}
              />
              <div aria-hidden className="absolute inset-0 -z-10" style={overlayStyle(hero)} />
              <header>{nav}</header>
              {back}
              <div className="mx-auto flex min-h-[min(80vh,50rem)] w-full max-w-6xl flex-col justify-end px-6 pt-16 pb-14 md:pb-20">
                {intro}
              </div>
            </div>
            <main id="main" tabIndex={-1} className="outline-none">
              {rest}
            </main>
          </>
        );
      })()}
    </>
  );
}

