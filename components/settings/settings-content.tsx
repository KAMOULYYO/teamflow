"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { User, Bell, Shield, CreditCard, Palette, ChevronRight, Check, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import toast from "react-hot-toast"

interface Props {
  user: { name: string; email: string; image: string | null }
}

export function SettingsContent({ user }: Props) {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [name, setName] = useState(user.name)
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = () => {
    setSaved(true)
    toast.success("Profile saved!")
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { icon: User,       label: "Profile",       description: "Your name, email and avatar" },
    { icon: Bell,       label: "Notifications",  description: "Choose what you hear about" },
    { icon: Palette,    label: "Appearance",     description: "Theme and display options" },
    { icon: Shield,     label: "Security",       description: "Password, 2FA, and sessions" },
    { icon: CreditCard, label: "Billing",        description: "Plans, payments and invoices" },
  ]

  return (
    <div className="space-y-3">
      {sections.map((section, i) => (
        <motion.div key={section.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <button
            onClick={() => setActiveSection(activeSection === section.label ? null : section.label)}
            className={`w-full group flex items-center gap-4 p-4 bg-[var(--card)] border rounded-2xl hover:border-[var(--ring)]/30 cursor-pointer transition-all text-left ${
              activeSection === section.label ? "border-[var(--primary)]/30 bg-[var(--primary)]/5" : "border-[var(--border)]"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              activeSection === section.label ? "bg-[var(--primary)]/20" : "bg-[var(--muted)] group-hover:bg-[var(--primary)]/10"
            }`}>
              <section.icon className={`w-[18px] h-[18px] transition-colors ${
                activeSection === section.label ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">{section.label}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{section.description}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${activeSection === section.label ? "rotate-90" : ""}`} />
          </button>

          {/* Expanded panels */}
          <motion.div
            initial={false}
            animate={{ height: activeSection === section.label ? "auto" : 0, opacity: activeSection === section.label ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--card)] border border-t-0 border-[var(--primary)]/20 rounded-b-2xl p-5 space-y-4">
              {section.label === "Profile" && (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
                      <button className="text-xs text-[var(--primary)] mt-1 hover:underline">Change avatar</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Display name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Email</label>
                    <input
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--muted-foreground)] cursor-not-allowed"
                    />
                  </div>
                  <button onClick={handleSaveProfile} className="flex items-center gap-2 gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
                    {saved ? <Check className="w-4 h-4" /> : null}
                    {saved ? "Saved!" : "Save changes"}
                  </button>
                </>
              )}

              {section.label === "Appearance" && (
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-3">Theme</p>
                  <div className="flex gap-3">
                    {([["light", Sun, "Light"], ["dark", Moon, "Dark"]] as const).map(([t, Icon, label]) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          theme === t ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--ring)]/30"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${theme === t ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`} />
                        <span className={`text-xs font-medium ${theme === t ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {section.label === "Notifications" && (
                <div className="space-y-3">
                  {[
                    { label: "Task assignments", desc: "When a task is assigned to you" },
                    { label: "Comments",          desc: "When someone comments on your tasks" },
                    { label: "Mentions",           desc: "When you're @mentioned" },
                    { label: "Project updates",    desc: "Status changes in your projects" },
                  ].map((item, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--foreground)]">{item.label}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p>
                      </div>
                      <div className="w-10 h-5 bg-[var(--primary)] rounded-full relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.label === "Security" && (
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] transition-colors text-left">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">Change password</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Update your password</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] transition-colors text-left">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">Two-factor authentication</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Add an extra layer of security</p>
                    </div>
                    <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg font-medium">Off</span>
                  </button>
                </div>
              )}

              {section.label === "Billing" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-[var(--foreground)]">Pro Plan</p>
                      <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-lg">Active</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">$12/month · Renews July 10, 2026</p>
                  </div>
                  <button className="w-full p-3 rounded-xl border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
                    View invoices
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
