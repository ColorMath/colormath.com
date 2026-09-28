/** The structured services a case study can be tagged with (one or many). */
export const SERVICES = [
  { value: "product-strategy", title: "Product strategy" },
  { value: "design", title: "Design" },
  { value: "engineering", title: "Engineering" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["value"];

export const serviceTitle = (slug: string) => SERVICES.find((s) => s.value === slug)?.title ?? slug;
