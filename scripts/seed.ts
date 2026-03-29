/**
 * PinHire India — Seed Data Script
 * Run with: npx ts-node --project tsconfig.json scripts/seed.ts
 *
 * Prerequisites:
 * 1. Create a .env.local with SUPABASE_SERVICE_ROLE_KEY
 * 2. Apply the migration: supabase/migrations/0001_init.sql
 */
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const companies = [
  // ─── Bengaluru – HSR Layout ────────────────────────────────
  {
    name: "Razorpay", slug: "razorpay",
    logo_url: "https://logo.clearbit.com/razorpay.com",
    short_bio: "India's leading full-stack financial solutions company",
    description: "Razorpay is building the new age of payments and banking in India. It processes over ₹10 lakh crore annually and serves 10M+ businesses.",
    website: "https://razorpay.com", career_page_url: "https://razorpay.com/jobs",
    industry: "Fintech", company_size: "1000+", funding_stage: "Series F",
    lat: 12.9141, lng: 77.6376,
    address: "SJR Cyber, Laskar Hosur Road", locality: "HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102",
    is_verified: true, is_featured: true,
  },
  {
    name: "Unacademy", slug: "unacademy",
    logo_url: "https://logo.clearbit.com/unacademy.com",
    short_bio: "India's largest learning platform",
    description: "Unacademy is transforming education in India with live classes, mock tests, and doubt-solving for 60M+ learners.",
    website: "https://unacademy.com", career_page_url: "https://unacademy.com/careers",
    industry: "Edtech", company_size: "1000+", funding_stage: "Series J",
    lat: 12.9116, lng: 77.6370,
    address: "Third Floor, Lexington Towers", locality: "HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102",
    is_verified: true, is_featured: true,
  },
  {
    name: "Slice", slug: "slice",
    logo_url: "https://logo.clearbit.com/sliceit.com",
    short_bio: "Next-gen credit card & payments for millennials",
    description: "Slice is reimagining credit for India's youth with a beautifully designed app and flexible payment options.",
    website: "https://sliceit.com", career_page_url: "https://sliceit.com/careers",
    industry: "Fintech", company_size: "51-200", funding_stage: "Series B",
    lat: 12.9138, lng: 77.6380,
    address: "27, 2nd Floor, 6th Cross", locality: "HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102",
    is_verified: true, is_featured: false,
  },
  // ─── Bengaluru – Koramangala ───────────────────────────────
  {
    name: "Swiggy", slug: "swiggy",
    logo_url: "https://logo.clearbit.com/swiggy.com",
    short_bio: "On-demand food & grocery delivery platform",
    description: "Swiggy is India's leading on-demand delivery platform, delivering food, groceries, and more in 30 minutes across 500+ cities.",
    website: "https://swiggy.com", career_page_url: "https://swiggy.com/careers",
    industry: "Logistics", company_size: "1000+", funding_stage: "IPO",
    lat: 12.9279, lng: 77.6271,
    address: "Bundl Technologies, Embassy Tech Village", locality: "Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034",
    is_verified: true, is_featured: true,
  },
  {
    name: "Meesho", slug: "meesho",
    logo_url: "https://logo.clearbit.com/meesho.com",
    short_bio: "Democratizing internet commerce for Bharat",
    description: "Meesho enables small businesses and individuals to start online stores. It serves 160M+ customers across India's tier-2 and tier-3 cities.",
    website: "https://meesho.com", career_page_url: "https://meesho.com/jobs",
    industry: "E-commerce", company_size: "1000+", funding_stage: "Series H",
    lat: 12.9352, lng: 77.6245,
    address: "Meesho, Koramangala 3rd Block", locality: "Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034",
    is_verified: true, is_featured: true,
  },
  {
    name: "Zepto", slug: "zepto",
    logo_url: "https://logo.clearbit.com/zeptonow.com",
    short_bio: "10-minute grocery delivery",
    description: "Zepto delivers groceries in under 10 minutes using a network of dark stores. Founded by 19-year-olds, it's one of India's fastest-growing startups.",
    website: "https://zeptonow.com", career_page_url: "https://zeptonow.com/careers",
    industry: "Logistics", company_size: "1000+", funding_stage: "Series G",
    lat: 12.9310, lng: 77.6270,
    address: "Koramangala 5th Block", locality: "Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560095",
    is_verified: true, is_featured: true,
  },
  // ─── Bengaluru – Whitefield ────────────────────────────────
  {
    name: "PhonePe", slug: "phonepe",
    logo_url: "https://logo.clearbit.com/phonepe.com",
    short_bio: "India's #1 digital payment platform",
    description: "PhonePe processes 50%+ of India's UPI volume, serving 500M+ users. Its platform includes payments, investments, insurance, and commerce.",
    website: "https://phonepe.com", career_page_url: "https://phonepe.com/en-in/careers.html",
    industry: "Fintech", company_size: "1000+", funding_stage: "Series F",
    lat: 12.9698, lng: 77.7499,
    address: "Embassy Golf Links Business Park", locality: "Whitefield", city: "Bengaluru", state: "Karnataka", pincode: "560066",
    is_verified: true, is_featured: true,
  },
  // ─── Delhi-NCR – Gurugram / Cyber City ─────────────────────
  {
    name: "Zomato", slug: "zomato",
    logo_url: "https://logo.clearbit.com/zomato.com",
    short_bio: "Hyperlocal commerce platform — food, grocery, going out",
    description: "Zomato is India's largest food delivery and hyperlocal commerce company. It partners with 300K+ restaurants and 8M+ delivery partners.",
    website: "https://zomato.com", career_page_url: "https://www.zomato.com/careers",
    industry: "Logistics", company_size: "1000+", funding_stage: "IPO",
    lat: 28.4949, lng: 77.0888,
    address: "Ground Floor, 12A, 94 Udyog Vihar, Phase IV", locality: "Cyber City", city: "Gurugram", state: "Haryana", pincode: "122015",
    is_verified: true, is_featured: true,
  },
  {
    name: "PolicyBazaar", slug: "policybazaar",
    logo_url: "https://logo.clearbit.com/policybazaar.com",
    short_bio: "India's largest online insurance marketplace",
    description: "PolicyBazaar is transforming insurance sales in India with transparent comparisons and a seamless buying experience.",
    website: "https://policybazaar.com", career_page_url: "https://policybazaar.com/careers",
    industry: "Fintech", company_size: "1000+", funding_stage: "IPO",
    lat: 28.5011, lng: 77.0892,
    address: "Plot no.119, Sector 44", locality: "Cyber City", city: "Gurugram", state: "Haryana", pincode: "122002",
    is_verified: true, is_featured: false,
  },
  {
    name: "Groww", slug: "groww",
    logo_url: "https://logo.clearbit.com/groww.in",
    short_bio: "India's fastest growing investment platform",
    description: "Groww democratizes investing for 50M+ Indians with stocks, mutual funds, F&O, and more, starting at ₹1.",
    website: "https://groww.in", career_page_url: "https://groww.in/open-positions",
    industry: "Fintech", company_size: "201-1000", funding_stage: "Series F",
    lat: 28.4842, lng: 77.0921,
    address: "Groww, Plot 18, Udyog Vihar Phase 4", locality: "Gurugram", city: "Gurugram", state: "Haryana", pincode: "122016",
    is_verified: true, is_featured: true,
  },
  // ─── Delhi-NCR – Noida ────────────────────────────────────
  {
    name: "Paytm", slug: "paytm",
    logo_url: "https://logo.clearbit.com/paytm.com",
    short_bio: "Payments, banking, investments and more",
    description: "Paytm is India's largest mobile payment and commerce platform. Its super-app connects consumers with merchants through payments and financial services.",
    website: "https://paytm.com", career_page_url: "https://paytm.com/careers",
    industry: "Fintech", company_size: "1000+", funding_stage: "IPO",
    lat: 28.5355, lng: 77.3910,
    address: "B-121, Sector 5, Noida", locality: "Sector 5", city: "Noida", state: "Uttar Pradesh", pincode: "201301",
    is_verified: true, is_featured: false,
  },
  {
    name: "InMobi", slug: "inmobi",
    logo_url: "https://logo.clearbit.com/inmobi.com",
    short_bio: "Global mobile advertising and marketing platform",
    description: "InMobi is the world's leading independent mobile advertising network, reaching 1.6B devices globally.",
    website: "https://inmobi.com", career_page_url: "https://inmobi.com/careers",
    industry: "Martech", company_size: "1000+", funding_stage: "Series C+",
    lat: 28.5245, lng: 77.3926,
    address: "Plot A-26, Block A, Sector 62", locality: "Sector 62", city: "Noida", state: "Uttar Pradesh", pincode: "201309",
    is_verified: true, is_featured: false,
  },
  // ─── Mumbai – Bandra ──────────────────────────────────────
  {
    name: "CRED", slug: "cred",
    logo_url: "https://logo.clearbit.com/cred.club",
    short_bio: "Rewarding creditworthy Indians",
    description: "CRED is a members-only credit card bill payment platform that rewards responsible financial behaviour. It serves 13M+ premium members.",
    website: "https://cred.club", career_page_url: "https://cred.club/careers",
    industry: "Fintech", company_size: "201-1000", funding_stage: "Series G",
    lat: 19.0596, lng: 72.8295,
    address: "Kaledonia, Andheri East", locality: "Bandra Kurla Complex", city: "Mumbai", state: "Maharashtra", pincode: "400051",
    is_verified: true, is_featured: true,
  },
  {
    name: "Navi", slug: "navi",
    logo_url: "https://logo.clearbit.com/navi.com",
    short_bio: "Simple financial products for every Indian",
    description: "Navi offers personal loans, home loans, health insurance, and mutual funds — all from a single app.",
    website: "https://navi.com", career_page_url: "https://navi.com/careers",
    industry: "Fintech", company_size: "51-200", funding_stage: "Series B",
    lat: 19.0544, lng: 72.8322,
    address: "BKC, Bandra East", locality: "Bandra", city: "Mumbai", state: "Maharashtra", pincode: "400051",
    is_verified: false, is_featured: false,
  },
  // ─── Mumbai – Lower Parel ─────────────────────────────────
  {
    name: "ShareChat", slug: "sharechat",
    logo_url: "https://logo.clearbit.com/sharechat.com",
    short_bio: "India's social media in your language",
    description: "ShareChat is an Indian social media platform serving 300M+ users in 15 Indian languages, owned by Mohalla Tech Pvt Ltd.",
    website: "https://sharechat.com", career_page_url: "https://sharechat.com/jobs",
    industry: "Media", company_size: "1000+", funding_stage: "Series H",
    lat: 18.9952, lng: 72.8265,
    address: "1st Floor, Godrej One, Pirojshanagar", locality: "Lower Parel", city: "Mumbai", state: "Maharashtra", pincode: "400079",
    is_verified: true, is_featured: true,
  },
  {
    name: "Licious", slug: "licious",
    logo_url: "https://logo.clearbit.com/licious.in",
    short_bio: "Fresh meat & seafood delivery",
    description: "Licious is India's first D2C unicorn focused on fresh, safe, delicious meat and seafood, delivered daily.",
    website: "https://licious.in", career_page_url: "https://licious.in/careers",
    industry: "D2C", company_size: "201-1000", funding_stage: "Series G",
    lat: 18.9934, lng: 72.8240,
    address: "Lodha Supremus 2, Near Piramal Realty", locality: "Lower Parel", city: "Mumbai", state: "Maharashtra", pincode: "400013",
    is_verified: false, is_featured: false,
  },
  // ─── Hyderabad – HITEC City ───────────────────────────────
  {
    name: "upGrad", slug: "upgrad",
    logo_url: "https://logo.clearbit.com/upgrad.com",
    short_bio: "India's leading online higher education platform",
    description: "upGrad offers industry-relevant online degrees and courses in partnership with top universities, serving 4M+ learners globally.",
    website: "https://upgrad.com", career_page_url: "https://upgrad.com/careers",
    industry: "Edtech", company_size: "1000+", funding_stage: "Series I",
    lat: 17.4486, lng: 78.3915,
    address: "Salarpuria Sattva Knowledge City", locality: "HITEC City", city: "Hyderabad", state: "Telangana", pincode: "500081",
    is_verified: true, is_featured: true,
  },
  {
    name: "Darwinbox", slug: "darwinbox",
    logo_url: "https://logo.clearbit.com/darwinbox.com",
    short_bio: "Modern cloud HR & payroll platform",
    description: "Darwinbox is the fastest-growing enterprise HR tech platform in Asia, used by 850+ companies and 2M+ employees.",
    website: "https://darwinbox.com", career_page_url: "https://darwinbox.com/careers",
    industry: "HRtech", company_size: "201-1000", funding_stage: "Series D",
    lat: 17.4492, lng: 78.3878,
    address: "8th Floor, DLF Cyber Towers", locality: "HITEC City", city: "Hyderabad", state: "Telangana", pincode: "500081",
    is_verified: true, is_featured: true,
  },
  {
    name: "Zetwerk", slug: "zetwerk",
    logo_url: "https://logo.clearbit.com/zetwerk.com",
    short_bio: "Global manufacturing network",
    description: "Zetwerk is a B2B marketplace for manufacturing, connecting buyers with vetted manufacturers across India for custom-made products.",
    website: "https://zetwerk.com", career_page_url: "https://zetwerk.com/careers",
    industry: "Deeptech", company_size: "201-1000", funding_stage: "Series F",
    lat: 17.4466, lng: 78.3740,
    address: "Raheja Mindspace IT Park", locality: "HITEC City", city: "Hyderabad", state: "Telangana", pincode: "500081",
    is_verified: true, is_featured: false,
  },
  // ─── Pune ─────────────────────────────────────────────────
  {
    name: "Persistent Systems", slug: "persistent-systems",
    logo_url: "https://logo.clearbit.com/persistent.com",
    short_bio: "Digital transformation & software company",
    description: "Persistent Systems is a global services and solutions company delivering digital business acceleration to clients around the world.",
    website: "https://persistent.com", career_page_url: "https://persistent.com/careers",
    industry: "SaaS", company_size: "1000+", funding_stage: "IPO",
    lat: 18.5679, lng: 73.9143,
    address: "Bhageerath, 402-B, Senapati Bapat Rd", locality: "Hinjewadi", city: "Pune", state: "Maharashtra", pincode: "411045",
    is_verified: true, is_featured: false,
  },
  {
    name: "Pune Startup – Postman", slug: "postman",
    logo_url: "https://logo.clearbit.com/postman.com",
    short_bio: "API development platform used by 25M+ developers",
    description: "Postman is the world's leading API platform, helping developers and teams build, test, and document APIs faster. HQ in SF with large India team.",
    website: "https://postman.com", career_page_url: "https://postman.com/company/careers",
    industry: "SaaS", company_size: "1000+", funding_stage: "Series D",
    lat: 18.5559, lng: 73.9312,
    address: "Magarpatta City, Hadapsar", locality: "Kharadi", city: "Pune", state: "Maharashtra", pincode: "411028",
    is_verified: true, is_featured: true,
  },
  // ─── Chennai ──────────────────────────────────────────────
  {
    name: "Zoho", slug: "zoho",
    logo_url: "https://logo.clearbit.com/zoho.com",
    short_bio: "Global business software suite — bootstrapped unicorn",
    description: "Zoho is a bootstrapped software company that builds a unified suite of 55+ applications serving 100M+ users globally. No VC money, profitable for 28 years.",
    website: "https://zoho.com", career_page_url: "https://careers.zoho.com",
    industry: "SaaS", company_size: "1000+", funding_stage: "Bootstrapped",
    lat: 12.9010, lng: 80.2280,
    address: "Zoho Corporation, Estancia IT Park", locality: "Sholinganallur", city: "Chennai", state: "Tamil Nadu", pincode: "600119",
    is_verified: true, is_featured: true,
  },
  {
    name: "Freshworks", slug: "freshworks",
    logo_url: "https://logo.clearbit.com/freshworks.com",
    short_bio: "Business software for customer delight",
    description: "Freshworks builds cloud-based SaaS (CRM, ITSM, CS) serving 60,000+ businesses globally. First Indian SaaS company to IPO on NASDAQ.",
    website: "https://freshworks.com", career_page_url: "https://freshworks.com/company/careers",
    industry: "SaaS", company_size: "1000+", funding_stage: "IPO",
    lat: 13.0587, lng: 80.2209,
    address: "Olympia Technology Park, Block A", locality: "T Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600032",
    is_verified: true, is_featured: true,
  },
  // ─── Bengaluru – Indiranagar ──────────────────────────────
  {
    name: "Smallcase", slug: "smallcase",
    logo_url: "https://logo.clearbit.com/smallcase.com",
    short_bio: "Modern investment portfolios by SEBI-registered experts",
    description: "Smallcase powers thematic investing for 5M+ investors through curated baskets of stocks / ETFs, built by 250+ SEBI-registered experts.",
    website: "https://smallcase.com", career_page_url: "https://smallcase.com/about-us/careers",
    industry: "Fintech", company_size: "51-200", funding_stage: "Series C",
    lat: 12.9716, lng: 77.6412,
    address: "12, 100 Feet Road, HAL 2nd Stage", locality: "Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560038",
    is_verified: true, is_featured: true,
  },
  {
    name: "HashedIn by Deloitte", slug: "hashedin",
    logo_url: "https://logo.clearbit.com/hashedin.com",
    short_bio: "Digital product engineering company",
    description: "HashedIn builds world-class digital products for global enterprises and startups, acquired by Deloitte in 2021.",
    website: "https://hashedin.com", career_page_url: "https://hashedin.com/careers",
    industry: "SaaS", company_size: "201-1000", funding_stage: "Acquired",
    lat: 12.9730, lng: 77.6391,
    address: "5th Floor, RMZ Latitude, Bellary Road", locality: "Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560024",
    is_verified: false, is_featured: false,
  },
  // ─── Bengaluru – CBD ──────────────────────────────────────
  {
    name: "BrowserStack", slug: "browserstack",
    logo_url: "https://logo.clearbit.com/browserstack.com",
    short_bio: "Test your app on 20,000 real devices",
    description: "BrowserStack is the cloud testing platform trusted by 50,000+ customers including Apple, Amazon, and PayPal to build high-quality digital experiences.",
    website: "https://browserstack.com", career_page_url: "https://browserstack.com/careers",
    industry: "SaaS", company_size: "201-1000", funding_stage: "Series B",
    lat: 12.9780, lng: 77.5940,
    address: "4th Floor World Trade Center, Brigade Gateway", locality: "Rajajinagar", city: "Bengaluru", state: "Karnataka", pincode: "560055",
    is_verified: true, is_featured: true,
  },
  {
    name: "Chargebee", slug: "chargebee",
    logo_url: "https://logo.clearbit.com/chargebee.com",
    short_bio: "Subscription management & revenue growth platform",
    description: "Chargebee automates subscription billing, revenue recognition, and retention for 6500+ SaaS businesses globally.",
    website: "https://chargebee.com", career_page_url: "https://chargebee.com/careers",
    industry: "SaaS", company_size: "201-1000", funding_stage: "Series G",
    lat: 12.9716, lng: 77.5946,
    address: "Katha Building, HSR Layout sector 7", locality: "HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102",
    is_verified: true, is_featured: false,
  },
  // ─── Bengaluru – Electronic City ──────────────────────────
  {
    name: "Flipkart", slug: "flipkart",
    logo_url: "https://logo.clearbit.com/flipkart.com",
    short_bio: "India's homegrown e-commerce giant",
    description: "Flipkart is India's largest e-commerce marketplace, now owned by Walmart, serving 500M+ registered customers with 150M+ products.",
    website: "https://flipkart.com", career_page_url: "https://flipkartcareers.com",
    industry: "E-commerce", company_size: "1000+", funding_stage: "Acquired",
    lat: 12.8448, lng: 77.6625,
    address: "Flipkart Internet, Alyssa, Begonia & Clove Embassy", locality: "Electronic City", city: "Bengaluru", state: "Karnataka", pincode: "560100",
    is_verified: true, is_featured: true,
  },
  // ─── Delhi – Connaught Place ──────────────────────────────
  {
    name: "Cars24", slug: "cars24",
    logo_url: "https://logo.clearbit.com/cars24.com",
    short_bio: "India's largest used-car marketplace",
    description: "Cars24 buys, sells, and finances used cars using AI to give instant prices. It operates in 200+ cities with 10M+ cars transacted.",
    website: "https://cars24.com", career_page_url: "https://cars24.com/careers",
    industry: "E-commerce", company_size: "1000+", funding_stage: "Series G",
    lat: 28.6315, lng: 77.2167,
    address: "Circle House, Barakhamba Road", locality: "Connaught Place", city: "Delhi", state: "Delhi", pincode: "110001",
    is_verified: true, is_featured: false,
  },
  // ─── Ahmedabad ────────────────────────────────────────────
  {
    name: "Juspay", slug: "juspay",
    logo_url: "https://logo.clearbit.com/juspay.in",
    short_bio: "Building payment infrastructure for India & world",
    description: "Juspay's HyperSDK powers the checkout experience for Amazon, Swiggy, Flipkart, and 400M+ customers.",
    website: "https://juspay.in", career_page_url: "https://juspay.in/careers",
    industry: "Fintech", company_size: "51-200", funding_stage: "Series B",
    lat: 23.0225, lng: 72.5714,
    address: "4th floor, Shivalik shilp-II", locality: "Satellite", city: "Ahmedabad", state: "Gujarat", pincode: "380015",
    is_verified: false, is_featured: false,
  },
]

