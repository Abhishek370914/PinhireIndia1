"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Briefcase, Filter, SlidersHorizontal } from "lucide-react"
import type { Job, WorkMode, JobType } from "@/types"
import { SEED_JOBS } from "@/lib/seed-jobs"
import { SEED_COMPANIES } from "@/lib/seed-companies"
import JobCard from "@/components/jobs/JobCard"
import type { Company } from "@/types"

const JOB_TYPES: JobType[] = ["full-time","part-time","contract","internship"]
const WORK_MODES: WorkMode[] = ["remote","hybrid","onsite"]
const CITIES = ["All","Bengaluru","Mumbai","Gurugram","Noida","Hyderabad","Chennai","Pune","Delhi"]

// Enrich jobs with company info
const enrichedJobs = SEED_JOBS.map((j) => ({
  ...j,
  company: SEED_COMPANIES.find((c) => c.id === j.company_id) as Company | undefined,
})) as Job[]

export default function JobsPage() {
  const [search, setSearch] = useState("")
  const [jobType, setJobType] = useState<string>("All")
  const [workMode, setWorkMode] = useState<string>("All")
  const [city, setCity] = useState("All")
  const [onlyNew, setOnlyNew] = useState(false)

  const filtered = useMemo(() => {
    return enrichedJobs.filter((j) => {
      const q = search.toLowerCase()
      const matchesSearch = !search
        || j.title.toLowerCase().includes(q)
        || j.skills.some((s) => s.toLowerCase().includes(q))
        || j.company?.name.toLowerCase().includes(q)
        || j.company?.city.toLowerCase().includes(q)
      const matchesType = jobType === "All" || j.job_type === jobType
      const matchesMode = workMode === "All" || j.work_mode === workMode
      const matchesCity = city === "All" || j.company?.city === city
      const matchesNew = !onlyNew || j.is_new
      return matchesSearch && matchesType && matchesMode && matchesCity && matchesNew
    })
  }, [search, jobType, workMode, city, onlyNew])

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
          <span className="gradient-saffron">Find Your</span> Next Role
        </h1>
        <p className="mt-2 text-muted-foreground">
          {SEED_JOBS.length} open positions across India's top startups
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass border border-white/8 rounded-2xl p-4 mb-6"
      >
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Role, skill, or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-saffron/50 transition-colors"
            />
          </div>

          <select value={jobType} onChange={(e) => setJobType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none appearance-none cursor-pointer text-foreground">
            <option value="All">All Types</option>
            {JOB_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>

          <select value={workMode} onChange={(e) => setWorkMode(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none appearance-none cursor-pointer text-foreground">
            <option value="All">All Modes</option>
            {WORK_MODES.map((m) => <option key={m} value={m} className="capitalize">{m}</option>)}
          </select>

          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none appearance-none cursor-pointer text-foreground">
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <button
            onClick={() => setOnlyNew(!onlyNew)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${
              onlyNew ? "bg-saffron/15 border-saffron/40 text-saffron" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
            }`}
          >
            ⚡ New Only
          </button>
        </div>
      </motion.div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="text-foreground font-semibold">{filtered.length}</span> jobs
      </p>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No jobs match your search. Try adjusting the filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
