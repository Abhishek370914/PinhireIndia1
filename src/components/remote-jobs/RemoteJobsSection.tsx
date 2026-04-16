'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, ExternalLink } from 'lucide-react'

interface Company {
  id: number
  name: string
  focus: string
  careerUrl: string
  roles: string[]
  tip: string
}

const COMPANIES: Company[] = [
  { id: 1, name: 'USA Rare Earth LLC', focus: 'Mine-to-magnet full chain (Round Top + magnets)', careerUrl: 'https://careers.usare.com/', roles: ['R&D', 'Supply Chain'], tip: 'Remote roles in supply chain, R&D, people ops' },
  { id: 2, name: 'MP Materials', focus: "USA's only integrated rare earth mine-to-magnet", careerUrl: 'https://mpmaterials.com/careers', roles: ['R&D', 'Supply Chain'], tip: 'Remote/hybrid in R&D, magnet tech, supply chain' },
  { id: 3, name: 'Lynas Rare Earths', focus: 'Largest non-China rare earth producer (Mt Weld)', careerUrl: 'https://lynascorp.com/careers/', roles: ['Consulting', 'R&D'], tip: 'Remote expert & analytical roles' },
  { id: 4, name: 'Iluka Resources', focus: 'Rare earth refinery & mineral sands processing', careerUrl: 'https://www.iluka.com/careers', roles: ['Supply Chain'], tip: 'Remote supply chain & technical roles' },
  { id: 5, name: 'Neo Performance Materials', focus: 'Rare earth magnets & advanced materials', careerUrl: 'https://www.neomaterials.com/careers', roles: ['Engineering'], tip: 'Frequent remote engineering & sales' },
  { id: 6, name: 'VACUUMSCHMELZE (VAC)', focus: 'High-performance permanent magnets', careerUrl: 'https://www.vacuumschmelze.com/en/career', roles: ['R&D'], tip: 'Remote R&D & technical consulting' },
  { id: 7, name: 'Arnold Magnetic Technologies', focus: 'High-performance magnets & assemblies', careerUrl: 'https://www.arnoldmagnetics.com/careers/', roles: ['R&D'], tip: 'Remote materials science roles' },
  { id: 8, name: 'Electron Energy Corporation', focus: 'Rare earth magnets (SmCo & NdFeB)', careerUrl: 'https://www.electronenergy.com/careers', roles: ['Consulting'], tip: 'Occasional remote expert roles' },
  { id: 9, name: 'Proterial Ltd. (ex-Hitachi)', focus: 'NdFeB magnets (NEOMAX)', careerUrl: 'https://www.proterial.com/careers/', roles: ['Engineering'], tip: 'Global remote opportunities' },
  { id: 10, name: 'Shin-Etsu Chemical', focus: "World's largest NdFeB magnet producer", careerUrl: 'https://www.shinetsu.co.jp/en/careers/', roles: ['R&D'], tip: 'International remote roles' },
  { id: 11, name: 'Pensana Plc', focus: 'Rare earth processing (UK/Europe focus)', careerUrl: 'https://pensana.co.uk/careers', roles: ['Policy', 'Supply Chain'], tip: 'Remote policy & supply chain' },
  { id: 12, name: 'Arafura Resources', focus: 'Nolans rare earth project (NdPr focus)', careerUrl: 'https://www.arafura.com.au/careers', roles: ['Engineering'], tip: 'Remote technical & project roles' },
  { id: 13, name: 'Rainbow Rare Earths', focus: 'Gakara rare earth project', careerUrl: 'https://www.rainbowrareearths.com/careers', roles: ['Consulting'], tip: 'Remote consulting roles' },
  { id: 14, name: 'ICF International', focus: 'Critical minerals consulting & policy', careerUrl: 'https://careers.icf.com/', roles: ['Consulting', 'Policy'], tip: 'Many remote "On-Call Critical Minerals Expert" roles' },
  { id: 15, name: 'Rio Tinto (Critical Minerals)', focus: 'Mining & rare earth processing', careerUrl: 'https://www.riotinto.com/careers', roles: ['Supply Chain'], tip: 'Remote analyst & sustainability roles' },
  { id: 16, name: 'Noveon Magnetics', focus: 'USA rare earth magnet recycling', careerUrl: 'https://www.noveonmagnetics.com/careers', roles: ['R&D'], tip: 'Early-stage remote R&D' },
  { id: 17, name: 'REalloys Inc.', focus: 'Heavy rare earth metallization', careerUrl: 'https://realloys.com/careers/', roles: ['Engineering', 'R&D'], tip: 'Remote magnet manufacturing & scientist roles' },
  { id: 18, name: 'Critical Metals Corp.', focus: 'Rare earth deposits (e.g., Greenland)', careerUrl: 'https://www.linkedin.com/company/critical-metals-corp', roles: ['Consulting'], tip: 'Remote project development roles' },
  { id: 19, name: 'Niron Magnetics', focus: 'Rare-earth-free permanent magnets (Iron Nitride)', careerUrl: 'https://www.nironmagnetics.com/careers', roles: ['R&D', 'Engineering'], tip: 'Remote/hybrid in magnet tech & R&D' },
  { id: 20, name: 'Energy Fuels Inc.', focus: 'Rare earth processing (from uranium byproduct)', careerUrl: 'https://www.energyfuels.com/careers', roles: ['Supply Chain', 'Engineering'], tip: 'Remote technical & supply chain' },
  { id: 21, name: 'Ucore Rare Metals', focus: 'RapidSX rare earth separation tech', careerUrl: 'https://ucore.com/careers', roles: ['Engineering'], tip: 'Remote engineering & project roles' },
  { id: 22, name: 'HyProMag (Mkango)', focus: 'Rare earth magnet recycling (HPMS tech)', careerUrl: 'https://www.mkango.ca/', roles: ['Consulting', 'Engineering'], tip: 'Remote recycling & magnet tech experts' },
  { id: 23, name: 'Phoenix Tailings', focus: 'Sustainable rare earth recovery from tailings', careerUrl: 'https://jobs.lever.co/PhoenixTailings', roles: ['Engineering'], tip: 'Remote process engineering roles' },
  { id: 24, name: 'American Rare Earths', focus: 'Large US rare earth deposits', careerUrl: 'https://www.linkedin.com/company/american-rare-earths', roles: ['Consulting', 'Engineering'], tip: 'Remote geology & technical' },
  { id: 25, name: 'TDK Corporation', focus: 'Rare earth magnets & electronic components', careerUrl: 'https://www.tdk.com/en/careers/', roles: ['R&D'], tip: 'Global remote R&D roles' },
  { id: 26, name: 'Dexter Magnetic Technologies', focus: 'Magnetic assemblies & rare earth solutions', careerUrl: 'https://www.dextermag.com/careers', roles: ['Engineering'], tip: 'Remote technical sales & engineering' },
  { id: 27, name: 'Adams Magnetic Products', focus: 'Permanent magnets & assemblies', careerUrl: 'https://www.adamsmagnetic.com/careers', roles: ['Engineering'], tip: 'Smaller team → occasional remote' },
  { id: 28, name: 'Bunting Magnetics', focus: 'Industrial magnets & separation', careerUrl: 'https://buntingmagnetics.com/careers', roles: ['Engineering'], tip: 'Remote engineering roles' },
  { id: 29, name: 'Solvay (Rare Earths)', focus: 'Rare earth processing & specialty chemicals', careerUrl: 'https://www.solvay.com/en/careers', roles: ['Engineering'], tip: 'Remote chemical/process experts' },
  { id: 30, name: 'Avalon Advanced Materials', focus: 'Rare earth & critical minerals exploration', careerUrl: 'https://www.avalonadvancedmaterials.com/careers', roles: ['Consulting', 'Engineering'], tip: 'Remote project & consulting' },
  { id: 31, name: 'Ionic Technologies', focus: 'Rare earth magnet recycling & separation', careerUrl: 'https://www.linkedin.com/company/ionic-technologies', roles: ['Engineering'], tip: 'Remote process development' },
  { id: 32, name: 'Ramaco Resources', focus: 'Critical minerals processing (from coal)', careerUrl: 'https://www.ramacoresources.com/careers', roles: ['Consulting'], tip: 'Remote technical leadership' },
  { id: 33, name: 'Ford Motor Co. (REE team)', focus: 'Rare earth & magnet supply chain strategy', careerUrl: 'https://www.careers.ford.com/', roles: ['Supply Chain'], tip: 'Remote supply chain manager roles' },
  { id: 34, name: 'Toyota Tsusho (Rare Earths)', focus: 'Rare earth trading & processing (IREL partner)', careerUrl: 'https://www.toyota-tsusho.com/careers', roles: ['Supply Chain', 'Policy'], tip: 'Global remote supply chain' },
  { id: 35, name: 'Geomega Resources', focus: 'Rare earth recycling & separation tech', careerUrl: 'https://geomega.ca/careers', roles: ['R&D'], tip: 'Remote R&D roles' },
  { id: 36, name: 'Mkango Resources', focus: 'Rare earth projects + HyProMag recycling', careerUrl: 'https://www.mkango.ca/', roles: ['Consulting', 'Engineering'], tip: 'Remote project & tech roles' },
  { id: 37, name: 'Aclara Resources', focus: 'Heavy rare earths (ionic clay)', careerUrl: 'https://www.linkedin.com/company/aclara-resources', roles: ['Consulting'], tip: 'Remote exploration & processing' },
  { id: 38, name: 'Idaho Strategic Resources', focus: 'Rare earths + critical minerals', careerUrl: 'https://idahostrategic.com/careers', roles: ['Engineering'], tip: 'Remote technical roles' },
  { id: 39, name: 'NioCorp Developments', focus: 'Niobium + rare earths project', careerUrl: 'https://www.niocorp.com/careers/', roles: ['Consulting', 'Engineering'], tip: 'Remote project development' },
  { id: 40, name: 'Eclipse Magnetics', focus: 'Industrial & rare earth magnets (UK)', careerUrl: 'https://www.eclipsemagnetics.com/careers', roles: ['Engineering'], tip: 'Remote sales & technical' },
  { id: 41, name: 'Goudsmit Magnetics', focus: 'Magnetic systems & rare earth applications', careerUrl: 'https://www.goudsmitmagnets.com/careers', roles: ['Engineering', 'R&D'], tip: 'Remote engineering' },
  { id: 42, name: 'Materion Advanced Materials', focus: 'Rare earth metals & advanced materials', careerUrl: 'https://materion.com/careers', roles: ['R&D'], tip: 'Remote materials scientist roles' },
]

