const fs = require('fs')
const crypto = require('crypto')

const rawInput = `Sonata Software, Koramangala Industrial Layout, Bengaluru, Karnataka 560034, https://www.sonata-software.com/careers
Trigent Software, Electronic City Phase 1, Bengaluru, Karnataka 560100, https://www.trigent.com/careers
Appentus Technologies, Koramangala, Bengaluru, Karnataka 560034, https://www.appentus.com/careers
Carmatec, BTM 2nd Stage, Bengaluru, Karnataka 560076, https://carmatec.com/careers
TechAvidus, Electronic City, Bengaluru, Karnataka 560100, https://techavidus.com/careers
Rytsense Technologies, Sarjapur Road, Bengaluru, Karnataka 560035, https://rytsense.com/careers
Aegis Softtech, Koramangala, Bengaluru, Karnataka 560034, https://www.aegissofttech.com/careers
Nadcab Labs, BTM Layout, Bengaluru, Karnataka 560076, https://www.nadcab.com/careers
Bonami Software, Electronic City, Bengaluru, Karnataka 560100, https://bonamisoftware.com/careers
Vyshnavi Information Technologies, Electronic City, Bengaluru, Karnataka 560100, https://www.vitinfo.com/careers
Eglobal India, Koramangala, Bengaluru, Karnataka 560034, https://www.eglobalindia.com/careers
Aalpha Information Systems, Koramangala, Bengaluru, Karnataka 560034, https://www.aalpha.net/careers
Leena AI, Koramangala, Bengaluru, Karnataka 560034, https://leena.ai/careers
Fireflies.ai, Koramangala, Bengaluru, Karnataka 560034, https://fireflies.ai/careers
Nanonets, Koramangala, Bengaluru, Karnataka 560034, https://nanonets.com/careers
Zenskar, Koramangala, Bengaluru, Karnataka 560034, https://www.zenskar.com/careers
Instawork, Koramangala, Bengaluru, Karnataka 560034, https://www.instawork.com/careers
Netskope, Koramangala, Bengaluru, Karnataka 560034, https://www.netskope.com/careers
LaunchDarkly, Koramangala, Bengaluru, Karnataka 560034, https://launchdarkly.com/careers
Innoviti Solutions, Koramangala, Bengaluru, Karnataka 560034, https://innoviti.com/careers
Rupeek, Koramangala, Bengaluru, Karnataka 560034, https://rupeek.com/careers
Perfios, Koramangala, Bengaluru, Karnataka 560034, https://www.perfios.com/careers
Livspace, Koramangala, Bengaluru, Karnataka 560034, https://www.livspace.com/careers
Increff, Koramangala, Bengaluru, Karnataka 560034, https://increff.com/careers
BlueStone, Koramangala, Bengaluru, Karnataka 560034, https://www.bluestone.com/careers
Khatabook, Koramangala, Bengaluru, Karnataka 560034, https://khatabook.com/careers
Yellow.ai, Koramangala, Bengaluru, Karnataka 560034, https://yellow.ai/careers
Rapido, Koramangala, Bengaluru, Karnataka 560034, https://rapido.bike/careers
Udaan, BTM Layout, Bengaluru, Karnataka 560076, https://udaan.com/careers
Ather Energy, Sarjapur Road, Bengaluru, Karnataka 560035, https://www.atherenergy.com/careers
Ninjacart, Electronic City, Bengaluru, Karnataka 560100, https://www.ninjacart.in/careers
Hashtaag, HSR Layout, Bengaluru, Karnataka 560102, https://hashtaag.com/careers
Pickcel, BTM Layout, Bengaluru, Karnataka 560076, https://pickcel.com/careers
Srishti Software, Electronic City, Bengaluru, Karnataka 560100, https://www.srishtisoftware.com/careers
Skypro Technologies, Sarjapur Road, Bengaluru, Karnataka 560035, https://skypro.in/careers
Zolostays, Koramangala, Bengaluru, Karnataka 560034, https://www.zolostays.com/careers
GrabOnRent, BTM Layout, Bengaluru, Karnataka 560076, https://grabonrent.com/careers
NimbleBox.ai, Sarjapur Road, Bengaluru, Karnataka 560035, https://nimblebox.ai/careers
Adwest Digital, Koramangala, Bengaluru, Karnataka 560034, https://adwestdigital.com/careers
Techasoft, BTM Layout, Bengaluru, Karnataka 560076, https://www.techasoft.com/careers
Digiexpand, Sarjapur Road, Bengaluru, Karnataka 560035, https://digiexpand.com/careers
TatvaSoft, Electronic City, Bengaluru, Karnataka 560100, https://www.tatvasoft.com/careers
Clarion Technologies, Koramangala, Bengaluru, Karnataka 560034, https://clariontechnologies.co.in/careers
QBurst, Koramangala, Bengaluru, Karnataka 560034, https://www.qburst.com/careers
Robosoft Technologies, Sarjapur Road, Bengaluru, Karnataka 560035, https://www.robosoftin.com/careers
W3 Dream Solutions, Electronic City, Bengaluru, Karnataka 560100, https://w3dreamsolutions.com/careers` // only distinct ones, I omitted dupes

