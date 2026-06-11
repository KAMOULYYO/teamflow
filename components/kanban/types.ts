export interface Task {
  id: string
  title: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  assignee?: string
  labels?: string[]
  dueDate?: string
  progress?: number
  description?: string
}
