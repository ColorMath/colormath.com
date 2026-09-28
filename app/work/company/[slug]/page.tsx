import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { companiesOf, getCaseStudies } from "@/sanity/lib/caseStudies";
import { WorkShell } from "../../WorkParts";

export async function generateStaticParams() {
  return companiesOf(await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

async function load(slug: string) {
  const studies = await getCaseStudies();
  const company = companiesOf(studies).find((c) => c.slug === slug);
  return company && { company, studies: studies.filter((s) => s.companies.some((c) => c.slug === slug)) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await load((await params).slug);
  return data ? { title: `${data.company.name} · Work · Color/Math` } : {};
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await load((await params).slug);
  if (!data) notFound();
  return <WorkShell eyebrow="Work with" title={data.company.name} studies={data.studies} />;
}
