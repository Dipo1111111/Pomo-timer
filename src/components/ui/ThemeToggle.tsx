import { Moon, Sun, Monitor } from 'lucide-react'
import { useSettings } from '../../lib/settings-context'
import { cn } from '../../lib/utils'
import type { AppSettings } from '../../lib/types'

const THEME_OPTIONS: { value: AppSettings['theme']; icon: typeof Sun; label: string }[] = [
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'system', icon: Monitor, label: 'System' },
]

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { settings, updateSettings } = useSettings()

  return (
    <div className={cn('flex items-center gap-1 rounded-full bg-surface p-1', className)}>
      {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => updateSettings({ theme: value })}
          className={cn(
            'flex items-center justify-center rounded-full p-2 transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            settings.theme === value
              ? 'bg-accent text-white shadow-sm'
              : 'text-ink-muted hover:text-ink hover:bg-surface-hover',
          )}
          aria-label={`${label} mode`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
