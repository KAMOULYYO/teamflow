"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "TeamFlow Pro replaced three tools we were using. Our sprint velocity increased 40% in the first month.",
    author: "Sarah Kim",
    role: "VP Engineering",
    company: "Meridian Labs",
    avatar: "SK",
    color: "from-blue-500 to-cyan-500",
    stars: 5,
  },
  {
    quote: "The AI task assistant is genuinely useful — it caught a scheduling conflict we would have missed.",
    author: "James Chen",
    role: "Head of Product",
    company: "Elevate AI",
    avatar: "JC",
    color: "from-violet-500 to-purple-600",
    stars: 5,
  },
  {
    quote: "Finally a project tool that doesn't feel like enterprise software from 2012. Our team loves it.",
    author: "Priya Nair",
    role: "Engineering Manager",
    company: "FluxScale",
    avatar: "PN",
    color: "from-pink-500 to-rose-500",
    stars: 5,
  },
  {
    quote: "The Kanban board is beautiful. Drag-and-drop is buttery smooth and the animations are chef's kiss.",
    author: "Marcus Reed",
    role: "CTO",
    company: "Orbit Systems",
    avatar: "MR",
    color: "from-amber-500 to-orange-500",
    stars: 5,
  },
  {
    quote: "Onboarding our 200-person team took less than a day. The UX is genuinely intuitive.",
    author: "Elena Vasquez",
    role: "Chief of Staff",
    company: "Nexus Corp",
    avatar: "EV",
    color: "from-emerald-500 to-teal-500",
    stars: 5,
  },
  {
    quote: "The analytics dashboard gives our exec team exactly the visibility they've been asking for.",
    author: "David Lim",
    role: "Product Lead",
    company: "Foundry Works",
    avatar: "DL",
    color: "from-indigo-500 to-violet-500",
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090f] via-[#0b0b14] to-[#09090f]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Loved by <span className="text-gradient">12,000+ teams</span>
          </h2>
          <p className="text-slate-400">Don't take our word for it — here's what teams are saying</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-dark rounded-2xl border border-white/8 p-6 hover:border-white/15 transition-all duration-300"
            >
              <Quote className="w-5 h-5 text-violet-500/50 mb-4" />
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.author}</div>
                  <div className="text-slate-500 text-xs">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
