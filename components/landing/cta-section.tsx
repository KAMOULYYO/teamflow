"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090f]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Glow blob */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 blur-3xl rounded-full scale-150" />

          <div className="relative glass-dark rounded-3xl border border-white/10 p-12 lg:p-16">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30 animate-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to ship faster?
              <br />
              <span className="text-gradient">Start free today.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              Join 12,000+ teams who use TeamFlow Pro to plan, build, and deliver great work.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="group gradient-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base"
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-all font-medium text-base"
              >
                Book a Demo
              </Link>
            </div>

            <p className="text-slate-600 text-xs mt-6">
              No credit card required · Free plan forever · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
