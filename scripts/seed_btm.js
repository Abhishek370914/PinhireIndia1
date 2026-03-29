const fs = require('fs');

const RAW_BTM_DATA = `GeekyAnts
Location: No. 18, 2nd Cross Road, N S Palya, 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076
Career Page: https://geekyants.com/careers (or check https://geekyants.com/)
Focus: UI/UX, React Native, AI-driven design & engineering.
DXMinds Technologies
Location: 61, 1st Floor, 7th Main Rd, BTM Layout Stage 2, Bengaluru, Karnataka 560076
Career Page: https://dxminds.com/careers (or contact via website)
Focus: Enterprise software development, mobile & web apps.
RupsTech Pvt Ltd
Location: NO.3, 1st Cross, 4th Main Road, New Gurappana Palya, BTM Layout 1st Stage, Bengaluru, Karnataka 560029 (also mentioned at 100 Feet Ring Road)
Career Page: http://rupstech.com/ (contact form or info@rupstech.com)
Focus: Software development & IT solutions.
Techasoft Pvt. Ltd.
Location: BTM Layout, Bengaluru (specific office in BTM)
Career Page: https://www.techasoft.com/careers (or main site)
Focus: Custom software development, IT consulting.
Innomatrics Technologies
Location: 2nd Floor, Akshay Complex, No. 01, 16th Main Rd, near Bharat Petroleum, BTM 2nd Stage, Bengaluru, Karnataka 560076
Career Page: https://innomatricstech.com/ (contact hello@innomatricstech.com)
Focus: Software development services.
Lore Software Solutions Private Limited
Location: #1, 1st Main, 1st Cross, Mico Layout, BTM 2nd Stage, Bengaluru
Career Page: Check LinkedIn or company site for openings.
Focus: IT services & software development.
Ariviga Technologies Private Ltd.
Location: #1088, 16th Main, 8th Cross, BTM Layout 1st Stage, Bengaluru - 560029
Career Page: http://ariviga.com/ (contact@ariviga.com)
Focus: Software development.
Besant Technologies (Training + Placement support)
Location: #700, Ground Floor, 30th Main Road, Kuvempu Nagar, BTM Layout 2nd Stage, Bengaluru – 560076
Career Page: https://www.besanttechnologies.com/ (they post placement-related tech roles)
Focus: Software training + developer placements.
Merida Tech Minds Opc Pvt Ltd
Location: BTM Layout, Bengaluru (verified listings)
Career Page: Search on company site or LinkedIn.
Focus: Software development & website solutions.
Excerpt Technologies Pvt Ltd
Location: BTM Layout area (B133/1 or similar addresses in directories)
Career Page: Check company website or Justdial/LinkedIn.
Focus: Custom software development.
Webcoretechnix
Location: #379, 23rd Main Rd, Stage 2, BTM Layout, Bengaluru - 560076
Career Page: https://webcoretechnix.com/ (contact via site)
Focus: Web development (WordPress, Magento, etc.).
Amabze
Location: #803, 16th Main, 13th Cross, BTM 2nd Stage, Bangalore, Karnataka 560076
Career Page: http://www.amabze.com/ (contact form).
ThoughtClan Technologies Pvt Ltd
Location: BTM Layout presence (check exact office).
Career Page: https://thoughtclan.com/
Focus: Digital commerce, AI/ML, custom development.

Additional Companies Often Listed in BTM Layout (Smaller / Startups)

Supraedge Technologies – BTM Layout, 560076
Terait Technologies Pvt Ltd – BTM area
RSC Systems Pvt Ltd – BTM Layout
The 4P Solutions – 727C, 1st Floor, 7th Cross, 10th Main, BTM 2nd Stage, 560076
Elite Tech Corporation – BTM Layout (custom software)
Grasko Solution Private Limited – BTM area (K3 Building)
iWave Systems Technologies – BTM vicinity
MIMSYS Technologies – BTM Layout
XCEL Corp – BTM presence, 1–20

Aalpha Information Systems
Location: Bengaluru (multiple offices) – Pincode: 560076 (BTM/Koramangala area)
Career Page: https://www.aalpha.net/careers/
Eglobal India
Location: Bengaluru – Pincode: 560095
Career Page: https://www.eglobalindia.com/careers/
Promatics Technologies
Location: Bengaluru – Pincode: 560102 (HSR area)
Career Page: https://www.promaticsindia.com/careers
Reckonsys
Location: Bengaluru – Pincode: 560037
Career Page: Check https://reckonsys.com/ (contact form / LinkedIn)
Ontoborn
Location: Bengaluru – Pincode: 560076
Career Page: https://ontoborn.com/careers (or main site)
Trudosys Tech LLP
Location: Bengaluru – Pincode: 560068
Career Page: Search company site for openings
Sprinto
Location: Bengaluru – Pincode: 560038 (Indiranagar vicinity)
Career Page: https://www.sprinto.com/careers
Lucidity
Location: Bengaluru – Pincode: 560095
Career Page: https://lucidity.cloud/careers
BiteSpeed
Location: Bengaluru – Pincode: 560076
Career Page: https://www.bitespeed.co/careers
Nanonets
Location: Bengaluru – Pincode: 560102
Career Page: https://nanonets.com/careers
Zenskar
Location: Bengaluru – Pincode: 560076
Career Page: https://www.zenskar.com/careers
Zethic
Location: Bengaluru – Pincode: 560029
Career Page: Check main website
Gyrus.AI
Location: Bengaluru – Pincode: 560066 (Whitefield edge)
Career Page: LinkedIn or company site
Manthan
Location: Bengaluru – Pincode: 560037
Career Page: https://www.manthan.com/careers
SigTuple
Location: Bengaluru – Pincode: 560102
Career Page: https://www.sigtuple.com/careers
Mad Street Den
Location: Bengaluru – Pincode: 560095
Career Page: https://madstreetden.com/careers
Flutura
Location: Bengaluru – Pincode: 560076
Career Page: https://www.flutura.com/careers
Uncanny Vision
Location: Bengaluru – Pincode: 560068
Career Page: Company website contact
Arya.ai
Location: Bengaluru – Pincode: 560076
Career Page: https://www.arya.ai/careers
Bash.ai (or similar AI firms; check exact)
Location: Bengaluru – Pincode: 560029
Career Page: LinkedIn

21–40

Motive – Bengaluru, Pincode 560095, Careers: https://gomotive.com/careers
Cleo – Bengaluru, Pincode 560076, Careers: https://www.cleo.com/careers
Scripbox – Bengaluru, Pincode 560102, Careers: https://scripbox.com/careers
Fi.Money – Bengaluru, Pincode 560038, Careers: Company site
Navan – Bengaluru (Ashok Nagar), Pincode 560025, Careers: https://navan.com/careers
Bolt.Earth – Bengaluru, Pincode 560066, Careers: https://bolt.earth/careers
Slick – Bengaluru, Pincode 560076, Careers: https://slickapp.co/
Buyhatke – Bengaluru, Pincode 560095, Careers: Company site
Lokal – Bengaluru, Pincode 560068, Careers: https://www.getlokalapp.com/careers
Even Healthcare – Bengaluru, Pincode 560102, Careers: Company site
Kreedo – Bengaluru, Pincode 560076, Careers: https://www.kreedo.in/
OnFinance AI – Bengaluru, Pincode 560029, Careers: LinkedIn
Mave Health – Bengaluru, Pincode 560095, Careers: https://mavehealth.com/
Digitory – Bengaluru, Pincode 560076, Careers: Company site
Innoviti Solutions – Bengaluru, Pincode 560102, Careers: https://innoviti.com/careers
Rupeek – Bengaluru, Pincode 560068, Careers: Company site
Increff – Bengaluru, Pincode 560076, Careers: https://increff.com/careers
Ninjacart – Bengaluru, Pincode 560066, Careers: https://ninjacart.com/careers
Yellow.ai – Bengaluru, Pincode 560038, Careers: https://yellow.ai/careers
Ather Energy (tech/embedded software roles) – Bengaluru, Pincode 560102, Careers: https://www.atherenergy.com/careers

41–60

Udaan – Bengaluru, Pincode 560095, Careers: https://udaan.com/careers
Practo – Bengaluru, Pincode 560076, Careers: https://www.practo.com/careers
MFine – Bengaluru, Pincode 560068, Careers: Company site
NetraDyne – Bengaluru, Pincode 560102, Careers: https://www.netradyne.com/careers
Vymo – Bengaluru, Pincode 560076, Careers: https://www.vymo.com/careers
Plivo – Bengaluru, Pincode 560029, Careers: https://www.plivo.com/careers
Fireflies.ai – Bengaluru, Pincode 560095, Careers: https://fireflies.ai/careers
Leena AI – Bengaluru, Pincode 560076, Careers: Company site
Instawork – Bengaluru, Pincode 560068, Careers: https://www.instawork.com/careers
Karya – Bengaluru, Pincode 560102, Careers: Company site
Zolve – Bengaluru, Pincode 560076, Careers: https://zolve.com/careers
Toonsutra – Bengaluru, Pincode 560095, Careers: LinkedIn
Nivara Home Fin – Bengaluru, Pincode 560029, Careers: Company site
Trigent Software – Bengaluru, Pincode 560066, Careers: https://www.trigent.com/careers
Mphasis – Bengaluru (various), Pincode 560076, Careers: https://www.mphasis.com/careers
Techasoft Pvt. Ltd. – Bengaluru (BTM vicinity), Pincode 560076, Careers: https://www.techasoft.com/careers
Innomatrics Technologies – Bengaluru, Pincode 560076, Careers: https://innomatricstech.com/
Lore Software Solutions – Bengaluru, Pincode 560076, Careers: Company site
Ariviga Technologies – Bengaluru, Pincode 560029, Careers: http://ariviga.com/
Besant Technologies (tech roles) – Bengaluru, Pincode 560076, Careers: https://www.besanttechnologies.com/

61–80

Supraedge Technologies – Bengaluru, Pincode 560076
Terait Technologies Pvt Ltd – Bengaluru, Pincode 560076
RSC Systems Pvt Ltd – Bengaluru, Pincode 560076
The 4P Solutions – Bengaluru, Pincode 560076
Elite Tech Corporation – Bengaluru, Pincode 560068
Grasko Solution Private Limited – Bengaluru, Pincode 560076
iWave Systems Technologies – Bengaluru, Pincode 560102
MIMSYS Technologies – Bengaluru, Pincode 560076
XCEL Corp – Bengaluru, Pincode 560029
Webcoretechnix – Bengaluru, Pincode 560076
Amabze – Bengaluru, Pincode 560076
ThoughtClan Technologies – Bengaluru, Pincode 560076
Merida Tech Minds – Bengaluru, Pincode 560076
Excerpt Technologies – Bengaluru, Pincode 560076
Aquila Technologies – Bengaluru, Pincode 560068
ClearWater Technology – Bengaluru, Pincode 560076
ARIAA Computech – Bengaluru, Pincode 560076
Ariba Technologies India – Bengaluru, Pincode 560076
Softtek India – Bengaluru, Pincode 560029
Usha Armour Pvt Ltd (software division) – Bengaluru, Pincode 560076

81–100

Digitap.AI – Bengaluru, Pincode 560076
WatNx Consulting – Bengaluru, Pincode 560076
Ebsl Automat – Bengaluru, Pincode 560066
G7 CR Technologies – Bengaluru, Pincode 560076
Sysnet Global Technologies – Bengaluru, Pincode 560076
VYTURR TECH INNOVATIONS – Bengaluru, Pincode 560076
NIMBLIX TECNOLOGIES – Bengaluru, Pincode 560076
BuziBrAIns – Bengaluru, Pincode 560076
Tetcos – Bengaluru, Pincode 560076
MicroNXT Solutions – Bengaluru, Pincode 560076
Simnovus – Bengaluru, Pincode 560076
Actinium Softwares – Bengaluru, Pincode 560066
Podshore Galaxy Services – Bengaluru, Pincode 560076
Adaptive Infotech – Bengaluru, Pincode 560076
Netjet Infotech – Bengaluru, Pincode 560076
Social DNA Labs – Bengaluru, Pincode 560076
Jellies-ai – Bengaluru, Pincode 560076
MSANTYTECH – Bengaluru, Pincode 560066
Weblink Software – Bengaluru, Pincode 560076
Cranes Software – Bengaluru, Pincode 560066`;

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

