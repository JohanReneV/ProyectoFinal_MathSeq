/**
 * API Service - Centralizado para todas las llamadas al backend
 */

const BACKEND_URL = "https://mathseq-backend.onrender.com"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  id: string
  nombre: string
  correo: string
  id_rol: number
}

export interface Progreso {
  usuario_id: string
  teoria_completada: boolean
  practica_completada: boolean
  juego_desbloqueado: boolean
  ejercicios_completados: number
  ejercicios_totales: number
  puntuacion: number
}

export interface EstudianteData {
  id: string
  nombre: string
  correo: string
  teoria_progreso: number
  practica_progreso: number
  juego_progreso: number
  puntos_totales: number
  promedio_general: number
}

export interface EstadisticasAdmin {
  total_usuarios: number
  estudiantes_activos: number
  docentes_activos: number
  modulos_activos: number
  promedio_completacion: number
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = BACKEND_URL
  }

  /**
   * Hace una petición HTTP al backend
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      
      // Obtener token de localStorage si existe
      const token = localStorage.getItem("mathseq_token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }

      // Agregar headers adicionales si existen
      if (options.headers) {
        Object.assign(headers, options.headers)
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      let data: any
      try {
        data = await response.json()
      } catch (e) {
        return {
          success: false,
          error: "Respuesta inválida del servidor",
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data?.error || data?.message || `Error ${response.status}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      console.error("Error en petición API:", error)
      return {
        success: false,
        error: "Error de conexión. Verifica tu internet",
      }
    }
  }

  // ============ AUTENTICACIÓN ============

  /**
   * Login de usuario
   */
  async login(correo: string, contrasena: string) {
    const result = await this.request<User>("/api/usuarios/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    })

    // Guardar token si existe
    if (result.success && result.data) {
      const token = (result.data as any).token
      if (token) {
        localStorage.setItem("mathseq_token", token)
      }
    }

    return result
  }

  /**
   * Registro de usuario
   */
  async register(nombre: string, correo: string, contrasena: string, id_rol: number = 1) {
    return this.request<User>("/api/usuarios/register", {
      method: "POST",
      body: JSON.stringify({ nombre, correo, contrasena, id_rol }),
    })
  }

  /**
   * Obtener usuario actual
   */
  async getCurrentUser() {
    return this.request<User>("/api/usuarios/me")
  }

  /**
   * Logout (limpia el token)
   */
  logout() {
    localStorage.removeItem("mathseq_token")
  }

  // ============ PROGRESO ============

  /**
   * Obtener progreso del usuario actual
   */
  async getProgreso(): Promise<ApiResponse<Progreso>> {
    return this.request<Progreso>("/api/progreso")
  }

  /**
   * Actualizar progreso del usuario
   */
  async updateProgreso(progreso: Partial<Progreso>): Promise<ApiResponse<Progreso>> {
    return this.request<Progreso>("/api/progreso", {
      method: "PUT",
      body: JSON.stringify(progreso),
    })
  }

  /**
   * Sincronizar progreso con el backend
   */
  async sincronizarProgreso(localProgreso: any): Promise<ApiResponse<Progreso>> {
    const token = localStorage.getItem("mathseq_token")
    if (!token) {
      return { success: false, error: "No autenticado" }
    }

    // Primero intenta obtener el progreso del servidor
    const serverProgreso = await this.getProgreso()
    
    if (!serverProgreso.success || !serverProgreso.data) {
      // Si no existe, crea uno nuevo
      return this.updateProgreso({
        teoria_completada: localProgreso.teoriaCompleted,
        practica_completada: localProgreso.practicaCompleted,
        juego_desbloqueado: localProgreso.juegoUnlocked,
        ejercicios_completados: localProgreso.completedExercises,
        ejercicios_totales: localProgreso.totalExercises,
        puntuacion: localProgreso.score,
      })
    }

    // Si existe, actualiza solo si el local es más reciente
    return this.updateProgreso(localProgreso)
  }

  // ============ DOCENTES ============

  /**
   * Obtener lista de estudiantes (para docentes)
   */
  async getEstudiantes(): Promise<ApiResponse<EstudianteData[]>> {
    return this.request<EstudianteData[]>("/api/docentes/estudiantes")
  }

  /**
   * Obtener progreso de un estudiante específico
   */
  async getProgresoEstudiante(estudianteId: string): Promise<ApiResponse<Progreso>> {
    return this.request<Progreso>(`/api/docentes/estudiantes/${estudianteId}/progreso`)
  }

  // ============ ADMIN ============

  /**
   * Obtener estadísticas del sistema (para admin)
   */
  async getEstadisticas(): Promise<ApiResponse<EstadisticasAdmin>> {
    return this.request<EstadisticasAdmin>("/api/admin/estadisticas")
  }

  /**
   * Obtener lista de usuarios (para admin)
   */
  async getUsuarios(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>("/api/admin/usuarios")
  }

  /**
   * Actualizar rol de usuario (para admin)
   */
  async updateRolUsuario(usuarioId: string, nuevoRol: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/admin/usuarios/${usuarioId}/rol`, {
      method: "PUT",
      body: JSON.stringify({ id_rol: nuevoRol }),
    })
  }

  /**
   * Eliminar usuario (para admin)
   */
  async deleteUsuario(usuarioId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/admin/usuarios/${usuarioId}`, {
      method: "DELETE",
    })
  }
}

// Exportar instancia singleton
export const apiService = new ApiService()
export default apiService

