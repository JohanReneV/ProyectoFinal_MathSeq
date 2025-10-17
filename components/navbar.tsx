"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, BarChart3, BookOpen, Home, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent">
              MATHSEQ
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">Hola, {user.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hidden sm:block">
              {user.role === "estudiante" ? "Estudiante" : user.role === "docente" ? "Docente" : "Admin"}
            </span>

            {user.role === "estudiante" && (
              <>
                <button
                  onClick={() => router.push("/home")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#43A047] transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Inicio</span>
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#43A047] transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="hidden sm:inline">Mi Progreso</span>
                </button>
              </>
            )}

            {user.role === "docente" && (
              <button
                onClick={() => router.push("/panel-docente")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#43A047] transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Panel Docente</span>
              </button>
            )}

            {user.role === "administrador" && (
              <>
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#43A047] transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
                <button
                  onClick={() => router.push("/home")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#43A047] transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Estudiante</span>
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
