"use client"

import { motion } from "framer-motion"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts"
import { TrendingUp, TrendingDown, Users, CheckCircle2, Clock, Zap } from "lucide-react"

const monthlyData = [
  { month: "Jan", completed: 45, delayed: 8, velocity: 72 },
  { month: "Feb", completed: 52, delayed: 6, velocity: 78 },
  { month: "Mar", completed: 61, delayed: 9, velocity: 74 },
  { month: "Apr", completed: 58, delayed: 5, velocity: 82 },
  { month: "May", completed: 74, delayed: 4, velocity: 88 },
  { month: "Jun", completed: 89, delayed: 3, velocity: 94 },
]

const teamData = [
  { member: "Sarah K.", completed: 34, inProgress: 5, overdue: 1 },
  { member: "James C.", completed: 28, inProgress: 7, overdue: 0 },
  { member: "Priya N.", completed: 41, inProgress: 3, overdue: 2 },
  { member: "Marcus R.", completed: 22, inProgress: 8, overdue: 3 },
  { member: "Elena V.", completed: 38, inProgress: 4, overdue: 0 },
]

const radarData = [
  { metric: "Velocity", value: 88 },
  { metric: "Quality", value: 92 },
  { metric: "Delivery", value: 78 },
  { metric: "Collab", value: 95 },
  { metric: "Planning", value: 83 },
  { metric: "Focus", value: 71 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-[var(--foreground)] mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-[var(--foreground)]">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const kpis = [
  { label: "Total Completed", value: "379", change: "+23%", icon: CheckCircle2, positive: true, color: "text-emerald-500 bg-emerald-500/10" },
  { label: "Avg Velocity", value: "81%", change: "+8%", icon: Zap, positive: true, color: "text-violet-500 bg-violet-500/10" },
  { label: "Overdue Tasks", value: "6", change: "-40%", icon: Clock, positive: true, color: "text-red-500 bg-red-500/10" },
  { label: "Active Members", value: "24", change: "+2", icon: Users, positive: true, color: "text-blue-500 bg-blue-500/10" },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${kpi.positive ? "text-emerald-600 bg-emerald-500/10" : "text-red-500 bg-red-500/10"}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
        >
          <div className="mb-5">
            <h3 className="font-semibold text-[var(--foreground)]">Monthly Performance</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Completed vs delayed tasks</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" name="Completed" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              <Bar dataKey="delayed" name="Delayed" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
        >
          <div className="mb-5">
            <h3 className="font-semibold text-[var(--foreground)]">Team Health</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Overall performance metrics</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Velocity trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Sprint Velocity Trend</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Team velocity over the last 6 months</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            +22% YTD
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[60, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="velocity" name="Velocity %" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Team leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
      >
        <h3 className="font-semibold text-[var(--foreground)] mb-5">Team Productivity</h3>
        <div className="space-y-4">
          {teamData.map((member, i) => {
            const total = member.completed + member.inProgress + member.overdue
            return (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${["from-violet-500 to-purple-600","from-blue-500 to-cyan-500","from-pink-500 to-rose-500","from-amber-500 to-orange-500","from-emerald-500 to-teal-500"][i]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {member.member.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--foreground)]">{member.member}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">{member.completed} done</span>
                  </div>
                  <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(member.completed / total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                      className="bg-emerald-500 rounded-full"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(member.inProgress / total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                      className="bg-violet-500 rounded-full"
                    />
                    {member.overdue > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(member.overdue / total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                        className="bg-red-500 rounded-full"
                      />
                    )}
                    <div className="flex-1 bg-[var(--muted)] rounded-full" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
