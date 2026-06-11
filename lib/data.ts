import { prisma } from "./prisma"
import { addDays } from "date-fns"

export async function getDashboardStats() {
  const [totalTasks, inProgress, completed, activeMembers, recentActivity, upcomingTasks, tasksByStatus] =
    await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { status: "COMPLETED" } }),
      prisma.user.count(),
      prisma.activityLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),
      prisma.task.findMany({
        where: {
          status: { not: "COMPLETED" },
          dueDate: { not: null, lte: addDays(new Date(), 10) },
        },
        orderBy: { dueDate: "asc" },
        take: 6,
        include: { project: { select: { name: true } } },
      }),
      prisma.task.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ])

  return { totalTasks, inProgress, completed, activeMembers, recentActivity, upcomingTasks, tasksByStatus }
}

export async function getTasksByStatus() {
  const tasks = await prisma.task.findMany({
    where: { status: { in: ["TODO", "IN_PROGRESS", "REVIEW", "DONE"] } },
    orderBy: [{ status: "asc" }, { position: "asc" }],
    include: {
      assignee: { select: { name: true } },
      project: { select: { name: true, color: true } },
    },
  })

  const grouped: Record<string, typeof tasks> = {
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  }
  for (const t of tasks) grouped[t.status]?.push(t)
  return grouped
}

export async function getTeamsWithMembers() {
  return prisma.team.findMany({
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { role: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })
}

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      team: { select: { name: true } },
      creator: { select: { name: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
}

