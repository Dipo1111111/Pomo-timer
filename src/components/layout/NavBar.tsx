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
      {/* ─── Mobile — floating capsule tab bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
        <div className="flex justify-center px-4 pb-2">
          <div className="flex items-center gap-1 h-14 px-2 rounded-2xl bg-surface border border-border/60 shadow-lg shadow-black/10">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const active = isActive(to)
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={cn(
                    'relative flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-medium transition-all duration-200',
                    active
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-ink-muted/60 hover:text-ink-muted',
                  )}
                  aria-label={label}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      active ? 'text-white' : 'text-ink-muted/50',
                    )}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  {active && <span className="text-[11px] font-semibold">{label}</span>}
                </NavLink>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden md:flex md:flex-col md:min-h-dvh md:w-56 md:border-r md:border-border md:bg-bg md:py-8 md:px-4 md:gap-1">
        {/* Brand */}
        <div className="mb-10 px-3">
          <div className="font-display text-xl font-bold text-ink/90 tracking-tight leading-none">
            Pomodoro
          </div>
          <div className="text-[9px] font-medium text-ink-muted/30 tracking-[0.25em] uppercase mt-2">
            Focus Timer
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative',
                  active
                    ? 'text-accent'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover/50',
                )}
                aria-label={label}
              >
                {/* Left accent bar for active */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-accent" />
                )}
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 ml-2 transition-colors duration-150',
                    active && 'text-accent',
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-3 pt-8">
          <div className="text-[8px] font-medium text-ink-muted/15 tracking-[0.2em] uppercase">
            v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
