import { NavLink, useLocation } from 'react-router-dom'
import { Clock, BarChart3, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Clock, label: 'Timer' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/settings', icon: Settings, label: 'Settings' },
] as const

export function NavBar() {
  const location = useLocation()

  const isActive = (to: string) =>
    to === '/'
      ? location.pathname === to
      : location.pathname.startsWith(to)

  return (
    <>
      {/* ─── Mobile — flush bottom tab bar ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ backgroundColor: 'var(--color-bg)' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-14 border-t border-border/40">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-150',
                  active
                    ? 'text-accent'
                    : 'text-ink-muted/50 active:text-ink-muted',
                )}
                aria-label={label}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all duration-150',
                    active && 'scale-105',
                  )}
                  strokeWidth={active ? 2.2 : 1.6}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium leading-none transition-colors duration-150',
                    active ? 'text-accent' : 'text-ink-muted/50',
                  )}
                >
                  {label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden md:flex md:flex-col md:min-h-dvh md:w-52 md:border-r md:border-border/40 md:bg-bg md:py-6 md:px-3 md:gap-0.5">
        {/* Brand */}
        <div className="mb-8 px-3">
          <div className="font-display text-lg font-semibold text-ink tracking-tight leading-none">
            Pomodoro
          </div>
          <div className="text-[8px] font-medium text-ink-muted/25 tracking-[0.3em] uppercase mt-1.5">
            Focus Timer
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover/40',
                )}
                aria-label={label}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-150',
                    active && 'text-accent',
                  )}
                  strokeWidth={active ? 2.2 : 1.6}
                />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-3 pt-6">
          <div className="text-[8px] font-medium text-ink-muted/15 tracking-[0.2em] uppercase">
            v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
