"use client"

import { useState } from "react"
import { Search, Bell, Plus, Command } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/dashboard/user-menu"
import { TaskModal } from "@/components/kanban/task-modal"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-[var(--muted-foreground)] text-sm hover:bg-[var(--muted)] transition-colors"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search anything…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] bg-[var(--background)] border border-[var(--border)] rounded px-1 py-0.5">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* New Task button */}
        <button
          onClick={() => setTaskModalOpen(true)}
          className="gradient-primary text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-violet-500/20 hover:opacity-90 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); router.prefetch("/notifications") }}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all"
          >
            <Bell className="w-4 h-4" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--primary)] border-2 border-[var(--background)]" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-10 z-20 w-80 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                    <span className="font-semibold text-sm text-[var(--foreground)]">Notifications</span>
                    <button className="text-xs text-[var(--primary)] hover:underline">Mark all read</button>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {[
                      { title: "Task assigned to you",   body: "Push notification integration assigned to you", time: "just now", unread: true  },
                      { title: "Comment on your task",   body: "Alex commented on Rate limiting",               time: "5m ago",   unread: true  },
                      { title: "Task completed",         body: "Homepage hero redesign completed 🎉",           time: "1h ago",   unread: false },
                    ].map((n, i) => (
                      <div key={i} className={`px-4 py-3 hover:bg-[var(--accent)] transition-colors cursor-pointer ${n.unread ? "bg-[var(--primary)]/5" : ""}`}>
                        <div className="flex items-start gap-2.5">
                          {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />}
                          <div className={n.unread ? "" : "pl-3.5"}>
                            <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
                            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{n.body}</p>
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-[var(--border)]">
                    <button
                      onClick={() => { setNotifOpen(false); router.push("/notifications") }}
                      className="w-full text-xs text-center text-[var(--primary)] hover:underline"
                    >
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <UserMenu />
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              className="fixed left-1/2 -translate-x-1/2 top-[15%] z-50 w-full max-w-xl px-4"
            >
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
                  <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <input
                    autoFocus
                    placeholder="Search tasks, projects, people…"
                    className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-sm focus:outline-none"
                    onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                  />
                  <kbd className="text-[10px] bg-[var(--muted)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--muted-foreground)]">ESC</kbd>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-[var(--muted-foreground)] font-medium mb-2 uppercase tracking-wider">Quick links</p>
                  {[
                    { label: "Tasks", href: "/tasks" },
                    { label: "Projects", href: "/projects" },
                    { label: "Teams", href: "/teams" },
                    { label: "Analytics", href: "/analytics" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      onClick={() => { router.push(item.href); setSearchOpen(false) }}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--accent)] cursor-pointer transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--foreground)]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global New Task modal */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        defaultStatus="TODO"
        projects={[]}
      />
    </header>
  )
}
