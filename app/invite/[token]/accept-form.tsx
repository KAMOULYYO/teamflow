"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Check, Loader2 } from "lucide-react"
import { acceptInvitation } from "@/app/actions/invite"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface Props {
  token: string
  email: string
  teamName: string
  teamColor: string
  role: string
}

export function AcceptInviteForm({ token, email, teamName, teamColor, role }: Props) {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const password = fd.get("password") as string
    const confirm = fd.get("confirm") as string
    if (password !== confirm) { toast.error("Passwords do not match"); return }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return }

    startTransition(async () => {
      const res = await acceptInvitation(fd)
      if (res?.error) { toast.error(res.error); return }
      toast.success("Welcome to " + teamName + "! 🎉")
      setTimeout(() => router.push("/login?invited=1"), 1000)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <a href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">⚡</div>
          <span className="text-white font-bold text-lg">TeamFlow Pro</span>
        </a>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg"
          style={{ backgroundColor: teamColor }}
        >
          {teamName[0]}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You're invited!</h1>
        <p className="text-slate-400 text-sm">
          Join <span className="text-violet-400 font-semibold">{teamName}</span> as a{" "}
          <span className="text-white font-medium">{role.toLowerCase()}</span>
        </p>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Full name *</label>
            <input
              name="name" required autoFocus
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl bg-[#12122a] border border-[#2a2a3e] text-white placeholder:text-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Email</label>
            <input
              value={email} disabled
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-[#2a2a3e] text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Password *</label>
            <div className="relative">
              <input
                name="password" required minLength={8}
                type={showPass ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#12122a] border border-[#2a2a3e] text-white placeholder:text-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Confirm password *</label>
            <div className="relative">
              <input
                name="confirm" required minLength={8}
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#12122a] border border-[#2a2a3e] text-white placeholder:text-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
            ) : (
              <><Check className="w-4 h-4" /> Accept & Create Account</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-violet-400 hover:underline">Sign in</a>
        </p>
      </div>
    </motion.div>
  )
}