const baseBTM = { lat: 12.9165, lng: 77.6101 }; // BTM Layout Base
const newCompanies = [];

// Rough extraction logic for the mixed format:
// Format 1: MULTI-LINE
// GeekyAnts
// Location: ...
// Career Page: ...

// Format 2: ONE-LINE
// Motive – Bengaluru, Pincode 560095, Careers: https://...

const lines = RAW_BTM_DATA.split('\n');
let i = 0;

while (i < lines.length) {
    let line = lines[i].trim();
    if (!line || line.match(/^[0-9]+–[0-9]+$/) || line.includes('Additional Companies Often Listed')) {
        i++;
        continue;
    }

    let name = '';
    let address = 'BTM Layout, Bengaluru';
    let url = '';

    if (lines[i+1] && lines[i+1].startsWith('Location:')) {
        // Multi-line block
        name = line;
        address = lines[i+1].replace('Location:', '').trim();
        url = (lines[i+2] && lines[i+2].startsWith('Career Page:')) ? lines[i+2].replace('Career Page:', '').trim() : '';
        i += 3;
        // fast-forward past Focus if exists
        while(i < lines.length && (lines[i].trim().startsWith('Focus:') || lines[i].trim() === '')) { i++; }
    } else if (line.includes(' – ') || line.includes(' - ')) {
        // Single-line block
        const parts = line.split(/ – | - |,/);
        name = parts[0].trim();
        const urlMatch = line.match(/(https?:\/\/[^\s\)]+)/);
        if (urlMatch) url = urlMatch[1];
        i++;
    } else {
        name = line;
        i++;
    }

    if (!name) continue;

    const shortName = name.replace(/\(.*\)/, '').replace('Pvt Ltd', '').replace('Private Limited', '').trim(); 
    
    // Check dupe
    if (seenNames.has(shortName.toLowerCase())) continue;
    seenNames.add(shortName.toLowerCase());

    // Clean URL
    url = url.split(' ')[0]; // remove "(or check..."
    if (!url.startsWith('http')) url = '';

    const domain = url ? getDomain(url) : shortName.toLowerCase().replace(/[^a-z]/g, '') + '.com';
    maxId++;

    const latOff = (Math.random() - 0.5) * 0.05;
    const lngOff = (Math.random() - 0.5) * 0.05;

    newCompanies.push({
        id: String(maxId),
        name: shortName,
        slug: shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,''),
        logo_url: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
        short_bio: `${shortName} office in BTM Layout / South Bengaluru.`,
        description: `${shortName} is located at ${address}. Check their career page for exciting opportunities.`,
        industry: ["Information Technology", "SaaS & Mobile Apps", "FinTech & Cloud", "AI/Product"][Math.floor(Math.random() * 4)],
        company_size: ["50-200", "200-500", "500-1000", "1000+"][Math.floor(Math.random() * 4)],
        funding_stage: "Private/Growth",
        lat: Number((baseBTM.lat + latOff).toFixed(6)),
        lng: Number((baseBTM.lng + lngOff).toFixed(6)),
        locality: "BTM Layout",
        city: "Bengaluru",
        state: "Karnataka",
        website: `https://${domain}`,
        career_page_url: url || `https://${domain}/careers`,
        is_verified: true,
        is_featured: Math.random() > 0.8,
        job_count: 0
    });
}

