"use client"

import { motion } from "framer-motion"
import { Bell, CheckCircle2, MessageSquare, UserPlus, FolderKanban, AtSign } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

interface Notif {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
}

interface Props {
  notifications: Notif[]
}

const TYPE_ICON: Record<string, { Icon: any; color: string }> = {
  TASK_ASSIGNED:  { Icon: FolderKanban,  color: "text-violet-500 bg-violet-500/10" },
  COMMENT_ADDED:  { Icon: MessageSquare, color: "text-blue-500 bg-blue-500/10"    },
  TASK_COMPLETED: { Icon: CheckCircle2,  color: "text-emerald-500 bg-emerald-500/10" },
  TEAM_INVITE:    { Icon: UserPlus,      color: "text-amber-500 bg-amber-500/10"   },
  PROJECT_UPDATE: { Icon: FolderKanban,  color: "text-pink-500 bg-pink-500/10"     },
  MENTION:        { Icon: AtSign,        color: "text-indigo-500 bg-indigo-500/10" },
}

export function NotificationsContent({ notifications }: Props) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-4">
          <Bell className="w-6 h-6 text-[var(--muted-foreground)]" />
        </div>
        <p className="text-sm font-medium text-[var(--foreground)]">All caught up!</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {notifications.map((n, i) => {
        const meta = TYPE_ICON[n.type] ?? { Icon: Bell, color: "text-slate-500 bg-slate-500/10" }
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:border-[var(--ring)]/30 ${
              n.read
                ? "bg-[var(--card)] border-[var(--border)]"
                : "bg-[var(--primary)]/5 border-[var(--primary)]/20"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
              <meta.Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">{n.title}</p>
                {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{n.message}</p>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5">{formatRelativeTime(new Date(n.createdAt))}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
