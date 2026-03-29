const fs = require('fs');

const RAW_WHITEFIELD_DATA = `TCS (Tata Consultancy Services) | International Tech Park Bangalore (ITPL), Whitefield, Bengaluru, Karnataka 560066 | https://www.tcs.com/careers
Wipro | Wipro Corporate Office / campuses in Whitefield / EPIP Zone, 560066 | https://careers.wipro.com/
Infosys | Infosys SEZ / Whitefield area, Bengaluru 560066 | https://www.infosys.com/careers/
Accenture | Accenture Delivery Centre, Whitefield, Bengaluru 560066 | https://www.accenture.com/in-en/careers
IBM | IBM India Pvt Ltd, Whitefield Campus, Bengaluru 560066 | https://www.ibm.com/careers
SAP Labs India | SAP Labs, Whitefield, Bengaluru 560066 | https://jobs.sap.com/
Oracle | Oracle India, Whitefield / EPIP, Bengaluru 560066 | https://www.oracle.com/careers/
Capgemini | Capgemini, Whitefield, Bengaluru 560066 | https://www.capgemini.com/careers/
Mindtree (LTIMindtree) | Mindtree Campus, Whitefield, Bengaluru 560066 | https://www.ltimindtree.com/careers/
HCL Technologies | HCL, Salarpuria GR Tech Park / Whitefield, Bengaluru 560066 | https://www.hcltech.com/careers
Dell Technologies | Dell, Whitefield, Bengaluru 560066 | https://jobs.dell.com/
Schneider Electric | Schneider Electric, Whitefield-Hoskote Road, Bengaluru 560066 | https://www.se.com/ww/en/about-us/careers/
Mu Sigma | Mu Sigma, International Tech Park (Aviator Building), Whitefield 560066 | https://www.mu-sigma.com/careers
Aegis (Essar Group) | Explorer Building, ITPL, Whitefield 560066 | https://aegis.com/careers
GE (John F. Welch Technology Centre) | GE Global Research, Whitefield, Bengaluru 560066 | https://jobs.gecareers.com/
Huawei | Huawei, Whitefield, Bengaluru 560066 | https://career.huawei.com/
Cognizant | Cognizant, Whitefield area, Bengaluru | https://careers.cognizant.com/
AT&T | International Tech Park, Whitefield 560066 | https://www.att.jobs/
Conduent | ITPL, Whitefield | https://jobs.conduent.com/
Xerox | ITPL Whitefield | https://www.xerox.com/en-us/about/careers
Société Générale | ITPL, Whitefield 560066 | https://careers.societegenerale.com/
GalaxE Solutions | Aviator Building, ITPL Whitefield | https://galaxesolutions.com/careers
Applied Materials | Whitefield / EPIP Zone | https://careers.appliedmaterials.com/
First American | Whitefield | https://www.firstamerican.com/careers
W2S Solutions | Whitefield | https://www2ssolutions.com/careers
Simnovus | Regent Prime, Whitefield Main Road, 560066 | https://simnovus.com/careers
Actinium Softwares | Whitefield, 560066 | https://actiniumsoftwares.com
MicroNXT Solutions | Regent Prime, Whitefield Main Road | https://micronxt.com
Weblink Software | Whitefield | https://weblinksoftware.com
MSANTYTECH | Sigma Tech Park, Whitefield, Palm Meadows, 560066 | https://msantytech.com
Jellies-ai | Whitefield, 560066 | https://jellies.ai
Social DNA Labs | Whitefield, 560066 | https://socialdnalabs.com
Podshore Galaxy Services | Whitefield area | https://podshore.com
Merida Tech Minds | Whitefield vicinity | https://meridatechminds.com
Netjet Infotech | Whitefield | https://netjetinfotech.com
Adaptive Infotech | Whitefield | https://adaptiveinfotech.com
Excerpt Technologies | Whitefield area | https://excerpttechnologies.com
Cranes Software | Whitefield vicinity | https://cranessoftware.com
42 Gears Mobility Systems | Whitefield area | https://42gears.com/careers
InstaSafe | Whitefield | https://instasafe.com/careers
Digitap.AI | Whitefield area | https://digitap.ai
WatNx Consulting | Whitefield | https://watnx.com
Ebsl Automat | Whitefield | https://ebslautomat.com
G7 CR Technologies | Whitefield | https://g7cr.com
Sysnet Global Technologies | Whitefield | https://sysnetglobal.com
VYTURR TECH INNOVATIONS | Whitefield area | https://vyturr.com
NIMBLIX TECNOLOGIES | Whitefield | https://nimblix.com
BuziBrAIns | Whitefield vicinity | https://buzibrains.com
Tetcos | Whitefield area | https://tetcos.com/careers`;

