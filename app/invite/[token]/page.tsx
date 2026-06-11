export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AcceptInviteForm } from "./accept-form"

interface Props {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { team: { select: { name: true, color: true } } },
  })

  if (!invitation) return notFound()

  if (invitation.accepted) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto text-3xl">✅</div>
          <h1 className="text-2xl font-bold text-white">Invitation already used</h1>
          <p className="text-slate-400">This invitation has already been accepted. You can log in to your account.</p>
          <a href="/login" className="inline-block mt-4 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  if (new Date() > invitation.expiresAt) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto text-3xl">⏰</div>
          <h1 className="text-2xl font-bold text-white">Invitation expired</h1>
          <p className="text-slate-400">This invitation has expired. Ask your team admin to send a new one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-4">
      <AcceptInviteForm
        token={token}
        email={invitation.email}
        teamName={invitation.team.name}
        teamColor={invitation.team.color ?? "#7c3aed"}
        role={invitation.role}
      />
    </div>
  )
}
