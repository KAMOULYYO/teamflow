export const dynamic = "force-dynamic"

import { KanbanBoard } from "@/components/kanban/kanban-board"
import { getTasksByStatus, getProjects } from "@/lib/data"
import { format } from "date-fns"

export default async function TasksPage() {
  const [grouped, projects] = await Promise.all([
    getTasksByStatus(),
    getProjects(),
  ])

  const serialized: Record<string, any[]> = {}
  for (const [status, tasks] of Object.entries(grouped)) {
    serialized[status] = tasks.map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      assignee: t.assignee?.name
        ? t.assignee.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
        : undefined,
      labels: t.labels ? JSON.parse(t.labels as string) : [],
      dueDate: t.dueDate ? format(new Date(t.dueDate), "MMM d") : undefined,
      progress: t.status === "DONE" ? 100 : t.status === "REVIEW" ? 80 : t.status === "IN_PROGRESS" ? 50 : undefined,
      description: t.description ?? undefined,
    }))
  }

  const projectList = projects.map(p => ({ id: p.id, name: p.name }))

  return (
    <div className="flex flex-col h-full space-y-4 max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Tasks</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Drag and drop to manage your workflow</p>
        </div>
      </div>
      <KanbanBoard initialTasks={serialized} projects={projectList} />
    </div>
  )
}
