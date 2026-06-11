"use client"

import { useRef, useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { createTask } from "@/app/actions/tasks"
import toast from "react-hot-toast"

interface Props {
  open: boolean
  onClose: () => void
  defaultStatus?: string
  projects: { id: string; name: string }[]
}

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"]
const STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BACKLOG"]

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  MEDIUM: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  HIGH: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  URGENT: "text-red-500 bg-red-500/10 border-red-500/20",
}

export function TaskModal({ open, onClose, defaultStatus = "TODO", projects }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [priority, setPriority] = useState("MEDIUM")
  const [status, setStatus] = useState(defaultStatus)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    const data = new FormData(formRef.current)
    data.set("priority", priority)
    data.set("status", status)
    startTransition(async () => {
      const result = await createTask(data)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Task created!")
        formRef.current?.reset()
        onClose()
      }
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--foreground)]">New Task</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Title *</label>
                  <input
                    name="title"
                    required
                    autoFocus
                    placeholder="What needs to be done?"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Add more details…"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
                  />
                </div>

                {/* Priority + Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Priority</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRIORITIES.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                            priority === p ? PRIORITY_STYLES[p] : "text-[var(--muted-foreground)] bg-transparent border-[var(--border)] hover:bg-[var(--accent)]"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-all"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project + Due date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Project</label>
                    <select
                      name="projectId"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-all"
                    >
                      <option value="">No project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Due date</label>
                    <input
                      name="dueDate"
                      type="date"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-all"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isPending ? "Creating…" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
