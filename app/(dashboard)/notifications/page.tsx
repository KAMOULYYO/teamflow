export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getNotifications } from "@/lib/data"
import { NotificationsContent } from "@/components/notifications/notifications-content"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  const notifications = session?.user?.id
    ? await getNotifications(session.user.id)
    : []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Stay up to date with your team activity</p>
        </div>
        {notifications.some(n => !n.read) && (
          <span className="text-xs font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-lg">
            {notifications.filter(n => !n.read).length} unread
          </span>
        )}
      </div>
      <NotificationsContent notifications={notifications} />
    </div>
  )
}
