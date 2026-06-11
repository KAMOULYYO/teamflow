"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, AlertTriangle } from "lucide-react"
import { PRIORITY_COLORS, PRIORITY_LABELS, formatDueDate } from "@/lib/utils"

interface UpcomingTask {
  id: string
  title: string
  priority: string
  dueDate: Date | null
  project: { name: string } | null
}

interface Props {
  tasks: UpcomingTask[]
}

export function UpcomingTasks({ tasks }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">Upcoming Tasks</h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Due in the next 10 days</p>
        </div>
        <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No upcoming deadlines 🎉</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--accent)] transition-colors cursor-pointer group"
            >
              <div className={`w-1.5 h-8 rounded-full shrink-0 ${
                task.priority === "URGENT" ? "bg-red-500" :
                task.priority === "HIGH" ? "bg-orange-500" :
                task.priority === "MEDIUM" ? "bg-yellow-500" : "bg-blue-500"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{task.title}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{task.project?.name ?? "—"}</p>
              </div>
              <div className="text-right shrink-0">
                <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>
                  {task.priority === "URGENT" && <AlertTriangle className="w-2.5 h-2.5" />}
                  {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--muted-foreground)]">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDueDate(task.dueDate)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
