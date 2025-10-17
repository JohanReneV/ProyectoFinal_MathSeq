"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Lightbulb, BookOpen, ChevronDown, ChevronUp } from "lucide-react"

interface EjercicioCardProps {
  ejercicio: {
    pregunta: string
    tipo: string
    nivel: "basico" | "intermedio" | "avanzado"
    pista: string
    pasos: string[]
  }
  numero: number
  total: number
  respuesta: string
  setRespuesta: (value: string) => void
  verificarRespuesta: () => void
}

export default function EjercicioCard({
  ejercicio,
  numero,
  total,
  respuesta,
  setRespuesta,
  verificarRespuesta,
}: EjercicioCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const getNivelColor = () => {
    switch (ejercicio.nivel) {
      case "basico":
        return "bg-green-100 text-green-700"
      case "intermedio":
        return "bg-yellow-100 text-yellow-700"
      case "avanzado":
        return "bg-red-100 text-red-700"
    }
  }

  const getNivelText = () => {
    switch (ejercicio.nivel) {
      case "basico":
        return "Básico"
      case "intermedio":
        return "Intermedio"
      case "avanzado":
        return "Avanzado"
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <span className="text-sm font-semibold text-gray-500">
          Ejercicio {numero} de {total}
        </span>
        <div className="flex gap-2">
          <span className={`px-3 py-1 ${getNivelColor()} rounded-full text-sm font-medium`}>{getNivelText()}</span>
          <span className="px-3 py-1 bg-blue-100 text-[#1E88E5] rounded-full text-sm font-medium">
            {ejercicio.tipo}
          </span>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">{ejercicio.pregunta}</h2>

      <div className="space-y-4 mb-6">
        <input
          type="number"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && verificarRespuesta()}
          placeholder="Escribe tu respuesta"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:border-[#1E88E5] focus:outline-none text-lg transition-colors"
        />

        <button
          onClick={verificarRespuesta}
          disabled={!respuesta.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-6 h-6" />
          Verificar Respuesta
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="font-medium">Ver Pista</span>
          {showHint ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </button>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
            >
              <p className="text-gray-700">{ejercicio.pista}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Ver Solución Paso a Paso</span>
          {showSolution ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </button>

        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg"
            >
              <p className="font-semibold text-blue-700 mb-3">Solución:</p>
              <ol className="space-y-2">
                {ejercicio.pasos.map((paso, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 text-gray-700"
                  >
                    <span className="font-bold text-blue-600">{index + 1}.</span>
                    <span>{paso}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
