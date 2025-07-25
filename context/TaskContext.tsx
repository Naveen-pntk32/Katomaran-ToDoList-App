"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  status: "open" | "complete"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
}

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  refreshTasks: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = () => {
    setLoading(true)
    const savedTasks = localStorage.getItem("taskmaster_tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }))
      setTasks(parsedTasks)
    }
    setLoading(false)
  }

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("taskmaster_tasks", JSON.stringify(updatedTasks))
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    toast({
      title: "Task created",
      description: "Your task has been added successfully.",
    })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task))
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    toast({
      title: "Task deleted",
      description: "Your task has been removed.",
      variant: "destructive",
    })
  }

  const refreshTasks = () => {
    loadTasks()
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
