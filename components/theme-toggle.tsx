"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // マウント後のみレンダリング（ハイドレーションエラー回避）
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="relative w-11 h-6 rounded-full bg-secondary"
        disabled
      >
        <div className="absolute top-1 w-4 h-4 rounded-full bg-muted transition-transform translate-x-1" />
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        isDark ? "bg-primary" : "bg-secondary"
      }`}
      aria-label="テーマ切り替え"
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform flex items-center justify-center ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-primary" />
        ) : (
          <Sun className="w-3 h-3 text-secondary-foreground" />
        )}
      </div>
    </button>
  )
}
