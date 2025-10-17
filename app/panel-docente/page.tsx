"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Home, Users, TrendingUp, Award, BookOpen, PenTool, Gamepad2, Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { RouteGuard } from "@/components/route-guard"

interface StudentData {
  nombre: string
  teoria: number
  practica: number
  juego: number
  puntosTotal: number
  promedioGeneral: number
}

export default function PanelDocentePage() {
  const [estudiantes, setEstudiantes] = useState<StudentData[]>([])
  const router = useRouter()

  useEffect(() => {
    cargarDatosEstudiantes()
  }, [])

  const cargarDatosEstudiantes = () => {
    const datosSimulados: StudentData[] = [
      {
        nombre: "Ana García",
        teoria: 100,
        practica: 85,
        juego: 90,
        puntosTotal: 450,
        promedioGeneral: 91.67,
      },
      {
        nombre: "Carlos López",
        teoria: 75,
        practica: 80,
        juego: 70,
        puntosTotal: 380,
        promedioGeneral: 75,
      },
      {
        nombre: "María Rodríguez",
        teoria: 90,
        practica: 95,
        juego: 85,
        puntosTotal: 520,
        promedioGeneral: 90,
      },
      {
        nombre: "Juan Martínez",
        teoria: 60,
        practica: 65,
        juego: 55,
        puntosTotal: 280,
        promedioGeneral: 60,
      },
      {
        nombre: "Laura Sánchez",
        teoria: 85,
        practica: 90,
        juego: 80,
        puntosTotal: 470,
        promedioGeneral: 85,
      },
    ]

    setEstudiantes(datosSimulados)
  }

  const promedioClase = {
    teoria: estudiantes.reduce((acc, est) => acc + est.teoria, 0) / (estudiantes.length || 1),
    practica: estudiantes.reduce((acc, est) => acc + est.practica, 0) / (estudiantes.length || 1),
    juego: estudiantes.reduce((acc, est) => acc + est.juego, 0) / (estudiantes.length || 1),
    general: estudiantes.reduce((acc, est) => acc + est.promedioGeneral, 0) / (estudiantes.length || 1),
  }

  const dataModulos = [
    { modulo: "Teoría", promedio: promedioClase.teoria },
    { modulo: "Práctica", promedio: promedioClase.practica },
    { modulo: "Juego", promedio: promedioClase.juego },
  ]

  const dataDistribucion = [
    { rango: "90-100", cantidad: estudiantes.filter((e) => e.promedioGeneral >= 90).length },
    { rango: "80-89", cantidad: estudiantes.filter((e) => e.promedioGeneral >= 80 && e.promedioGeneral < 90).length },
    { rango: "70-79", cantidad: estudiantes.filter((e) => e.promedioGeneral >= 70 && e.promedioGeneral < 80).length },
    { rango: "60-69", cantidad: estudiantes.filter((e) => e.promedioGeneral >= 60 && e.promedioGeneral < 70).length },
    { rango: "<60", cantidad: estudiantes.filter((e) => e.promedioGeneral < 60).length },
  ]

  const exportarDatos = () => {
    const csv = [
      ["Nombre", "Teoría", "Práctica", "Juego", "Puntos Totales", "Promedio General"],
      ...estudiantes.map((est) => [
        est.nombre,
        est.teoria,
        est.practica,
        est.juego,
        est.puntosTotal,
        est.promedioGeneral.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_estudiantes.csv"
    a.click()
  }

  return (
    <RouteGuard allowedRoles={["docente", "administrador"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] transition-colors"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
              <button
                onClick={exportarDatos}
                className="flex items-center gap-2 px-4 py-2 bg-[#43A047] text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                Exportar Datos
              </button>
            </div>

            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent"
            >
              Panel del Docente
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#1E88E5] to-blue-600 rounded-xl shadow-lg p-6 text-white"
              >
                <Users className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Total Estudiantes</p>
                <p className="text-3xl font-bold">{estudiantes.length}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#43A047] to-green-600 rounded-xl shadow-lg p-6 text-white"
              >
                <TrendingUp className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Promedio General</p>
                <p className="text-3xl font-bold">{promedioClase.general.toFixed(1)}%</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
              >
                <Award className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Estudiantes Destacados</p>
                <p className="text-3xl font-bold">{estudiantes.filter((e) => e.promedioGeneral >= 90).length}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
              >
                <BookOpen className="w-10 h-10 mb-3" />
                <p className="text-sm opacity-90">Módulos Activos</p>
                <p className="text-3xl font-bold">3</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Promedio por Módulo</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataModulos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="modulo" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="promedio" fill="#1E88E5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Distribución de Calificaciones
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataDistribucion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rango" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#43A047" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Desempeño Individual</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Estudiante</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center justify-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Teoría
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center justify-center gap-2">
                          <PenTool className="w-4 h-4" />
                          Práctica
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center justify-center gap-2">
                          <Gamepad2 className="w-4 h-4" />
                          Juego
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Puntos</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((estudiante, index) => (
                      <motion.tr
                        key={estudiante.nombre}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-200">{estudiante.nombre}</td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              estudiante.teoria >= 80
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : estudiante.teoria >= 60
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {estudiante.teoria}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              estudiante.practica >= 80
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : estudiante.practica >= 60
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {estudiante.practica}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              estudiante.juego >= 80
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : estudiante.juego >= 60
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {estudiante.juego}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                          {estudiante.puntosTotal}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-lg font-bold text-[#1E88E5]">
                            {estudiante.promedioGeneral.toFixed(1)}%
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}
