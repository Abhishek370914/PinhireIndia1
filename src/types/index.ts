// ─── Database Types ────────────────────────────────────────────
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type CompanySize = "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"
export type FundingStage = "Bootstrapped" | "Pre-seed" | "Seed" | "Series A" | "Series B" | "Series C+" | "IPO"
export type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance"
export type WorkMode = "remote" | "hybrid" | "onsite"
export type Industry =
  | "Fintech" | "Edtech" | "Healthtech" | "SaaS" | "E-commerce" | "Logistics"
  | "Real Estate" | "Gaming" | "AI/ML" | "Deeptech" | "Agritech" | "HRtech"
  | "Martech" | "Cleantech" | "Web3" | "D2C" | "Media" | "Other"

export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  banner_url: string | null
  description: string | null
  short_bio: string | null
  website: string | null
  career_page_url: string | null
  industry: Industry | null
  company_size: CompanySize | null
  funding_stage: FundingStage | null
  lat: number
  lng: number
  address: string | null
  locality: string | null
  city: string
  state: string
  pincode: string | null
  is_verified: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  /** Joined field: job count from DB */
  job_count?: number
}

export interface Job {
  id: string
  company_id: string
  title: string
  description: string | null
  requirements: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  experience_min: number | null
  experience_max: number | null
  job_type: JobType | null
  work_mode: WorkMode | null
  skills: string[]
  apply_url: string | null
  source: string | null
  external_id: string | null
  is_new: boolean
  is_active: boolean
  posted_at: string
  fetched_at: string
  /** Joined company info */
  company?: Pick<Company, "id" | "name" | "slug" | "logo_url" | "city" | "state" | "industry">
}

export interface Experience {
  id: string
  company: string
  role: string
  duration: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  year: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  location: string | null
  headline: string | null
  experience_years: number | null
  skills: string[]
  experience_details: Experience[]
  education: Education[]
  preferred_role: string | null
  preferred_location: string | null
  expected_salary: number | null
  created_at: string
}

export interface Alert {
  id: string
  user_id: string
  type: "company" | "locality" | "keyword"
  value: string
  channels: ("in_app" | "email" | "push")[]
  created_at: string
}

export interface SavedItem {
  id: string
  user_id: string
  type: "company" | "job"
  ref_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  url: string | null
  is_read: boolean
  created_at: string
}

// ─── Filter / UI Types ─────────────────────────────────────────
export interface MapFilters {
  industries: Industry[]
  companySizes: CompanySize[]
  jobTypes: JobType[]
  workModes: WorkMode[]
  experienceMin: number | null
  experienceMax: number | null
  salaryMin: number | null
  salaryMax: number | null
  searchQuery: string
  city: string | null
  locality: string | null
}

export type MapViewMode = "map" | "list" | "split"

export interface MapViewport {
  latitude: number
  longitude: number
  zoom: number
}

// ─── API Response Types ────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  hasMore: boolean
}
