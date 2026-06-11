export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { CalendarView } from "@/components/calendar/calendar-view"

export default async function CalendarPage() {
  const tasks = await prisma.task.findMany({
    where: { dueDate: { not: null } },
    orderBy: { dueDate: "asc" },
    include: { project: { select: { name: true, color: true } } },
    take: 100,
  })

  const events = tasks.map(t => ({
    id: t.id,
    title: t.title,
    dueDate: t.dueDate!.toISOString(),
    priority: t.priority,
    status: t.status,
    project: t.project?.name ?? null,
    color: t.project?.color ?? "#7c3aed",
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Calendar</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">View tasks and deadlines at a glance</p>
      </div>
      <CalendarView events={events} />
    </div>
  )
}
