"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Calendar, BarChart3, Bell, Settings, Zap, ChevronLeft,
  ChevronRight, Plus, Hash
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const recentProjects = [
  { name: "Website Redesign", color: "#7c3aed" },
  { name: "Mobile App", color: "#2563eb" },
  { name: "API v2", color: "#059669" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--sidebar-border)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-sm text-[var(--sidebar-foreground)] whitespace-nowrap overflow-hidden"
              >
                TeamFlow <span className="text-gradient">Pro</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group relative",
                active
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--accent)]"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl"
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon className={cn("w-4 h-4 shrink-0 relative z-10", active ? "text-[var(--primary)]" : "")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}

        {/* Recent projects */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-4 pb-2"
          >
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Projects</span>
              <button className="w-5 h-5 rounded-md hover:bg-[var(--accent)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {recentProjects.map((p) => (
              <Link
                key={p.name}
                href="/projects"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all"
              >
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                <span className="truncate text-xs">{p.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[var(--sidebar-border)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--accent)] transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
