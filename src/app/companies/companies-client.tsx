"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Building2, MapPin, Filter } from "lucide-react"
import type { Company, Industry } from "@/types"
import CompanyCard from "@/components/company/CompanyCard"

const INDUSTRIES = ["All","Fintech","Edtech","Healthtech","SaaS","E-commerce","Logistics","AI/ML","HRtech","Martech","D2C","Media","Deeptech","Web3"]
const CITIES = ["All","Bengaluru","Mumbai","Gurugram","Noida","Hyderabad","Chennai","Pune","Delhi","Ahmedabad"]

interface Props { companies: Company[] }

export default function CompaniesClient({ companies }: Props) {
  const [search, setSearch] = useState("")
  const [industry, setIndustry] = useState("All")
  const [city, setCity] = useState("All")

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
      const matchesIndustry = industry === "All" || c.industry === industry
      const matchesCity = city === "All" || c.city === city
      return matchesSearch && matchesIndustry && matchesCity
    })
  }, [companies, search, industry, city])

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
          <span className="gradient-saffron">Indian Companies</span> Hiring Now
        </h1>
        <p className="mt-2 text-muted-foreground">
          {companies.length} companies across India — from HSR Layout to HITEC City
        </p>
      </motion.div>

      {/* Search + Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron/50 transition-colors"
          />
        </div>

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-saffron/50 transition-colors appearance-none cursor-pointer"
        >
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-saffron/50 transition-colors appearance-none cursor-pointer"
        >
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8 text-xs text-muted-foreground">
          <Building2 className="w-3.5 h-3.5" />
          {filtered.length} results
        </div>
      </motion.div>

      {/* Company grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No companies match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company, i) => (
            <CompanyCard key={company.id} company={company} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
