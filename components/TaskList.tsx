"use client"

import type { Task } from "@/context/TaskContext"
import TaskItem from "./TaskItem"
import { ListTodo } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

export default function TaskList({ tasks, onEditTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <ListTodo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started with organizing your work.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
      ))}
    </div>
  )
}
