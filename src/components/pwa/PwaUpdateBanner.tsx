import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTimerContext } from '@/lib/timer-context'

/**
 * Handles PWA service worker updates with timer-aware behavior:
 * - If the timer isn't running, updates automatically and reloads (smooth, seamless)
 * - If the timer IS running, shows a minimal banner so you're not interrupted mid-session
 */
export function PwaUpdateBanner() {
  const { state } = useTimerContext()
  const [dismissed, setDismissed] = useState(false)
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Periodically check for SW updates (every 30 minutes)
      // Important for installed PWAs that may stay open for hours
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 30 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error)
    },
  })

  // Auto-update + reload when timer is not running
  useEffect(() => {
    if (!needRefresh) return
    if (dismissed) return
    if (state.status === 'running') return

    const timeout = setTimeout(() => {
      updateServiceWorker(true)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [needRefresh, state.status, updateServiceWorker, dismissed])

  if (!needRefresh) return null

  // If auto-update is about to fire, don't show the banner
  if (state.status !== 'running' && !dismissed) return null

  return (
    <div className="fixed inset-x-0 bottom-24 flex justify-center z-[60] pointer-events-none">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border/60 shadow-lg shadow-black/10 pointer-events-auto animate-slide-up">
        <p className="text-xs font-medium text-ink-muted">
          Update available
        </p>
        <button
          onClick={() => {
            setDismissed(true)
            updateServiceWorker(true)
          }}
          className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
