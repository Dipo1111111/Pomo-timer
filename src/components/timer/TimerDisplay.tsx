import { cn, formatTime } from '../../lib/utils'
import type { TimerPhase, TimerStatus } from '../../lib/types'
import type { VisualThemeId } from '../../lib/visual-themes'
import { useSettings } from '../../lib/settings-context'

interface TimerDisplayProps {
  remaining: number
  totalDuration: number
  phase: TimerPhase
  status: TimerStatus
  className?: string
}

const PHASE_COLORS = {
  focus: 'stroke-phase-focus',
  short_break: 'stroke-phase-short-break',
  long_break: 'stroke-phase-long-break',
} as const

const PHASE_TRACK_COLORS = {
  focus: 'stroke-accent-subtle',
  short_break: 'stroke-accent-subtle',
  long_break: 'stroke-accent-subtle',
} as const

/* ─── Shared: center time display ─── */
function TimeDigits({ remaining }: { remaining: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span
        className={cn(
          'font-display font-bold tracking-tighter tabular-nums',
          'text-[clamp(3rem,10vw,5rem)]',
          'text-ink',
          'transition-colors duration-500',
        )}
      >
        {formatTime(remaining)}
      </span>
    </div>
  )
}

/* ─── Editorial ring: continuous with tick marks ─── */
function EditorialRing({
  remaining,
  totalDuration,
  phase,
  status,
}: {
  remaining: number
  totalDuration: number
  phase: TimerPhase
  status: TimerStatus
}) {
  const radius = 140
  const strokeWidth = 2.5
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const progress = totalDuration > 0 ? remaining / totalDuration : 0
  const offset = circumference * (1 - progress)
  const isRunning = status === 'running'
  const cx = radius
  const cy = radius

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={radius * 2}
        height={radius * 2}
        className={cn(
          'transform -rotate-90 drop-shadow-none',
          isRunning && 'timer-ring-active',
        )}
        role="img"
        aria-label={`Timer: ${formatTime(remaining)} remaining`}
      >
        {/* Track ring */}
        <circle
          cx={cx} cy={cy} r={normalizedRadius}
          fill="none" strokeWidth={strokeWidth}
          className={cn('transition-colors duration-500', PHASE_TRACK_COLORS[phase])}
        />
        {/* Progress ring */}
        <circle
          cx={cx} cy={cy} r={normalizedRadius}
          fill="none" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            'transition-[stroke-dashoffset] duration-300 ease-linear',
            PHASE_COLORS[phase],
          )}
        />
        {/* Tick marks at cardinal points */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle - 90) * Math.PI / 180
          return (
            <line key={angle}
              x1={cx + normalizedRadius * Math.cos(rad)}
              y1={cy + normalizedRadius * Math.sin(rad)}
              x2={cx + (normalizedRadius + 6) * Math.cos(rad)}
              y2={cy + (normalizedRadius + 6) * Math.sin(rad)}
              className="stroke-ink"
              strokeWidth="0.6" opacity="0.12" />
          )
        })}
      </svg>

      <TimeDigits remaining={remaining} />
    </div>
  )
}

/* ─── Frost ring: 12 segmented arcs ─── */
function FrostRing({
  remaining,
  totalDuration,
  phase,
  status,
}: {
  remaining: number
  totalDuration: number
  phase: TimerPhase
  status: TimerStatus
}) {
  const radius = 140
  const progressWidth = 2
  const normalizedRadius = radius - progressWidth
  const cx = radius
  const cy = radius
  const segs = 12
  const segLen = (2 * Math.PI * normalizedRadius) / segs
  const filled = Math.max(1, Math.round(segs * (1 - remaining / totalDuration)))
  const isRunning = status === 'running'

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={radius * 2}
        height={radius * 2}
        className={cn(
          'transform -rotate-90 drop-shadow-none',
          isRunning && 'timer-ring-active',
        )}
        role="img"
        aria-label={`Timer: ${formatTime(remaining)} remaining`}
      >
        {/* Outer reference */}
        <circle cx={cx} cy={cy} r={radius - 8}
          fill="none" strokeWidth="0.3"
          className="stroke-ink" opacity="0.04" />
        {/* Segments */}
        {Array.from({ length: segs }).map((_, i) => (
          <circle key={i} cx={cx} cy={cy} r={normalizedRadius}
            fill="none"
            strokeWidth={progressWidth}
            className={i < filled ? PHASE_COLORS[phase] : ''}
            opacity={i < filled ? 1 : 0.2}
            stroke={i < filled ? undefined : 'oklch(0.75 0.02 260)'}
            strokeDasharray={`${segLen - 2} ${2 * Math.PI * normalizedRadius}`}
            strokeDashoffset={i * segLen}
            strokeLinecap="round" />
        ))}
      </svg>

      <TimeDigits remaining={remaining} />
    </div>
  )
}

/* ─── Forge ring: clean thick continuous ring on black ─── */
function ForgeRing({
  remaining,
  totalDuration,
  phase,
  status,
}: {
  remaining: number
  totalDuration: number
  phase: TimerPhase
  status: TimerStatus
}) {
  const radius = 140
  const strokeWidth = 4
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const progress = totalDuration > 0 ? remaining / totalDuration : 0
  const offset = circumference * (1 - progress)
  const isRunning = status === 'running'
  const cx = radius
  const cy = radius

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={radius * 2}
        height={radius * 2}
        className={cn(
          'transform -rotate-90 drop-shadow-none',
          isRunning && 'timer-ring-active',
        )}
        role="img"
        aria-label={`Timer: ${formatTime(remaining)} remaining`}
      >
        {/* Track — faint structural ring */}
        <circle cx={cx} cy={cy} r={normalizedRadius}
          fill="none" strokeWidth="1"
          className="stroke-ink" opacity="0.03" />
        {/* Outer reference ring */}
        <circle cx={cx} cy={cy} r={radius - 4}
          fill="none" strokeWidth="0.3"
          className="stroke-ink" opacity="0.02" />
        {/* Progress — thick accent */}
        <circle cx={cx} cy={cy} r={normalizedRadius}
          fill="none" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            'transition-[stroke-dashoffset] duration-300 ease-linear',
            PHASE_COLORS[phase],
          )}
        />
      </svg>

      <TimeDigits remaining={remaining} />
    </div>
  )
}

/* ─── Main export: selects ring based on visual theme ─── */
export function TimerDisplay(props: TimerDisplayProps) {
  const { settings } = useSettings()
  const visualTheme: VisualThemeId = settings.visualTheme ?? 'forge'

  switch (visualTheme) {
    case 'frost':
      return <FrostRing {...props} />
    case 'forge':
      return <ForgeRing {...props} />
    case 'editorial':
    default:
      return <EditorialRing {...props} />
  }
}
