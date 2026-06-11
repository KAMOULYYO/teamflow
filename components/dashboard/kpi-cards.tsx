"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, TrendingUp, Users, ArrowUp } from "lucide-react"

interface Props {
  completed: number
  inProgress: number
  totalTasks: number
  activeMembers: number
}

export function KpiCards({ completed, inProgress, totalTasks, activeMembers }: Props) {
  const velocity = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0

  const kpis = [
    {
      label: "Tasks Completed",
      value: String(completed),
      change: "+12%",
      positive: true,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      label: "In Progress",
      value: String(inProgress),
      change: `${inProgress} active`,
      positive: true,
      icon: Clock,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      gradient: "from-violet-500/10 to-transparent",
    },
    {
      label: "Completion Rate",
      value: `${velocity}%`,
      change: "+5%",
      positive: true,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      gradient: "from-blue-500/10 to-transparent",
    },
    {
      label: "Team Members",
      value: String(activeMembers),
      change: `${totalTasks} tasks total`,
      positive: true,
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      gradient: "from-amber-500/10 to-transparent",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          whileHover={{ y: -2 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden group hover:border-[var(--ring)]/30 transition-all"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${kpi.gradient} rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform`} />

          <div className="relative">
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-4`}>
              <kpi.icon className={`${kpi.color}`} style={{ width: "18px", height: "18px" }} />
            </div>

            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.value}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{kpi.label}</p>
              </div>
              <div className="flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg text-emerald-600 bg-emerald-500/10">
                <ArrowUp className="w-3 h-3" />
                {kpi.change}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
