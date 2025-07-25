"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useTask } from "@/context/TaskContext"
import TaskList from "./TaskList"
import TaskModal from "./TaskModal"
import { Plus, Search, LogOut, User, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TaskDashboard() {
  const { user, signOut } = useAuth()
  const { tasks, refreshTasks, loading } = useTask()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "complete">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        // Sort by priority first, then by due date
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }

        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime()
        }

        return b.createdAt.getTime() - a.createdAt.getTime()
      })
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const taskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === "complete").length
    const pending = total - completed
    const overdue = tasks.filter((task) => task.dueDate && task.dueDate < new Date() && task.status === "open").length

    return { total, completed, pending, overdue }
  }, [tasks])

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TaskMaster</h1>
              <Button variant="ghost" size="sm" onClick={refreshTasks} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{taskStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1">
                <Badge
                  variant={statusFilter === "all" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={statusFilter === "open" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("open")}
                >
                  Open
                </Badge>
                <Badge
                  variant={statusFilter === "complete" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("complete")}
                >
                  Complete
                </Badge>
              </div>

              <div className="flex gap-1">
                <Badge
                  variant={priorityFilter === "all" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setPriorityFilter("all")}
                >
                  All Priority
                </Badge>
                <Badge
                  variant={priorityFilter === "high" ? "destructive" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setPriorityFilter("high")}
                >
                  High
                </Badge>
                <Badge
                  variant={priorityFilter === "medium" ? "default" : "secondary"}
                  className="cursor-pointer bg-orange-500 hover:bg-orange-600"
                  onClick={() => setPriorityFilter("medium")}
                >
                  Medium
                </Badge>
                <Badge
                  variant={priorityFilter === "low" ? "default" : "secondary"}
                  className="cursor-pointer bg-green-500 hover:bg-green-600"
                  onClick={() => setPriorityFilter("low")}
                >
                  Low
                </Badge>
              </div>
            </div>

            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Task List */}
        <TaskList tasks={filteredTasks} onEditTask={handleEditTask} />
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} task={editingTask} />
    </div>
  )
}
