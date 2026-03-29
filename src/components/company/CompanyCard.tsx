"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Briefcase, Building2, TrendingUp, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/types"
import { cn } from "@/lib/utils"
import { useMapStore } from "@/store/mapStore"

interface Props {
  company: Company
  index?: number
}

const industryColors: Record<string, string> = {
  Fintech: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Edtech: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Healthtech: "bg-red-500/10 text-red-400 border-red-500/20",
  SaaS: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "E-commerce": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Logistics: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "AI/ML": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Media: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  HRtech: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
}

export default function CompanyCard({ company, index = 0 }: Props) {
  const { setSelectedCompany, setViewport, hoveredCompanyId, setHoveredCompanyId } = useMapStore()

  const handleClick = () => {
    setSelectedCompany(company.id, company)
    setViewport({ latitude: company.lat, longitude: company.lng, zoom: 14 })
  }

  const industryClass = company.industry ? industryColors[company.industry] : "bg-white/5 text-muted-foreground border-white/10"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 280, damping: 24 }}
      onHoverStart={() => setHoveredCompanyId(company.id)}
      onHoverEnd={() => setHoveredCompanyId(null)}
      onClick={handleClick}
      className={cn(
        "group relative glass border border-white/8 rounded-2xl p-4 cursor-pointer",
        "hover:border-saffron/30 hover:shadow-lg hover:shadow-saffron/10",
        "transition-all duration-200",
        hoveredCompanyId === company.id && "border-saffron/40 shadow-saffron/15 shadow-lg"
      )}
    >
      {/* Featured glow */}
      {company.is_featured && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-saffron/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-start gap-3">
        {/* Logo */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
          {company.logo_url ? (
            <Image src={company.logo_url} alt={company.name} fill className="object-cover bg-white" sizes="48px" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-saffron to-amber-400 text-sm">
              {company.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {company.is_verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-teal border-2 border-background flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">✓</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-saffron transition-colors truncate leading-tight">
                {company.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{company.locality ? `${company.locality}, ` : ""}{company.city}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-saffron/10 text-muted-foreground hover:text-saffron transition-colors shrink-0"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Short bio */}
          {company.short_bio && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{company.short_bio}</p>
          )}

          {/* Tags row */}
          <div className="flex items-center flex-wrap gap-1.5 mt-2">
            {company.industry && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${industryClass}`}>
                {company.industry}
              </span>
            )}
            {company.funding_stage && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-navy/60 border border-white/8 text-muted-foreground">
                <TrendingUp className="w-2.5 h-2.5" />
                {company.funding_stage}
              </span>
            )}
            {company.company_size && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] border border-white/8 text-muted-foreground">
                <Building2 className="w-2.5 h-2.5" />
                {company.company_size}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Job count footer */}
      {company.job_count != null && company.job_count > 0 && (
        <div className="mt-3 pt-3 border-t border-white/6 flex items-center gap-1.5 text-xs">
          <Briefcase className="w-3.5 h-3.5 text-saffron" />
          <span className="text-saffron font-semibold">{company.job_count} open role{company.job_count > 1 ? "s" : ""}</span>
        </div>
      )}
    </motion.div>
  )
}
