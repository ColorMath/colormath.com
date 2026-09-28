import { defineField, defineType } from "sanity";

/** A company we've worked with; case studies reference it, /work/#<slug> filters to them. */
export const company = defineType({
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "url", title: "Website", type: "url" }),
    defineField({
      name: "color",
      title: "Brand color",
      description: "Hex. Used for placeholder panels on /work when a case study has no cover image.",
      type: "string",
      validation: (r) => r.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex color" }),
    }),
  ],
  preview: { select: { title: "name", subtitle: "url" } },
});
