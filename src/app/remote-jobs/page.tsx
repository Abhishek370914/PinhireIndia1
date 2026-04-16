import { Metadata } from 'next'
import RemoteJobsSection from '@/components/remote-jobs/RemoteJobsSection'

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
      <RemoteJobsSection />

      {/* Footer Info */}
      <div className="bg-gradient-to-b from-transparent to-blue-900 text-white py-12">
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
