import { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Button } from '@/components/ui/Button'
import { colors, fonts, fontSizes, spacing } from '@/lib/tokens'
import { isOnboardingComplete, setOnboardingComplete } from '@/lib/storage'
import { useRouter } from 'expo-router'

const SCREENS = [
  {
    title: 'Deep focus, your way',
    subtitle: 'A clean timer that stays out of your way. No bells. No whistles. Just the Pomodoro method.',
  },
  {
    title: 'Work and breathe',
    subtitle: '25 minutes of focus, 5 minutes to reset. Every four sessions, take a longer break.',
  },
  {
    title: 'Ready to start?',
    subtitle: 'No sign-up. No accounts. Just open the app and begin your first session.',
  },
]

/* ─── Animated dot indicator ─── */

function Dot({ active }: { active: boolean }) {
  const anim = useRef(new Animated.Value(active ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
    }).start()
  }, [active, anim])

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 24],
  })

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.accent],
  })

  return <Animated.View style={[styles.dot, { width, backgroundColor: bgColor }]} />
}

/* ─── Animated screen content ─── */

function AnimatedScreenContent({ screen }: { screen: typeof SCREENS[number] }) {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  // Animate in on mount
  useEffect(() => {
    fadeAnim.setValue(0)
    slideAnim.setValue(20)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }, [screen.title, fadeAnim, slideAnim])

  return (
    <Animated.View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing[6],
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text style={styles.title}>{screen.title}</Text>
      <Text style={styles.subtitle}>{screen.subtitle}</Text>
    </Animated.View>
  )
}

/* ─── Main Onboarding Screen ─── */

export default function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const isLast = step === SCREENS.length - 1

  useEffect(() => {
    isOnboardingComplete().then(done => {
      if (done) {
        router.replace('/(tabs)')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  const handleNext = async () => {
    if (isLast) {
      await setOnboardingComplete()
      router.replace('/(tabs)')
    } else {
      setStep(s => s + 1)
    }
  }

  if (checking) return null

  const screen = SCREENS[step]

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Dots */}
        <View style={styles.steps}>
          {SCREENS.map((_, i) => (
            <Dot key={i} active={i === step} />
          ))}
        </View>

        {/* Animated content */}
        <AnimatedScreenContent key={step} screen={screen} />
      </View>

      <View style={styles.footer}>
        <Button
          title={isLast ? 'Start' : 'Next'}
          variant="primary"
          size="lg"
          onPress={handleNext}
          style={styles.button}
        />
        {!isLast && (
          <Text
            style={styles.skip}
            onPress={async () => {
              await setOnboardingComplete()
              router.replace('/(tabs)')
            }}
          >
            Skip
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: spacing[6],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[6],
  },
  steps: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[8],
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.base,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing[4],
  },
  footer: {
    alignItems: 'center',
    gap: spacing[4],
  },
  button: {
    width: '100%',
  },
  skip: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.inkMuted,
  },
})
