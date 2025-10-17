"use client"

import { motion } from "framer-motion"
import { Send } from "lucide-react"

interface NivelCardProps {
  sucesion: {
    sucesion: number[]
    tipo: string
  }
  respuesta: string
  setRespuesta: (value: string) => void
  verificarRespuesta: () => void
}

export default function NivelCard({ sucesion, respuesta, setRespuesta, verificarRespuesta }: NivelCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
    >
      <div className="mb-6">
        <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
          Sucesión {sucesion.tipo}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">¿Cuál es el siguiente número?</h2>

      <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
        {sucesion.sucesion.map((num, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-[#1E88E5] to-[#43A047] rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          >
            {num}
          </motion.div>
        ))}
        <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-3xl font-bold">
          ?
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="number"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && verificarRespuesta()}
          placeholder="Tu respuesta"
          className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-lg focus:border-[#1E88E5] focus:outline-none text-lg transition-colors"
        />
        <button
          onClick={verificarRespuesta}
          disabled={!respuesta.trim()}
          className="px-8 py-4 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white rounded-lg font-semibold hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Enviar
        </button>
      </div>
    </motion.div>
  )
}
