import { SEED_JOBS } from "./seed-jobs"
import { SEED_COMPANIES } from "./seed-companies"
import type { Job, Company } from "@/types"

/**
 * Pre-computed indices for O(1) data lookup.
 * This prevents expensive .filter() calls inside high-frequency renders (map/sidebar).
 */

// Index jobs by company_id
export const JOBS_BY_COMPANY: Record<string, Job[]> = SEED_JOBS.reduce((acc, job) => {
  if (!job.is_active) return acc
  if (!acc[job.company_id]) {
    acc[job.company_id] = []
  }
  acc[job.company_id].push(job as Job)
  return acc
}, {} as Record<string, Job[]>)

// Index company by ID for quick detail lookups
export const COMPANY_BY_ID: Record<string, Company> = SEED_COMPANIES.reduce((acc, co) => {
  if (co.id) acc[co.id as string] = co as Company
  return acc
}, {} as Record<string, Company>)

// Total active roles across all companies
export const TOTAL_ACTIVE_ROLES = SEED_JOBS.filter(j => j.is_active).length

// Helper to get job count for a company
export const getJobCount = (companyId: string): number => {
  return JOBS_BY_COMPANY[companyId]?.length || 0
}
