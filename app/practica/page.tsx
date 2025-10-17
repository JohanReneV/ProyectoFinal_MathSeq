"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import EjercicioCard from "@/components/ejercicio-card"
import { Home, Filter, CheckCircle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/auth-context"

const ejercicios = [
  {
    pregunta: "¿Cuál es el siguiente término en la sucesión: 2, 5, 8, 11, ...?",
    respuestaCorrecta: "14",
    tipo: "Aritmética",
    nivel: "basico" as const,
    explicacion: "Es una sucesión aritmética con diferencia d=3. El siguiente término es 11+3=14",
    pista: "Observa la diferencia entre términos consecutivos. ¿Es constante?",
    pasos: [
      "Identifica el patrón: 5-2=3, 8-5=3, 11-8=3",
      "La diferencia común es d=3",
      "Aplica la fórmula: siguiente término = 11 + 3",
      "Resultado: 14",
    ],
  },
  {
    pregunta: "¿Cuál es el siguiente término en la sucesión: 3, 9, 27, 81, ...?",
    respuestaCorrecta: "243",
    tipo: "Geométrica",
    nivel: "basico" as const,
    explicacion: "Es una sucesión geométrica con razón r=3. El siguiente término es 81×3=243",
    pista: "¿Qué operación relaciona cada término con el anterior?",
    pasos: [
      "Identifica el patrón: 9÷3=3, 27÷9=3, 81÷27=3",
      "La razón común es r=3",
      "Aplica la fórmula: siguiente término = 81 × 3",
      "Resultado: 243",
    ],
  },
  {
    pregunta: "¿Cuál es el siguiente término en la sucesión: 1, 4, 9, 16, ...?",
    respuestaCorrecta: "25",
    tipo: "Cuadrados",
    nivel: "intermedio" as const,
    explicacion: "Son cuadrados perfectos: 1², 2², 3², 4², ... El siguiente es 5²=25",
    pista: "Piensa en números elevados al cuadrado.",
    pasos: [
      "Reconoce el patrón: 1=1², 4=2², 9=3², 16=4²",
      "Son cuadrados perfectos de números consecutivos",
      "El siguiente número es 5",
      "Calcula: 5² = 25",
    ],
  },
  {
    pregunta: "¿Cuál es el siguiente término en la sucesión: 10, 7, 4, 1, ...?",
    respuestaCorrecta: "-2",
    tipo: "Aritmética",
    nivel: "intermedio" as const,
    explicacion: "Es una sucesión aritmética con diferencia d=-3. El siguiente término es 1-3=-2",
    pista: "La sucesión puede ser decreciente. Observa cómo disminuyen los valores.",
    pasos: [
      "Identifica el patrón: 7-10=-3, 4-7=-3, 1-4=-3",
      "La diferencia común es d=-3 (negativa)",
      "Aplica la fórmula: siguiente término = 1 + (-3)",
      "Resultado: -2",
    ],
  },
  {
    pregunta: "¿Cuál es el siguiente término en la sucesión: 2, 6, 18, 54, ...?",
    respuestaCorrecta: "162",
    tipo: "Geométrica",
    nivel: "basico" as const,
    explicacion: "Es una sucesión geométrica con razón r=3. El siguiente término es 54×3=162",
    pista: "Divide cada término por el anterior para encontrar la razón.",
    pasos: [
      "Identifica el patrón: 6÷2=3, 18÷6=3, 54÷18=3",
      "La razón común es r=3",
      "Aplica la fórmula: siguiente término = 54 × 3",
      "Resultado: 162",
    ],
  },
  {
    pregunta: "En la sucesión aritmética donde a₁=5 y d=7, ¿cuál es a₅?",
    respuestaCorrecta: "33",
    tipo: "Aritmética",
    nivel: "avanzado" as const,
    explicacion: "Usando la fórmula aₙ = a₁ + (n-1)d: a₅ = 5 + (5-1)×7 = 5 + 28 = 33",
    pista: "Usa la fórmula general de sucesiones aritméticas: aₙ = a₁ + (n-1)d",
    pasos: [
      "Identifica los valores: a₁=5, d=7, n=5",
      "Aplica la fórmula: aₙ = a₁ + (n-1)d",
      "Sustituye: a₅ = 5 + (5-1)×7",
      "Calcula: a₅ = 5 + 4×7 = 5 + 28 = 33",
    ],
  },
  {
    pregunta: "En la sucesión geométrica donde a₁=3 y r=2, ¿cuál es a₄?",
    respuestaCorrecta: "24",
    tipo: "Geométrica",
    nivel: "avanzado" as const,
    explicacion: "Usando la fórmula aₙ = a₁ × r^(n-1): a₄ = 3 × 2³ = 3 × 8 = 24",
    pista: "Usa la fórmula general de sucesiones geométricas: aₙ = a₁ × r^(n-1)",
    pasos: [
      "Identifica los valores: a₁=3, r=2, n=4",
      "Aplica la fórmula: aₙ = a₁ × r^(n-1)",
      "Sustituye: a₄ = 3 × 2^(4-1)",
      "Calcula: a₄ = 3 × 2³ = 3 × 8 = 24",
    ],
  },
]

export default function PracticaPage() {
  const [ejercicioActual, setEjercicioActual] = useState(0)
  const [respuesta, setRespuesta] = useState("")
  const [correctas, setCorrectas] = useState(0)
  const [nivelFiltro, setNivelFiltro] = useState<"todos" | "basico" | "intermedio" | "avanzado">("todos")
  const [showFilter, setShowFilter] = useState(false)
  const router = useRouter()
  const { updateProgress, progress } = useAuth()

  const ejerciciosFiltrados = nivelFiltro === "todos" ? ejercicios : ejercicios.filter((ej) => ej.nivel === nivelFiltro)

  const verificarRespuesta = () => {
    const ejercicio = ejerciciosFiltrados[ejercicioActual]

    if (respuesta.trim() === ejercicio.respuestaCorrecta) {
      toast.success(`¡Correcto! ${ejercicio.explicacion}`, {
        position: "top-center",
        autoClose: 4000,
      })
      const newCorrect = correctas + 1
      setCorrectas(newCorrect)

      const newCompletedExercises = progress.completedExercises + 1
      updateProgress({
        completedExercises: newCompletedExercises,
        score: progress.score + 10,
      })

      if (newCompletedExercises >= progress.totalExercises) {
        updateProgress({ practicaCompleted: true })
      }

      setTimeout(() => {
        if (ejercicioActual < ejerciciosFiltrados.length - 1) {
          setEjercicioActual(ejercicioActual + 1)
          setRespuesta("")
        } else {
          toast.info("¡Has completado todos los ejercicios de este nivel!", {
            position: "top-center",
          })
        }
      }, 2000)
    } else {
      toast.error(`Incorrecto. ${ejercicio.explicacion}`, {
        position: "top-center",
        autoClose: 4000,
      })
    }
  }

  return (
    <RouteGuard allowedRoles={["estudiante", "administrador"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ToastContainer />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => router.push("/home")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] transition-colors"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
              <div className="flex items-center gap-4">
                {progress.practicaCompleted && (
                  <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Completado
                  </span>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Nivel</span>
                  </button>
                  {showFilter && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <button
                        onClick={() => {
                          setNivelFiltro("todos")
                          setEjercicioActual(0)
                          setShowFilter(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => {
                          setNivelFiltro("basico")
                          setEjercicioActual(0)
                          setShowFilter(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Básico
                      </button>
                      <button
                        onClick={() => {
                          setNivelFiltro("intermedio")
                          setEjercicioActual(0)
                          setShowFilter(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Intermedio
                      </button>
                      <button
                        onClick={() => {
                          setNivelFiltro("avanzado")
                          setEjercicioActual(0)
                          setShowFilter(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                      >
                        Avanzado
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Correctas: <span className="font-bold text-[#43A047]">{correctas}</span> /{" "}
                  {ejerciciosFiltrados.length}
                </div>
              </div>
            </div>

            <EjercicioCard
              ejercicio={ejerciciosFiltrados[ejercicioActual]}
              numero={ejercicioActual + 1}
              total={ejerciciosFiltrados.length}
              respuesta={respuesta}
              setRespuesta={setRespuesta}
              verificarRespuesta={verificarRespuesta}
            />
          </motion.div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}
