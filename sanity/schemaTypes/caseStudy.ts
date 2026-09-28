import { defineArrayMember, defineField, defineType } from "sanity";
import { SERVICES } from "../lib/services";

/** A short "how we made this" story, published at /work/<slug>/. */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Label above the title", description: "Defaults to \"Case study\"", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "companies",
      title: "Companies",
      description: "Who the work was for. Each links to a page listing all their case studies.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "company" }] })],
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: SERVICES.map((s) => ({ title: s.title, value: s.value })), layout: "grid" },
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      description: "Free-form, e.g. Brand, GTM strategy, End-to-end app, MCP",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image (optional)",
      description: "Runs full-bleed behind the title; the logo and text flip to white. Leave empty for the light hero.",
      type: "object",
      fields: [
        defineField({ name: "src", title: "Image path", type: "string" }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "position", title: "Focal point", description: "CSS object-position, e.g. 50% 40%", type: "string" }),
        defineField({
          name: "overlayColor",
          title: "Overlay color",
          description: "Hex, e.g. #141A28. Defaults to our ink (#211F1E).",
          type: "string",
          validation: (r) => r.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex color" }),
        }),
        defineField({
          name: "overlayColorTo",
          title: "Overlay gradient to (optional)",
          description: "Hex. When set, the overlay runs left to right from Overlay color to this one, like the homepage hero (#7D0735 → #B9040C).",
          type: "string",
          validation: (r) => r.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex color" }),
        }),
        defineField({
          name: "overlayStrength",
          title: "Overlay strength",
          description: "0 (none) to 100 (strongest). Defaults to 60; keep text readable.",
          type: "number",
          validation: (r) => r.min(0).max(100),
        }),
      ],
    }),
    defineField({
      name: "cover",
      title: "Cover image (for /work)",
      type: "object",
      fields: [
        defineField({ name: "src", title: "Image path", type: "string" }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Order on /work",
      description: "Lower numbers first",
      type: "number",
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
        defineArrayMember({
          name: "imageGroup",
          title: "Images",
          type: "object",
          description: "One to three images side by side, placed in the story. Web copies live in public/case-studies/<slug>/",
          fields: [
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              validation: (r) => r.min(1).max(3),
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
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
          preview: {
            select: { caption: "caption", first: "images.0.alt" },
            prepare: ({ caption, first }) => ({ title: caption || first || "Images" }),
          },
        }),
      ],
    }),
    defineField({ name: "shotsHeading", title: "Heading for the final work", description: "Defaults to \"The work\"", type: "string" }),
    defineField({
      name: "shots",
      title: "Final shots",
      description: "Finished photographs, shown above the behind-the-scenes gallery. Web copies live in public/case-studies/<slug>/",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "src", title: "Image path", type: "string" }),
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "layout",
              title: "Layout",
              description: "Desktop: full row; wide (2/3, cropped 3:2, pair with a tall); tall (1/3, cropped 3:4); third (1/3, never cropped)",
              type: "string",
              options: { list: ["full", "wide", "tall", "third"], layout: "radio" },
            }),
          ],
          preview: { select: { title: "alt", subtitle: "layout" } },
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
