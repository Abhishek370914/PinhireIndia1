"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  MapPin, 
  Zap, 
  Target, 
  Briefcase,
  ChevronRight,
  Sparkles,
  FileText,
  Upload,
  User,
  Plus,
  Loader2,
  ExternalLink,
  Award
} from "lucide-react"
import { 
  calculateProfileStrength, 
  getStrengthColor, 
  getStrengthBgColor 
} from "@/lib/profile-strength"
import { useUserStore } from "@/store/userStore"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect, useMemo } from "react"
import { parseResume } from "@/lib/resume-parser"

interface ProfileStrengthModalProps {
  isOpen: boolean
  onClose: () => void
}

const CAREER_PAGES = {
  "Zomato": "https://www.zomato.com/careers",
  "Infosys": "https://www.infosys.com/careers.html",
  "Wipro": "https://careers.wipro.com/global-india/",
  "TCS": "https://www.tcs.com/careers",
  "Google": "https://www.google.com/about/careers/applications/",
  "Microsoft": "https://careers.microsoft.com/",
  "Amazon": "https://www.amazon.jobs/en/locations/bangalore-india"
}

export default function ProfileStrengthModal({ isOpen, onClose }: ProfileStrengthModalProps) {
  const { profile, setProfile, resumeUrl, setResume, setExperiences, setEducation, setSkills } = useUserStore()
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { total, sections } = calculateProfileStrength(profile, !!resumeUrl)
  const colorClass = getStrengthColor(total)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setShowSuccess(false)
      
      try {
        const parsedData = await parseResume(file)
        
        // Update store with parsed data
        if (parsedData.full_name) setProfile({ full_name: parsedData.full_name })
        if (parsedData.headline) setProfile({ headline: parsedData.headline })
        if (parsedData.location) setProfile({ location: parsedData.location })
        if (parsedData.skills) setSkills(parsedData.skills)
        if (parsedData.experience_details) setExperiences(parsedData.experience_details)
        if (parsedData.education) setEducation(parsedData.education)
        
        setResume(URL.createObjectURL(file))
        setShowSuccess(true)
        
        // Clear success message after 3s
        setTimeout(() => setShowSuccess(false), 3000)
      } catch (error) {
        console.error("Parsing failed:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  // Dynamic Insights Logic
  const insights = useMemo(() => {
    if (!profile) return []
    
    const baseInsights = [
      { 
        icon: Target, 
        text: `You are a strong match for ${total > 90 ? "84" : "47"} companies in ${profile.location || "India"}`, 
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        company: total > 90 ? "Google" : "Zomato"
      },
      { 
        icon: Zap, 
        text: `Your ${profile.skills?.[0] || "React"} + ${profile.skills?.[1] || "Node.js"} skills are in highest demand`, 
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        company: "Microsoft"
      },
      { 
        icon: MapPin, 
        text: `Top hiring hubs for you: Bengaluru, Pune, Hyderabad`, 
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        company: "Amazon"
      },
      { 
        icon: Briefcase, 
        text: `${total > 50 ? "12" : "5"} companies actively hiring for ${profile.preferred_role || "Developers"}`, 
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        company: "Infosys"
      }
    ]
    return baseInsights
  }, [profile, total])

  const handleQuickAdd = (sectionId: string) => {
    // In a real app, this would open a specific sub-modal or form
    // For this demonstration, we'll keep the "Add Now" placeholder logic or just close and go to settings
    if (sectionId === "basic") {
      setProfile({ full_name: "Arjun Mehta", location: "Bengaluru", headline: "Lead Full Stack Engineer" })
    }
  }

  if (!isOpen || !isClient) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0A2540]/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0A2540] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20"
      >
        {/* Top Progress Line */}
        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${total}%` }}
            className={cn("h-full transition-all duration-1000", total < 50 ? "bg-red-500" : total < 80 ? "bg-amber-500" : "bg-emerald-500")}
          />
        </div>

        {/* Header */}
        <div className="px-6 py-6 sm:px-10 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
               <svg className="w-full h-full -rotate-90 transform">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-white/5" />
                <motion.circle
                  initial={{ strokeDashoffset: 150 }}
                  animate={{ strokeDashoffset: 150 - (total / 100) * 150 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4"
                  strokeDasharray="150" fill="transparent" strokeLinecap="round"
                  className={colorClass}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-xs font-black", colorClass)}>{total}%</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0A2540] dark:text-white tracking-tight">Profile Strength</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{total < 80 ? "Complete your profile to unlock insights" : "Your profile is market-ready!"}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Section Breakdown (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resume Upload - Compact & Premium */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-saffron/10 text-saffron flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black dark:text-white">Smart Resume Scan</h4>
                      <p className="text-[10px] text-gray-400">Auto-fills Skills, Experience & Education</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full"
                      >
                        <CheckCircle2 className="w-3 h-3" /> RESUME UPLOADED
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <input ref={fileInputRef} onChange={handleFileUpload} type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={cn(
                      "w-full h-14 rounded-2xl border-2 border-dashed transition-all font-bold gap-3",
                      resumeUrl 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400" 
                        : "bg-white dark:bg-[#0A2540] border-gray-200 dark:border-white/10 hover:border-saffron hover:bg-orange-50 dark:hover:bg-saffron/10 text-gray-500"
                    )}
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-saffron" /> : <Upload className="w-5 h-5" />}
                    {isUploading ? "Analysing Resume..." : resumeUrl ? "Replace Resume" : "Upload Resume (PDF/DOC)"}
                  </Button>
                </div>
              </div>

              {/* Sections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sections.filter(s => s.id !== 'resume').map((section) => (
                  <div key={section.id} className="p-4 rounded-[1.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between group hover:border-saffron/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                        section.isComplete ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:bg-saffron/10 group-hover:text-saffron"
                      )}>
                        {section.isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-black dark:text-white uppercase tracking-tight">{section.label}</h5>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{section.isComplete ? "Completed" : "Action required"}</p>
                      </div>
                    </div>
                    {!section.isComplete && (
                      <button onClick={() => handleQuickAdd(section.id)} className="text-[10px] font-black text-saffron hover:underline underline-offset-4">ADD NOW</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dynamic Insights (1 col) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-saffron" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Smart Insights</h4>
              </div>

              {total >= 80 ? (
                <div className="flex flex-col gap-3">
                  {insights.map((insight, i) => (
                    <motion.a
                      key={i}
                      href={CAREER_PAGES[insight.company as keyof typeof CAREER_PAGES] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group/card block p-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-saffron/30 transition-all cursor-pointer overflow-hidden relative"
                    >
                      <div className="flex gap-3 items-start relative z-10">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", insight.color)}>
                          <insight.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-black text-saffron/80 uppercase tracking-widest">{insight.company}</span>
                            <ExternalLink className="w-3 h-3 text-gray-300 group-hover/card:text-saffron transition-colors" />
                          </div>
                          <p className="text-xs font-bold leading-snug dark:text-white group-hover/card:text-saffron transition-colors">{insight.text}</p>
                        </div>
                      </div>
                      {/* Interactive background shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-shimmer" />
                    </motion.a>
                  ))}
                  
                  <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-center">
                    <p className="text-[10px] text-gray-400 font-medium">Updated just now based on your resume</p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0A2540] shadow-xl flex items-center justify-center mb-4">
                    <Award className="w-7 h-7 text-gray-300" />
                  </div>
                  <h5 className="text-sm font-black dark:text-white">Unlock Career Insights</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    Upload your resume or finish your profile to see matching companies and market demand.
                  </p>
                   <Button 
                    variant="link" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-saffron font-black text-xs mt-4 uppercase tracking-wider"
                  >
                    Upload Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-gray-50 dark:bg-white/4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
           <button onClick={onClose} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#0A2540] transition-colors">
             Maybe later
           </button>
           <Button 
            className="bg-[#0A2540] hover:bg-saffron text-white rounded-2xl h-12 px-8 font-black gap-2 transition-all shadow-xl shadow-[#0A2540]/20"
            onClick={onClose}
          >
             Go to Explore <TrendingUp className="w-4 h-4" />
           </Button>
        </div>
      </motion.div>
    </div>
  )
}
