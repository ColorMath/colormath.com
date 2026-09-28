import { Wordmark } from "../components/Wordmark";
import type { CaseStudy } from "@/sanity/lib/caseStudies";
import { serviceTitle } from "@/sanity/lib/services";

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
          <a href={`/work/#${s}`} className={`${tag} ${onDark ? "bg-yellow text-ink" : "bg-yellow text-ink"}`}>
            {serviceTitle(s)}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** A case study card for /work and the company/service lists. */
export function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <li className="flex flex-col" data-work-tags={[...study.companies.map((c) => c.slug), ...study.services].join(" ")}>
      <a href={`/work/${study.slug}/`} className="group block">
        {study.cover && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={study.cover.src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        )}
        <h2 className="mt-4 font-display text-2xl font-bold underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-current">
          {study.title}
        </h2>
      </a>
      {study.dek && <p className="mt-2 text-lg leading-snug">{study.dek.replace(/\*/g, "")}</p>}
      {study.deliverables.length > 0 && (
        <p className="mt-2 text-sm opacity-80">{study.deliverables.join(" · ")}</p>
      )}
      <div className="mt-4">
        <Tags study={study} />
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
              <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
