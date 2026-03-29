"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Company } from "@/types"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface Props {
  company: Company
  isHovered: boolean
  onClick: () => void
}

export default function CompanyMarker({ company, isHovered, onClick }: Props) {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <motion.button
              onClick={onClick}
              initial={{ scale: 0, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              whileHover={{ scale: 1.18, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="relative flex flex-col items-center cursor-pointer focus:outline-none group"
              aria-label={`${company.name} — ${company.city}`}
            >
              {/* Pulse ring */}
              {isHovered && (
                <motion.div
                  className="absolute -inset-2 rounded-full bg-saffron/20 border border-saffron/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Logo circle */}
              <div
                className={`
                  relative w-10 h-10 rounded-full overflow-hidden border-2 shadow-xl
                  transition-all duration-200
                  ${isHovered
                    ? "border-saffron shadow-saffron/40 shadow-2xl ring-2 ring-saffron/30"
                    : "border-white/15 shadow-black/50 group-hover:border-saffron/60"
                  }
                `}
              >
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={company.name}
                    fill
                    className="object-cover bg-white"
                    sizes="40px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-saffron to-amber-400 flex items-center justify-center text-white font-bold text-sm">
                    {company.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Pin stem */}
              <div
                className={`w-0.5 h-2.5 transition-colors duration-200 ${
                  isHovered ? "bg-saffron" : "bg-white/30 group-hover:bg-saffron/60"
                }`}
              />
              {/* Pin dot */}
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  isHovered ? "bg-saffron" : "bg-white/40 group-hover:bg-saffron/60"
                }`}
              />
            </motion.button>
          }
        />

        <TooltipContent
          side="top"
          className="glass border border-white/10 text-xs py-1.5 px-2.5 rounded-lg max-w-[140px] text-center !bg-card !text-foreground"
        >
          <p className="font-semibold text-foreground leading-tight">{company.name}</p>
          <p className="text-muted-foreground">{company.locality ?? company.city}</p>
          {company.job_count != null && company.job_count > 0 && (
            <p className="text-saffron font-medium">{company.job_count} open roles</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
