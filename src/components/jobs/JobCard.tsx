"use client"

import { motion } from "framer-motion"
import { Briefcase, Clock, MapPin, Zap, ExternalLink, Bookmark, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Job } from "@/types"
import { formatSalary, formatRelativeDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface Props {
  job: Job
  index?: number
  compact?: boolean
}

const workModeColors = {
  remote: "bg-teal/10 text-teal border-teal/20",
  hybrid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  onsite: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}
const jobTypeLabels: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
}

export default function JobCard({ job, index = 0, compact = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 280, damping: 24 }}
      className={cn(
        "group relative glass border border-white/8 rounded-xl transition-all duration-200",
        "hover:border-saffron/30 hover:shadow-md hover:shadow-saffron/10",
        compact ? "p-3" : "p-4"
      )}
    >
      {/* "New" ribbon */}
      {job.is_new && (
        <div className="absolute top-2.5 right-2.5">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-saffron/15 border border-saffron/30 text-saffron text-[10px] font-bold"
          >
            <Zap className="w-2.5 h-2.5" />
            NEW
          </motion.div>
        </div>
      )}

      {/* Title */}
      <h4 className={cn("font-semibold text-foreground group-hover:text-saffron transition-colors pr-10", compact ? "text-sm" : "text-base")}>
        {job.title}
      </h4>

      {/* Company info if present */}
      {job.company && (
        <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {job.company.city} · {job.company.name}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {job.work_mode && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${workModeColors[job.work_mode] ?? "bg-white/5 border-white/10 text-muted-foreground"}`}>
            {job.work_mode.charAt(0).toUpperCase() + job.work_mode.slice(1)}
          </span>
        )}
        {job.job_type && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border border-white/8 text-muted-foreground">
            {jobTypeLabels[job.job_type] ?? job.job_type}
          </span>
        )}
        {(job.experience_min != null || job.experience_max != null) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border border-white/8 text-muted-foreground">
            {job.experience_min ?? 0}–{job.experience_max ?? "10"}+ yrs
          </span>
        )}
      </div>

      {/* Salary */}
      <p className={cn("mt-2 font-semibold", compact ? "text-xs" : "text-sm", "text-foreground/80")}>
        {formatSalary(job.salary_min, job.salary_max)}
      </p>

      {/* Skills */}
      {!compact && job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {job.skills.slice(0, 5).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-md text-[11px] bg-white/4 border border-white/8 text-muted-foreground">
              {s}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] text-muted-foreground">+{job.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatRelativeDate(job.posted_at)}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </motion.button>
          {job.apply_url && (
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-saffron text-white text-xs font-semibold hover:bg-saffron/90 transition-colors"
              >
                Apply
                <ExternalLink className="w-3 h-3" />
              </motion.div>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
