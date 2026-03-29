"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Bookmark, Bell, Briefcase, Building2, MapPin, Settings, ChevronRight, ArrowRight } from "lucide-react"
import { SEED_COMPANIES } from "@/lib/seed-companies"
import { SEED_JOBS } from "@/lib/seed-jobs"
import type { Company, Job } from "@/types"

const savedCompanies = SEED_COMPANIES.slice(0, 3) as Company[]
const savedJobs = SEED_JOBS.slice(0, 4) as Job[]

const alerts = [
  { id: "a1", type: "locality", value: "HSR Layout, Bengaluru", channels: ["in_app", "email"] },
  { id: "a2", type: "keyword", value: "Senior Frontend Engineer", channels: ["in_app"] },
  { id: "a3", type: "company", value: "Razorpay", channels: ["in_app", "push"] },
]

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-bold text-lg">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-saffron hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-muted-foreground text-sm mb-1">Welcome back 👋</p>
        <h1 className="font-display font-extrabold text-4xl tracking-tight">Your Dashboard</h1>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
      >
        {[
          { icon: Bookmark, label: "Saved Jobs", value: savedJobs.length, color: "text-saffron" },
          { icon: Building2, label: "Following", value: savedCompanies.length, color: "text-teal" },
          { icon: Bell, label: "Active Alerts", value: alerts.length, color: "text-blue-400" },
          { icon: Briefcase, label: "Applications", value: 0, color: "text-purple-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass border border-white/8 rounded-2xl p-4">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="font-display font-bold text-2xl">{value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Saved Jobs + Companies */}
        <div className="lg:col-span-2 space-y-8">
          {/* Saved Jobs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionHeader title="Saved Jobs" href="/jobs" />
            {savedJobs.length === 0 ? (
              <div className="glass border border-white/8 rounded-2xl p-8 text-center text-muted-foreground text-sm">
                No saved jobs yet.{" "}
                <Link href="/jobs" className="text-saffron hover:underline">Browse roles →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {savedJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="glass border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-saffron/25 transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {job.work_mode} · {job.job_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.is_new && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-saffron/15 text-saffron border border-saffron/25">NEW</span>
                      )}
                      <Link href={job.apply_url ?? "#"} target="_blank">
                        <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-saffron transition-colors" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Saved Companies */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SectionHeader title="Following Companies" href="/companies" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {savedCompanies.map((company, i) => (
                <Link key={company.id} href={`/companies/${company.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="glass border border-white/8 rounded-2xl p-4 hover:border-saffron/25 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 mb-3 bg-white">
                      {company.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <p className="font-semibold text-sm group-hover:text-saffron transition-colors">{company.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{company.city}</p>
                    {company.job_count != null && (
                      <p className="text-xs text-saffron mt-1">{company.job_count} open roles</p>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Alerts + Quick Links */}
        <div className="space-y-4">
          {/* Alerts */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-saffron" />
                  <h3 className="font-semibold text-sm">Job Alerts</h3>
                </div>
                <span className="text-xs text-muted-foreground">{alerts.length} active</span>
              </div>
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{alert.value}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{alert.type} · {alert.channels.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/notifications">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/8 text-xs text-muted-foreground hover:text-saffron hover:border-saffron/25 transition-all cursor-pointer"
                >
                  Manage Alerts <Settings className="w-3 h-3" />
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass border border-white/8 rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-3">Quick Access</h3>
              <div className="space-y-1">
                {[
                  { href: "/explore", label: "🗺 Explore Map" },
                  { href: "/companies", label: "🏢 All Companies" },
                  { href: "/jobs", label: "💼 Browse Jobs" },
                  { href: "/notifications", label: "🔔 Notifications" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                      {label}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
