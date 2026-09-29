import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A standalone article (e.g. a reference doc) at /notes/<slug>/. Notes are
 * not listed anywhere on the site; they are only reachable by link, such as
 * from a case study.
 */
export const note = defineType({
  name: "note",
  title: "Note",
  type: "document",
  fields: [
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
});
