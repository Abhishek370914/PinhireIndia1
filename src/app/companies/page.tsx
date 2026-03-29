import type { Metadata } from "next"
import { SEED_COMPANIES } from "@/lib/seed-companies"
import type { Company } from "@/types"
import CompaniesClient from "./companies-client"

export const metadata: Metadata = {
  title: "Companies",
  description: "Browse hundreds of Indian startups and tech companies hiring now. Filter by city, industry, funding stage, and more.",
}

export default function CompaniesPage() {
  return <CompaniesClient companies={SEED_COMPANIES as Company[]} />
}
