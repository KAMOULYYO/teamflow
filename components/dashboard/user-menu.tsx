"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { LogOut, Settings, User, ChevronDown } from "lucide-react"
import { getInitials } from "@/lib/utils"
import Link from "next/link"

export function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const name = session?.user?.name || "User"
  const email = session?.user?.email || ""

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--accent)] transition-all group"
      >
        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
          {getInitials(name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-medium text-[var(--foreground)] leading-none">{name}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 z-20 w-56 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl shadow-black/10 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--foreground)]">{name}</p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">{email}</p>
              </div>
              <div className="py-1">
                <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
                  <User className="w-3.5 h-3.5 text-[var(--muted-foreground)]" /> Profile
                </Link>
                <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
                  <Settings className="w-3.5 h-3.5 text-[var(--muted-foreground)]" /> Settings
                </Link>
              </div>
              <div className="border-t border-[var(--border)] py-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
