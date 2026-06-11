export const dynamic = "force-dynamic"

import { ProjectsGrid } from "@/components/projects/projects-grid"
import { getProjects } from "@/lib/data"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

export default async function ProjectsPage() {
  const [projects, teams] = await Promise.all([
    getProjects(),
    prisma.team.findMany({ select: { id: true, name: true } }),
  ])

  const serialized = projects.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    color: p.color ?? "#7c3aed",
    status: p.status,
    taskCount: p._count.tasks,
    members: 0,
    due: p.endDate ? format(new Date(p.endDate), "MMM d") : null,
    team: p.team?.name ?? "",
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Projects</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Manage all your team projects</p>
      </div>
      <ProjectsGrid projects={serialized} teams={teams} />
    </div>
  )
}
