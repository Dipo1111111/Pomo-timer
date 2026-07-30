import { useEffect, useRef, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import {
  EBGaramond_400Regular,
  EBGaramond_700Bold,
} from '@expo-google-fonts/eb-garamond'
import * as SplashScreen from 'expo-splash-screen'
import { SettingsProvider } from '@/lib/settings-context'
import { TimerProvider } from '@/lib/timer-context'
import { isOnboardingComplete } from '@/lib/storage'
import { LoadingScreen } from '@/components/LoadingScreen'
import { NotificationBridge } from '@/components/timer/NotificationBridge'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [ready, setReady] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)
  const mounted = useRef(false)

  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    Inter_500: Inter_500Medium,
    Inter_600: Inter_600SemiBold,
    Inter_700: Inter_700Bold,
    EBGaramond: EBGaramond_400Regular,
    EBGaramond_700: EBGaramond_700Bold,
  })

  useEffect(() => {
    isOnboardingComplete().then(setOnboardingDone)
  }, [])

  // Keep the native splash visible until everything is loaded,
  // then hide it AND show the main app in one go.
  useEffect(() => {
    if (fontsLoaded && onboardingDone !== null && !mounted.current) {
      mounted.current = true
      SplashScreen.hideAsync()
      setReady(true)
    }
  }, [fontsLoaded, onboardingDone])

  if (!ready) {
    return <LoadingScreen start={false} onDone={() => {}} />
  }

  return (
    <SettingsProvider>
      <TimerProvider>
        <NotificationBridge />
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
      </TimerProvider>
    </SettingsProvider>
  )
}
