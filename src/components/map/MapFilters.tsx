"use client"

import { motion } from "framer-motion"
import { SlidersHorizontal, X, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMapStore } from "@/store/mapStore"
import type { Industry, CompanySize, JobType, WorkMode } from "@/types"

const INDUSTRIES: Industry[] = ["Fintech","Edtech","Healthtech","SaaS","E-commerce","Logistics","AI/ML","Deeptech","HRtech","Martech","D2C","Media","Web3","Gaming","Agritech","Cleantech","Real Estate","Other"]
const SIZES: { label: string; value: CompanySize }[] = [
  { label: "1–10", value: "1-10" },
  { label: "11–50", value: "11-50" },
  { label: "51–200", value: "51-200" },
  { label: "201–1K", value: "201-1000" },
  { label: "1K+", value: "1000+" },
]
const JOB_TYPES: { label: string; value: JobType }[] = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
]
const WORK_MODES: { label: string; value: WorkMode }[] = [
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "On-site", value: "onsite" },
]

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      {children}
    </div>
  )
}

function ToggleBadge({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer ${
        active
          ? "bg-saffron/15 border-saffron/60 text-saffron"
          : "bg-white/4 border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
      }`}
    >
      {label}
    </motion.button>
  )
}

export default function MapFilters() {
  const { filters, setFilters, resetFilters } = useMapStore()

  const toggle = <T extends string>(key: keyof typeof filters, value: T) => {
    const arr = filters[key] as T[]
    setFilters({ [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] })
  }

  const hasAnyFilter =
    filters.industries.length > 0 ||
    filters.companySizes.length > 0 ||
    filters.jobTypes.length > 0 ||
    filters.workModes.length > 0

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 24 }}
      className="w-72 shrink-0 h-full glass border-r border-white/8 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-saffron" />
          Filters
        </div>
        {hasAnyFilter && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-saffron transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <FilterSection title="Industry">
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES.map((ind) => (
              <ToggleBadge
                key={ind}
                label={ind}
                active={filters.industries.includes(ind)}
                onClick={() => toggle("industries", ind)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Company Size">
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map(({ label, value }) => (
              <ToggleBadge
                key={value}
                label={label}
                active={filters.companySizes.includes(value)}
                onClick={() => toggle("companySizes", value)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Job Type">
          <div className="flex flex-wrap gap-1.5">
            {JOB_TYPES.map(({ label, value }) => (
              <ToggleBadge
                key={value}
                label={label}
                active={filters.jobTypes.includes(value)}
                onClick={() => toggle("jobTypes", value)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Work Mode">
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODES.map(({ label, value }) => (
              <ToggleBadge
                key={value}
                label={label}
                active={filters.workModes.includes(value)}
                onClick={() => toggle("workModes", value)}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Active filter count */}
      {hasAnyFilter && (
        <div className="px-4 py-3 border-t border-white/8 text-xs text-muted-foreground">
          {[...filters.industries, ...filters.companySizes, ...filters.jobTypes, ...filters.workModes].length} filter(s) active
        </div>
      )}
    </motion.aside>
  )
}
