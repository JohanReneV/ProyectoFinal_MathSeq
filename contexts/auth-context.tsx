"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api"

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
  register: (
    nombre: string,
    correo: string,
    contrasena: string,
    id_rol?: number
  ) => Promise<{ success: boolean; message?: string }>
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

  const cargarProgresoDelServidor = async () => {
    try {
      const response = await apiService.getProgreso()
      if (response.success && response.data) {
        const serverProgreso = response.data
        setProgress({
          teoriaCompleted: serverProgreso.teoria_completada,
          practicaCompleted: serverProgreso.practica_completada,
          juegoUnlocked: serverProgreso.juego_desbloqueado,
          completedExercises: serverProgreso.ejercicios_completados,
          totalExercises: serverProgreso.ejercicios_totales,
          score: serverProgreso.puntuacion,
        })
      }
    } catch (error) {
      console.error("Error cargando progreso del servidor:", error)
    }
  }

  const sincronizarConBackend = async () => {
    if (!user?.id) return
    try {
      await apiService.updateProgreso({
        teoria_completada: progress.teoriaCompleted,
        practica_completada: progress.practicaCompleted,
        juego_desbloqueado: progress.juegoUnlocked,
        ejercicios_completados: progress.completedExercises,
        ejercicios_totales: progress.totalExercises,
        puntuacion: progress.score,
      })
    } catch (error) {
      console.error("Error sincronizando progreso:", error)
    }
  }

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
    
    // Sincronizar con backend si hay usuario autenticado
    if (user?.id) {
      sincronizarConBackend()
    }
  }, [progress])

  
  const login = async (correo: string, contrasena: string): Promise<{ success: boolean; message?: string }> => {
    // Validaciones básicas
    if (!correo.trim() || !contrasena.trim()) {
      return { success: false, message: "Correo y contraseña son obligatorios" }
    }

    const normalizeUser = (payload: any): { id?: string; nombre?: string; correo?: string; id_rol?: number } | null => {
      if (!payload) return null
      const u = payload.user ?? payload
      if (!u) return null
      const rawId = u.id ?? u.id_usuario
      if (rawId == null) return null
      return {
        id: String(rawId),
        nombre: u.nombre,
        correo: u.correo,
        id_rol: u.id_rol,
      }
    }

    const setFromUser = (u: { id?: string; nombre?: string; correo?: string; id_rol?: number } | null) => {
      if (!u || !u.id || u.id_rol == null) return false
      setUser({
        id: u.id,
        nombre: u.nombre || "",
        correo: u.correo || correo,
        id_rol: u.id_rol,
        role: mapRole(u.id_rol),
      })
      return true
    }

    const extractMessage = (data: any, fallback: string) => {
      if (data?.error) return data.error
      if (data?.message) return data.message
      return fallback
    }

    try {
      const response = await apiService.login(correo, contrasena)
      
      if (!response.success) {
        return { success: false, message: response.error || "Error al iniciar sesión" }
      }

      if (!response.data) {
        return { success: false, message: "Datos de usuario inválidos" }
      }

      const u = normalizeUser(response.data)
      if (setFromUser(u)) {
        // Cargar progreso del servidor
        await cargarProgresoDelServidor()
        return { success: true }
      }
      
      return { success: false, message: "Datos de usuario inválidos" }
    } catch (err) {
      console.error("Error de conexión:", err)
      return { success: false, message: "Error de conexión. Verifica tu internet" }
    }
  }

  const register = async (
    nombre: string,
    correo: string,
    contrasena: string,
    id_rol: number = 1
  ): Promise<{ success: boolean; message?: string }> => {
    // Validaciones básicas
    if (!nombre.trim() || !correo.trim() || !contrasena.trim()) {
      return { success: false, message: "Todos los campos son obligatorios" }
    }

    if (contrasena.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres" }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    try {
      const response = await apiService.register(nombre, correo, contrasena, id_rol)
      
      if (!response.success) {
        return { success: false, message: response.error || "No se pudo registrar" }
      }

      return { success: true, message: response.message || "Registrado correctamente" }
    } catch (err) {
      console.error("Error de conexión en registro:", err)
      return { success: false, message: "Error de conexión. Verifica tu internet" }
    }
  }

  const logout = () => {
    apiService.logout()
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
    <AuthContext.Provider value={{ user, progress, login, register, logout, updateProgress, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
