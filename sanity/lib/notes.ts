import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";
import { client } from "./client";

export type Note = {
  eyebrow?: string;
  title: string;
  slug: string;
  dek?: string;
  hidden?: boolean;
  date: string;
  body: PortableTextBlock[];
};

/** Every note, hidden ones included (they still build and work by direct link). Newest first. */
export async function getNotes(): Promise<Note[]> {
  if (!client) return [];
  try {
    return await client.fetch(
      groq`*[_type == "note" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
        eyebrow, title, "slug": slug.current, dek, hidden, "date": coalesce(publishedAt, _createdAt), body
      }`
    );
  } catch (error) {
    console.warn("Sanity note fetch failed.", error);
    return [];
  }
}

/** The notes shown in lists: everything not marked Hidden. */
export async function getListedNotes(): Promise<Note[]> {
  return (await getNotes()).filter((n) => !n.hidden);
}
