"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Search, Bell, User, Briefcase, Building2, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ProfileStrengthMeter from "@/components/profile/ProfileStrengthMeter"
import ProfileStrengthModal from "@/components/profile/ProfileStrengthModal"
import { useUserStore } from "@/store/userStore"
import type { Session } from "next-auth"
import { signOut as authSignOut } from "next-auth/react"

interface NavbarProps {
  session: Session | null
}

const navLinks = [
  { href: "/explore", label: "Explore Map", icon: MapPin },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/companies", label: "Companies", icon: Building2 },
]

const AnimatedPinHireLogo = () => (
  <motion.div
    whileHover="hover"
    className="relative w-9 h-9 flex items-center justify-center shrink-0"
  >
    <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pin-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FF6B00" floodOpacity="0.3"/>
        </filter>
        <linearGradient id="paper-grad" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF"/>
          <stop offset="1" stopColor="#F8FAFC"/>
        </linearGradient>
      </defs>

      {/* The Resume / CV (Paper Sheet) */}
      <motion.path
        d="M14 10C14 7.79086 15.7909 6 18 6H28L36 14V38C36 40.2091 34.2091 42 32 42H18C15.7908 42 14 40.2091 14 38V10Z"
        fill="url(#paper-grad)"
        stroke="#0A2540"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hover: { 
            rotateZ: -5,
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }
        }}
        style={{ transformOrigin: "center" }}
      />
      
      {/* Folded Top-Right Corner */}
      <motion.path
        d="M28 6V14H36"
        fill="#E2E8F0"
        stroke="#0A2540"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hover: { d: "M28 6V16H34" }
        }}
      />

      {/* CV Content Lines */}
      <motion.path
        d="M20 20H26 M20 25H30 M20 30H25"
        stroke="#0A2540"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* The Location Pin enveloping the paper */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        variants={{
          hover: { scale: 1.15, y: -4, transition: { type: "spring", stiffness: 400 } }
        }}
        style={{ transformOrigin: "32px 28px" }}
        filter="url(#pin-glow)"
      >
        <path
          d="M32 16C28.134 16 25 19.134 25 23C25 28.5 32 37 32 37C32 37 39 28.5 39 23C39 19.134 35.866 16 32 16Z"
          fill="#FF6B00"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="23" r="3.5" fill="#FFFFFF" />
      </motion.g>
    </svg>
  </motion.div>
)

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { resetProfile } = useUserStore()

  const handleSignOut = async () => {
    await authSignOut({ callbackUrl: "/auth/login" })
    resetProfile()
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <AnimatedPinHireLogo />
          <span className="font-display font-800 text-xl tracking-tight">
            <span style={{ color: "#0A2540" }}>Pin</span>
            <span style={{ color: "#FF6B00" }}>Hire</span>
            <span className="text-gray-400 text-sm font-medium ml-1.5 tracking-normal hidden sm:inline">India</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href))
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-orange-50 text-saffron"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <Link href="/notifications">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Unread indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron ring-2 ring-background" />
            </motion.button>
          </Link>

          {/* Profile Strength Meter */}
          <ProfileStrengthMeter 
            onClick={() => setShowProfileModal(true)} 
          />

          {/* Auth button / User Info */}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                Hi, {session.user?.name?.split(' ')[0] || 'User'}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden sm:inline-flex">
              <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-white font-semibold rounded-xl gap-1.5 glow-saffron">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1"
        >
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-orange-50 text-saffron"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </Link>
          ))}
          {session ? (
            <Button 
              size="sm" 
              variant="outline"
              className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full mt-2 bg-saffron hover:bg-saffron/90 text-white rounded-xl">
                Sign In
              </Button>
            </Link>
          )}
        </motion.div>
      )}

      {/* Profile Strength Modal */}
      <ProfileStrengthModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </motion.header>
  )
}
