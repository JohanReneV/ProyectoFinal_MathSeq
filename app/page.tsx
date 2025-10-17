"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import FunctionsIcon from "@mui/icons-material/Functions"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === "estudiante") {
        router.push("/home")
      } else if (user.role === "docente") {
        router.push("/panel-docente")
      } else if (user.role === "administrador") {
        router.push("/admin")
      }
    }
  }, [isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (email.trim() && password.trim()) {
      setIsLoading(true)

      const success = await login(email, password)

      if (success) {
        // Redirect will happen via useEffect
      } else {
        setError("Credenciales incorrectas. Por favor, intenta de nuevo.")
        setIsLoading(false)
      }
    }
  }

  const fillDemoCredentials = (role: "estudiante" | "docente" | "administrador") => {
    if (role === "estudiante") {
      setEmail("estudiante@mathseq.com")
      setPassword("estudiante123")
    } else if (role === "docente") {
      setEmail("docente@mathseq.com")
      setPassword("docente123")
    } else {
      setEmail("admin@mathseq.com")
      setPassword("admin123")
    }
    setShowDemoCredentials(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 text-6xl text-[#1E88E5] opacity-10"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      >
        ∑
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-5xl text-[#43A047] opacity-10"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      >
        √
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-20 text-4xl text-[#1E88E5] opacity-10"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
      >
        π
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] p-5 rounded-2xl shadow-lg"
            >
              <FunctionsIcon sx={{ fontSize: 48, color: "white" }} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent"
          >
            MATHSEQ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg"
          >
            Aprende Sucesiones Matemáticas
          </motion.p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#1E88E5] focus:outline-none transition-all shadow-sm focus:shadow-md"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#1E88E5] focus:outline-none transition-all shadow-sm focus:shadow-md"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(30, 136, 229, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
              transition={isLoading ? { repeat: Number.POSITIVE_INFINITY, duration: 0.6 } : {}}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 text-lg"
            >
              {isLoading ? "Entrando..." : "Iniciar Sesión"}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-[#1E88E5] transition-colors"
            >
              Ver credenciales de demostración
            </button>

            {showDemoCredentials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-2 text-sm"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Estudiante:</p>
                  <p className="text-gray-600 dark:text-gray-300">estudiante@mathseq.com / estudiante123</p>
                  <button
                    onClick={() => fillDemoCredentials("estudiante")}
                    className="mt-2 text-[#1E88E5] hover:underline"
                  >
                    Usar estas credenciales
                  </button>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Docente:</p>
                  <p className="text-gray-600 dark:text-gray-300">docente@mathseq.com / docente123</p>
                  <button
                    onClick={() => fillDemoCredentials("docente")}
                    className="mt-2 text-[#43A047] hover:underline"
                  >
                    Usar estas credenciales
                  </button>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Administrador:</p>
                  <p className="text-gray-600 dark:text-gray-300">admin@mathseq.com / admin123</p>
                  <button
                    onClick={() => fillDemoCredentials("administrador")}
                    className="mt-2 text-purple-600 hover:underline"
                  >
                    Usar estas credenciales
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
