"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "estudiante" | "docente" | "administrador"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface Progress {
  teoriaCompleted: boolean
  practicaCompleted: boolean
  juegoUnlocked: boolean
  completedExercises: number
  totalExercises: number
  score: number
}

interface AuthContextType {
  user: User | null
  progress: Progress
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProgress: (updates: Partial<Progress>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration (in production, this would come from a backend)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "estudiante@mathseq.com",
    password: "estudiante123",
    role: "estudiante",
  },
  {
    id: "2",
    name: "María García",
    email: "docente@mathseq.com",
    password: "docente123",
    role: "docente",
  },
  {
    id: "3",
    name: "Carlos Admin",
    email: "admin@mathseq.com",
    password: "admin123",
    role: "administrador",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<Progress>({
    teoriaCompleted: false,
    practicaCompleted: false,
    juegoUnlocked: false,
    completedExercises: 0,
    totalExercises: 20,
    score: 0,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mathseq_user")
    const storedProgress = localStorage.getItem("mathseq_progress")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (storedProgress) {
      setProgress(JSON.parse(storedProgress))
    }
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("mathseq_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("mathseq_user")
    }
  }, [user])

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("mathseq_progress", JSON.stringify(progress))

    // Auto-unlock game when both teoria and practica are completed
    if (progress.teoriaCompleted && progress.practicaCompleted && !progress.juegoUnlocked) {
      setProgress((prev) => ({ ...prev, juegoUnlocked: true }))
    }
  }, [progress])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setProgress({
      teoriaCompleted: false,
      practicaCompleted: false,
      juegoUnlocked: false,
      completedExercises: 0,
      totalExercises: 20,
      score: 0,
    })
    localStorage.removeItem("mathseq_user")
    localStorage.removeItem("mathseq_progress")
  }

  const updateProgress = (updates: Partial<Progress>) => {
    setProgress((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        progress,
        login,
        logout,
        updateProgress,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
