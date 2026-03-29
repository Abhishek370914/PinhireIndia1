"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { MessageCircle, X, Send, User, Bot, Briefcase, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- Ghost Mascot Component ---
const GhostMascot = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(79,209,255,0.4)]">
    <defs>
      <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="80%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="eyeGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Ghost Body */}
    <path 
      d="M25,40 C25,20 50,20 75,40 L75,80 C75,90 65,100 50,100 C35,100 25,90 25,80 Z" 
      fill="url(#ghostGrad)" 
      className="opacity-95"
    />
    
    {/* Glowing Eyes */}
    <g filter="url(#eyeGlow)">
      <circle cx="40" cy="45" r="4" fill="#4FD1FF" />
      <circle cx="60" cy="45" r="4" fill="#4FD1FF" />
    </g>
    
    {/* Headset */}
    <path 
      d="M30,45 Q30,25 50,25 Q70,25 70,45" 
      fill="none" 
      stroke="#1E293B" 
      strokeWidth="2.5" 
    />
    <rect x="25" y="42" width="6" height="10" rx="2" fill="#1E293B" />
    <rect x="69" y="42" width="6" height="10" rx="2" fill="#1E293B" />
    <path d="M28,52 L35,60" stroke="#1E293B" strokeWidth="1.5" />

    {/* Paper Sheet */}
    <motion.path 
      d="M65,70 L85,70 L85,90 L65,90 Z" 
      fill="#F8FAFC" 
      stroke="#CBD5E1" 
      strokeWidth="0.5"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </svg>
)

export default function GhostAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey there! 👋 How was your day? Welcome to PinHire India! How can I help you explore the best job opportunities today?" }
  ])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg = { role: "user", content: input }
    setMessages(prev => [...prev, newMsg])
    setInput("")

    // Mock Response Logic
    setTimeout(() => {
      let response = "That's interesting! You can explore all our job listings by clicking the 'Find Jobs' button. Want me to filter by a specific city?"
      if (input.toLowerCase().includes("bengaluru") || input.toLowerCase().includes("bangalore")) {
        response = "Bengaluru is buzzing! We have 1,200+ roles in HSR, Koramangala, and Whitefield right now. 🚀"
      } else if (input.toLowerCase().includes("company") || input.toLowerCase().includes("companies")) {
        response = "We have over 500+ top Indian companies like Infosys, Wipro, and high-growth startups on the map! 🏢"
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }])
    }, 1000)
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Ghost Container */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            layoutId="ghost-mascot"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0],
              rotate: [0, 2, -2, 0]
            }}
            whileHover={{ 
              scale: 1.15, 
              filter: "brightness(1.1) drop-shadow(0 0 20px rgba(79,209,255,0.6))",
            }}
            whileTap={{ scale: 0.95 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              default: { duration: 0.3 }
            }}
            onClick={() => setIsOpen(true)}
            className="w-24 h-24 flex items-center justify-center cursor-pointer relative group transition-all duration-300 z-[110]"
            title="Click to chat!"
          >
            <div className="w-20 h-24 relative z-10">
              <GhostMascot />
            </div>
            {/* Pulsing Aura */}
            <motion.div 
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-blue-400/30 rounded-full blur-3xl -z-10" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="w-[380px] h-[540px] bg-[#0A1120] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col mb-4 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl p-1">
                  <GhostMascot />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Ghost Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Online</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    m.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5",
                    m.role === "assistant" ? "bg-saffron/20" : "bg-blue-500/20"
                  )}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4 text-saffron" /> : <User className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    m.role === "assistant" 
                      ? "bg-white/5 text-gray-200 rounded-tl-none" 
                      : "bg-blue-600/90 text-white rounded-tr-none ml-auto"
                  )}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2 bg-white/5 rounded-2xl p-2 border border-white/5 focus-within:border-saffron/50 transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about jobs, companies..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-gray-500 px-2"
                />
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  className="bg-saffron hover:bg-saffron/90 text-white rounded-xl h-9 w-9"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
