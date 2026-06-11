"use client"

import { motion } from "framer-motion"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

const data = [
  { day: "Mon", completed: 12, created: 18, inProgress: 8 },
  { day: "Tue", completed: 19, created: 14, inProgress: 11 },
  { day: "Wed", completed: 15, created: 22, inProgress: 14 },
  { day: "Thu", completed: 25, created: 19, inProgress: 10 },
  { day: "Fri", completed: 22, created: 16, inProgress: 13 },
  { day: "Sat", completed: 8, created: 5, inProgress: 4 },
  { day: "Sun", completed: 6, created: 4, inProgress: 3 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-lg">
      <p className="text-xs font-semibold text-[var(--foreground)] mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span>{p.name}: <span className="font-medium text-[var(--foreground)]">{p.value}</span></span>
        </div>
      ))}
    </div>
  )
}

export function WeeklyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">Weekly Performance</h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Task activity this week</p>
        </div>
        <div className="flex gap-1">
          {["W", "M", "Q"].map((p, i) => (
            <button
              key={p}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                i === 0
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="completed" name="Completed" stroke="#7c3aed" strokeWidth={2} fill="url(#colorCompleted)" dot={false} activeDot={{ r: 4, fill: "#7c3aed" }} />
          <Area type="monotone" dataKey="created" name="Created" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCreated)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
