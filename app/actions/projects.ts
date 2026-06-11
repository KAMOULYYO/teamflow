"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sendInviteEmail } from "@/lib/email"
import { addDays } from "date-fns"

async function resolveUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true } })
  if (dbUser) return dbUser.id
  const byEmail = await prisma.user.findUnique({ where: { email: session.user.email! }, select: { id: true } })
  return byEmail?.id ?? null
}

const CreateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  color: z.string().default("#6366f1"),
  teamId: z.string().min(1, "Team is required"),
})

export async function createProject(formData: FormData) {
  const userId = await resolveUserId()
  if (!userId) return { error: "Not authenticated" }

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    color: (formData.get("color") as string) || "#6366f1",
    teamId: formData.get("teamId") as string,
  }

  const parsed = CreateProjectSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { name, description, color, teamId } = parsed.data

  const data: Record<string, unknown> = { name, color, teamId, creatorId: userId, status: "ACTIVE" }
  if (description) data.description = description

  await prisma.project.create({ data: data as any })

  revalidatePath("/projects")
  revalidatePath("/dashboard")
  return { success: true }
}

const CreateTeamSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  color: z.string().default("#7c3aed"),
})

export async function createTeam(formData: FormData) {
  const userId = await resolveUserId()
  if (!userId) return { error: "Not authenticated" }

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    color: (formData.get("color") as string) || "#7c3aed",
  }

  const parsed = CreateTeamSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { name, description, color } = parsed.data
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now()

  const team = await prisma.team.create({
    data: { name, slug, color, description: description ?? null },
  })

  await prisma.teamMember.create({
    data: { teamId: team.id, userId, role: "OWNER" },
  })

  revalidatePath("/teams")
  return { success: true }
}

const InviteMemberSchema = z.object({
  email: z.string().email("Invalid email"),
  teamId: z.string().min(1),
  role: z.enum(["MEMBER", "MANAGER", "ADMIN"]).default("MEMBER"),
})

export async function inviteMember(formData: FormData) {
  const userId = await resolveUserId()
  if (!userId) return { error: "Not authenticated" }

  const raw = {
    email: formData.get("email") as string,
    teamId: formData.get("teamId") as string,
    role: (formData.get("role") as string) || "MEMBER",
  }

  const parsed = InviteMemberSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { email, teamId, role } = parsed.data

  // If user already exists in DB, add directly
  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existingUser) {
    const alreadyMember = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: existingUser.id } } })
    if (alreadyMember) return { error: "This person is already a member of this team" }
    await prisma.teamMember.create({ data: { teamId, userId: existingUser.id, role } })
    revalidatePath("/teams")
    return { success: true, directAdd: true }
  }

  // Delete any existing pending invite so we can resend a fresh one
  await prisma.invitation.deleteMany({
    where: { email, teamId, accepted: false },
  })

  // Get inviter name and team name for email
  const [inviter, team] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.team.findUnique({ where: { id: teamId }, select: { name: true } }),
  ])

  // Create invitation record
  const invitation = await prisma.invitation.create({
    data: {
      email,
      teamId,
      role,
      invitedBy: userId,
      expiresAt: addDays(new Date(), 7),
    },
  })

  // Send email
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3001"
  const acceptUrl = `${baseUrl}/invite/${invitation.token}`

  const result = await sendInviteEmail({
    to: email,
    inviterName: inviter?.name ?? "Someone",
    teamName: team?.name ?? "the team",
    role,
    acceptUrl,
  })

  revalidatePath("/teams")
  return {
    success: true,
    sent: result.sent,
    // Return link when no email is configured (dev mode)
    acceptUrl: result.sent ? undefined : acceptUrl,
  }
}
