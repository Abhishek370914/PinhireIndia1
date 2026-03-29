"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Globe, ExternalLink, Building2, TrendingUp, CheckCircle2, Briefcase, Bookmark } from "lucide-react"
import type { Company } from "@/types"
import { SEED_JOBS } from "@/lib/seed-jobs"
import JobCard from "@/components/jobs/JobCard"

interface Props { company: Company }

export default function CompanyDetailClient({ company }: Props) {
  // Filter mock jobs for this company
  const jobs = SEED_JOBS.filter((j) => j.company_id === company.id)

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/companies">
        <motion.div
          whileHover={{ x: -3 }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Companies
        </motion.div>
      </Link>

      {/* Banner */}
      <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron/20 via-navy to-teal/20" />
        {company.banner_url && (
          <Image src={company.banner_url} alt="" fill className="object-cover opacity-50" />
        )}
      </div>

      {/* Header row */}
      <div className="relative px-4 sm:px-6 pb-6 pt-0 -mt-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-background shadow-2xl bg-white shrink-0">
            {company.logo_url ? (
              <Image src={company.logo_url} alt={company.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron to-amber-400 text-white font-bold text-xl">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
              <Bookmark className="w-4 h-4" /> Save
            </button>
            {company.career_page_url && (
              <a href={company.career_page_url} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold hover:bg-saffron/90 transition-colors glow-saffron"
                >
                  <ExternalLink className="w-4 h-4" /> Careers Page
                </motion.div>
              </a>
            )}
          </div>
        </div>

        {/* Company name + meta */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">{company.name}</h1>
            {company.is_verified && (
              <CheckCircle2 className="w-6 h-6 text-teal shrink-0" />
            )}
            {company.is_featured && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-saffron/15 text-saffron border border-saffron/25">Featured</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            {company.locality ? `${company.locality}, ` : ""}{company.city}, {company.state}
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {company.industry && (
            <span className="px-3 py-1.5 rounded-xl text-sm font-medium bg-saffron/10 text-saffron border border-saffron/20">{company.industry}</span>
          )}
          {company.company_size && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border border-white/10 text-muted-foreground">
              <Building2 className="w-4 h-4" />{company.company_size} employees
            </span>
          )}
          {company.funding_stage && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border border-white/10 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />{company.funding_stage}
            </span>
          )}
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border border-white/10 text-muted-foreground hover:text-saffron hover:border-saffron/30 transition-all">
              <Globe className="w-4 h-4" />Website
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6">
        {/* About */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h2 className="font-display font-bold text-xl mb-3">About {company.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {company.description || company.short_bio || "No description available."}
            </p>
          </div>

          {/* Jobs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-saffron" />
              <h2 className="font-display font-bold text-xl">Open Roles ({jobs.length})</h2>
            </div>
            {jobs.length === 0 ? (
              <div className="glass border border-white/8 rounded-2xl p-10 text-center text-muted-foreground">
                No open roles at the moment. Follow this company to get notified.
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass border border-white/8 rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">Company Info</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs mb-0.5">Location</dt>
                <dd className="text-foreground">{company.city}, {company.state}</dd>
              </div>
              {company.pincode && (
                <div>
                  <dt className="text-muted-foreground text-xs mb-0.5">Pincode</dt>
                  <dd className="text-foreground">{company.pincode}</dd>
                </div>
              )}
              {company.company_size && (
                <div>
                  <dt className="text-muted-foreground text-xs mb-0.5">Team Size</dt>
                  <dd className="text-foreground">{company.company_size} employees</dd>
                </div>
              )}
              {company.funding_stage && (
                <div>
                  <dt className="text-muted-foreground text-xs mb-0.5">Funding</dt>
                  <dd className="text-foreground">{company.funding_stage}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="glass border border-white/8 rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-3">🔔 Get Notified</h3>
            <p className="text-xs text-muted-foreground mb-3">Follow {company.name} to receive alerts for new job openings.</p>
            <Link href="/auth/signup">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-saffron/30 hover:text-saffron transition-all cursor-pointer"
              >
                Follow Company
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
