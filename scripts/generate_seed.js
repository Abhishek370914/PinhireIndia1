const fs = require('fs')
const crypto = require('crypto')

const rawInput = `Infosys, Electronic City, Bengaluru, Karnataka 560100, https://www.infosys.com/careers/
Wipro, Doddakannelli, Sarjapur Road, Bengaluru, Karnataka 560035, https://careers.wipro.com/
TCS, Electronic City Phase II, Bengaluru, Karnataka 560100, https://www.tcs.com/careers
Accenture, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.accenture.com/in-en/careers
IBM India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.ibm.com/careers
Google India, Embassy Golf Links, Bengaluru, Karnataka 560071, https://www.google.com/about/careers/applications/locations/bangalore
Microsoft India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.microsoft.com/
Amazon India, Embassy Tech Village, Devarabeesanahalli, Bengaluru, Karnataka 560103, https://www.amazon.jobs/en/locations/bengaluru
Oracle India, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.oracle.com/careers/
SAP Labs India, Whitefield, Bengaluru, Karnataka 560066, https://www.sap.com/india/careers.html
Cisco Systems, Cessna Business Park, Marathahalli, Bengaluru, Karnataka 560037, https://www.cisco.com/c/en/us/about/careers.html
Capgemini, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.capgemini.com/in-en/careers/
Cognizant, Electronic City, Bengaluru, Karnataka 560100, https://careers.cognizant.com/global/en
HCL Technologies, Electronic City, Bengaluru, Karnataka 560100, https://www.hcltech.com/careers
LTIMindtree, Global Village, RVCE Post, Bengaluru, Karnataka 560059, https://careers.ltimindtree.com/
Tech Mahindra, Electronic City, Bengaluru, Karnataka 560100, https://www.techmahindra.com/careers/
Dell Technologies, Embassy Tech Village, Bengaluru, Karnataka 560103, https://jobs.dell.com/
Intel India, Outer Ring Road, Bengaluru, Karnataka 560103, https://www.intel.com/content/www/us/en/jobs/locations/india.html
Adobe India, Embassy Golf Links, Bengaluru, Karnataka 560071, https://www.adobe.com/careers.html
ServiceNow, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.servicenow.com/
Atlassian, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.atlassian.com/company/careers
Intuit India, Embassy Tech Village, Bengaluru, Karnataka 560103, https://careers.intuit.com/
Flipkart, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.flipkartcareers.com/
Swiggy, Indiranagar, Bengaluru, Karnataka 560038, https://www.swiggy.com/careers
Razorpay, Koramangala, Bengaluru, Karnataka 560034, https://razorpay.com/careers/
PhonePe, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.phonepe.com/careers/
Zoho Corporation, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.zoho.com/careers/
Mphasis, Bagmane Technology Park, Bengaluru, Karnataka 560093, https://careers.mphasis.com/
Mu Sigma, Embassy Golf Links, Bengaluru, Karnataka 560071, https://www.mu-sigma.com/careers
Mindtree (now LTIMindtree), Global Village, Bengaluru, Karnataka 560059, https://careers.ltimindtree.com/
Hewlett Packard Enterprise (HPE), Embassy Tech Village, Bengaluru, Karnataka 560103, https://careers.hpe.com/
VMware (Broadcom), Embassy Tech Village, Bengaluru, Karnataka 560103, https://careers.vmware.com/
Qualcomm India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.qualcomm.com/company/careers
Texas Instruments India, Bagmane Tech Park, Bengaluru, Karnataka 560093, https://careers.ti.com/
Bosch Global Software Technologies, Koramangala, Bengaluru, Karnataka 560095, https://www.bosch.com/careers/
Robert Bosch Engineering, Koramangala, Bengaluru, Karnataka 560095, https://www.bosch.in/careers/
Honeywell India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.honeywell.com/
Schneider Electric India, Electronic City, Bengaluru, Karnataka 560100, https://www.se.com/in/en/about-us/careers/
Siemens Healthineers, Electronic City, Bengaluru, Karnataka 560100, https://www.siemens-healthineers.com/careers
Philips Innovation Campus, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.philips.com/careers
24[7].ai, Koramangala, Bengaluru, Karnataka 560034, https://www.247.ai/careers/
Amdocs, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.amdocs.com/careers
ADP India, Bagmane Tech Park, Bengaluru, Karnataka 560093, https://jobs.adp.com/
KPIT Technologies, Electronic City, Bengaluru, Karnataka 560100, https://www.kpit.com/careers/
Intellect Design Arena, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.intellectdesign.com/careers
OpenText, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.opentext.com/careers
Persistent Systems, Bagmane Tech Park, Bengaluru, Karnataka 560093, https://www.persistent.com/careers/
GlobalLogic (Hitachi), Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.globallogic.com/careers/
NTT Data, Electronic City, Bengaluru, Karnataka 560100, https://www.nttdata.com/global/en/careers
DXC Technology, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.dxc.com/
Infosys BPM, Electronic City, Bengaluru, Karnataka 560100, https://www.infosys.com/careers/
Wipro Digital, Sarjapur Road, Bengaluru, Karnataka 560035, https://careers.wipro.com/
TCS Digital, Electronic City, Bengaluru, Karnataka 560100, https://www.tcs.com/careers
Accenture Digital, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.accenture.com/in-en/careers
IBM Watson, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.ibm.com/careers
Google Cloud India, Embassy Golf Links, Bengaluru, Karnataka 560071, https://www.google.com/about/careers/
Microsoft Azure India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.microsoft.com/
Amazon Web Services (AWS) India, Embassy Tech Village, Bengaluru, Karnataka 560103, https://aws.amazon.com/careers/
Oracle Cloud India, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.oracle.com/careers/
SAP Cloud India, Whitefield, Bengaluru, Karnataka 560066, https://www.sap.com/careers.html
Cisco Meraki, Cessna Business Park, Bengaluru, Karnataka 560037, https://www.cisco.com/careers
Capgemini Engineering, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.capgemini.com/careers/
Cognizant Digital, Electronic City, Bengaluru, Karnataka 560100, https://careers.cognizant.com/
HCL Digital, Electronic City, Bengaluru, Karnataka 560100, https://www.hcltech.com/careers
LTIMindtree Digital, Global Village, Bengaluru, Karnataka 560059, https://careers.ltimindtree.com/
Tech Mahindra Digital, Electronic City, Bengaluru, Karnataka 560100, https://www.techmahindra.com/careers/
Flipkart Internet, Embassy Tech Village, Bengaluru, Karnataka 560103, https://www.flipkartcareers.com/
Swiggy, Indiranagar, Bengaluru, Karnataka 560038, https://www.swiggy.com/careers
Razorpay, Koramangala, Bengaluru, Karnataka 560034, https://razorpay.com/careers/
PhonePe, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.phonepe.com/careers/
Meesho, Koramangala, Bengaluru, Karnataka 560034, https://www.meesho.com/careers
Groww, Koramangala, Bengaluru, Karnataka 560034, https://groww.in/careers
Zerodha, Indiranagar, Bengaluru, Karnataka 560038, https://zerodha.com/careers
Postman, Koramangala, Bengaluru, Karnataka 560034, https://www.postman.com/careers
Freshworks, Koramangala, Bengaluru, Karnataka 560034, https://www.freshworks.com/company/careers/
Chargebee, Koramangala, Bengaluru, Karnataka 560034, https://www.chargebee.com/careers/
Wingify (VWO), Koramangala, Bengaluru, Karnataka 560034, https://wingify.com/careers
HackerEarth, Indiranagar, Bengaluru, Karnataka 560038, https://www.hackerearth.com/careers/
Unacademy, Koramangala, Bengaluru, Karnataka 560034, https://unacademy.com/careers
Byju's, Electronic City, Bengaluru, Karnataka 560100, https://byjus.com/careers/
UpGrad, Koramangala, Bengaluru, Karnataka 560034, https://www.upgrad.com/careers
Simplilearn, Koramangala, Bengaluru, Karnataka 560034, https://www.simplilearn.com/careers
InMobi, Koramangala, Bengaluru, Karnataka 560034, https://www.inmobi.com/careers
Practo, Koramangala, Bengaluru, Karnataka 560034, https://www.practo.com/careers
Curefit, Koramangala, Bengaluru, Karnataka 560034, https://www.cure.fit/careers
Dunzo, Koramangala, Bengaluru, Karnataka 560034, https://www.dunzo.com/careers
Licious, Koramangala, Bengaluru, Karnataka 560034, https://www.licious.in/careers
BigBasket, Koramangala, Bengaluru, Karnataka 560034, https://www.bigbasket.com/careers/
Blinkit (Zomato), Koramangala, Bengaluru, Karnataka 560034, https://www.blinkit.com/careers
Nykaa, Koramangala, Bengaluru, Karnataka 560034, https://www.nykaa.com/careers
Myntra, Koramangala, Bengaluru, Karnataka 560034, https://www.myntra.com/careers
Ajio (Reliance), Electronic City, Bengaluru, Karnataka 560100, https://www.ajio.com/careers
Tata Digital, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.tata.com/careers
Reliance Jio Infocomm, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.ril.com/careers
Airtel Africa / India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.airtel.in/careers
Vodafone Idea, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.vodafoneidea.com/careers
Ericsson India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.ericsson.com/en/careers
Nokia India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.nokia.com/about-us/careers/
Samsung R&D India, Bagmane Tech Park, Bengaluru, Karnataka 560093, https://www.samsung.com/in/careers/
LG Soft India, Koramangala, Bengaluru, Karnataka 560034, https://www.lg.com/global/careers
Sony India, Koramangala, Bengaluru, Karnataka 560034, https://www.sony.co.in/careers
Panasonic India, Electronic City, Bengaluru, Karnataka 560100, https://www.panasonic.com/in/careers/
Bosch Rexroth, Koramangala, Bengaluru, Karnataka 560095, https://www.boschrexroth.com/en/careers/
ABB India, Peenya, Bengaluru, Karnataka 560058, https://global.abb/group/en/careers
Schneider Electric, Electronic City, Bengaluru, Karnataka 560100, https://www.se.com/in/en/about-us/careers/
Eaton India, Electronic City, Bengaluru, Karnataka 560100, https://www.eaton.com/in/en-us/company/careers.html
3M India, Electronic City, Bengaluru, Karnataka 560100, https://www.3m.com/3M/en_IN/careers-in/
GE India, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.ge.com/careers
Honeywell Aerospace, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.honeywell.com/
Collins Aerospace, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.collinsaerospace.com/
OpenXcell, Koramangala, Bengaluru, Karnataka 560034, https://www.openxcell.com/careers
Ajackus, Koramangala, Bengaluru, Karnataka 560034, https://www.ajackus.com/careers
Zerone Consulting, Whitefield, Bengaluru, Karnataka 560066, https://www.zeroneconsulting.com/careers
Promatics Technologies, Electronic City, Bengaluru, Karnataka 560100, https://www.promaticsindia.com/careers
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
Fictiv, Koramangala, Bengaluru, Karnataka 560034, https://www.fictiv.com/careers
Forward Networks, Koramangala, Bengaluru, Karnataka 560034, https://forwardnetworks.com/careers
Cyberhaven, Koramangala, Bengaluru, Karnataka 560034, https://www.cyberhaven.com/careers
Toast, Koramangala, Bengaluru, Karnataka 560034, https://careers.toasttab.com/
Northern Trust, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.northerntrust.com/careers
Q2, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.q2.com/careers
RingCentral, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.ringcentral.com/careers
Opendoor, Koramangala, Bengaluru, Karnataka 560034, https://www.opendoor.com/careers
Epsilon, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.epsilon.com/careers
BlackRock, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://careers.blackrock.com/
Wells Fargo, Manyata Embassy Business Park, Bengaluru, Karnataka 560045, https://www.wellsfargo.com/careers
Adyen, Koramangala, Bengaluru, Karnataka 560034, https://www.adyen.com/careers
Innoviti Solutions, Koramangala, Bengaluru, Karnataka 560034, https://innoviti.com/careers
Rupeek, Koramangala, Bengaluru, Karnataka 560034, https://rupeek.com/careers
Perfios, Koramangala, Bengaluru, Karnataka 560034, https://www.perfios.com/careers
Livspace, Koramangala, Bengaluru, Karnataka 560034, https://www.livspace.com/careers
Increff, Koramangala, Bengaluru, Karnataka 560034, https://increff.com/careers
BlueStone, Koramangala, Bengaluru, Karnataka 560034, https://www.bluestone.com/careers
Khatabook, Koramangala, Bengaluru, Karnataka 560034, https://khatabook.com/careers
Postman India, Koramangala, Bengaluru, Karnataka 560034, https://www.postman.com/careers
Freshworks India, Koramangala, Bengaluru, Karnataka 560034, https://www.freshworks.com/company/careers/
Chargebee India, Koramangala, Bengaluru, Karnataka 560034, https://www.chargebee.com/careers/
Wingify India, Koramangala, Bengaluru, Karnataka 560034, https://wingify.com/careers
HackerEarth India, Indiranagar, Bengaluru, Karnataka 560038, https://www.hackerearth.com/careers/
Unacademy India, Koramangala, Bengaluru, Karnataka 560034, https://unacademy.com/careers
Byju's, Electronic City, Bengaluru, Karnataka 560100, https://byjus.com/careers/`

