import type { Metadata } from "next";
import { getListedNotes } from "@/sanity/lib/notes";
import { Wordmark } from "../components/Wordmark";
import { SiteNav } from "../components/SiteNav";
import { NotesSignupBand } from "../components/NotesSignupBand";

export const metadata: Metadata = {
  title: "Studio notes · Color/Math",
  description:
    "Notes from the Color/Math studio: what we're building, what's on our minds, and what's inspiring us.",
};

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** The Studio notes blog. Hidden notes are left out (they still work by direct link). */
export default async function NotesIndex() {
  const notes = await getListedNotes();
  return (
    <>
      <header className="on-dark absolute inset-x-0 top-0 z-30 text-paper">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6 pt-7">
          <a href="/" aria-label="Color/Math home">
            <Wordmark className="h-10 w-auto" />
          </a>
          <SiteNav />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="on-dark bg-red bg-[url('/img/hero-red.png')] bg-cover bg-center pt-[4.25rem] text-paper">
          <div className="mx-auto w-full max-w-6xl px-6 pt-14 pb-16 md:pt-20">
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.06]">Studio notes</h1>
            <p className="mt-6 max-w-[38rem] text-lg leading-relaxed md:text-xl">
              What we&apos;re building, what&apos;s on our minds, and what&apos;s inspiring us.
            </p>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
            {notes.length ? (
              <ul className="grid max-w-3xl gap-14">
                {notes.map((n) => (
                  <li key={n.slug}>
                    <p className="text-base">
                      <time dateTime={n.date.slice(0, 10)}>{dateFormat.format(new Date(n.date.slice(0, 10)))}</time>
                      {n.eyebrow && <> · {n.eyebrow}</>}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
                      <a
                        href={`/notes/${n.slug}/`}
                        className="underline decoration-transparent decoration-4 underline-offset-6 transition-colors hover:decoration-yellow focus-visible:decoration-yellow"
                      >
                        {n.title}
                      </a>
                    </h2>
                    {n.dek && <p className="mt-3 max-w-[52ch] text-lg leading-relaxed">{n.dek}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid items-center gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/pineapple.webp"
                  alt="A pineapple with giant googly eyes and a banana for a smile, looking a little alarmed."
                  width={800}
                  height={1000}
                  className="h-auto w-full max-w-[22rem]"
                />
                <div>
                  <h2 className="font-display text-4xl font-bold md:text-5xl">No studio notes posted yet.</h2>
                  <p className="mt-5 max-w-[40ch] text-lg leading-relaxed md:text-xl">
                    The pineapple is keeping an eye on things (two, actually).
                    Sign up below and the first one comes straight to you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <NotesSignupBand source="notes" chip={false} heading={notes.length ? "Get the next one" : "Get the first one"}>
          New notes by email. And once a quarter, something you can hold (yes,
          with a stamp).
        </NotesSignupBand>
      </main>
    </>
  );
}
