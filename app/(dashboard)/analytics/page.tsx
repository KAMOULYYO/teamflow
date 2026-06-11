import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Analytics</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Track team performance and productivity trends</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}