const locationMap = {
  "electronic city": { lat: 12.8452, lng: 77.6601 },
  "manyata": { lat: 13.0475, lng: 77.6190 },
  "embassy tech village": { lat: 12.9355, lng: 77.6853 },
  "embassy golf links": { lat: 12.9515, lng: 77.6409 },
  "cessna": { lat: 12.9360, lng: 77.6910 },
  "bagmane": { lat: 12.9818, lng: 77.6644 },
  "koramangala": { lat: 12.9279, lng: 77.6271 },
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
    let domain = url.hostname.replace('www.', '')
    return domain
  } catch(e) {
    return "example.com"
  }
}

// Generate deterministic offsets so it doesn't shift on reload,
// but companies in same area aren't beautifully stacked.
function createOffset(id) {
  const hash = crypto.createHash('md5').update(String(id)).digest('hex')
  const latR = parseInt(hash.substring(0, 4), 16) / 65535 // 0 to 1
  const lngR = parseInt(hash.substring(4, 8), 16) / 65535
  
  // range -0.005 to +0.005 (about ~500m radius scatter)
  return {
    latOff: (latR - 0.5) * 0.015,
    lngOff: (lngR - 0.5) * 0.015
  }
}

const companies = []
const lines = rawInput.split('\n').filter(l => l.trim())

