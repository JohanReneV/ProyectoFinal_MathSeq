"use client"

import { createContext, useContext, useState, useEffect } from "react"

const BACKEND_URL = "https://mathseq-backend.onrender.com"

export type UserRole = "estudiante" | "docente" | "administrador"

export interface User {
  id: string
  nombre: string
  correo: string
  id_rol: number
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
  login: (correo: string, contrasena: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  updateProgress: (updates: Partial<Progress>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

  useEffect(() => {
    const storedUser = localStorage.getItem("mathseq_user")
    const storedProgress = localStorage.getItem("mathseq_progress")
    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedProgress) setProgress(JSON.parse(storedProgress))
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem("mathseq_user", JSON.stringify(user))
    else localStorage.removeItem("mathseq_user")
  }, [user])

  useEffect(() => {
    localStorage.setItem("mathseq_progress", JSON.stringify(progress))
    if (progress.teoriaCompleted && progress.practicaCompleted && !progress.juegoUnlocked) {
      setProgress(prev => ({ ...prev, juegoUnlocked: true }))
    }
  }, [progress])

  // ================= LOGIN =================
  const login = async (correo: string, contrasena: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      })
      const data = await res.json()

      if (res.ok && data.user) {
        setUser({
          id: data.user.id_usuario.toString(),
          nombre: data.user.nombre,
          correo: data.user.correo,
          id_rol: data.user.id_rol,
          role: mapRole(data.user.id_rol),
        })
        return { success: true }
      }

      return { success: false, message: data.message || "Credenciales incorrectas" }
    } catch (err) {
      console.error("Error login:", err)
      return { success: false, message: "Error de conexión con el servidor" }
    }
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
    setProgress(prev => ({ ...prev, ...updates }))
  }

  const mapRole = (id_rol: number): UserRole => {
    switch (id_rol) {
      case 1: return "estudiante"
      case 2: return "docente"
      case 3: return "administrador"
      default: return "estudiante"
    }
  }

  return (
    <AuthContext.Provider value={{ user, progress, login, logout, updateProgress, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
