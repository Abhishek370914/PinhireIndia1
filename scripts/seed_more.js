const fs = require('fs');

const RAW_DATA = `Company Name: Vtiger Systems (India) Private Limited (Vtiger CRM)
Exact Location: #18, 20th Main, 2nd Block, Rajajinagar, Bengaluru, Karnataka
Pincode: 560010
Career Page: https://www.vtiger.com/careers/ (live & hiring for developers, support, etc.) . Inode Technologies Private Limited
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://www.inode.in/careers
Signiwis Technologies Pvt. Ltd.
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://signiwis.com/careers
Effone Technologies
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://effone.com/careers
Voqeoit Technologies
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://voqeoit.com/careers
MCi Apps
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://mciapps.com/careers
Samcomm Technologies Pvt. Ltd.
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://samcomm.in/careers
Chipwerks Private Limited
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://chipwerks.com/careers
Vthreesoft Technologies
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://vthreesoft.com/careers
Sourceaxis Technologies
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://sourceaxis.com/careers
Karunadu Technologies Pvt Ltd
Location: Rajajinagar 4th Block, Bengaluru
Pincode: 560010
Career Page: https://karunadu.com/careers
STG Rajajinagar
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://stg.in/careers
Laabam One Business Solutions
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://laabamone.com/careers
Eagleweb Digital
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://eagleweb.in/careers
Globe IT Institute (Software development arm)
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://globeit.in/careers
Render Infotech
Location: Rajajinagar, Bengaluru
Pincode: 560010
Career Page: https://renderinfotech.com/careers. Playment
Location: Bengaluru (Koramangala / nearby)
Pincode: 560034
Career Page: https://playment.io/careers
Sprinto (Compliance SaaS)
Location: Bengaluru
Pincode: 560038
Career Page: https://www.sprinto.com/careers
Lucidity (Cloud management)
Location: Bengaluru
Pincode: 560095
Career Page: https://lucidity.cloud/careers
BiteSpeed (AI marketing)
Location: Bengaluru
Pincode: 560076
Career Page: https://www.bitespeed.co/careers
Zenskar (Finance automation)
Location: Bengaluru
Pincode: 560076
Career Page: https://www.zenskar.com/careers
OnFinance AI
Location: Bengaluru
Pincode: 560029
Career Page: https://onfinance.ai/careers
Kreedo (Edtech)
Location: Bengaluru
Pincode: 560076
Career Page: https://www.kreedo.in/careers
Mave Health
Location: Bengaluru
Pincode: 560095
Career Page: https://mavehealth.com/careers
Innoviti Solutions
Location: Bengaluru
Pincode: 560102
Career Page: https://innoviti.com/careers
Increff (Retail SaaS)
Location: Bengaluru
Pincode: 560076
Career Page: https://increff.com/careers
Yellow.ai
Location: Bengaluru
Pincode: 560038
Career Page: https://yellow.ai/careers
Fireflies.ai
Location: Bengaluru
Pincode: 560095
Career Page: https://fireflies.ai/careers
Leena AI
Location: Bengaluru
Pincode: 560076
Career Page: https://leena.ai/careers
Instawork
Location: Bengaluru
Pincode: 560068
Career Page: https://www.instawork.com/careers
Zolve
Location: Bengaluru
Pincode: 560076
Career Page: https://zolve.com/careers`;

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

const existingModPath = '/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts';
const existingCompanies = extractJSON(fs.readFileSync(existingModPath, 'utf8'));
const seenNames = new Set(existingCompanies.map(c => c.name.toLowerCase()));
let maxId = Math.max(...existingCompanies.map(c => parseInt(c.id))) || 0;

const newCompanies = [];

