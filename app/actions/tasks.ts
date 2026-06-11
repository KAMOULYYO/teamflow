"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BACKLOG"]),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
})

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Not authenticated" }

  // Resolve the real DB user — JWT token may have a stale or fallback ID
  let userId = session.user.id
  const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!dbUser) {
    // Fallback: look up by email
    const byEmail = await prisma.user.findUnique({ where: { email: session.user.email! }, select: { id: true } })
    if (!byEmail) return { error: "User not found. Please sign out and sign in again." }
    userId = byEmail.id
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    projectId: (formData.get("projectId") as string) || undefined,
    dueDate: (formData.get("dueDate") as string) || undefined,
  }

  const parsed = CreateTaskSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { title, description, priority, status, projectId, dueDate } = parsed.data

  const count = await prisma.task.count({ where: { status } })

  const data: Record<string, unknown> = {
    title,
    priority,
    status,
    creatorId: userId,
    assigneeId: userId,
    position: count + 1,
  }
  if (description) data.description = description
  if (projectId) data.projectId = projectId
  if (dueDate) data.dueDate = new Date(dueDate)

  await prisma.task.create({ data: data as any })

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function moveTask(taskId: string, newStatus: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  })
  revalidatePath("/tasks")
}
