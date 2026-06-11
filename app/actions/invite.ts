"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const AcceptSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function acceptInvitation(formData: FormData) {
  const raw = {
    token: formData.get("token") as string,
    name: formData.get("name") as string,
    password: formData.get("password") as string,
  }

  const parsed = AcceptSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { token, name, password } = parsed.data

  // Find and validate invitation
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { team: { select: { id: true, name: true } } },
  })

  if (!invitation) return { error: "Invalid invitation link" }
  if (invitation.accepted) return { error: "This invitation has already been used" }
  if (new Date() > invitation.expiresAt) return { error: "This invitation has expired" }

  // Check if email already registered
  const existing = await prisma.user.findUnique({ where: { email: invitation.email } })
  if (existing) {
    // User already exists — just add to team and mark accepted
    const alreadyMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: invitation.teamId, userId: existing.id } },
    })
    if (!alreadyMember) {
      await prisma.teamMember.create({
        data: { teamId: invitation.teamId, userId: existing.id, role: invitation.role },
      })
    }
    await prisma.invitation.update({ where: { token }, data: { accepted: true } })
    return { success: true, message: "Added to team" }
  }

  // Hash password and create new user
  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email: invitation.email,
      password: hashedPassword,
      role: "MEMBER",
    },
  })

  // Add to team
  await prisma.teamMember.create({
    data: { teamId: invitation.teamId, userId: user.id, role: invitation.role },
  })

  // Mark invitation accepted
  await prisma.invitation.update({ where: { token }, data: { accepted: true } })

  // Create welcome notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "TEAM_JOINED",
      title: "Welcome to " + invitation.team.name + "!",
      message: "Your account is ready. Start collaborating with your team.",
    },
  })

  return { success: true }
}
