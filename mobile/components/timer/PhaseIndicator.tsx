import { useRef, useEffect, useState } from 'react'
import { Text, Animated } from 'react-native'
import { colors, fonts, fontSizes, spacing } from '@/lib/tokens'
import { phaseLabel } from '@/lib/utils'
import type { TimerPhase } from '@/lib/types'

interface PhaseIndicatorProps {
  phase: TimerPhase
  taskName?: string
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  focus: colors.phaseFocus,
  short_break: colors.phaseShortBreak,
  long_break: colors.phaseLongBreak,
}

export function PhaseIndicator({ phase, taskName }: PhaseIndicatorProps) {
  const [displayPhase, setDisplayPhase] = useState(phase)
  const [displayTaskName, setDisplayTaskName] = useState(taskName)
  const opacity = useRef(new Animated.Value(1)).current
  const prevPhase = useRef(phase)
  const prevTask = useRef(taskName)

  useEffect(() => {
    const phaseChanged = phase !== prevPhase.current
    const taskChanged = taskName !== prevTask.current

    if (phaseChanged || taskChanged) {
      prevPhase.current = phase
      prevTask.current = taskName

      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        // Swap content at opacity 0 (invisible to user)
        setDisplayPhase(phase)
        setDisplayTaskName(taskName)
        // Fade in
        Animated.timing(opacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }).start()
      })
    }
  }, [phase, taskName, opacity])

  const dp = displayPhase
  const isFocus = dp === 'focus'
  const nextLabel = isFocus ? 'NEXT: BREAK' : 'NEXT: FOCUS'

  return (
    <Animated.View style={{ alignItems: 'center', gap: spacing[2], opacity }}>
      {/* Phase label */}
      <Text
        style={{
          fontFamily: fonts.sans,
          fontSize: fontSizes.sm,
          fontWeight: '600',
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: PHASE_COLORS[dp],
        }}
      >
        {phaseLabel(dp)}
      </Text>

      {/* Task name or next-phase hint */}
      {isFocus && displayTaskName ? (
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.sm,
            color: colors.ink,
            fontWeight: '500',
            maxWidth: 200,
          }}
          numberOfLines={1}
        >
          {displayTaskName}
        </Text>
      ) : !isFocus ? (
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.xs,
            color: colors.inkMuted,
          }}
        >
          {nextLabel}
        </Text>
      ) : null}
    </Animated.View>
  )
}
