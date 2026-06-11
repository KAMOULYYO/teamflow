"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, MoreHorizontal, CheckCircle2, Calendar, FolderKanban, X } from "lucide-react"
import { useState, useTransition } from "react"
import { createProject } from "@/app/actions/projects"
import toast from "react-hot-toast"

interface Project {
  id: string
  name: string
  description: string | null
  color: string
  status: string
  taskCount: number
  members: number
  due: string | null
  team: string
}

interface Team {
  id: string
  name: string
}

interface Props {
  projects: Project[]
  teams: Team[]
}

const COLORS = ["#6366f1","#7c3aed","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"]

export function ProjectsGrid({ projects, teams }: Props) {
  const [filter, setFilter] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [isPending, startTransition] = useTransition()

  const filtered = projects.filter(p => {
    if (filter === "All") return true
    if (filter === "Active") return p.status === "ACTIVE"
    if (filter === "Completed") return p.status === "COMPLETED"
    return true
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("color", color)
    startTransition(async () => {
      const res = await createProject(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success("Project created!")
      setModalOpen(false)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["All", "Active", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${filter === f ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-violet-500/20 hover:opacity-90 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--ring)]/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: project.color }} />
            <div className="flex items-start justify-between mb-4 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: project.color }}>
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{project.name}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${project.status === "COMPLETED" ? "text-emerald-500 bg-emerald-500/10" : "text-violet-500 bg-violet-500/10"}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:bg-[var(--accent)] transition-all">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-4 line-clamp-2">{project.description}</p>
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[var(--muted-foreground)]">{project.team}</span>
                <span className="font-semibold text-[var(--foreground)]">{project.taskCount} tasks</span>
              </div>
              <div className="h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: project.status === "COMPLETED" ? "100%" : "60%" }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.07 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: project.color }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {project.taskCount} tasks
              </div>
              {project.due && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.due}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filtered.length * 0.07 }}
          onClick={() => setModalOpen(true)}
          className="bg-[var(--muted)]/30 border-2 border-dashed border-[var(--border)] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all group min-h-[180px]"
        >
          <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[var(--border)] group-hover:border-[var(--primary)] flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
          </div>
          <span className="text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">New Project</span>
        </motion.button>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            >
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="text-base font-bold text-[var(--foreground)]">New Project</h2>
                  <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Project name *</label>
                    <input
                      name="name" required autoFocus
                      placeholder="e.g. Marketing Campaign"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Description</label>
                    <textarea
                      name="description" rows={2}
                      placeholder="What is this project about?"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">Team *</label>
                    <select
                      name="teamId" required
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-all"
                    >
                      <option value="">Select a team…</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button
                          type="button" key={c}
                          onClick={() => setColor(c)}
                          className={`w-7 h-7 rounded-lg transition-all ${color === c ? "ring-2 ring-offset-2 ring-offset-[var(--card)] ring-white scale-110" : "hover:scale-105"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isPending} className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                      {isPending ? "Creating…" : "Create Project"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
