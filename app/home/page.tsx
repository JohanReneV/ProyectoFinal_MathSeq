"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CardTema from "@/components/card-tema"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import CreateIcon from "@mui/icons-material/Create"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/auth-context"
import { Lock } from "lucide-react"

export default function HomePage() {
  const { user, progress } = useAuth()

  const estudianteTemas = [
    {
      titulo: "Teoría Interactiva",
      descripcion: "Aprende sobre sucesiones aritméticas, geométricas y mixtas",
      icono: MenuBookIcon,
      color: "from-blue-500 to-blue-600",
      ruta: "/teoria",
      locked: false,
    },
    {
      titulo: "Práctica Guiada",
      descripcion: "Resuelve ejercicios y recibe retroalimentación inmediata",
      icono: CreateIcon,
      color: "from-green-500 to-green-600",
      ruta: "/practica",
      locked: false,
    },
    {
      titulo: "Juego / Simulación",
      descripcion: progress.juegoUnlocked
        ? "Pon a prueba tus conocimientos de forma divertida"
        : "Completa Teoría y Práctica para desbloquear",
      icono: SportsEsportsIcon,
      color: "from-purple-500 to-purple-600",
      ruta: "/juego",
      locked: !progress.juegoUnlocked,
    },
  ]

  return (
    <RouteGuard allowedRoles={["estudiante", "administrador"]}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col"
        >
          <Navbar />

          <main className="flex-1 container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent">
                ¡Bienvenido, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Selecciona un módulo para comenzar tu aprendizaje
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {estudianteTemas.map((tema, index) => (
                <motion.div
                  key={tema.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {tema.locked && (
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm font-semibold">Bloqueado</p>
                      </div>
                    </div>
                  )}
                  <CardTema tema={tema} index={index} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Tu Progreso</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Teoría</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${progress.teoriaCompleted ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}
                    >
                      {progress.teoriaCompleted ? "Completado" : "En progreso"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Práctica</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${progress.practicaCompleted ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}
                    >
                      {progress.practicaCompleted
                        ? "Completado"
                        : `${progress.completedExercises}/${progress.totalExercises} ejercicios`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Juego</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${progress.juegoUnlocked ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}
                    >
                      {progress.juegoUnlocked ? "Desbloqueado" : "Bloqueado"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>

          <Footer />
        </motion.div>
      </AnimatePresence>
    </RouteGuard>
  )
}
