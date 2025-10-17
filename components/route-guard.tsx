"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/auth-context"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  requireGameUnlock?: boolean
}

export function RouteGuard({ children, allowedRoles, requireGameUnlock = false }: RouteGuardProps) {
  const { user, isAuthenticated, progress } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate page based on role
      if (user.role === "estudiante") {
        router.push("/home")
      } else if (user.role === "docente") {
        router.push("/panel-docente")
      } else if (user.role === "administrador") {
        router.push("/admin")
      }
      return
    }

    // Check if game unlock is required
    if (requireGameUnlock && !progress.juegoUnlocked) {
      router.push("/home")
    }
  }, [isAuthenticated, user, allowedRoles, requireGameUnlock, progress.juegoUnlocked, router])

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null
  }

  if (requireGameUnlock && !progress.juegoUnlocked) {
    return null
  }

  return <>{children}</>
}
