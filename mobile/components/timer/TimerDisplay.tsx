import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg'
import { colors, fonts, fontSizes } from '@/lib/tokens'
import type { TimerPhase, TimerStatus } from '@/lib/types'
import { formatTime } from '@/lib/utils'

interface TimerDisplayProps {
  remaining: number
  totalDuration: number
  phase: TimerPhase
  status: TimerStatus
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  focus: colors.phaseFocus,
  short_break: colors.phaseShortBreak,
  long_break: colors.phaseLongBreak,
}

const SIZE = 280
const STROKE = 2.5
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = SIZE / 2

export function TimerDisplay({ remaining, totalDuration, phase, status }: TimerDisplayProps) {
  const targetProgress = totalDuration > 0 ? remaining / totalDuration : 1

  // Animate progress smoothly on large changes (reset / phase), snap on normal ticks
  const [displayProgress, setDisplayProgress] = useState(targetProgress)
  const displayRef = useRef(targetProgress)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const delta = Math.abs(targetProgress - displayRef.current)

    // Normal tick — tiny delta, snap immediately
    if (delta < 0.005) {
      displayRef.current = targetProgress
      setDisplayProgress(targetProgress)
      return
    }

    // Large change — animate smoothly (ease-out, duration proportional to delta)
    const duration = Math.min(delta * 1000, 400)
    const startTime = Date.now()
    const startVal = displayRef.current

    const tick = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      // ease-out: t * (2 - t)
      const eased = t * (2 - t)
      const current = startVal + (targetProgress - startVal) * eased
      displayRef.current = current
      setDisplayProgress(current)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [remaining, totalDuration]) // eslint-disable-line react-hooks/exhaustive-deps
  // We intentionally only react to remaining/totalDuration changes, not targetProgress

  const dashOffset = CIRCUMFERENCE * (1 - displayProgress)
  const color = PHASE_COLORS[phase]

  // Tick marks at cardinal points
  const ticks = [0, 90, 180, 270].map(angle => {
    const rad = ((angle - 90) * Math.PI) / 180
    const innerX = CENTER + RADIUS * Math.cos(rad)
    const innerY = CENTER + RADIUS * Math.sin(rad)
    const outerX = CENTER + (RADIUS + 6) * Math.cos(rad)
    const outerY = CENTER + (RADIUS + 6) * Math.sin(rad)
    return { innerX, innerY, outerX, outerY }
  })

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Track ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={colors.accentSubtle}
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Progress ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
        {/* Tick marks at cardinal points */}
        {ticks.map((t, i) => (
          <Line
            key={i}
            x1={t.innerX}
            y1={t.innerY}
            x2={t.outerX}
            y2={t.outerY}
            stroke={colors.ink}
            strokeWidth={0.6}
            opacity={0.12}
          />
        ))}
        {/* Time digits */}
        <SvgText
          x={CENTER}
          y={CENTER + 12}
          textAnchor="middle"
          fill={colors.ink}
          fontFamily="EBGaramond"
          fontSize={fontSizes.hero}
          fontWeight="700"
        >
          {formatTime(remaining)}
        </SvgText>
      </Svg>
    </View>
  )
}
