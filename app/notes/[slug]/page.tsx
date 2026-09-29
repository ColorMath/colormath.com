import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { Wordmark } from "../../components/Wordmark";
import { storyComponents } from "../../components/Story";

type Note = { eyebrow?: string; title: string; slug: string; dek?: string; body: PortableTextBlock[] };

/** Notes are standalone pages reachable only by link (not listed anywhere). */
async function getNotes(): Promise<Note[]> {
  if (!client) return [];
  try {
    return await client.fetch(groq`*[_type == "note" && defined(slug.current)]{ eyebrow, title, "slug": slug.current, dek, body }`);
  } catch (error) {
    console.warn("Sanity note fetch failed.", error);
    return [];
  }
}

export async function generateStaticParams() {
  const notes = await getNotes();
  // A static export needs at least one path; "_" renders a 404.
  return notes.length ? notes.map((n) => ({ slug: n.slug })) : [{ slug: "_" }];
}

async function find(slug: string) {
  return (await getNotes()).find((n) => n.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const note = await find((await params).slug);
  if (!note) return {};
  return { title: `${note.title} · Color/Math`, description: note.dek };
}

const base = storyComponents("#F9CD3F");
const components: PortableTextComponents = {
  types: base.types,
  marks: base.marks,
  block: {
    normal: ({ children }) => <p className="mt-5 text-lg leading-relaxed first:mt-0">{children}</p>,
    h2: ({ children }) => <h2 className="mt-12 font-display text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 font-display text-xl font-bold">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">{children}</ul>,
  },
};

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const note = await find((await params).slug);
  if (!note) notFound();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto w-full max-w-6xl px-6 pt-7">
        <a href="/" aria-label="Color/Math home">
          <Wordmark className="h-10 w-auto" />
        </a>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-6 pt-14 pb-24 outline-none md:pt-20">
        <article className="max-w-[44rem]">
          {note.eyebrow && <p className="font-display text-lg font-bold">{note.eyebrow}</p>}
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">{note.title}</h1>
          {note.dek && <p className="mt-6 text-xl leading-relaxed">{note.dek}</p>}
          <div className="mt-10 border-t-2 border-ink pt-10">
            <PortableText value={note.body ?? []} components={components} />
          </div>
        </article>
      </main>
    </div>
  );
}
