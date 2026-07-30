import { useRef, useEffect } from 'react'
import { View, Text, ScrollView, Switch, StyleSheet, SafeAreaView, Pressable, Animated } from 'react-native'
import { useSettings } from '@/lib/settings-context'
import { colors, fonts, fontSizes, spacing, radii } from '@/lib/tokens'

/* ─── Animated slider dot ─── */

function SliderDot({ active }: { active: boolean }) {
  const scaleAnim = useRef(new Animated.Value(active ? 1 : 0.85)).current
  const colorAnim = useRef(new Animated.Value(active ? 1 : 0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: active ? 1 : 0.85,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(colorAnim, {
        toValue: active ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start()
  }, [active, scaleAnim, colorAnim])

  const bgColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.accent],
  })

  return (
    <Animated.View
      style={[
        styles.sliderDot,
        {
          backgroundColor: bgColor,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  )
}

/* ─── Settings Page ─── */

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()

  const renderSlider = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    min: number,
    max: number,
    step: number,
    suffix: string,
  ) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>
        {label}: {value}{suffix}
      </Text>
      <View style={styles.sliderContainer}>
        {[min, min + step, min + step * 2, min + step * 3, min + step * 4].map(v => (
          v <= max && (
            <Pressable
              key={v}
              onPress={() => onChange(v)}
              style={styles.sliderDotPressable}
            >
              <SliderDot active={v <= value} />
            </Pressable>
          )
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Timer Durations */}
        <Text style={styles.sectionTitle}>Timer Durations</Text>
        <View style={styles.section}>
          {renderSlider(
            'Focus',
            settings.focusDuration,
            v => updateSettings({ focusDuration: v }),
            15, 60, 5, 'm',
          )}
          {renderSlider(
            'Short Break',
            settings.shortBreakDuration,
            v => updateSettings({ shortBreakDuration: v }),
            3, 15, 2, 'm',
          )}
          {renderSlider(
            'Long Break',
            settings.longBreakDuration,
            v => updateSettings({ longBreakDuration: v }),
            10, 30, 5, 'm',
          )}
        </View>

        {/* Cycle */}
        <Text style={styles.sectionTitle}>Cycle</Text>
        <View style={styles.section}>
          {renderSlider(
            'Sessions before long break',
            settings.sessionsBeforeLongBreak,
            v => updateSettings({ sessionsBeforeLongBreak: v }),
            2, 6, 1, '',
          )}
        </View>

        {/* Auto-start */}
        <Text style={styles.sectionTitle}>Auto-start</Text>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Start breaks automatically</Text>
            <Switch
              value={settings.autoStartBreaks}
              onValueChange={v => updateSettings({ autoStartBreaks: v })}
              trackColor={{ false: colors.border, true: colors.accentSubtle }}
              thumbColor={settings.autoStartBreaks ? colors.accent : colors.inkMuted}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Start focus automatically</Text>
            <Switch
              value={settings.autoStartFocus}
              onValueChange={v => updateSettings({ autoStartFocus: v })}
              trackColor={{ false: colors.border, true: colors.accentSubtle }}
              thumbColor={settings.autoStartFocus ? colors.accent : colors.inkMuted}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing[6],
    paddingBottom: 100,
    gap: spacing[6],
  },
  sectionTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing[2],
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  settingLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.base,
    color: colors.ink,
    flexShrink: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: spacing[1],
    alignItems: 'center',
  },
  sliderDotPressable: {
    padding: 4,
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
})
