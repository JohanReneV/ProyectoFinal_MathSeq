"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import FunctionsIcon from "@mui/icons-material/Functions"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { register, isAuthenticated, user } = useAuth()

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    setIsLoading(true)
    const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`
    const result = await register(nombreCompleto, email, password, 1)
    
    if (result.success) {
      // Redirigir al login después del registro exitoso
      router.push("/?message=Registro exitoso. Por favor inicia sesión.")
    } else {
      setError(result.message || "No se pudo registrar")
    }
    
    setIsLoading(false)
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
            className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent"
          >
            Registrarse
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg"
          >
            Crea tu cuenta en MATHSEQ
          </motion.p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#1E88E5] focus:outline-none transition-all shadow-sm focus:shadow-md"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Tu apellido"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-[#1E88E5] focus:outline-none transition-all shadow-sm focus:shadow-md"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
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

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
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

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.0 }}
              className="text-center mt-4"
            >
              <Link 
                href="/" 
                className="inline-flex items-center text-[#1E88E5] hover:text-[#43A047] transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
