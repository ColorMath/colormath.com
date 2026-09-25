import { defineArrayMember, defineField, defineType } from "sanity";

/** A short "how we made this" story, published at /work/<slug>/. */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "dek", title: "Summary", description: "One line under the title. Wrap a word in *asterisks* for italics.", type: "text", rows: 2 }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "Path of a video served by the site, e.g. /case-studies/building-blocks/under-the-table.mp4",
      type: "string",
    }),
    defineField({ name: "posterUrl", title: "Video poster URL", type: "string" }),
    defineField({ name: "videoCaption", title: "Video caption", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }],
          lists: [],
          marks: {
            decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [defineField({ name: "href", title: "URL", type: "url" })],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Behind-the-scenes photos",
      description: "Web copies live in public/case-studies/<slug>/",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "src", title: "Image path", type: "string" }),
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "alt", subtitle: "src" } },
        }),
      ],
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "url", title: "Link", type: "url" }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        }),
      ],
    }),
  ],
});
