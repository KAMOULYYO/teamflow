export const dynamic = "force-dynamic"

import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { TaskOverview } from "@/components/dashboard/task-overview"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { TeamActivity } from "@/components/dashboard/team-activity"
import { getDashboardStats } from "@/lib/data"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([
    getServerSession(authOptions),
    getDashboardStats(),
  ])

  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const taskBreakdown = (() => {
    const map: Record<string, number> = {}
    for (const g of stats.tasksByStatus) map[g.status] = g._count._all
    return [
      { name: "Completed", value: map["COMPLETED"] ?? 0, color: "#10b981" },
      { name: "In Progress", value: map["IN_PROGRESS"] ?? 0, color: "#7c3aed" },
      { name: "Review",      value: map["REVIEW"] ?? 0, color: "#f59e0b" },
      { name: "Todo",        value: map["TODO"] ?? 0, color: "#3b82f6" },
      { name: "Backlog",     value: map["BACKLOG"] ?? 0, color: "#6b7280" },
    ]
  })()

  const completionRate = stats.totalTasks > 0
    ? Math.round(((map => map["COMPLETED"] ?? 0)(Object.fromEntries(stats.tasksByStatus.map(g => [g.status, g._count._all])))) / stats.totalTasks * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{greeting}, {firstName} 👋</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Here's what's happening with your team today.</p>
      </div>

      <KpiCards
        completed={stats.completed}
        inProgress={stats.inProgress}
        totalTasks={stats.totalTasks}
        activeMembers={stats.activeMembers}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>
        <TaskOverview data={taskBreakdown} completionRate={completionRate} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={stats.upcomingTasks} />
        <TeamActivity activities={stats.recentActivity} />
      </div>
    </div>
  )
}
