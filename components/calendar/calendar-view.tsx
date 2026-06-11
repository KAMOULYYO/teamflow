"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface CalEvent {
  id: string
  title: string
  dueDate: string
  priority: string
  status: string
  project: string | null
  color: string
}

interface Props {
  events: CalEvent[]
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

const PRIORITY_DOT: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH:   "bg-orange-500",
  MEDIUM: "bg-yellow-500",
  LOW:    "bg-blue-500",
}

export function CalendarView({ events }: Props) {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => setCurrent(new Date(year, month - 1, 1))
  const next = () => setCurrent(new Date(year, month + 1, 1))

  const eventsForDay = (day: number) => {
    const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter(e => e.dueDate.startsWith(d))
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const selectedEvents = selected ? events.filter(e => e.dueDate.startsWith(selected)) : []

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar grid */}
      <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prev} className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))} className="px-3 py-1.5 text-xs font-medium rounded-xl text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors">
              Today
            </button>
            <button onClick={next} className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-[var(--muted-foreground)] py-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const dayEvents = eventsForDay(day)
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isSelected = selected === dateStr
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(isSelected ? null : dateStr)}
                className={`relative min-h-[52px] p-1 rounded-xl text-left transition-all ${
                  isToday(day)
                    ? "bg-[var(--primary)] text-white"
                    : isSelected
                    ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30"
                    : "hover:bg-[var(--accent)] border border-transparent"
                }`}
              >
                <span className={`text-xs font-semibold block mb-1 ${isToday(day) ? "text-white" : "text-[var(--foreground)]"}`}>
                  {day}
                </span>
                <div className="flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 3).map(e => (
                    <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[e.priority] ?? "bg-slate-400"}`} />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className={`text-[8px] font-bold ${isToday(day) ? "text-white/80" : "text-[var(--muted-foreground)]"}`}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Side panel */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
        {selected && selectedEvents.length > 0 ? (
          <>
            <h3 className="font-semibold text-[var(--foreground)] mb-1">
              {new Date(selected + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">{selectedEvents.length} task{selectedEvents.length > 1 ? "s" : ""} due</p>
            <div className="space-y-3">
              {selectedEvents.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[var(--muted)]/50 hover:bg-[var(--accent)] transition-colors"
                >
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: e.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{e.title}</p>
                    {e.project && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{e.project}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                        e.priority === "URGENT" ? "text-red-500 bg-red-500/10" :
                        e.priority === "HIGH"   ? "text-orange-500 bg-orange-500/10" :
                        e.priority === "MEDIUM" ? "text-yellow-500 bg-yellow-500/10" :
                        "text-blue-500 bg-blue-500/10"
                      }`}>{e.priority}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        e.status === "DONE"        ? "text-emerald-500 bg-emerald-500/10" :
                        e.status === "IN_PROGRESS" ? "text-violet-500 bg-violet-500/10" :
                        e.status === "REVIEW"      ? "text-amber-500 bg-amber-500/10" :
                        "text-slate-500 bg-slate-500/10"
                      }`}>{e.status.replace("_", " ")}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {selected ? "No tasks due" : "Select a day"}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {selected ? "Nothing scheduled for this date" : "Click a date to see its tasks"}
            </p>
          </div>
        )}

        {/* Upcoming list */}
        {!selected && (
          <>
            <h3 className="font-semibold text-[var(--foreground)] mb-3">Upcoming deadlines</h3>
            <div className="space-y-2">
              {events.slice(0, 7).map((e, i) => (
                <div key={e.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--accent)] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--foreground)] truncate">{e.title}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">
                      {new Date(e.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[e.priority]}`} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
