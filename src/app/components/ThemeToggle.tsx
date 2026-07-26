'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light' : 'Dark'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${className}`}
      style={{
        color: 'var(--fg)',
        backgroundColor: 'transparent',
      }}
    >
      <span
        className="relative flex h-4 w-4 items-center justify-center"
        style={{ color: 'var(--fg-secondary)' }}
      >
        <Sun
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
          strokeWidth={1.75}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
          strokeWidth={1.75}
        />
      </span>
    </button>
  )
}
