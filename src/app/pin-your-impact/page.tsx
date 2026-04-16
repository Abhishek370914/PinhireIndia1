import type { Metadata } from 'next'
import PinYourImpact from '@/components/PinYourImpact/PinYourImpact'

export const metadata: Metadata = {
  title: 'Pin Your Impact - Global Talent Matching for Rare Earth Mission',
  description:
    'Join 2,847+ global talents supporting India\'s Atmanirbhar Bharat mission. Get matched with 500+ companies in 5 minutes. Completely free, no sign-up required.',
  keywords: [
    'rare earth jobs',
    'India careers',
    'talent matching',
    'critical minerals',
    'IREL',
    'remote jobs',
    'Atmanirbhar Bharat',
  ],
  openGraph: {
    title: 'Pin Your Impact - Find Your Perfect Rare Earth Role',
    description:
      'AI-powered talent matching for the global rare earth ecosystem. 500+ companies, 2000+ remote roles.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1537462715957-37854212614b?auto=format&fit=crop&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'Pin Your Impact - Talent Matching',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pin Your Impact - Global Rare Earth Talent Matching',
    description: '500+ companies matching with your skills. 5-minute AI assessment.',
  },
  alternates: {
    canonical: 'https://pinhire.in/pin-your-impact',
  },
}

export default function PinYourImpactPage() {
  return (
    <main className="min-h-screen bg-black">
      <PinYourImpact />
    </main>
  )
}
