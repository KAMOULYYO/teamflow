"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play, Star, TrendingUp, Users, CheckCircle2, Zap } from "lucide-react"
import { DashboardPreview } from "@/components/landing/dashboard-preview"

const avatars = [
  { initials: "JD", color: "from-violet-500 to-purple-600" },
  { initials: "SK", color: "from-blue-500 to-cyan-500" },
  { initials: "AL", color: "from-pink-500 to-rose-500" },
  { initials: "MR", color: "from-amber-500 to-orange-500" },
  { initials: "TC", color: "from-emerald-500 to-teal-500" },
]

const floatingCards = [
  {
    icon: TrendingUp,
    label: "Sprint velocity",
    value: "+34%",
    sub: "this month",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    delay: 0,
    position: "top-[12%] -right-4 md:right-8",
  },
  {
    icon: CheckCircle2,
    label: "Tasks completed",
    value: "2,847",
    sub: "this week",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    delay: 0.4,
    position: "bottom-[18%] -left-4 md:left-4",
  },
  {
    icon: Users,
    label: "Active teams",
    value: "143",
    sub: "across 12 projects",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    delay: 0.8,
    position: "top-[38%] -left-6 md:-left-10",
  },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,transparent_70%)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6"
            >
              <Zap className="w-3 h-3" />
              New: AI Task Assistant is live
              <ArrowRight className="w-3 h-3" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6"
            >
              Manage Teams{" "}
              <span className="text-gradient">Faster Than</span>{" "}
              Ever
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Plan projects, assign tasks, track progress and boost productivity
              from a single intelligent workspace. Built for modern teams.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
            >
              <Link
                href="/register"
                className="group gradient-primary text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Start Free — No CC Required
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-all font-medium">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-2">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.color} border-2 border-[#09090f] flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                <div className="flex items-center gap-1 justify-center lg:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-white font-semibold ml-1">4.9</span>
                </div>
                <span>Trusted by 12,000+ teams worldwide</span>
              </div>
            </motion.div>
          </div>

          {/* Right — dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Floating cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + card.delay }}
                className={`absolute z-20 ${card.position} animate-float`}
                style={{ animationDelay: `${card.delay}s` }}
              >
                <div className="glass rounded-2xl p-3 shadow-2xl min-w-[140px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${card.bg}`}>
                      <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
                    </div>
                    <span className="text-white/60 text-[10px] font-medium">{card.label}</span>
                  </div>
                  <div className={`text-xl font-bold text-white`}>{card.value}</div>
                  <div className="text-white/40 text-[10px]">{card.sub}</div>
                </div>
              </motion.div>
            ))}

            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