// Deduplication map
const seenNames = new Set()

lines.forEach((line, i) => {
  // Line format: Name, Address parts..., URL
  const parts = line.split(',')
  if(parts.length < 3) return
  
  let url = parts[parts.length - 1].trim()
  const name = parts[0].trim()
  
  if (seenNames.has(name.toLowerCase())) return
  seenNames.add(name.toLowerCase())

  const address = parts.slice(1, parts.length - 1).join(',').trim()
  // Try to extract locality from the first part of address
  const locality = parts[1].trim()
  const city = "Bengaluru"
  const state = "Karnataka"
  
  const baseXY = getBaseCoord(address)
  const offset = createOffset(name)
  const lat = baseXY.lat + offset.latOff
  const lng = baseXY.lng + offset.lngOff
  
  const domain = getDomain(url)
  const logo_url = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`
  
  companies.push({
    id: String(100 + i), // avoid colliding with original list
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,''),
    logo_url,
    short_bio: `${name} office located in ${locality}.`,
    description: `${name} is hiring in Bengaluru at their ${locality} office. Visit their career page for more details.`,
    industry: "Technology", // Generic default
    company_size: "1000+",
    funding_stage: "Corporate",
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    locality,
    city,
    state,
    website: `https://${domain}`,
    career_page_url: url,
    is_verified: true,
    is_featured: false,
    job_count: Math.floor(Math.random() * 10) + 2
  })
})

const fileContent = `/**
 * Client-side company data for map display.
 * Includes user-provided 150+ Bengaluru tech hub companies.
 */
import type { Company } from "@/types"

export const SEED_COMPANIES: Partial<Company>[] = ${JSON.stringify(companies, null, 2)} as any as Company[]
`
fs.writeFileSync('/Users/apple/Desktop/jobmapindia/src/lib/seed-companies.ts', fileContent)
console.log(`Successfully generated ${companies.length} companies to seed-companies.ts!`)