const ROLE_TYPES = ['R&D', 'Supply Chain', 'Engineering', 'Consulting', 'Policy']

export default function RemoteJobsSection() {
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredCompanies = useMemo(() => {
    return COMPANIES.filter((company) => {
      const matchesRole = selectedRole === 'all' || company.roles.includes(selectedRole)
      const matchesSearch =
        searchQuery === '' ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.focus.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesRole && matchesSearch
    })
  }, [selectedRole, searchQuery])

  return (
    <section className="py-16 bg-gradient-to-b from-white via-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl sm:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              🌐 Remote Jobs Worldwide
            </span>
          </h2>
          <p className="text-xl text-green-600 font-semibold mb-4">
            Work From Anywhere in Rare Earth & Permanent Magnets
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-12 border-l-4 border-green-600"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Looking for <strong>remote career opportunities</strong> in the global rare earth and permanent magnet industry? This carefully curated job board is designed for talented professionals worldwide who want to contribute to{' '}
            <strong>India's Atmanirbhar Bharat mission</strong> for strategic minerals self-reliance — without relocating from home.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            These 42+ companies are key players in the supply chain supporting <strong>IREL's pin-point strategy</strong>, EV magnets, renewable energy, and defence technology advancement. Browse roles across <strong>R&D, Supply Chain, Engineering, Consulting, and Policy</strong>. Job openings update constantly — check career pages regularly using "remote," "work from home," or "virtual" filters.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies or focus areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-600 focus:outline-none text-gray-700 transition"
              />
            </div>
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedRole === 'all'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Roles
            </button>
            {ROLE_TYPES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Companies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border-t-4 border-gradient-to-r from-blue-600 to-green-600"
            >
              <div className="h-1 bg-gradient-to-r from-blue-600 to-green-600"></div>

              <div className="p-6">
                {/* Company Name */}
                <h3 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  {company.name}
                </h3>

                {/* Focus */}
                <div className="bg-green-50 border-l-4 border-green-600 p-3 mb-4 rounded">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Focus</p>
                  <p className="text-sm text-gray-800 font-medium">{company.focus}</p>
                </div>

                {/* Roles */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-4 rounded">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Remote Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {company.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tip */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4 rounded">
                  <p className="text-sm text-yellow-800 font-medium">
                    <span className="mr-1">💡</span>
                    {company.tip}
                  </p>
                </div>

                {/* Career Link */}
                <a
                  href={company.careerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition transform hover:translate-x-1"
                >
                  View Careers
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCompanies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-gray-600">No companies found for your search. Try adjusting your filters.</p>
          </motion.div>
        )}

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-sm text-gray-600 mb-8"
        >
          Showing {filteredCompanies.length} of {COMPANIES.length} companies
        </motion.p>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <a
            href="https://www.linkedin.com/jobs/search/?keywords=rare%20earth%20remote&f_jt=F&f_WT=2"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <Briefcase className="w-5 h-5" />
            🔍 Search Remote Jobs on LinkedIn
          </a>
          <button
            onClick={() => alert('Coming soon: Join our exclusive Rare Earth Talent Network!')}
            className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            ✉️ Join Rare Earth Talent Network
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border-l-4 border-blue-600"
        >
          <h4 className="text-lg font-bold text-blue-600 mb-3">📌 Important Information</h4>
          <p className="text-gray-700 mb-3">
            <strong>Job openings are dynamic and change continuously.</strong> We recommend visiting each company's career page regularly and using filters like "remote," "work from home," or "work anywhere" to discover the latest opportunities.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>About Project Pin IRE India:</strong> This resource supports India's strategic initiative for rare earth, critical minerals, and permanent magnet self-reliance under IREL's leadership. Contributing to these companies — regardless of your location — helps build the global supply chain for Atmanirbhar Bharat and global clean energy/defence technology advancement.
          </p>
          <p className="text-sm text-gray-600 italic border-t border-gray-300 pt-4">
            ✅ <strong>Last Updated:</strong> April 2026 | <strong>42+ Global Companies</strong> | <strong>Project Pin IRE India</strong> | Part of India's Atmanirbhar Bharat Initiative
          </p>
        </motion.div>
      </div>
    </section>
  )
}
