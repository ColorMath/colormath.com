import { defineField, defineType } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "services", title: "What we do" },
    { name: "founders", title: "Founders" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      description: "Small line above the headline",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero headline",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero subheading",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "servicesHeading",
      title: "Services heading",
      type: "string",
      group: "services",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "services",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "foundersHeading",
      title: "Founders heading",
      type: "string",
      group: "founders",
    }),
    defineField({
      name: "foundersIntro",
      title: "Founders intro",
      type: "text",
      rows: 2,
      group: "founders",
    }),
    defineField({
      name: "founders",
      title: "Founders",
      type: "array",
      group: "founders",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "role",
              title: "Role",
              description: 'e.g. "Design · the color"',
              type: "string",
            }),
            defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
            defineField({ name: "url", title: "Website", type: "url" }),
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "contactHeading",
      title: "Contact heading",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactBody",
      title: "Contact body",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Landing Page" }),
  },
});
