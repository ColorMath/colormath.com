import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A Studio notes post at /notes/<slug>/. Hidden notes (e.g. a reference doc
 * linked from a case study) still build and work by direct link, but are left
 * out of every list of notes.
 */
export const note = defineType({
  name: "note",
  title: "Note",
  type: "document",
  fields: [
    defineField({
      name: "hidden",
      title: "Hidden",
      description: "Hidden notes still work by direct link, but don't appear in the list of notes.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      description: "Shown on the post and used to order the list. Defaults to when the note was created.",
      type: "date",
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "dek", title: "Summary", type: "text", rows: 2 }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }, { title: "Subheading", value: "h3" }],
          lists: [{ title: "Bullets", value: "bullet" }],
          marks: {
            decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }],
            annotations: [{ name: "link", title: "Link", type: "object", fields: [defineField({ name: "href", title: "URL", type: "url", validation: (r) => r.uri({ allowRelative: true }) })] }],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", hidden: "hidden", slug: "slug.current" },
    prepare: ({ title, hidden, slug }) => ({
      title,
      subtitle: `${hidden ? "Hidden · " : ""}/notes/${slug ?? ""}`,
    }),
  },
});
