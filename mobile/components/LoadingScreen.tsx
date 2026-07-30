import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { colors, fonts, fontSizes, spacing } from '@/lib/tokens'

const TRACK_WIDTH = 192
const FILL_DURATION = 1200

export function LoadingScreen({
  start,
  onDone,
}: {
  start: boolean
  onDone: () => void
}) {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!start) return

    Animated.timing(progress, {
      toValue: 1,
      duration: FILL_DURATION,
      useNativeDriver: false,
    }).start()
  }, [start, progress])

  useEffect(() => {
    if (!start) return
    const timeout = setTimeout(onDone, FILL_DURATION + 200)
    return () => clearTimeout(timeout)
  }, [start, onDone])

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.container}>
      {/* Brand name */}
      <Text style={styles.brand}>Pomodoro</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Focus Timer</Text>

      {/* Progress bar track */}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 36,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.5,
    marginBottom: spacing[8],
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.inkMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.4,
    marginBottom: spacing[12],
  },
  track: {
    width: TRACK_WIDTH,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    opacity: 0.3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: colors.accent,
  },
})
