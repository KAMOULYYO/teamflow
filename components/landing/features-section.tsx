"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard, Kanban, BarChart3, Users, Brain, Zap,
  Shield, Bell, GitBranch, Sparkles
} from "lucide-react"

const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    description: "Drag-and-drop task management with real-time updates and smooth animations. See your work flow.",
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    icon: Brain,
    title: "AI Task Assistant",
    description: "Smart task suggestions, workload predictions, and productivity insights powered by AI.",
    color: "from-pink-500 to-rose-500",
    glow: "shadow-pink-500/20",
    badge: "New",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Beautiful animated charts showing team productivity, velocity, and performance trends.",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Create teams, invite members, assign roles with granular RBAC permissions.",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: GitBranch,
    title: "Project Workflows",
    description: "Flexible project structures with custom statuses, labels, and automated workflows.",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Context-aware notifications that surface what matters without the noise.",
    color: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with RBAC, audit logs, SSO, and end-to-end encryption.",
    color: "from-slate-400 to-slate-600",
    glow: "shadow-slate-500/20",
  },
  {
    icon: Sparkles,
    title: "Live Collaboration",
    description: "See teammates' cursors, edits, and presence indicators in real time.",
    color: "from-fuchsia-500 to-pink-500",
    glow: "shadow-fuchsia-500/20",
    badge: "Beta",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-4">
            <Zap className="w-3 h-3" />
            Everything you need
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Built for how modern
            <br />
            <span className="text-gradient">teams actually work</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature is thoughtfully designed to reduce friction and amplify your team's output.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className="relative h-full glass-dark rounded-2xl border border-white/8 p-5 hover:border-white/15 transition-all duration-300 overflow-hidden">
                {/* Hover glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.color} blur-2xl`}
                  style={{ opacity: 0, filter: "blur(40px)", transform: "scale(0.5)" }}
                />

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>

                {/* Badge */}
                {feature.badge && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    {feature.badge}
                  </span>
                )}

                <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
