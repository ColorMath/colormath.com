/** The structured services a case study can be tagged with (one or many). */
export const SERVICES = [
  { value: "product-strategy", title: "Product strategy" },
  { value: "design", title: "Design" },
  { value: "engineering", title: "Engineering" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["value"];

export const serviceTitle = (slug: string) => SERVICES.find((s) => s.value === slug)?.title ?? slug;

/** Tag colors match the homepage service panels. */
export const serviceTagClass: Record<string, string> = {
  "product-strategy": "bg-violet text-paper",
  design: "bg-red text-paper",
  engineering: "bg-yellow text-ink",
};
