import { useRef, useCallback } from 'react'
import { Vibration, Platform } from 'react-native'
import { Audio } from 'expo-av'

export function useNotification() {
  const soundRef = useRef<Audio.Sound | null>(null)

  const playSound = useCallback(async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
      )
      soundRef.current = sound
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync()
        }
      })
    } catch (e) {
      console.log('Audio playback failed:', e)
    }
  }, [])

  const notify = useCallback((soundType: 'bell' | 'chime' | 'none') => {
    if (soundType === 'bell') {
      playSound('https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg')
    } else if (soundType === 'chime') {
      playSound('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg')
    }
    // Vibrate briefly
    try { Vibration.vibrate(200) } catch {}
  }, [playSound])

  return { notify }
}
