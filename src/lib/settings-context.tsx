import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { AppSettings, ThemeMode } from './types'
import { loadSettings, saveSettings } from './storage'

interface SettingsContextValue {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
  theme: ThemeMode
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function resolveTheme(theme: AppSettings['theme']): ThemeMode {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [theme, setTheme] = useState<ThemeMode>(resolveTheme(settings.theme))

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      return next
    })
  }, [])

  // Sync visual theme to DOM
  useEffect(() => {
    document.documentElement.dataset.visualTheme = settings.visualTheme
    // Also update theme-color meta when visual theme changes
    const resolved = resolveTheme(settings.theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const themeColors: Record<string, { dark: string; light: string }> = {
        editorial: { dark: '#1e1c1a', light: '#f5f2ed' },
        frost: { dark: '#1a1e24', light: '#fafaf8' },
        forge: { dark: '#151517', light: '#151517' },
      }
      const palette = themeColors[settings.visualTheme] || themeColors.editorial
      meta.setAttribute('content', resolved === 'dark' ? palette.dark : palette.light)
    }
  }, [settings.visualTheme, settings.theme])

  // Sync dark/light theme to DOM and resolve system preference
  useEffect(() => {
    const resolved = resolveTheme(settings.theme)
    setTheme(resolved)
    document.documentElement.classList.toggle('light', resolved === 'light')
    // Update theme-color meta — match the current visual theme's bg
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
      // Fallbacks per visual theme
      const themeColors: Record<string, { dark: string; light: string }> = {
        editorial: { dark: '#1e1c1a', light: '#f5f2ed' },
        frost: { dark: '#1a1e24', light: '#fafaf8' },
        forge: { dark: '#151517', light: '#151517' },
      }
      const vt = document.documentElement.dataset.visualTheme || 'editorial'
      const palette = themeColors[vt] || themeColors.editorial
      meta.setAttribute('content', resolved === 'dark' ? palette.dark : palette.light)
    }
  }, [settings.theme])

  // Listen for system theme changes when set to 'system'
  useEffect(() => {
    if (settings.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const resolved = mq.matches ? 'dark' : 'light'
      setTheme(resolved)
      document.documentElement.classList.toggle('light', resolved === 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings.theme])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, theme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
