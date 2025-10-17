"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { SvgIconComponent } from "@mui/icons-material"

interface CardTemaProps {
  tema: {
    titulo: string
    descripcion: string
    icono: SvgIconComponent
    color: string
    ruta: string
  }
  index: number
}

export default function CardTema({ tema, index }: CardTemaProps) {
  const router = useRouter()
  const Icono = tema.icono

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
      whileHover={{
        scale: 1.05,
        y: -10,
        boxShadow: "0 20px 40px rgba(30, 136, 229, 0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(tema.ruta)}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transition-all hover:shadow-2xl border border-gray-100"
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-br ${tema.color} p-5 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-lg`}
      >
        <Icono sx={{ fontSize: 40, color: "white" }} />
      </motion.div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{tema.titulo}</h3>
      <p className="text-gray-600 leading-relaxed text-base">{tema.descripcion}</p>

      <motion.div
        className="mt-6 flex items-center text-[#1E88E5] font-semibold"
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
      >
        <span>Comenzar</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="ml-2"
        >
          →
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
