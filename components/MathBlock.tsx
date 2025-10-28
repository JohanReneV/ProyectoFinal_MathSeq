"use client"

import { useEffect, useRef } from "react"
import katex from "katex"

interface MathBlockProps {
  expression: string
  displayMode?: boolean
}

export default function MathBlock({ expression, displayMode = true }: MathBlockProps) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(expression, ref.current, {
        throwOnError: false,
        displayMode,
        trust: true,
        strict: "ignore",
      })
    } catch (e) {
      // silencioso: no romper UI por una fórmula inválida
    }
  }, [expression, displayMode])

  return <span ref={ref} aria-label="math" />
}


