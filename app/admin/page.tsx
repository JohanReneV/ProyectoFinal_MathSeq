"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Home, Users, BookOpen, Settings, BarChart3, Shield, Database, Activity } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "content" | "settings">("overview")

  // Mock data for demonstration
  const systemStats = {
    totalUsers: 127,
    activeStudents: 98,
    activeTeachers: 12,
    totalModules: 3,
    avgCompletion: 67.5,
    systemUptime: "99.8%",
  }

  const activityData = [
    { fecha: "Lun", estudiantes: 45, docentes: 8 },
    { fecha: "Mar", estudiantes: 52, docentes: 10 },
    { fecha: "Mié", estudiantes: 48, docentes: 9 },
    { fecha: "Jue", estudiantes: 61, docentes: 11 },
    { fecha: "Vie", estudiantes: 55, docentes: 12 },
    { fecha: "Sáb", estudiantes: 32, docentes: 5 },
    { fecha: "Dom", estudiantes: 28, docentes: 4 },
  ]

  const moduleUsage = [
    { modulo: "Teoría", usuarios: 85 },
    { modulo: "Práctica", usuarios: 72 },
    { modulo: "Juego", usuarios: 48 },
  ]

  const mockUsers = [
    { id: 1, nombre: "Ana García", email: "ana@example.com", rol: "estudiante", estado: "activo" },
    { id: 2, nombre: "Carlos López", email: "carlos@example.com", rol: "estudiante", estado: "activo" },
    { id: 3, nombre: "María Rodríguez", email: "maria@example.com", rol: "docente", estado: "activo" },
    { id: 4, nombre: "Juan Martínez", email: "juan@example.com", rol: "estudiante", estado: "inactivo" },
    { id: 5, nombre: "Laura Sánchez", email: "laura@example.com", rol: "docente", estado: "activo" },
  ]

  return (
    <RouteGuard allowedRoles={["administrador"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] transition-colors"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
            </div>

            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#1E88E5] to-[#43A047] bg-clip-text text-transparent"
            >
              Panel de Administración
            </motion.h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Vista General
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "content"
                    ? "bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Contenido
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "settings"
                    ? "bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="w-5 h-5" />
                Configuración
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#1E88E5] to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <Users className="w-10 h-10 mb-3" />
                    <p className="text-sm opacity-90">Total Usuarios</p>
                    <p className="text-3xl font-bold">{systemStats.totalUsers}</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#43A047] to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <Activity className="w-10 h-10 mb-3" />
                    <p className="text-sm opacity-90">Estudiantes Activos</p>
                    <p className="text-3xl font-bold">{systemStats.activeStudents}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <Shield className="w-10 h-10 mb-3" />
                    <p className="text-sm opacity-90">Docentes Activos</p>
                    <p className="text-3xl font-bold">{systemStats.activeTeachers}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <Database className="w-10 h-10 mb-3" />
                    <p className="text-sm opacity-90">Uptime del Sistema</p>
                    <p className="text-3xl font-bold">{systemStats.systemUptime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Actividad de la Semana</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="estudiantes" stroke="#1E88E5" strokeWidth={2} />
                        <Line type="monotone" dataKey="docentes" stroke="#43A047" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Uso de Módulos</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={moduleUsage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="modulo" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="usuarios" fill="#1E88E5" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestión de Usuarios</h2>
                    <button className="px-4 py-2 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white rounded-lg hover:shadow-lg transition-shadow">
                      Agregar Usuario
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Rol</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                            Estado
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-200">{user.nombre}</td>
                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {user.rol}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  user.estado === "activo"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {user.estado}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button className="text-[#1E88E5] hover:underline mr-3">Editar</button>
                              <button className="text-red-500 hover:underline">Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Gestión de Contenido</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-[#1E88E5] transition-colors cursor-pointer">
                      <BookOpen className="w-12 h-12 text-[#1E88E5] mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Módulo Teoría</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">4 temas disponibles</p>
                      <button className="text-[#1E88E5] hover:underline">Editar contenido</button>
                    </div>
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-[#43A047] transition-colors cursor-pointer">
                      <BookOpen className="w-12 h-12 text-[#43A047] mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Módulo Práctica</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">7 ejercicios disponibles</p>
                      <button className="text-[#43A047] hover:underline">Editar contenido</button>
                    </div>
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors cursor-pointer">
                      <BookOpen className="w-12 h-12 text-purple-500 mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Módulo Juego</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Generación dinámica activa</p>
                      <button className="text-purple-500 hover:underline">Configurar</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    Configuración del Sistema
                  </h2>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Configuración General
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Nombre de la Plataforma</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">MATHSEQ</p>
                          </div>
                          <button className="text-[#1E88E5] hover:underline">Editar</button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Modo de Mantenimiento</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Desactivado</p>
                          </div>
                          <button className="text-[#1E88E5] hover:underline">Cambiar</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Configuración de Módulos
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              Ejercicios requeridos para completar Práctica
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">20 ejercicios</p>
                          </div>
                          <button className="text-[#1E88E5] hover:underline">Editar</button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              Desbloqueo automático del Juego
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Activado (al completar Teoría y Práctica)
                            </p>
                          </div>
                          <button className="text-[#1E88E5] hover:underline">Cambiar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}
