"use client"

import { motion } from "framer-motion"
import { Calendar, AlertTriangle, MessageSquare, Paperclip } from "lucide-react"
import { PRIORITY_COLORS } from "@/lib/utils"
import type { Task } from "@/components/kanban/types"

const avatarColors: Record<string, string> = {
  JD: "from-violet-500 to-purple-600",
  SK: "from-blue-500 to-cyan-500",
  AL: "from-pink-500 to-rose-500",
  MR: "from-amber-500 to-orange-500",
  TC: "from-emerald-500 to-teal-500",
}

const labelColors: Record<string, string> = {
  docs: "bg-blue-500/15 text-blue-400",
  devops: "bg-orange-500/15 text-orange-400",
  research: "bg-purple-500/15 text-purple-400",
  design: "bg-pink-500/15 text-pink-400",
  eng: "bg-violet-500/15 text-violet-400",
  backend: "bg-indigo-500/15 text-indigo-400",
  content: "bg-emerald-500/15 text-emerald-400",
}

interface KanbanCardProps {
  task: Task
  isDragging: boolean
}

export function KanbanCard({ task, isDragging }: KanbanCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group bg-[var(--card)] border rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? "border-[var(--primary)]/50 shadow-xl shadow-[var(--primary)]/20 rotate-1 scale-105"
          : "border-[var(--border)] hover:border-[var(--border)] hover:shadow-md"
      }`}
    >
      {/* Priority indicator */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority === "URGENT" && <AlertTriangle className="w-2.5 h-2.5" />}
          {task.priority}
        </span>
        {task.labels && task.labels.length > 0 && (
          <div className="flex gap-1">
            {task.labels.slice(0, 2).map((label) => (
              <span key={label} className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${labelColors[label] || "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[var(--foreground)] mb-3 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
        {task.title}
      </p>

      {/* Progress bar */}
      {task.progress !== undefined && task.progress < 100 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
              <Calendar className="w-2.5 h-2.5" />
              {task.dueDate}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-[10px] text-[var(--muted-foreground)]">
            <MessageSquare className="w-2.5 h-2.5" />
            <span>3</span>
          </div>
          {task.assignee && (
            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarColors[task.assignee] || "from-gray-500 to-gray-600"} flex items-center justify-center text-white text-[8px] font-bold`}>
              {task.assignee}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
