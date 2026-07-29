import { motion, AnimatePresence } from 'framer-motion'
import { cn, phaseLabel } from '../../lib/utils'
import type { TimerPhase } from '../../lib/types'

interface PhaseIndicatorProps {
  phase: TimerPhase
  taskName?: string
  className?: string
}

export function PhaseIndicator({
  phase,
  taskName,
  className,
}: PhaseIndicatorProps) {
  const isFocus = phase === 'focus'
  const nextLabel = isFocus
    ? 'NEXT: BREAK'
    : 'NEXT: FOCUS'

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* Phase label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={cn(
            'text-sm font-semibold tracking-widest uppercase',
            isFocus ? 'text-phase-focus' : 'text-phase-short-break',
          )}
        >
          {phaseLabel(phase)}
        </motion.span>
      </AnimatePresence>

      {/* Task name or next-phase hint */}
      {isFocus && taskName ? (
        <span className="text-sm text-ink font-medium max-w-[200px] truncate">
          {taskName}
        </span>
      ) : !isFocus ? (
        <span className="text-xs text-ink-muted">{nextLabel}</span>
      ) : null}
    </div>
  )
}
