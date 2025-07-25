"use client"

import type React from "react"
import { useState } from "react"
import { View, StyleSheet, Image, Alert } from "react-native"
import { Button, Card, Title, Paragraph, ActivityIndicator } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../context/AuthContext"
import { theme } from "../utils/theme"

const AuthScreen: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      Alert.alert("Sign In Error", "Failed to sign in with Google. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={{ uri: "https://via.placeholder.com/120x120/4285F4/FFFFFF?text=TODO" }} style={styles.logo} />

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>Welcome to TaskMaster</Title>
            <Paragraph style={styles.subtitle}>Organize your tasks efficiently and boost your productivity</Paragraph>

            <Button
              mode="contained"
              onPress={handleGoogleSignIn}
              disabled={loading}
              style={styles.signInButton}
              contentStyle={styles.buttonContent}
              icon="google"
            >
              {loading ? <ActivityIndicator color="white" /> : "Sign in with Google"}
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 40,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    elevation: 4,
  },
  cardContent: {
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: theme.colors.onSurfaceVariant,
  },
  signInButton: {
    width: "100%",
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
})

export default AuthScreen
