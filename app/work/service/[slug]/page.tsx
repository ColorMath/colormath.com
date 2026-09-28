import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudies } from "@/sanity/lib/caseStudies";
import { SERVICES, serviceTitle } from "@/sanity/lib/services";
import { WorkShell } from "../../WorkParts";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.value }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return SERVICES.some((s) => s.value === slug) ? { title: `${serviceTitle(slug)} · Work · Color/Math` } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SERVICES.some((s) => s.value === slug)) notFound();
  const studies = (await getCaseStudies()).filter((s) => s.services.includes(slug));
  return <WorkShell eyebrow="Work in" title={serviceTitle(slug)} studies={studies} />;
}
