import type { Metadata } from "next";
import { companiesOf, getCaseStudies } from "@/sanity/lib/caseStudies";
import { SERVICES } from "@/sanity/lib/services";
import { WorkFilter } from "./WorkFilter";
import { WorkShell } from "./WorkParts";

export const metadata: Metadata = {
  title: "Work · Color/Math",
  description: "Case studies from Color/Math.",
};

export default async function WorkIndex() {
  const studies = await getCaseStudies();
  const clients = companiesOf(studies).map((c) => ({ slug: c.slug, label: c.name }));
  const used = new Set(studies.flatMap((s) => s.services));
  const areas = SERVICES.filter((s) => used.has(s.value)).map((s) => ({ slug: s.value, label: s.title }));
  return <WorkShell title="Work" studies={studies} filter={<WorkFilter clients={clients} areas={areas} />} />;
}
