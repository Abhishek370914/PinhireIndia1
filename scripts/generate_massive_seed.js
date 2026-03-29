const fs = require('fs');
const crypto = require('crypto');

const STARTUP_PREFIXES = ["Tech", "Fin", "Health", "Agri", "Edu", "Cloud", "Data", "Cyber", "Smart", "Neo", "Omni", "Zepto", "Insta", "Giga", "Quant"];
const STARTUP_SUFFIXES = ["verse", "matic", "ify", "ly", "wave", "flow", "stack", "labs", "pay", "works", "ai", "hub", "node", "link", "base"];

const LOCATIONS = [
  { city: "Bengaluru", state: "Karnataka", localities: ["Koramangala", "HSR Layout", "BTM Layout", "Electronic City", "Indiranagar", "Whitefield", "Sarjapur Road"] },
  { city: "Gurugram", state: "Haryana", localities: ["Cyber City", "Udyog Vihar", "Sector 44", "Golf Course Road", "Sector 62"] },
  { city: "Mumbai", state: "Maharashtra", localities: ["Bandra Kurla Complex", "Powai", "Andheri East", "Malad", "Lower Parel"] },
  { city: "Pune", state: "Maharashtra", localities: ["Hinjewadi", "Kharadi", "Magarpatta", "Viman Nagar", "Baner"] },
  { city: "Hyderabad", state: "Telangana", localities: ["HITEC City", "Gachibowli", "Madhapur", "Kondapur", "Banjara Hills"] },
  { city: "Chennai", state: "Tamil Nadu", localities: ["OMR", "Guindy", "Taramani", "Siruseri", "Velachery"] },
  { city: "Noida", state: "Uttar Pradesh", localities: ["Sector 62", "Sector 132", "Sector 16", "Sector 125"] }
];

