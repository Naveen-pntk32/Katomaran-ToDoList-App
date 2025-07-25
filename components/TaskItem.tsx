"use client"

import { useState } from "react"
import { type Task, useTask } from "@/context/TaskContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Edit, Trash2, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskItemProps {
  task: Task
  onEdit: () => void
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
  const { updateTask, deleteTask } = useTask()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleComplete = () => {
    updateTask(task.id, {
      status: task.status === "complete" ? "open" : "complete",
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    deleteTask(task.id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-orange-500 hover:bg-orange-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return ""
    }
  }

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status === "open"
  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (taskDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (taskDate.getTime() === today.getTime() + 86400000) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        task.status === "complete" ? "opacity-75" : ""
      } ${isOverdue ? "border-l-4 border-l-red-500" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={task.status === "complete"} onCheckedChange={handleToggleComplete} className="mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`font-medium text-gray-900 ${
                    task.status === "complete" ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm text-gray-600 mt-1 ${task.status === "complete" ? "line-through" : ""}`}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={getPriorityColor(task.priority)}
                  className={`text-xs ${task.priority === "medium" ? getPriorityBgColor(task.priority) : ""} ${
                    task.priority === "low" ? getPriorityBgColor(task.priority) : ""
                  }`}
                >
                  {task.priority.toUpperCase()}
                </Badge>

                <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {task.dueDate && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                <Calendar className="h-4 w-4" />
                <span>Due: {formatDate(task.dueDate)}</span>
                {isOverdue && <Clock className="h-4 w-4 ml-1" />}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
