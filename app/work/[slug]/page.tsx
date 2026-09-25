import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getCaseStudies } from "@/sanity/lib/caseStudies";
import { Wordmark } from "../../components/Wordmark";

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

const body: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 text-lg leading-relaxed first:mt-0">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 font-display text-2xl font-bold">{children}</h2>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="font-medium underline decoration-2 underline-offset-4 hover:decoration-violet">
        {children}
      </a>
    ),
  },
};

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = await find((await params).slug);
  if (!study) notFound();

  return (
    <>
      {/* Header over the red hero but outside <main>, as on the homepage. */}
      <header className="on-dark absolute inset-x-0 top-0 z-30 text-paper">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6 pt-7">
          <a href="/" aria-label="Color/Math home">
            <Wordmark className="h-10 w-auto" />
          </a>
          <a href="/contact/" className="nav-swipe font-display text-lg font-bold">
            <span aria-hidden className="mr-1.5">/</span>
            Contact
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="on-dark bg-red bg-[url('/img/hero-red.png')] bg-cover bg-center pt-[4.25rem] text-paper">
          <div className="mx-auto w-full max-w-6xl px-6 pt-14 pb-16 md:pt-20 md:pb-20">
            <a
              href="/"
              className="inline-flex items-center gap-2 font-display text-base font-bold underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-yellow focus-visible:decoration-yellow"
            >
              <svg aria-hidden viewBox="0 0 10 12" className="h-3 w-2.5 fill-current">
                <path d="M0 6 10 0v12z" />
              </svg>
              Back to Color/Math
            </a>
            <p className="mt-10 font-display text-lg font-bold">Behind the scenes</p>
            <h1 className="mt-2 max-w-[20ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.06]">
              {study.title}
            </h1>
            {study.dek && <p className="mt-6 max-w-[38rem] text-lg leading-relaxed md:text-xl"><Emphasis text={study.dek} /></p>}
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:py-24">
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
            <div>
              <PortableText value={study.body} components={body} />
              {study.credits.length > 0 && (
                <dl className="mt-12 grid gap-x-8 gap-y-4 border-t-2 border-ink pt-8 sm:grid-cols-[auto_1fr]">
                  {study.credits.map((c) => (
                    <div key={c.role} className="contents">
                      <dt className="font-display font-bold">{c.role}</dt>
                      <dd>
                        {c.url ? (
                          <a href={c.url} className="underline decoration-2 underline-offset-4 hover:decoration-violet">
                            {c.name}
                          </a>
                        ) : (
                          c.name
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>

        {study.shots.length > 0 && (
          <section aria-labelledby="shots-heading" className="bg-red text-paper on-dark">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
              <h2 id="shots-heading" className="font-display text-2xl font-bold md:text-3xl">
                The shots
              </h2>
              <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
                {study.shots.map((photo) => (
                  <li key={photo.src} className="mb-5 break-inside-avoid">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt={photo.alt} loading="lazy" className="block w-full" />
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
      </main>
    </>
  );
}
