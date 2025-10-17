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
  const [email, setEmail] = useState("demo@mathseq.com")
  const [password, setPassword] = useState("demo1234")
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, register, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {

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
      const { success, message } = await login(email, password)
      setIsLoading(false)
  
      if (!success) {
        setError(message || "Error de inicio de sesión")
      }
    }
  }

  const handleRegister = async () => {
    setError("")
    if (!email.trim() || !password.trim()) return

    setIsRegistering(true)
    const nombre = email.split("@")[0] || "Usuario"
    const result = await register(nombre, email, password, 1)
    if (!result.success) {
      setIsRegistering(false)
      setError(result.message || "No se pudo registrar")
      return
    }
    // Tras registrar, iniciar sesión automáticamente
    const loginResult = await login(email, password)
    setIsRegistering(false)
    if (!loginResult.success) {
      setError(loginResult.message || "Registrado pero no se pudo iniciar sesión")
    }
  }

  const handleDemoLogin = async () => {
    setError("")
    const demoEmail = "demo@mathseq.com"
    const demoPass = "demo1234"
    setEmail(demoEmail)
    setPassword(demoPass)
    setIsLoading(true)
    // Intentar login directo
    const firstTry = await login(demoEmail, demoPass)
    if (firstTry.success) {
      setIsLoading(false)
      return
    }
    // Si falla, registrar y luego login
    const reg = await register("Demo", demoEmail, demoPass, 1)
    if (!reg.success) {
      setIsLoading(false)
      setError(reg.message || "No se pudo crear usuario demo")
      return
    }
    const secondTry = await login(demoEmail, demoPass)
    setIsLoading(false)
    if (!secondTry.success) {
      setError(secondTry.message || "No se pudo iniciar sesión con demo")
    }
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
            <motion.button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading || isRegistering}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-3 bg-[#1E88E5] text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition-all disabled:opacity-70 text-base"
            >
              Entrar Demo
            </motion.button>
            <motion.button
              type="button"
              onClick={handleRegister}
              disabled={isRegistering || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={isRegistering ? { scale: [1, 1.05, 1] } : {}}
              transition={isRegistering ? { repeat: Number.POSITIVE_INFINITY, duration: 0.6 } : {}}
              className="w-full mt-3 border-2 border-[#1E88E5] text-[#1E88E5] dark:text-white dark:border-gray-700 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-70 text-lg"
            >
              {isRegistering ? "Registrando..." : "Registrar"}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
