"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import type { AuthContextType, User } from "../types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID", // From Firebase Console
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      await auth().signInWithCredential(googleCredential)
    } catch (error) {
      console.error("Google Sign-In Error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await GoogleSignin.signOut()
      await auth().signOut()
    } catch (error) {
      console.error("Sign Out Error:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
