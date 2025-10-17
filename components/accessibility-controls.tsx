"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Type, Settings, X } from "lucide-react"
import { useTheme } from "next-themes"

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedFontSize = localStorage.getItem("mathseq_fontSize") || "medium"
    setFontSize(savedFontSize)
    applyFontSize(savedFontSize)
  }, [])

  const applyFontSize = (size: string) => {
    const root = document.documentElement
    switch (size) {
      case "small":
        root.style.fontSize = "14px"
        break
      case "medium":
        root.style.fontSize = "16px"
        break
      case "large":
        root.style.fontSize = "18px"
        break
      case "xlarge":
        root.style.fontSize = "20px"
        break
    }
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem("mathseq_fontSize", size)
    applyFontSize(size)
  }

  if (!mounted) return null

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-[#1E88E5] to-[#43A047] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Abrir controles de accesibilidad"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Accesibilidad</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Cerrar panel"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                      <Sun className="w-5 h-5" />
                      Tema
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === "light"
                            ? "border-[#1E88E5] bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <Sun className="w-6 h-6 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Claro</p>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === "dark"
                            ? "border-[#1E88E5] bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <Moon className="w-6 h-6 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Oscuro</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                      <Type className="w-5 h-5" />
                      Tamaño de Fuente
                    </h3>
                    <div className="space-y-3">
                      {[
                        { value: "small", label: "Pequeña", size: "text-sm" },
                        { value: "medium", label: "Mediana", size: "text-base" },
                        { value: "large", label: "Grande", size: "text-lg" },
                        { value: "xlarge", label: "Muy Grande", size: "text-xl" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFontSizeChange(option.value)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            fontSize === option.value
                              ? "border-[#1E88E5] bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <p className={`${option.size} font-medium text-gray-700 dark:text-gray-300`}>
                            {option.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Atajos de Teclado</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Abrir accesibilidad:</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                          Alt + A
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Cambiar tema:</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                          Alt + T
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