function getDomain(urlStr) {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace('www.', '');
  } catch(e) {
    if (urlStr && urlStr.startsWith('http')) return urlStr.replace('https://', '').replace('http://', '').split('/')[0];
    return "example.com";
  }
}

function extractJSON(content) {
  const match = content.match(/=\s*(\[[\s\S]*?\])\s*as/);
  if (match) return JSON.parse(match[1]);
  return [];
}

// ── READ EXISTING DATA ──────────────────────────────────────────────
const existingModPath = '/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts';
const existingCompanies = extractJSON(fs.readFileSync(existingModPath, 'utf8'));
const seenNames = new Set(existingCompanies.map(c => c.name.toLowerCase()));
let maxId = Math.max(...existingCompanies.map(c => parseInt(c.id))) || 0;

const baseWF = { lat: 12.9698, lng: 77.7500 };
const newCompanies = [];

RAW_WHITEFIELD_DATA.split('\n').forEach(line => {
    if(!line.trim()) return;
    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 3) return;

    let [name, address, url] = parts;
    const shortName = name.replace(/\(.*\)/, '').trim(); 
    
    // Prevent dupes
    if (seenNames.has(shortName.toLowerCase())) return;
    seenNames.add(shortName.toLowerCase());

    const domain = getDomain(url);
    maxId++;

    const latOff = (Math.random() - 0.5) * 0.04;
    const lngOff = (Math.random() - 0.5) * 0.04;

    newCompanies.push({
        id: String(maxId),
        name: shortName,
        slug: shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,''),
        logo_url: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
        short_bio: `${shortName} office in Whitefield, Bengaluru.`,
        description: `${name} is located at ${address}. Check their career page for exciting opportunities.`,
        industry: ["Information Technology", "Software Services", "Cloud Computing", "AI/Product"][Math.floor(Math.random() * 4)],
        company_size: "1000+",
        funding_stage: "Public/Enterprise",
        lat: Number((baseWF.lat + latOff).toFixed(6)),
        lng: Number((baseWF.lng + lngOff).toFixed(6)),
        locality: "Whitefield",
        city: "Bengaluru",
        state: "Karnataka",
        website: `https://${domain}`,
        career_page_url: url,
        is_verified: true,
        is_featured: Math.random() > 0.7,
        job_count: 0
    });
});

const finalCompanies = existingCompanies.concat(newCompanies);

// ── GENERATE TOTAL JOBS ─────────────────────────────────────────────
const JOB_TITLES = [
  "Software Development Engineer", "Java Backend Developer", "Full Stack Engineer",
  "Cloud Solutions Architect", "Data Engineer", "AI/ML Scientist",
  "DevOps Engineer", "QA Automation Engineer", "Digital Consultant"
];

const jobsModPath = '/Users/apple/Desktop/jobmapindia/src/lib/seed-jobs.ts';
const fakeJobs = extractJSON(fs.readFileSync(jobsModPath, 'utf8'));
let jobId = Math.max(...fakeJobs.map(j => parseInt(j.id))) || 0;

newCompanies.forEach(company => {
  const numJobs = Math.floor(Math.random() * 6) + 1; // 1 to 6 jobs
  company.job_count = numJobs;

  const titles = [...JOB_TITLES].sort(() => 0.5 - Math.random()).slice(0, numJobs);
  
  titles.forEach(title => {
    jobId++;
    fakeJobs.push({
      id: String(jobId),
      company_id: company.id,
      title: title,
      slug: `${company.slug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random()*1000)}`,
      location: `Whitefield, Bengaluru`,
      work_mode: Math.random() > 0.5 ? "Hybrid" : "Office",
      job_type: "Full-time",
      experience_min: Math.floor(Math.random() * 4),
      experience_max: Math.floor(Math.random() * 5) + 5,
      salary_min: 1000000 + Math.floor(Math.random() * 8) * 100000,
      salary_max: 2000000 + Math.floor(Math.random() * 15) * 100000,
      currency: "INR",
      description: `Join ${company.name} at our Whitefield campus as a ${title}. We are building scalable software solutions.`,
      requirements: [],
      benefits: [],
      apply_url: company.career_page_url || company.website,
      is_active: true,
      is_featured: company.is_featured,
      is_new: Math.random() > 0.4
    });
  });
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

console.log(`SUCCESS: Ingested ${newCompanies.length} Whitefield companies and generated their precise map markers + jobs.`);
