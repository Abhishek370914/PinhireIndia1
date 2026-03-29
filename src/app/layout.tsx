import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import { auth } from "@/auth"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | PinHire India",
    default: "PinHire India — Drop a pin. Find your dream job.",
  },
  description:
    "Explore thousands of startup and tech jobs on an interactive map of India. From HSR Layout to HITEC City — find your next opportunity pinned to the exact location.",
  keywords: ["jobs india", "startup jobs", "bengaluru jobs", "mumbai jobs", "map jobs india", "pinhire"],
  openGraph: {
    type: "website",
    siteName: "PinHire India",
    title: "PinHire India — Drop a pin. Find your dream job.",
    description: "India's first map-based startup job discovery platform.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "PinHire India",
    description: "Explore startup jobs on a live map of India.",
  },
  themeColor: "#07091a",
  manifest: "/manifest.json",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html
      lang="en"
      // Dark by default — no flash
      className={`dark ${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar session={session} />
        <main className="flex-1 flex flex-col pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
