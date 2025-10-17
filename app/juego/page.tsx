"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import NivelCard from "@/components/nivel-card"
import { Home, Trophy, Clock, Target, Lock } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/auth-context"

const generarSucesion = (nivel: number) => {
  const tipos = ["aritmetica", "geometrica", "cuadrados"]
  const tipo = tipos[Math.floor(Math.random() * tipos.length)]

  if (tipo === "aritmetica") {
    const inicio = Math.floor(Math.random() * 10) + 1
    const diferencia = Math.floor(Math.random() * 5) + 1
    const sucesion = Array.from({ length: 4 }, (_, i) => inicio + i * diferencia)
    const respuesta = inicio + 4 * diferencia
    return { sucesion, respuesta, tipo: "Aritmética" }
  } else if (tipo === "geometrica") {
    const inicio = Math.floor(Math.random() * 3) + 2
    const razon = Math.floor(Math.random() * 2) + 2
    const sucesion = Array.from({ length: 4 }, (_, i) => inicio * Math.pow(razon, i))
    const respuesta = inicio * Math.pow(razon, 4)
    return { sucesion, respuesta, tipo: "Geométrica" }
  } else {
    const sucesion = Array.from({ length: 4 }, (_, i) => Math.pow(i + 1, 2))
    const respuesta = Math.pow(5, 2)
    return { sucesion, respuesta, tipo: "Cuadrados" }
  }
}

export default function JuegoPage() {
  const [nivel, setNivel] = useState(1)
  const [puntos, setPuntos] = useState(0)
  const [tiempo, setTiempo] = useState(60)
  const [juegoActivo, setJuegoActivo] = useState(false)
  const [sucesionActual, setSucesionActual] = useState(generarSucesion(1))
  const [respuesta, setRespuesta] = useState("")
  const router = useRouter()
  const { progress, updateProgress } = useAuth()

  useEffect(() => {
    let intervalo: NodeJS.Timeout
    if (juegoActivo && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo((t) => t - 1)
      }, 1000)
    } else if (tiempo === 0) {
      finalizarJuego()
    }
    return () => clearInterval(intervalo)
  }, [juegoActivo, tiempo])

  const iniciarJuego = () => {
    if (!progress.juegoUnlocked) {
      toast.error("Debes completar Teoría y Práctica para desbloquear el juego", {
        position: "top-center",
      })
      return
    }

    setJuegoActivo(true)
    setNivel(1)
    setPuntos(0)
    setTiempo(60)
    setSucesionActual(generarSucesion(1))
    setRespuesta("")
  }

  const verificarRespuesta = () => {
    if (Number.parseInt(respuesta) === sucesionActual.respuesta) {
      const puntosGanados = nivel * 10
      setPuntos(puntos + puntosGanados)
      setNivel(nivel + 1)
      toast.success(`¡Correcto! +${puntosGanados} puntos`, {
        position: "top-center",
        autoClose: 1500,
      })
      setSucesionActual(generarSucesion(nivel + 1))
      setRespuesta("")
    } else {
      toast.error("¡Incorrecto! Intenta de nuevo", {
        position: "top-center",
        autoClose: 1500,
      })
    }
  }

  const finalizarJuego = () => {
    setJuegoActivo(false)
    updateProgress({
      score: progress.score + puntos,
    })

    toast.success(`¡Juego terminado! Puntos finales: ${puntos}`, {
      position: "top-center",
      autoClose: 3000,
    })
  }

  return (
    <RouteGuard allowedRoles={["estudiante", "administrador"]} requireGameUnlock={false}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ToastContainer />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.push("/home")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] transition-colors"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
            </div>

            {!progress.juegoUnlocked ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center"
              >
                <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Lock className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">Juego Bloqueado</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Completa los módulos de Teoría y Práctica para desbloquear el juego
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Teoría</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${progress.teoriaCompleted ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400"}`}
                    >
                      {progress.teoriaCompleted ? "✓ Completado" : "Pendiente"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Práctica</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${progress.practicaCompleted ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400"}`}
                    >
                      {progress.practicaCompleted ? "✓ Completado" : "Pendiente"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : !juegoActivo ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center"
              >
                <div className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">Desafío de Sucesiones</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Adivina el siguiente número en cada sucesión. ¡Tienes 60 segundos!
                </p>
                <button
                  onClick={iniciarJuego}
                  className="px-8 py-4 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow"
                >
                  Comenzar Juego
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-3">
                    <Target className="w-8 h-8 text-[#1E88E5]" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nivel</p>
                      <p className="text-2xl font-bold text-[#1E88E5]">{nivel}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-[#43A047]" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Puntos</p>
                      <p className="text-2xl font-bold text-[#43A047]">{puntos}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo</p>
                      <p className="text-2xl font-bold text-purple-600">{tiempo}s</p>
                    </div>
                  </div>
                </div>

                <NivelCard
                  sucesion={sucesionActual}
                  respuesta={respuesta}
                  setRespuesta={setRespuesta}
                  verificarRespuesta={verificarRespuesta}
                />
              </>
            )}
          </motion.div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}
