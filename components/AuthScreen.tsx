"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { Chrome, CheckCircle, Zap, Shield } from "lucide-react"

export default function AuthScreen() {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TaskMaster</h1>
          <p className="text-gray-600 mt-2">Organize your tasks efficiently</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your tasks and boost your productivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full h-12 text-base" size="lg">
              <Chrome className="mr-2 h-5 w-5" />
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Zap className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Fast & Efficient</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Organized</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