const HUB_COORDS = {
  "bengaluru": { lat: 12.9716, lng: 77.5946 },
  "gurugram": { lat: 28.4595, lng: 77.0266 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "pune": { lat: 18.5204, lng: 73.8567 },
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "noida": { lat: 28.5355, lng: 77.3910 }
};

function generateRandomCompany(id) {
  const prefix = STARTUP_PREFIXES[Math.floor(Math.random() * STARTUP_PREFIXES.length)];
  const suffix = STARTUP_SUFFIXES[Math.floor(Math.random() * STARTUP_SUFFIXES.length)];
  const name = `${prefix}${suffix}`;
  
  const locData = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const locality = locData.localities[Math.floor(Math.random() * locData.localities.length)];
  
  const baseXY = HUB_COORDS[locData.city.toLowerCase()] || { lat: 20.5937, lng: 78.9629 };
  
  // Distribute within a ~10-15km radius of the city center randomly
  const latOff = (Math.random() - 0.5) * 0.15;
  const lngOff = (Math.random() - 0.5) * 0.15;

  const lat = Number((baseXY.lat + latOff).toFixed(6));
  const lng = Number((baseXY.lng + lngOff).toFixed(6));
  
  const domain = `${name.toLowerCase()}.com`;

  return {
    id: String(id),
    name: name,
    slug: name.toLowerCase(),
    logo_url: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
    short_bio: `${name} is innovating in ${locData.city}.`,
    description: `${name} is a fast-growing startup located in ${locality}, ${locData.city}, building next-generation technology for the Indian market.`,
    industry: ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", "Cybersecurity"][Math.floor(Math.random() * 7)],
    company_size: ["1-10", "11-50", "51-200", "200-500"][Math.floor(Math.random() * 4)],
    funding_stage: ["Seed", "Series A", "Series B", "Bootstrapped"][Math.floor(Math.random() * 4)],
    lat,
    lng,
    locality,
    city: locData.city,
    state: locData.state,
    website: `https://${domain}`,
    career_page_url: `https://${domain}/careers`,
    is_verified: Math.random() > 0.2,
    is_featured: Math.random() > 0.8,
    job_count: 0
  };
}

// ── READ EXISTING DATA ──────────────────────────────────────────────
const existingModPath = '/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts';
let existingContent = fs.readFileSync(existingModPath, 'utf8');

const startIndex = existingContent.indexOf('[');
const endIndex = existingContent.lastIndexOf(']');
let jsonArrayStr = existingContent.substring(startIndex, endIndex + 1);
jsonArrayStr = jsonArrayStr.replace(/as any as Company\[\]|as Company\[\]/g, '');

const existingCompanies = eval(jsonArrayStr);
const seenNames = new Set(existingCompanies.map(c => c.name.toLowerCase()));
let maxId = Math.max(...existingCompanies.map(c => parseInt(c.id))) || 0;

console.log(`Found ${existingCompanies.length} existing companies.`);

const newCompanies = [];
// Generate exactly enough to hit 350 companies total
const numToGenerate = Math.max(0, 350 - existingCompanies.length);

for (let i = 0; i < numToGenerate; i++) {
  let attempts = 0;
  let comp;
  do {
    maxId++;
    comp = generateRandomCompany(maxId);
    attempts++;
  } while (seenNames.has(comp.name.toLowerCase()) && attempts < 10);
  
  seenNames.add(comp.name.toLowerCase());
  newCompanies.push(comp);
}

const finalCompanies = existingCompanies.concat(newCompanies);

// ── GENERATE TOTAL JOBS ─────────────────────────────────────────────
const JOB_TITLES = [
  "Frontend Engineer", "Backend Developer", "Full Stack Engineer",
  "Product Manager", "Data Scientist", "Machine Learning Engineer",
  "DevOps Engineer", "Site Reliability Engineer", "UI/UX Designer",
  "Growth Hacker", "Sales Development Rep", "HR Manager", "QA Automation"
];

const fakeJobs = [];
let jobId = 1;

finalCompanies.forEach(company => {
  // 90% chance to have jobs
  if (Math.random() > 0.1) {
    const numJobs = Math.floor(Math.random() * 5) + 1; // 1 to 5 jobs
    company.job_count = numJobs;

    const titles = [...JOB_TITLES].sort(() => 0.5 - Math.random()).slice(0, numJobs);
    
    titles.forEach(title => {
      fakeJobs.push({
        id: String(jobId++),
        company_id: company.id,
        title: title,
        slug: `${company.slug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random()*1000)}`,
        location: company.locality ? `${company.locality}, ${company.city}` : company.city,
        work_mode: Math.random() > 0.6 ? "Remote" : (Math.random() > 0.5 ? "Hybrid" : "Office"),
        job_type: "Full-time",
        experience_min: Math.floor(Math.random() * 3),
        experience_max: Math.floor(Math.random() * 4) + 4,
        salary_min: 800000 + Math.floor(Math.random() * 5) * 100000,
        salary_max: 1500000 + Math.floor(Math.random() * 10) * 100000,
        currency: "INR",
        description: `Exciting opportunity for a ${title} at ${company.name}. Help us build the future of our industry.`,
        requirements: [],
        benefits: [],
        apply_url: company.career_page_url || company.website,
        is_active: true,
        is_featured: company.is_featured,
        is_new: Math.random() > 0.5
      });
    });
  } else {
    company.job_count = 0;
  }
});

const companiesContent = `/**
 * Client-side company data for map display.
 */
import type { Company } from "@/types"

export const SEED_COMPANIES: Partial<Company>[] = ${JSON.stringify(finalCompanies, null, 2)} as any as Company[]
`;

const jobsContent = `/**
 * Generated mock jobs for all companies
 */
import type { Job } from "@/types"

export const SEED_JOBS: Job[] = ${JSON.stringify(fakeJobs, null, 2)} as any as Job[]
`;

fs.writeFileSync('/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts', companiesContent);
fs.writeFileSync('/Users/apple/Desktop/jobmapindia/src/lib/seed-jobs.ts', jobsContent);

console.log(`Successfully generated ${newCompanies.length} NEW mock companies!`);
console.log(`Total Companies: ${finalCompanies.length}`);
console.log(`Total Mock Jobs: ${fakeJobs.length}`);
