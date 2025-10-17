"use client"

import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm text-center md:text-left">
            © 2025 MATHSEQ - Plataforma Educativa de Matemáticas
          </p>
          <p className="flex items-center gap-2 text-gray-600 text-sm">
            Hecho con <Heart className="w-4 h-4 text-red-500 fill-current" /> para estudiantes
          </p>
        </div>
      </div>
    </footer>
  )
}
