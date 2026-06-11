"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Users, Crown, Shield, MoreHorizontal, Mail, Settings, X } from "lucide-react"
import { useState, useTransition } from "react"
import { createTeam, inviteMember } from "@/app/actions/projects"
import toast from "react-hot-toast"

const roles = {
  OWNER:   { label: "Owner",   icon: Crown,    color: "text-amber-500 bg-amber-500/10" },
  ADMIN:   { label: "Admin",   icon: Shield,   color: "text-red-500 bg-red-500/10"     },
  MANAGER: { label: "Manager", icon: Settings, color: "text-blue-500 bg-blue-500/10"   },
  MEMBER:  { label: "Member",  icon: Users,    color: "text-slate-500 bg-slate-500/10" },
}

const COLORS = ["#7c3aed","#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"]

interface Member {
  name: string
  email: string
  role: string
  avatar: string
  color: string
}

interface Team {
  id: string
  name: string
  description: string | null
  color: string | null
  members: Member[]
}

interface Props {
  teams: Team[]
}

export function TeamsContent({ teams: initialTeams }: Props) {
  const [activeTeam, setActiveTeam] = useState(initialTeams[0] ?? null)
  const [newTeamOpen, setNewTeamOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [teamColor, setTeamColor] = useState(COLORS[0])
  const [isPending, startTransition] = useTransition()

  if (!activeTeam && initialTeams.length === 0) {
    return <p className="text-[var(--muted-foreground)] text-sm">No teams found.</p>
  }

  function handleCreateTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("color", teamColor)
    startTransition(async () => {
      const res = await createTeam(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success("Team created!")
      setNewTeamOpen(false)
    })
  }

  function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("teamId", activeTeam!.id)
    startTransition(async () => {
      const res = await inviteMember(fd)
      if (res?.error) { toast.error(res.error); return }
      if (res.sent === false && res.acceptUrl) {
        // No email configured — copy link to clipboard automatically
        navigator.clipboard.writeText(res.acceptUrl).catch(() => {})
        toast.success("Lien d'invitation copié ! (aucun SMTP configuré)", { duration: 8000 })
      } else {
        toast.success("Invitation sent by email! ✉️")
      }
      setInviteOpen(false)
    })
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Teams list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--foreground)]">Your Teams</span>
            <button
              onClick={() => setNewTeamOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> New Team
            </button>
          </div>
          {initialTeams.map((team, i) => (
            <motion.button
              key={team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setActiveTeam(team)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                activeTeam?.id === team.id
                  ? "border-[var(--primary)]/30 bg-[var(--primary)]/5"
                  : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: team.color ?? "#7c3aed" }}>
                  {team.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{team.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{team.description}</p>
                </div>
                <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-lg">
                  {team.members.length}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Team detail */}
        {activeTeam && (
          <div className="lg:col-span-2 space-y-4">
            <motion.div key={activeTeam.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg" style={{ backgroundColor: activeTeam.color ?? "#7c3aed" }}>
                    {activeTeam.name[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">{activeTeam.name}</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">{activeTeam.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-all"
                >
                  <Mail className="w-3.5 h-3.5" /> Invite Member
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                  Members ({activeTeam.members.length})
                </p>
                {activeTeam.members.map((member, i) => {
                  const role = roles[member.role as keyof typeof roles] ?? roles.MEMBER
                  return (
                    <motion.div
                      key={member.email}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--accent)] transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)]">{member.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{member.email}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg ${role.color}`}>
                        <role.icon className="w-3 h-3" />
                        {role.label}
                      </div>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:bg-[var(--border)] transition-all">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* New Team Modal */}
      <AnimatePresence>
        {newTeamOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setNewTeamOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="text-base font-bold text-[var(--foreground)]">New Team</h2>
                  <button onClick={() => setNewTeamOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Team name *</label>
                    <input name="name" required autoFocus placeholder="e.g. Design Team" className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Description</label>
                    <input name="description" placeholder="What does this team do?" className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button type="button" key={c} onClick={() => setTeamColor(c)} className={`w-7 h-7 rounded-lg transition-all ${teamColor === c ? "ring-2 ring-offset-2 ring-offset-[var(--card)] ring-white scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setNewTeamOpen(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">Cancel</button>
                    <button type="submit" disabled={isPending} className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">{isPending ? "Creating…" : "Create Team"}</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {inviteOpen && activeTeam && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setInviteOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="text-base font-bold text-[var(--foreground)]">Invite to {activeTeam.name}</h2>
                  <button onClick={() => setInviteOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleInvite} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Email address *</label>
                    <input name="email" type="email" required autoFocus placeholder="colleague@company.com" className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1.5">Role</label>
                    <select name="role" className="w-full px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-all">
                      <option value="MEMBER">Member</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setInviteOpen(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">Cancel</button>
                    <button type="submit" disabled={isPending} className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">{isPending ? "Inviting…" : "Send Invite"}</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
