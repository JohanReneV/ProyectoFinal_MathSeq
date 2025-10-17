"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Home, Trophy, BookOpen, PenTool, Gamepad2 } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { progress } = useAuth()
  const router = useRouter()

  const teoriaProgress = progress.teoriaCompleted ? 100 : 0
  const practicaProgress = (progress.completedExercises / progress.totalExercises) * 100
  const juegoProgress = progress.juegoUnlocked ? 50 : 0

  const dataPie = [
    { name: "Teoría", value: teoriaProgress, color: "#1E88E5" },
    { name: "Práctica", value: practicaProgress, color: "#43A047" },
    { name: "Juego", value: juegoProgress, color: "#9C27B0" },
  ]

  const dataBar = [
    { modulo: "Teoría", progreso: teoriaProgress },
    { modulo: "Práctica", progreso: practicaProgress },
    { modulo: "Juego", progreso: juegoProgress },
  ]

  return (
    <RouteGuard allowedRoles={["estudiante", "administrador"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.push("/home")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] transition-colors"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
            </div>

            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent"
            >
              Tu Progreso
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#1E88E5] to-blue-600 rounded-xl shadow-lg p-6 text-white"
              >
                <BookOpen className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Teoría</p>
                <p className="text-3xl font-bold">{Math.round(teoriaProgress)}%</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#43A047] to-green-600 rounded-xl shadow-lg p-6 text-white"
              >
                <PenTool className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Práctica</p>
                <p className="text-3xl font-bold">{Math.round(practicaProgress)}%</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
              >
                <Gamepad2 className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Juego</p>
                <p className="text-3xl font-bold">{progress.juegoUnlocked ? "Desbloqueado" : "Bloqueado"}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
              >
                <Trophy className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Puntos Totales</p>
                <p className="text-3xl font-bold">{progress.score}</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Distribución del Progreso</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dataPie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${Math.round(value)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Progreso por Módulo</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataBar}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="modulo" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="progreso" fill="#1E88E5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}