const finalCompanies = existingCompanies.concat(newCompanies);

// ── GENERATE TOTAL JOBS ─────────────────────────────────────────────
const JOB_TITLES = [
  "Frontend Developer (React/Vue)", "Backend Developer (Node.js/Python)", "Mobile App Developer (React Native)",
  "Cloud Solutions Architect", "Data Engineer", "AI/ML Scientist",
  "DevOps Engineer", "QA Automation Engineer", "Product Manager"
];

const jobsModPath = '/Users/apple/Desktop/jobmapindia/src/lib/seed-jobs.ts';
const fakeJobs = extractJSON(fs.readFileSync(jobsModPath, 'utf8'));
let jobId = Math.max(...fakeJobs.map(j => parseInt(j.id))) || 0;

newCompanies.forEach(company => {
  const numJobs = Math.floor(Math.random() * 4) + 1; // 1 to 4 jobs
  company.job_count = numJobs;

  const titles = [...JOB_TITLES].sort(() => 0.5 - Math.random()).slice(0, numJobs);
  
  titles.forEach(title => {
    jobId++;
    fakeJobs.push({
      id: String(jobId),
      company_id: company.id,
      title: title,
      slug: `${company.slug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random()*1000)}`,
      location: `BTM Layout, Bengaluru`,
      work_mode: Math.random() > 0.4 ? "Hybrid" : "Office",
      job_type: "Full-time",
      experience_min: Math.floor(Math.random() * 3),
      experience_max: Math.floor(Math.random() * 4) + 4,
      salary_min: 800000 + Math.floor(Math.random() * 5) * 100000,
      salary_max: 1500000 + Math.floor(Math.random() * 10) * 100000,
      currency: "INR",
      description: `Join ${company.name} at our South Bengaluru office as a ${title}.`,
      requirements: [],
      benefits: [],
      apply_url: company.career_page_url || company.website,
      is_active: true,
      is_featured: company.is_featured,
      is_new: Math.random() > 0.5
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

console.log(`SUCCESS: Found unique BTM companies and ingested ${newCompanies.length} records + generated jobs.`);
