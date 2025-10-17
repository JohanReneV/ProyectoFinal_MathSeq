"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface SequenceVisualizerProps {
  type: "aritmetica" | "geometrica" | "convergente"
  initialValue?: number
  difference?: number
  ratio?: number
  limit?: number
}

export default function SequenceVisualizer({
  type,
  initialValue = 2,
  difference = 3,
  ratio = 2,
  limit = 5,
}: SequenceVisualizerProps) {
  const [currentTerm, setCurrentTerm] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [data, setData] = useState<{ n: number; value: number }[]>([])

  const generateSequence = (terms: number) => {
    const sequence: { n: number; value: number }[] = []

    for (let n = 1; n <= terms; n++) {
      let value = 0

      if (type === "aritmetica") {
        value = initialValue + (n - 1) * difference
      } else if (type === "geometrica") {
        value = initialValue * Math.pow(ratio, n - 1)
      } else if (type === "convergente") {
        value = limit - limit / n
      }

      sequence.push({ n, value: Number.parseFloat(value.toFixed(2)) })
    }

    return sequence
  }

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    let term = currentTerm

    const interval = setInterval(() => {
      term++
      if (term > 10) {
        clearInterval(interval)
        setIsPlaying(false)
        return
      }

      setCurrentTerm(term)
      setData(generateSequence(term))
    }, 500)
  }

  const handleReset = () => {
    setCurrentTerm(0)
    setData([])
    setIsPlaying(false)
  }

  const getBehaviorIcon = () => {
    if (type === "aritmetica") {
      return difference > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />
    } else if (type === "geometrica") {
      return ratio > 1 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />
    } else {
      return <Minus className="w-5 h-5" />
    }
  }

  const getBehaviorText = () => {
    if (type === "aritmetica") {
      return difference > 0 ? "Creciente" : "Decreciente"
    } else if (type === "geometrica") {
      return ratio > 1 ? "Creciente" : "Decreciente"
    } else {
      return "Convergente"
    }
  }

  const getFormula = () => {
    if (type === "aritmetica") {
      return `$$a_n = ${initialValue} + (n-1) \\cdot ${difference}$$`
    } else if (type === "geometrica") {
      return `$$a_n = ${initialValue} \\cdot ${ratio}^{(n-1)}$$`
    } else {
      return `$$a_n = ${limit} - \\frac{${limit}}{n}$$`
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] p-2 rounded-lg text-white">
            {getBehaviorIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Visualizador de Sucesión</h3>
            <p className="text-sm text-gray-600">{getBehaviorText()}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            className="p-3 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1976D2] transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-2 font-semibold">Fórmula:</p>
        <div className="text-center text-lg">{getFormula()}</div>
      </div>

      <AnimatePresence mode="wait">
        {data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="n" label={{ value: "Término (n)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Valor", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                />
                {type === "convergente" && <ReferenceLine y={limit} stroke="#43A047" strokeDasharray="5 5" />}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1E88E5"
                  strokeWidth={3}
                  dot={{ fill: "#1E88E5", r: 5 }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {data.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 justify-center">
          {data.map((point, index) => (
            <motion.div
              key={point.n}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] text-white px-4 py-2 rounded-lg font-semibold shadow-md"
            >
              a<sub>{point.n}</sub> = {point.value}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