// ─── Jobs per company ─────────────────────────────────────────
const jobTemplates = [
  {
    title: "Senior Software Engineer – Backend",
    description: "Design and build scalable microservices. Work on high-traffic systems handling millions of requests.",
    requirements: "4+ years Go/Java/Node.js, Distributed systems, PostgreSQL, Redis, AWS/GCP",
    salary_min: 2500000, salary_max: 4500000,
    experience_min: 4, experience_max: 8,
    job_type: "full-time", work_mode: "hybrid",
    skills: ["Go", "Microservices", "PostgreSQL", "Redis", "AWS"],
    is_new: true,
  },
  {
    title: "Product Manager – Growth",
    description: "Own user acquisition, onboarding, and retention funnels. Define and execute the growth roadmap.",
    requirements: "3+ years PM experience, Data-driven mindset, SQL, A/B testing",
    salary_min: 2000000, salary_max: 3500000,
    experience_min: 3, experience_max: 7,
    job_type: "full-time", work_mode: "hybrid",
    skills: ["Product Strategy", "SQL", "A/B Testing", "Analytics", "Roadmapping"],
    is_new: true,
  },
  {
    title: "Frontend Engineer – React",
    description: "Build beautiful, performant user interfaces that delight millions of users.",
    requirements: "3+ years React, TypeScript, CSS-in-JS, Performance optimization",
    salary_min: 1800000, salary_max: 3200000,
    experience_min: 3, experience_max: 6,
    job_type: "full-time", work_mode: "hybrid",
    skills: ["React", "TypeScript", "Next.js", "Figma", "CSS"],
    is_new: false,
  },
  {
    title: "DevOps / Platform Engineer",
    description: "Build and maintain CI/CD pipelines, Kubernetes clusters, and the cloud infrastructure stack.",
    requirements: "3+ years DevOps, Kubernetes, Terraform, Prometheus, GitOps",
    salary_min: 2200000, salary_max: 4000000,
    experience_min: 3, experience_max: 7,
    job_type: "full-time", work_mode: "onsite",
    skills: ["Kubernetes", "Terraform", "AWS", "Prometheus", "GitOps"],
    is_new: false,
  },
  {
    title: "ML Engineer – Recommendations",
    description: "Build and deploy ML models powering personalisation, fraud detection, and demand forecasting.",
    requirements: "2+ years ML, Python, PyTorch/TensorFlow, MLflow, Feature stores",
    salary_min: 2500000, salary_max: 5000000,
    experience_min: 2, experience_max: 6,
    job_type: "full-time", work_mode: "hybrid",
    skills: ["Python", "PyTorch", "MLflow", "Feature Engineering", "SQL"],
    is_new: true,
  },
  {
    title: "Design Lead – Product Design",
    description: "Lead a team of designers to craft world-class product experiences from concept to launch.",
    requirements: "5+ years product design, Figma, Design systems, User research",
    salary_min: 2800000, salary_max: 5000000,
    experience_min: 5, experience_max: 10,
    job_type: "full-time", work_mode: "hybrid",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Motion Design"],
    is_new: true,
  },
  {
    title: "SDE-1 – Internship to Full-Time",
    description: "Start as an intern, ship features, and transition to a full-time role within 3–6 months.",
    requirements: "CS degree (or equivalent), LeetCode problem-solving, one internship",
    salary_min: 800000, salary_max: 1500000,
    experience_min: 0, experience_max: 2,
    job_type: "internship", work_mode: "hybrid",
    skills: ["Data Structures", "Algorithms", "Python", "System Design", "Git"],
    is_new: true,
  },
  {
    title: "Head of Engineering",
    description: "Shape the engineering culture, hire top talent, and own the tech roadmap as we scale from 100 to 1000 engineers.",
    requirements: "10+ years, 5+ years managing managers, built teams >50, startup DNA",
    salary_min: 7000000, salary_max: 15000000,
    experience_min: 10, experience_max: 20,
    job_type: "full-time", work_mode: "onsite",
    skills: ["Leadership", "Engineering Strategy", "Hiring", "Architecture", "P&L"],
    is_new: false,
  },
]

