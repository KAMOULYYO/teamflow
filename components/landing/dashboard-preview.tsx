"use client"

import { motion } from "framer-motion"
import { BarChart2, CheckCircle2, Clock, MoreHorizontal, Zap } from "lucide-react"

const tasks = [
  { title: "Design system update", status: "IN_PROGRESS", priority: "HIGH", assignee: "JD", progress: 65 },
  { title: "API integration", status: "REVIEW", priority: "URGENT", assignee: "SK", progress: 90 },
  { title: "Mobile onboarding", status: "TODO", priority: "MEDIUM", assignee: "AL", progress: 20 },
  { title: "Performance audit", status: "COMPLETED", priority: "LOW", assignee: "MR", progress: 100 },
]

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-500/20 text-red-400",
  HIGH: "bg-orange-500/20 text-orange-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  LOW: "bg-blue-500/20 text-blue-400",
}

const statusColors: Record<string, string> = {
  IN_PROGRESS: "bg-violet-500/20 text-violet-400",
  REVIEW: "bg-amber-500/20 text-amber-400",
  TODO: "bg-slate-500/20 text-slate-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
}

const avatarColors = ["from-violet-500 to-purple-600", "from-blue-500 to-cyan-500", "from-pink-500 to-rose-500", "from-amber-500 to-orange-500"]

export function DashboardPreview() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/30">
      {/* Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-blue-600/30 rounded-3xl blur-xl" />

      <div className="relative glass-dark rounded-2xl border border-white/10 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/3">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <div className="flex-1 mx-4">
            <div className="bg-white/5 rounded-md h-5 flex items-center justify-center">
              <span className="text-white/30 text-[10px]">app.teamflowpro.com/dashboard</span>
            </div>
          </div>
          <Zap className="w-3.5 h-3.5 text-violet-400" />
        </div>

        {/* App chrome */}
        <div className="flex h-[360px]">
          {/* Sidebar */}
          <div className="w-14 bg-white/3 border-r border-white/5 flex flex-col items-center py-4 gap-3">
            <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {["■", "◉", "◈", "◆", "▲"].map((icon, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] transition-colors ${
                    i === 0 ? "bg-violet-500/20 text-violet-400" : "text-white/20 hover:text-white/40"
                  }`}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
              <div>
                <div className="text-white text-xs font-semibold">Sprint 14</div>
                <div className="text-white/30 text-[9px]">4 tasks · Due in 3 days</div>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-white/30" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">JD</div>
              </div>
            </div>

            {/* Task list */}
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {tasks.map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="bg-white/3 hover:bg-white/5 border border-white/5 rounded-xl p-2.5 group cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {task.status === "COMPLETED" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-3 h-3 text-white/30 shrink-0" />
                      )}
                      <span className={`text-[11px] font-medium truncate ${task.status === "COMPLETED" ? "text-white/40 line-through" : "text-white/80"}`}>
                        {task.title}
                      </span>
                    </div>
                    <MoreHorizontal className="w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${statusColors[task.status]}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                          className={`h-full rounded-full ${task.progress === 100 ? "bg-emerald-400" : "bg-violet-500"}`}
                        />
                      </div>
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center text-[7px] font-bold text-white`}>
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
