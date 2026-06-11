"use client"

import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const plans = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    description: "Perfect for small teams getting started",
    features: ["Up to 5 members", "3 projects", "Basic Kanban", "2GB storage", "Email support"],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: 16,
    annual: 12,
    description: "For growing teams that move fast",
    features: [
      "Up to 50 members",
      "Unlimited projects",
      "Advanced Kanban",
      "AI Task Assistant",
      "Analytics dashboard",
      "50GB storage",
      "Priority support",
      "Custom workflows",
    ],
    cta: "Start 14-day trial",
    href: "/register",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    monthly: 49,
    annual: 39,
    description: "For large orgs with advanced needs",
    features: [
      "Unlimited members",
      "Unlimited everything",
      "SSO / SAML",
      "Audit logs",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated CSM",
      "On-premise option",
    ],
    cta: "Book a demo",
    href: "#",
    highlighted: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="text-slate-400 mb-8">No hidden fees. Cancel anytime.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-white/10 text-white" : "text-slate-500"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${annual ? "bg-white/10 text-white" : "text-slate-500"}`}
            >
              Annual
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md">-25%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "gradient-primary border-violet-500/50 shadow-2xl shadow-violet-500/20"
                  : "glass-dark border-white/8 hover:border-white/15"
              } transition-all duration-300`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-white text-violet-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    <Zap className="w-2.5 h-2.5" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className={`text-xs ${plan.highlighted ? "text-white/70" : "text-slate-500"}`}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                  <span className={`text-sm mb-1.5 ${plan.highlighted ? "text-white/60" : "text-slate-500"}`}>
                    / user / mo
                  </span>
                </div>
                {annual && plan.monthly > 0 && (
                  <div className="text-xs text-emerald-400 mt-1">
                    Save ${(plan.monthly - plan.annual) * 12}/user/year
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 shrink-0 ${plan.highlighted ? "text-white" : "text-emerald-500"}`} />
                    <span className={plan.highlighted ? "text-white/80" : "text-slate-400"}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
                  plan.highlighted
                    ? "bg-white text-violet-700 hover:bg-white/90 shadow-lg"
                    : "bg-white/8 border border-white/10 text-white hover:bg-white/12"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
