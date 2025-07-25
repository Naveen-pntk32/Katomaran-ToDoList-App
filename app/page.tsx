"use client"

import { useAuth } from "@/context/AuthContext"
import { TaskProvider } from "@/context/TaskContext"
import AuthScreen from "@/components/AuthScreen"
import TaskDashboard from "@/components/TaskDashboard"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {user ? (
        <TaskProvider>
          <TaskDashboard />
        </TaskProvider>
      ) : (
        <AuthScreen />
      )}
      <Toaster />
    </main>
  )
}
