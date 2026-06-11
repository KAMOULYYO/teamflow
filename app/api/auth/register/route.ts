import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations"
import { nanoid } from "nanoid"

// In-memory store used when PostgreSQL is not connected
const memoryUsers: Array<{ id: string; name: string; email: string; password: string }> = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data
    const hashed = await bcrypt.hash(password, 12)

    // Try real DB first
    try {
      const { prisma } = await import("@/lib/prisma")

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }

      const user = await prisma.user.create({
        data: { name, email, password: hashed },
        select: { id: true, email: true, name: true },
      })
      return NextResponse.json({ user }, { status: 201 })
    } catch {
      // DB unavailable — use in-memory fallback
      const alreadyExists =
        memoryUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
      if (alreadyExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }

      const user = { id: nanoid(), name, email, password: hashed }
      memoryUsers.push(user)

      return NextResponse.json(
        { user: { id: user.id, email: user.email, name: user.name } },
        { status: 201 }
      )
    }
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
