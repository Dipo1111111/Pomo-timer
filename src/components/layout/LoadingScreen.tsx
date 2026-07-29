import { useEffect, useState } from 'react'

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Fill the bar over ~1.2s, then call onDone
    const duration = 1200
    const interval = 16
    const step = 100 / (duration / interval)

    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + step
        if (next >= 100) {
          clearInterval(t)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(t)
  }, [onDone])

  // Once at 100, wait a beat then dismiss
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(onDone, 200)
      return () => clearTimeout(timeout)
    }
  }, [progress, onDone])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg">
      {/* Brand name */}
      <div className="font-display text-4xl font-bold text-ink tracking-tight mb-8">
        Pomodoro
      </div>

      {/* Tagline */}
      <div className="text-xs text-ink-muted/40 tracking-[0.3em] uppercase mb-12">
        Focus Timer
      </div>

      {/* Progress bar track */}
      <div className="w-48 h-[3px] rounded-full bg-border/30 overflow-hidden">
        {/* Progress bar fill */}
        <div
          className="h-full rounded-full bg-accent transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
