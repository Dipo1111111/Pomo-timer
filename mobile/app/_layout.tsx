import { useEffect, useState } from 'react'
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
  const [appReady, setAppReady] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)

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

  // Once fonts and onboarding are known, hide Expo splash and
  // signal the loading bar to start filling
  useEffect(() => {
    if (fontsLoaded && onboardingDone !== null && !assetsReady) {
      SplashScreen.hideAsync()
      setAssetsReady(true)
    }
  }, [fontsLoaded, onboardingDone, assetsReady])

  if (!appReady || !assetsReady) {
    return <LoadingScreen start={assetsReady} onDone={() => setAppReady(true)} />
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
