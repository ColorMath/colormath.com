import type { Metadata } from "next";
import { getCaseStudies } from "@/sanity/lib/caseStudies";
import { WorkShell } from "./WorkParts";

export const metadata: Metadata = {
  title: "Work · Color/Math",
  description: "Case studies from Color/Math.",
};

export default async function WorkIndex() {
  return <WorkShell title="Work" studies={await getCaseStudies()} />;
}
