export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SettingsContent } from "@/components/settings/settings-content"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Manage your account and preferences</p>
      </div>
      <SettingsContent
        user={{
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
          image: session?.user?.image ?? null,
        }}
      />
    </div>
  )
}
