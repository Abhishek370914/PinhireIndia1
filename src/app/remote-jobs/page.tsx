import { Metadata } from 'next'
import Link from 'next/link'
import RemoteJobsSection from '@/components/remote-jobs/RemoteJobsSection'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Remote Jobs Worldwide | Rare Earth & Permanent Magnets | Project Pin IRE',
  description:
    'Work from anywhere in rare earth, critical minerals & permanent magnets. 42+ global companies hiring remote. Contribute to India\'s Atmanirbhar Bharat mission. Explore R&D, supply chain, engineering, consulting, policy roles.',
  keywords:
    'remote jobs, rare earth, permanent magnets, critical minerals, IREL, Project Pin IRE, India, work from home',
  openGraph: {
    title: 'Remote Jobs Worldwide | Rare Earth & Permanent Magnets | Project Pin IRE India',
    description:
      'Join 42+ global companies advancing rare earth independence. Work remotely from anywhere and support India\'s Atmanirbhar Bharat mission.',
    type: 'website',
    url: 'https://pinhireindia.com/remote-jobs',
  },
}

export default function RemoteJobsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              Home
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold">Remote Jobs Worldwide</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      
      {/* Pin Your Impact CTA Section */}
      <div className="bg-linear-to-b from-slate-900 via-blue-900 to-slate-900 border-b border-white/10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-12">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-linear-to-r from-green-500/20 via-blue-500/20 to-cyan-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%221%22%20fill%3D%22%23fff%22%20opacity%3D%220.1%22/%3E%3C/svg%3E')] bg-repeat" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 text-sm font-bold">NEW: AI TALENT MATCHING</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Pin Your Impact
                  <span className="block text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-400">
                    Get 5 Perfect Company Matches in 5 Minutes
                  </span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Answer 5 quick questions about your skills, experience, and impact goals. Our AI will scan 500+ companies and recommend your top matches with current job openings.
                </p>
              </div>
              
              <div className="md:flex-shrink-0">
                <Link
                  href="/pin-your-impact"
                  className="inline-block group relative px-8 py-4 rounded-2xl bg-linear-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold text-lg shadow-[0_20px_60px_rgba(34,197,94,0.3)] overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative z-10">
                    Start Matching →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remote Jobs Section */}
      <RemoteJobsSection />

      {/* Footer Info */}
      <div className="bg-linear-to-b from-transparent to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg mb-2">
            🌍 <strong>Global rare earth talent</strong> fueling India's strategic independence
          </p>
          <p className="text-sm text-blue-100">
            All opportunities are external career pages | Each company manages their own hiring process | Last updated: April 2026
          </p>
        </div>
      </div>
    </main>
  )
}