// Base Coordinates for Areas
const COORDS = {
  "560010": { lat: 12.9830, lng: 77.5543 }, // Rajajinagar
  "560038": { lat: 12.9784, lng: 77.6408 }, // Indiranagar
  "560095": { lat: 12.9345, lng: 77.6266 }, // Koramangala
  "560076": { lat: 12.9165, lng: 77.6101 }, // BTM Layout
  "560029": { lat: 12.9250, lng: 77.6042 }, // SG Palya
  "560102": { lat: 12.9121, lng: 77.6446 }, // HSR Layout
  "560068": { lat: 12.9069, lng: 77.6322 }, // Bommanahalli
  "560034": { lat: 12.9345, lng: 77.6266 }, // Koramangala
};
const DEFAULT_BENGALURU = { lat: 12.9716, lng: 77.5946 };

const lines = RAW_DATA.split('\n');
let i = 0;

while (i < lines.length) {
    let line = lines[i].trim();
    if (!line) {
        i++;
        continue;
    }

    let name = '';
    let address = 'Bengaluru';
    let url = '';
    let pincode = '';

    // Fast heuristic block parser
    if (line.includes('Company Name:') || !line.includes('Career Page:')) {
        name = line.replace('Company Name:', '').replace(/^\.\s*/, '').trim();
        if (lines[i+1] && (lines[i+1].startsWith('Location:') || lines[i+1].startsWith('Exact Location:'))) {
            address = lines[i+1].replace('Location:', '').replace('Exact Location:', '').trim();
            pincode = (lines[i+2] && lines[i+2].startsWith('Pincode:')) ? lines[i+2].replace('Pincode:', '').trim() : '';
            if (lines[i+3] && lines[i+3].startsWith('Career Page:')) {
                const parts = lines[i+3].split('http');
                if (parts.length > 1) {
                    url = 'http' + parts[1].split(' ')[0];
                }
                const nameInLine = lines[i+3].match(/\.\s*([A-Z].+)$/);
                if (nameInLine) {
                     // Next company is appended to the Career Page line!
                     lines.splice(i+4, 0, nameInLine[1]);
                }
                i += 4;
            } else i += 3;
        } else {
             i++;
        }
    } else {
        i++;
    }

    if (!name) continue;

    const shortName = name.replace(/\(.*\)/, '').replace('Pvt Ltd', '').replace('Pvt. Ltd.', '').replace('Private Limited', '').trim(); 
    
    if (seenNames.has(shortName.toLowerCase())) continue;
    seenNames.add(shortName.toLowerCase());

    url = url.split(' ')[0].replace(/\)$/,''); 
    
    const domain = url ? getDomain(url) : shortName.toLowerCase().replace(/[^a-z]/g, '') + '.com';
    maxId++;

    const baseLoc = COORDS[pincode] || DEFAULT_BENGALURU;
    const latOff = (Math.random() - 0.5) * 0.04;
    const lngOff = (Math.random() - 0.5) * 0.04;

    newCompanies.push({
        id: String(maxId),
        name: shortName,
        slug: shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,''),
        logo_url: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
        short_bio: `${shortName} office in ${address}.`,
        description: `${shortName} is located at ${address}. Check their career page for exciting opportunities.`,
        industry: ["Information Technology", "SaaS & Mobile Apps", "FinTech & Cloud", "AI/Product"][Math.floor(Math.random() * 4)],
        company_size: ["50-200", "200-500", "500-1000", "1000+"][Math.floor(Math.random() * 4)],
        funding_stage: "Private/Growth",
        lat: Number((baseLoc.lat + latOff).toFixed(6)),
        lng: Number((baseLoc.lng + lngOff).toFixed(6)),
        locality: address.includes(',') ? address.split(',')[0].trim() : address,
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
      location: company.locality + ', Bengaluru',
      work_mode: Math.random() > 0.4 ? "Hybrid" : "Office",
      job_type: "Full-time",
      experience_min: Math.floor(Math.random() * 3),
      experience_max: Math.floor(Math.random() * 4) + 4,
      salary_min: 800000 + Math.floor(Math.random() * 5) * 100000,
      salary_max: 1500000 + Math.floor(Math.random() * 10) * 100000,
      currency: "INR",
      description: `Join ${company.name} at our Bengaluru office as a ${title}.`,
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

console.log(`SUCCESS: Ingested ${newCompanies.length} records dynamically mapped by their exact pincodes.`);