const locationMap = {
  "electronic city": { lat: 12.8452, lng: 77.6601 },
  "manyata": { lat: 13.0475, lng: 77.6190 },
  "embassy tech village": { lat: 12.9355, lng: 77.6853 },
  "embassy golf links": { lat: 12.9515, lng: 77.6409 },
  "cessna": { lat: 12.9360, lng: 77.6910 },
  "bagmane": { lat: 12.9818, lng: 77.6644 },
  "koramangala": { lat: 12.9279, lng: 77.6271 },
  "btm": { lat: 12.9165, lng: 77.6101 }, // added BTM
  "hsr": { lat: 12.9121, lng: 77.6446 }, // added HSR
  "indiranagar": { lat: 12.9716, lng: 77.6412 },
  "whitefield": { lat: 12.9698, lng: 77.7499 },
  "sarjapur": { lat: 12.9121, lng: 77.6836 },
  "global village": { lat: 12.9152, lng: 77.5028 },
  "peenya": { lat: 13.0315, lng: 77.5255 },
  "outer ring road": { lat: 12.9304, lng: 77.6784 },
}

function getBaseCoord(address) {
  const lower = address.toLowerCase()
  for (const [key, coords] of Object.entries(locationMap)) {
    if (lower.includes(key)) {
      return coords
    }
  }
  return { lat: 12.9716, lng: 77.5946 } // Default central Bangalore
}

function getDomain(urlStr) {
  try {
    const url = new URL(urlStr)
    return url.hostname.replace('www.', '')
  } catch(e) {
    return "example.com"
  }
}

function createOffset(id) {
  const hash = crypto.createHash('md5').update(String(id)).digest('hex')
  const latR = parseInt(hash.substring(0, 4), 16) / 65535
  const lngR = parseInt(hash.substring(4, 8), 16) / 65535
  return { latOff: (latR - 0.5) * 0.015, lngOff: (lngR - 0.5) * 0.015 }
}

const lines = rawInput.split('\n').filter(l => l.trim())

// READ EXISTING
const existingModPath = '/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts'
let existingContent = fs.readFileSync(existingModPath, 'utf8')

// Parse out JSON safely by stripping TS syntax
const startIndex = existingContent.indexOf('[')
const endIndex = existingContent.lastIndexOf(']')
let jsonArrayStr = existingContent.substring(startIndex, endIndex + 1)
// The end might include `] as any as Company[]`, so just take up to the first closing bracket of the *main array*, or just remove the cast text.
jsonArrayStr = jsonArrayStr.replace(/as any as Company\[\]|as Company\[\]/g, '')

const existingCompanies = eval(jsonArrayStr)

// Dedupe by name
const seenNames = new Set(existingCompanies.map(c => c.name.toLowerCase()))
let maxId = Math.max(...existingCompanies.map(c => parseInt(c.id)))

