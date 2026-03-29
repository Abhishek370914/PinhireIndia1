import type { Metadata } from "next"
import { SEED_COMPANIES } from "@/lib/seed-companies"
import type { Company } from "@/types"
import CompanyDetailClient from "./company-detail-client"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const company = SEED_COMPANIES.find((c) => c.slug === slug) as Company | undefined
  if (!company) return { title: "Company Not Found" }
  return {
    title: company.name,
    description: company.short_bio ?? `Explore open jobs at ${company.name} on PinHire India.`,
  }
}

export async function generateStaticParams() {
  return SEED_COMPANIES.map((c) => ({ slug: c.slug }))
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const company = SEED_COMPANIES.find((c) => c.slug === slug) as Company | undefined
  if (!company) notFound()
  return <CompanyDetailClient company={company} />
}
