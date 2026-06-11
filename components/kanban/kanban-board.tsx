"use client"

import { useState, useRef } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { KanbanCard } from "@/components/kanban/kanban-card"
import { TaskModal } from "@/components/kanban/task-modal"
import { Plus, Filter, Search, LayoutGrid, List } from "lucide-react"
import type { Task } from "@/components/kanban/types"

const columns = [
  { id: "TODO",        label: "Todo",        color: "#3b82f6" },
  { id: "IN_PROGRESS", label: "In Progress", color: "#7c3aed" },
  { id: "REVIEW",      label: "Review",      color: "#f59e0b" },
  { id: "DONE",        label: "Done",        color: "#10b981" },
]

interface Props {
  initialTasks?: Record<string, Task[]>
  projects?: { id: string; name: string }[]
}

const DEFAULT_TASKS: Record<string, Task[]> = { TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: [] }

export function KanbanBoard({ initialTasks = DEFAULT_TASKS, projects = [] }: Props) {
  const [tasks, setTasks] = useState(initialTasks)
  const [view, setView] = useState<"board" | "list">("board")
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState("TODO")
  const [search, setSearch] = useState("")

  const openModal = (status = "TODO") => {
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const srcCol = [...tasks[source.droppableId]]
    const dstCol = source.droppableId === destination.droppableId ? srcCol : [...tasks[destination.droppableId]]

    const [moved] = srcCol.splice(source.index, 1)
    dstCol.splice(destination.index, 0, moved)

    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: srcCol,
      [destination.droppableId]: dstCol,
    }))
  }

  const filtered = (colId: string) => {
    const list = tasks[colId] ?? []
    if (!search.trim()) return list
    return list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
            <Search className="w-3.5 h-3.5" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter tasks…"
              className="bg-transparent outline-none text-xs w-28 placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--muted)] rounded-xl p-1 gap-0.5">
            {(["board", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`p-1.5 rounded-lg transition-all ${view === v ? "bg-[var(--card)] shadow text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
              >
                {v === "board" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => openModal("TODO")}
            className="gradient-primary text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-violet-500/20 hover:opacity-90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
      </div>

      {/* Board view */}
      {view === "board" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                count={tasks[col.id]?.length ?? 0}
                onAdd={() => openModal(col.id)}
              >
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] space-y-3 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-[var(--primary)]/5" : ""}`}
                    >
                      {filtered(col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <KanbanCard task={task} isDragging={snapshot.isDragging} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </KanbanColumn>
            ))}
          </div>
        </DragDropContext>
      ) : (
        /* List view */
        <div className="space-y-2 overflow-y-auto">
          {columns.map(col => (
            filtered(col.id).map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-[var(--ring)]/30 transition-all">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                <span className="flex-1 text-sm text-[var(--foreground)]">{task.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${
                  task.priority === "URGENT" ? "text-red-500 bg-red-500/10" :
                  task.priority === "HIGH" ? "text-orange-500 bg-orange-500/10" :
                  task.priority === "MEDIUM" ? "text-yellow-500 bg-yellow-500/10" :
                  "text-blue-500 bg-blue-500/10"
                }`}>{task.priority}</span>
                <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-lg">{col.label}</span>
                {task.dueDate && <span className="text-xs text-[var(--muted-foreground)]">{task.dueDate}</span>}
              </div>
            ))
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultStatus={defaultStatus}
        projects={projects}
      />
    </div>
  )
}
