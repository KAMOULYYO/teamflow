"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface DataPoint {
  name: string
  value: number
  color: string
}

interface Props {
  data: DataPoint[]
  completionRate: number
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-2.5 shadow-lg text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
        <span className="text-[var(--foreground)] font-medium">{d.name}</span>
        <span className="text-[var(--muted-foreground)]">{d.value}</span>
      </div>
    </div>
  )
}

export function TaskOverview({ data, completionRate }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const visible = data.filter(d => d.value > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
    >
      <h3 className="font-semibold text-[var(--foreground)] mb-1">Task Breakdown</h3>
      <p className="text-xs text-[var(--muted-foreground)] mb-4">{total} total tasks</p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={visible.length ? visible : [{ name: "None", value: 1, color: "#6b7280" }]}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {(visible.length ? visible : [{ color: "#6b7280" }]).map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--foreground)]">{completionRate}%</p>
            <p className="text-[9px] text-[var(--muted-foreground)]">Done</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-[var(--muted-foreground)]">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-[var(--muted)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: total > 0 ? `${(d.value / total) * 100}%` : "0%" }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: d.color }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--foreground)] w-6 text-right">{d.value}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
