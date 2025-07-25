"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem("taskmaster_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signInWithGoogle = async () => {
    // Simulate Google sign-in
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
    }

    setUser(mockUser)
    localStorage.setItem("taskmaster_user", JSON.stringify(mockUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("taskmaster_user")
    localStorage.removeItem("taskmaster_tasks")
  }

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
