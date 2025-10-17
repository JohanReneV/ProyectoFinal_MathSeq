"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SequenceVisualizer from "@/components/sequence-visualizer"
import { ChevronLeft, ChevronRight, Home, Eye, CheckCircle } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/auth-context"

const temasTeoria = [
  {
    titulo: "Introducción a las Sucesiones",
    contenido:
      "Una sucesión es una lista ordenada de números que siguen un patrón específico. Cada número en la sucesión se llama término.",
    ejemplo: "Ejemplo: 2, 4, 6, 8, 10... (números pares)",
    formula: "$$a_n = 2n$$",
    visualizer: { type: "aritmetica" as const, initialValue: 2, difference: 2 },
  },
  {
    titulo: "Sucesiones Aritméticas",
    contenido:
      'Una sucesión aritmética es aquella donde la diferencia entre términos consecutivos es constante. Esta diferencia se llama "razón" (d).',
    ejemplo: "Ejemplo: 3, 7, 11, 15, 19... (d = 4)",
    formula: "$$a_n = a_1 + (n-1) \\cdot d$$",
    visualizer: { type: "aritmetica" as const, initialValue: 3, difference: 4 },
  },
  {
    titulo: "Sucesiones Geométricas",
    contenido:
      'Una sucesión geométrica es aquella donde cada término se obtiene multiplicando el anterior por una constante llamada "razón" (r).',
    ejemplo: "Ejemplo: 2, 6, 18, 54, 162... (r = 3)",
    formula: "$$a_n = a_1 \\cdot r^{(n-1)}$$",
    visualizer: { type: "geometrica" as const, initialValue: 2, ratio: 3 },
  },
  {
    titulo: "Sucesiones Convergentes",
    contenido:
      "Una sucesión convergente es aquella cuyos términos se acercan cada vez más a un valor límite específico a medida que n aumenta.",
    ejemplo: "Ejemplo: 4, 4.5, 4.67, 4.75, 4.8... (converge a 5)",
    formula: "$$a_n = 5 - \\frac{5}{n}$$",
    visualizer: { type: "convergente" as const, limit: 5 },
  },
]

export default function TeoriaPage() {
  const [temaActual, setTemaActual] = useState(0)
  const [showVisualizer, setShowVisualizer] = useState(false)
  const router = useRouter()
  const { updateProgress, progress } = useAuth()

  const siguiente = () => {
    if (temaActual < temasTeoria.length - 1) {
      setTemaActual(temaActual + 1)
      setShowVisualizer(false)
    } else {
      updateProgress({ teoriaCompleted: true })
    }
  }

  const anterior = () => {
    if (temaActual > 0) {
      setTemaActual(temaActual - 1)
      setShowVisualizer(false)
    }
  }

  const tema = temasTeoria[temaActual]

  return (
    <RouteGuard allowedRoles={["estudiante", "administrador"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => router.push("/home")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] transition-colors"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
              <div className="flex items-center gap-4">
                {progress.teoriaCompleted && (
                  <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Completado
                  </span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tema {temaActual + 1} de {temasTeoria.length}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={temaActual}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#1E88E5]">{tema.titulo}</h1>

                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-[#1E88E5] p-6 rounded-r-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tema.contenido}</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-[#43A047] p-6 rounded-r-lg">
                    <p className="font-semibold text-[#43A047] mb-2">Ejemplo:</p>
                    <p className="text-gray-700 dark:text-gray-300">{tema.ejemplo}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Fórmula:</p>
                    <div className="text-2xl dark:text-gray-100">{tema.formula}</div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setShowVisualizer(!showVisualizer)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white rounded-lg hover:shadow-lg transition-shadow mb-4"
                    >
                      <Eye className="w-5 h-5" />
                      {showVisualizer ? "Ocultar Visualización" : "Ver Visualización Interactiva"}
                    </button>

                    <AnimatePresence>
                      {showVisualizer && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <SequenceVisualizer {...tema.visualizer} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={anterior}
                    disabled={temaActual === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>

                  <button
                    onClick={siguiente}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    {temaActual === temasTeoria.length - 1 ? "Finalizar" : "Siguiente"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}
