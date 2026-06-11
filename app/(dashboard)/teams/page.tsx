export const dynamic = "force-dynamic"

import { TeamsContent } from "@/components/teams/teams-page"
import { getTeamsWithMembers } from "@/lib/data"

export default async function TeamsPage() {
  const teams = await getTeamsWithMembers()

  const serialized = teams.map(team => ({
    id: team.id,
    name: team.name,
    description: team.description,
    color: team.color,
    members: team.members.map(m => ({
      name: m.user.name ?? "",
      email: m.user.email,
      role: m.role,
      avatar: (m.user.name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2),
      color: avatarColor(m.user.id),
    })),
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Teams</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Manage your teams, members and permissions</p>
      </div>
      <TeamsContent teams={serialized} />
    </div>
  )
}

const COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-indigo-500 to-violet-500",
  "from-red-500 to-rose-500",
  "from-teal-500 to-cyan-600",
]

function avatarColor(id: string): string {
  let hash = 0
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}
