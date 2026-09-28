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
  ],
  preview: { select: { title: "name", subtitle: "url" } },
});
