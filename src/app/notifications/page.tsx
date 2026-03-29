"use client"

import { motion } from "framer-motion"
import { Bell, Briefcase, Building2, MapPin, CheckCheck } from "lucide-react"
import { useState } from "react"
import { formatRelativeDate } from "@/lib/utils"

const mockNotifications = [
  { id: "n1", title: "5 new jobs at Razorpay", body: "Senior Backend Engineer, Product Manager, and 3 more roles just posted in HSR Layout.", url: "/companies/razorpay", is_read: false, created_at: new Date(Date.now() - 30 * 60000).toISOString(), icon: "🏢" },
  { id: "n2", title: "New jobs near HSR Layout", body: "12 new positions added in your watched area this week.", url: "/explore", is_read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString(), icon: "📍" },
  { id: "n3", title: "Zepto is hiring a Head of Engineering", body: "A senior role matching your alert 'Head of Engineering Bengaluru' was just posted.", url: "/companies/zepto", is_read: false, created_at: new Date(Date.now() - 5 * 3600000).toISOString(), icon: "⚡" },
  { id: "n4", title: "Meesho added 8 new roles", body: "DevOps, Mobile, and Data science positions in Koramangala.", url: "/companies/meesho", is_read: true, created_at: new Date(Date.now() - 86400000).toISOString(), icon: "💼" },
  { id: "n5", title: "Freshworks job alert", body: "Senior Product Designer matching 'design lead Chennai' was posted.", url: "/companies/freshworks", is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), icon: "🎨" },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-4xl tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="text-saffron font-semibold">{unreadCount} unread</span> notifications
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-saffron transition-colors">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </motion.div>

      {/* Notification list */}
      <div className="space-y-2">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => markRead(notif.id)}
            className={`
              glass border rounded-2xl px-5 py-4 cursor-pointer transition-all
              ${notif.is_read
                ? "border-white/6 opacity-60 hover:opacity-80"
                : "border-saffron/20 hover:border-saffron/35"
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="text-xl leading-none mt-0.5 shrink-0">{notif.icon}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold text-sm ${notif.is_read ? "text-foreground/70" : "text-foreground"}`}>
                    {notif.title}
                  </p>
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-saffron shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.body}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  {formatRelativeDate(notif.created_at)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No notifications yet.</p>
          <p className="text-xs mt-1">Follow companies or set alerts to get notified.</p>
        </div>
      )}

      {/* Push notification CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 glass border border-white/8 rounded-2xl p-5 flex items-center justify-between gap-4"
      >
        <div>
          <p className="font-semibold text-sm mb-0.5">Enable Push Notifications</p>
          <p className="text-xs text-muted-foreground">Get instant alerts when new jobs match your saved searches.</p>
        </div>
        <button className="shrink-0 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold hover:bg-saffron/90 transition-colors">
          Enable
        </button>
      </motion.div>
    </div>
  )
}
