import { useRef } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, fontSizes, spacing, radii } from '@/lib/tokens'
import type { TimerStatus } from '@/lib/types'

interface TimerControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ status, onStart, onPause, onReset, onSkip }: TimerControlsProps) {
  const isRunning = status === 'running'
  const isIdle = status === 'idle'

  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      friction: 8,
      tension: 200,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start()
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[4] }}>
      {/* Reset */}
      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.6}
        style={{
          width: 44,
          height: 44,
          borderRadius: radii.full,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="refresh-outline" size={20} color={colors.inkMuted} />
      </TouchableOpacity>

      {/* Start / Pause */}
      <TouchableOpacity
        onPress={isRunning ? onPause : onStart}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          backgroundColor: colors.accent,
          paddingHorizontal: spacing[8],
          minWidth: 140,
          height: 52,
          borderRadius: radii.full,
        }}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[2],
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={20}
            color={colors.white}
          />
          <Text style={{ fontFamily: fonts.sans, fontSize: fontSizes.base, fontWeight: '600', color: colors.white }}>
            {isRunning ? 'Pause' : isIdle ? 'Start' : 'Resume'}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity
        onPress={onSkip}
        activeOpacity={0.6}
        style={{
          width: 44,
          height: 44,
          borderRadius: radii.full,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="play-skip-forward-outline" size={20} color={colors.inkMuted} />
      </TouchableOpacity>
    </View>
  )
}
