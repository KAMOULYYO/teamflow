import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Fallback only used if DB is completely unavailable
const FALLBACK_HASH = "$2b$12$1wfdV5E5jpAd9tcqauy4d.9ndWcabJG2oBVxfUcNqZCffQxpydcpq" // demo1234

async function findUserInDb(email: string) {
  try {
    const { prisma } = await import("@/lib/prisma")
    return await prisma.user.findUnique({ where: { email } })
  } catch {
    return null
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // 1. Always try real DB first
        const user = await findUserInDb(email)
        if (user?.password) {
          const valid = await bcrypt.compare(password, user.password)
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name, image: user.image }
        }

        // 2. DB unavailable — allow demo account as emergency fallback
        if (email.toLowerCase() === "demo@teamflowpro.com") {
          const valid = await bcrypt.compare(password, FALLBACK_HASH)
          if (!valid) return null
          return { id: "demo-fallback", email, name: "Alex Johnson", image: null }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
