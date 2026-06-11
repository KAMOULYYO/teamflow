"use client"

import { Plus } from "lucide-react"

interface ColumnProps {
  column: { id: string; label: string; color: string }
  count: number
  children: React.ReactNode
  onAdd?: () => void
}

export function KanbanColumn({ column, count, children, onAdd }: ColumnProps) {
  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-sm font-semibold text-[var(--foreground)]">{column.label}</span>
          <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 py-0.5 rounded-md font-medium">
            {count}
          </span>
        </div>
        <button onClick={onAdd} className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tasks */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
