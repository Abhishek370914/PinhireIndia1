import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min?: number | null, max?: number | null, currency = "INR"): string {
  if (!min && !max) return "Salary not disclosed"
  const fmt = (n: number) => {
    if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
    if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(1)}L`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return `${n}`
  }
  const prefix = currency === "INR" ? "₹" : currency
  if (min && max) return `${prefix}${fmt(min)} – ${prefix}${fmt(max)}`
  if (min) return `${prefix}${fmt(min)}+`
  if (max) return `Up to ${prefix}${fmt(max)}`
  return ""
}

export function formatRelativeDate(date?: string | Date | null): string {
  if (!date) return "Recently"
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return "Recently"
  
  const diff = Date.now() - d.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  
  if (mins  < 60)  return `${Math.max(0, mins)}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  < 7)   return `${days}d ago`
  if (days  < 30)  return `${Math.floor(days / 7)}w ago`
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function getCompanySizeLabel(size: string): string {
  const map: Record<string, string> = {
    "1-10":    "Startup (1–10)",
    "11-50":   "Small (11–50)",
    "51-200":  "Mid-size (51–200)",
    "201-1000":"Growth (201–1000)",
    "1000+":   "Enterprise (1000+)",
  }
  return map[size] ?? size
}

export const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
]

export const INDIA_TECH_HUBS = [
  "Bengaluru – HSR Layout","Bengaluru – Koramangala","Bengaluru – Whitefield",
  "Bengaluru – Indiranagar","Mumbai – Bandra","Mumbai – Andheri",
  "Mumbai – Lower Parel","Delhi – Gurugram","Delhi – Noida","Delhi – Connaught Place",
  "Hyderabad – HITEC City","Pune – Hinjewadi","Pune – Kharadi",
  "Chennai – Sholinganallur","Chennai – T Nagar",
]
