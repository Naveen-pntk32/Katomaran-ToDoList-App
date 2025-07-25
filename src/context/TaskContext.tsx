"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Task, TaskContextType } from "../types"
import { useAuth } from "./AuthContext"

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const STORAGE_KEY = `tasks_${user?.uid}`

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY)
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }))
        setTasks(parsedTasks)
      }
    } catch (err) {
      setError("Failed to load tasks")
      console.error("Load tasks error:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
    } catch (err) {
      console.error("Save tasks error:", err)
    }
  }

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user!.uid,
      }

      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      await saveTasks(updatedTasks)
    } catch (err) {
      setError("Failed to add task")
      console.error("Add task error:", err)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task))
      setTasks(updatedTasks)
      await saveTasks(updatedTasks)
    } catch (err) {
      setError("Failed to update task")
      console.error("Update task error:", err)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter((task) => task.id !== id)
      setTasks(updatedTasks)
      await saveTasks(updatedTasks)
    } catch (err) {
      setError("Failed to delete task")
      console.error("Delete task error:", err)
    }
  }

  const refreshTasks = async () => {
    await loadTasks()
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
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

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
