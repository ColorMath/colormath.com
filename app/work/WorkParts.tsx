import fs from "node:fs";
import path from "node:path";
import { Wordmark } from "../components/Wordmark";
import type { CaseStudy } from "@/sanity/lib/caseStudies";
import { serviceTagClass, serviceTitle } from "@/sanity/lib/services";

const tag =
  "inline-block px-2 py-0.5 font-display text-sm font-bold underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-current focus-visible:decoration-current";

/** Company and service tags; each links to the page listing its case studies. */
export function Tags({ study, onDark = false }: { study: CaseStudy; onDark?: boolean }) {
  if (!study.companies.length && !study.services.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {study.companies.map((c) => (
        <li key={`c-${c.slug}`}>
          <a href={`/work/#${c.slug}`} className={`${tag} ${onDark ? "bg-paper text-ink" : "bg-ink text-paper"}`}>
            {c.name}
          </a>
        </li>
      ))}
      {study.services.map((s) => (
        <li key={`s-${s}`}>
          <a href={`/work/#${s}`} className={`${tag} ${serviceTagClass[s] ?? "bg-yellow text-ink"}`}>
            {serviceTitle(s)}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Does public/logos/<slug>.svg exist? Checked at build time. */
function hasLogo(slug: string) {
  return fs.existsSync(path.join(process.cwd(), "public", "logos", `${slug}.svg`));
}

/**
 * The /work panel image: the study's cover, or a placeholder of the client's
 * logo on its brand color (ink when none is set) until a cover exists.
 */
function Cover({ study }: { study: CaseStudy }) {
  const box = "aspect-[4/3] w-full md:aspect-[21/9]";
  const cover = study.cover;
  if (cover?.src) {
    const color = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(cover.overlayColor ?? "") ? cover.overlayColor : undefined;
    const pct = (n?: number) => Math.min(100, Math.max(0, Math.round(n ?? 0)));
    const wash = color
      ? `linear-gradient(to right, color-mix(in srgb, ${color} ${pct(cover.overlayLeft)}%, transparent), color-mix(in srgb, ${color} ${pct(cover.overlayRight ?? cover.overlayLeft)}%, transparent))`
      : undefined;
    return (
      <div className={`${box} relative overflow-hidden`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover.src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: cover.position }} />
        {wash && <div aria-hidden className="absolute inset-0" style={{ backgroundImage: wash }} />}
        {cover.logo && (
          <div className="absolute inset-0 flex items-center justify-center p-[8%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.logo} alt={cover.logoAlt ?? ""} className="h-auto max-h-full w-[min(55%,28rem)] object-contain" />
          </div>
        )}
      </div>
    );
  }
  const company = study.companies[0];
  return (
    <div aria-hidden className={`${box} flex items-center justify-center`} style={{ backgroundColor: company?.color || "#211F1E" }}>
      {company && hasLogo(company.slug) ? (
        <span
          className="logo-mark block aspect-[432/218] w-[min(60%,26rem)] text-paper"
          style={{ "--logo": `url(/logos/${company.slug}.svg)` } as React.CSSProperties}
        />
      ) : (
        <span className="font-display text-4xl font-bold text-paper md:text-6xl">{company?.name ?? study.title}</span>
      )}
    </div>
  );
}

/** A full-width case study panel for /work. */
export function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <li data-work-tags={[...study.companies.map((c) => c.slug), ...study.services].join(" ")}>
      <a href={`/work/${study.slug}/`} className="group block">
        <Cover study={study} />
      </a>
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12">
        <div>
          <a href={`/work/${study.slug}/`} className="group">
            <h2 className="font-display text-3xl font-bold underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-current md:text-4xl">
              {study.title}
            </h2>
          </a>
          {study.dek && <p className="mt-3 max-w-[40rem] text-lg leading-snug md:text-xl">{study.dek.replace(/\*/g, "")}</p>}
        </div>
        <div className="md:pt-2">
          {study.deliverables.length > 0 && <p className="text-sm opacity-80">{study.deliverables.join(" · ")}</p>}
          <div className="mt-4">
            <Tags study={study} />
          </div>
        </div>
      </div>
    </li>
  );
}

/** Shared page shell for the /work lists: red header band, paper list. */
export function WorkShell({
  eyebrow,
  title,
  intro,
  studies,
  filter,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  studies: CaseStudy[];
  filter?: React.ReactNode;
}) {
  return (
    <>
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
          <div className="mx-auto w-full max-w-6xl px-6 pt-14 pb-16 md:pt-20">
            {eyebrow && <p className="font-display text-lg font-bold">{eyebrow}</p>}
            <h1 className="mt-2 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.06]">{title}</h1>
            {intro && <p className="mt-6 max-w-[38rem] text-lg leading-relaxed md:text-xl">{intro}</p>}
          </div>
        </section>
        <section className="bg-paper">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
            {filter && <div className="mb-12">{filter}</div>}
            {studies.length ? (
              <ul className="grid gap-20 md:gap-28">
                {studies.map((s) => (
                  <CaseCard key={s.slug} study={s} />
                ))}
              </ul>
            ) : (
              <p className="text-lg">Nothing here yet.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