async function seed() {
  console.log("🌱 Seeding PinHire India database...")

  // Insert companies
  const { data: insertedCompanies, error: companyErr } = await supabase
    .from("companies")
    .upsert(companies, { onConflict: "slug" })
    .select("id, slug")

  if (companyErr) {
    console.error("Error inserting companies:", companyErr)
    process.exit(1)
  }

  console.log(`✅ Inserted ${insertedCompanies?.length ?? 0} companies`)

  // Insert 3–5 random jobs per company
  const jobs = (insertedCompanies ?? []).flatMap((company) => {
    // Pick 3-5 random job templates for each company
    const count = 3 + Math.floor(Math.random() * 3)
    const shuffled = [...jobTemplates].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map((tpl, i) => ({
      ...tpl,
      company_id: company.id,
      source: "manual",
      external_id: `${company.slug}-job-${i + 1}`,
      apply_url: `https://jobmapindia.com/companies/${company.slug}#jobs`,
      posted_at: new Date(Date.now() - Math.random() * 14 * 86400_000).toISOString(),
    }))
  })

  const { data: insertedJobs, error: jobErr } = await supabase
    .from("jobs")
    .upsert(jobs, { onConflict: "source,external_id" })
    .select("id")

  if (jobErr) {
    console.error("Error inserting jobs:", jobErr)
    process.exit(1)
  }

  console.log(`✅ Inserted ${insertedJobs?.length ?? 0} jobs`)
  console.log("🎉 Seed complete! PinHire India is ready.")
}

seed().catch(console.error)
