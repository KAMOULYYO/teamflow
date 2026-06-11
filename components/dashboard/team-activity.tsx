"use client"

import { motion } from "framer-motion"
import { CheckCircle2, MessageSquare, UserPlus, ArrowRight, Zap } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

interface Activity {
  id: string
  action: string
  userId: string
  createdAt: Date
  metadata: string | null
  user: { name: string | null }
}

interface Props {
  activities: Activity[]
}

const avatarColors = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
]

function actionMeta(activity: Activity) {
  const meta = activity.metadata ? JSON.parse(activity.metadata) : {}
  switch (activity.action) {
    case "task.completed":
      return { Icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", verb: "completed", target: meta.taskTitle ?? "a task" }
    case "comment.created":
      return { Icon: MessageSquare, color: "text-blue-500 bg-blue-500/10", verb: "commented on", target: meta.taskTitle ?? "a task" }
    case "member.joined":
      return { Icon: UserPlus, color: "text-amber-500 bg-amber-500/10", verb: "joined", target: meta.teamName ?? "a team" }
    case "task.moved":
      return { Icon: ArrowRight, color: "text-violet-500 bg-violet-500/10", verb: "moved task", target: `${meta.from ?? ""} → ${meta.to ?? ""}` }
    case "task.created":
      return { Icon: Zap, color: "text-pink-500 bg-pink-500/10", verb: "created", target: meta.taskTitle ?? "a task" }
    case "project.created":
      return { Icon: Zap, color: "text-indigo-500 bg-indigo-500/10", verb: "created project", target: meta.projectName ?? "a project" }
    default:
      return { Icon: Zap, color: "text-slate-500 bg-slate-500/10", verb: activity.action, target: "" }
  }
}

export function TeamActivity({ activities }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">Team Activity</h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Live team updates</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((act, i) => {
            const { Icon, color, verb, target } = actionMeta(act)
            const initials = (act.user.name ?? "?").split(" ").map(n => n[0]).join("").slice(0, 2)
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--foreground)] leading-relaxed">
                    <span className="font-medium">{act.user.name}</span>{" "}
                    <span className="text-[var(--muted-foreground)]">{verb}</span>{" "}
                    <span className="font-medium">{target}</span>
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{formatRelativeTime(new Date(act.createdAt))}</p>
                </div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-3 h-3" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