const newCompanies = []
lines.forEach((line) => {
  const parts = line.split(',')
  if(parts.length < 3) return
  let url = parts[parts.length - 1].trim()
  const name = parts[0].trim()
  
  if (seenNames.has(name.toLowerCase())) return
  seenNames.add(name.toLowerCase())

  const address = parts.slice(1, parts.length - 1).join(',').trim()
  const locality = parts[1].trim()
  
  maxId++
  const baseXY = getBaseCoord(address)
  const offset = createOffset(name)
  
  const domain = getDomain(url)
  const logo_url = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`
  
  newCompanies.push({
    id: String(maxId),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,''),
    logo_url,
    short_bio: `${name} office located in ${locality}.`,
    description: `${name} is hiring in Bengaluru at their ${locality} office. Visit their career page for more details.`,
    industry: "Startup",
    company_size: "50-500",
    funding_stage: "Funded",
    lat: Number((baseXY.lat + offset.latOff).toFixed(6)),
    lng: Number((baseXY.lng + offset.lngOff).toFixed(6)),
    locality,
    city: "Bengaluru",
    state: "Karnataka",
    website: `https://${domain}`,
    career_page_url: url,
    is_verified: true,
    is_featured: false,
    job_count: 0
  })
})

const finalCompanies = existingCompanies.concat(newCompanies)

// Add fake realistic jobs for ALL companies
const JOB_TITLES = [
  "Frontend Engineer", "Backend Developer", "Full Stack Engineer",
  "Product Manager", "Data Scientist", "DevOps Engineer",
  "UI/UX Designer", "Marketing Manager", "Sales Executive", "HR Business Partner"
]

const fakeJobs = []
let jobId = 1

finalCompanies.forEach(company => {
  // Generate 2 to 8 jobs per company
  const numJobs = Math.floor(Math.random() * 7) + 2
  company.job_count = numJobs // update the company job_count

  // Generate unique titles for this company
  const titles = [...JOB_TITLES].sort(() => 0.5 - Math.random()).slice(0, numJobs)
  
  titles.forEach(title => {
    fakeJobs.push({
      id: String(jobId++),
      company_id: company.id,
      title: title,
      slug: `${company.slug}-${title.toLowerCase().replace(/ /g, '-')}-${Math.floor(Math.random()*1000)}`,
      location: company.locality ? `${company.locality}, ${company.city}` : company.city,
      work_mode: Math.random() > 0.6 ? "Remote" : (Math.random() > 0.5 ? "Hybrid" : "Office"),
      job_type: "Full-time",
      experience_min: Math.floor(Math.random() * 3),
      experience_max: Math.floor(Math.random() * 4) + 4,
      salary_min: 800000 + Math.floor(Math.random() * 5) * 100000,
      salary_max: 1500000 + Math.floor(Math.random() * 10) * 100000,
      currency: "INR",
      description: `We are looking for a ${title} to join ${company.name} in Bengaluru.`,
      requirements: [],
      benefits: [],
      apply_url: company.career_page_url || company.website,
      is_active: true,
      is_featured: false,
      is_new: Math.random() > 0.5
    })
  })
})

const companiesContent = `/**
 * Client-side company data for map display.
 */
import type { Company } from "@/types"

export const SEED_COMPANIES: Partial<Company>[] = ${JSON.stringify(finalCompanies, null, 2)} as any as Company[]
`

const jobsContent = `/**
 * Generated mock jobs for all companies
 */
import type { Job } from "@/types"

export const SEED_JOBS: Job[] = ${JSON.stringify(fakeJobs, null, 2)} as any as Job[]
`

fs.writeFileSync('/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts', companiesContent)
fs.writeFileSync('/Users/apple/Desktop/jobmapindia/src/lib/seed-jobs.ts', jobsContent)
console.log(`Successfully generated ${newCompanies.length} NEW companies and ${fakeJobs.length} total mock jobs!`)
