import { useCallback, useRef } from 'react'
import type { TimerPhase } from '../lib/types'
import { phaseLabel } from '../lib/utils'

/**
 * Audio context for generating tones programmatically.
 * No external sound files needed — we generate a pleasant chime
 * using the Web Audio API.
 */
function createChime(audioCtx: AudioContext, frequency: number, duration: number) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(
    frequency * 1.5,
    audioCtx.currentTime + duration * 0.1,
  )

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + duration)
}

function playBell(audioCtx: AudioContext) {
  createChime(audioCtx, 880, 0.4)
  setTimeout(() => createChime(audioCtx, 1100, 0.5), 200)
}

function playChime(audioCtx: AudioContext) {
  createChime(audioCtx, 660, 0.3)
  setTimeout(() => createChime(audioCtx, 880, 0.4), 150)
}

/**
 * Hook for session-end notifications.
 * Plays an audio alarm, shows browser notification, and updates the page title.
 */
export function useNotification() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctor = window.AudioContext
        || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtxRef.current = new Ctor()
    }
    return audioCtxRef.current
  }, [])

  /** Call from a user-gesture handler (e.g. Start button) to unblock AudioContext */
  const primeAudio = useCallback(() => {
    try {
      const ctx = getAudioCtx()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
    } catch {
      // Audio unavailable — silently ignore
    }
  }, [getAudioCtx])

  const notify = useCallback((phase: TimerPhase, sound: string) => {
    // Audio
    if (sound !== 'none') {
      try {
        const ctx = getAudioCtx()
        // Auto-resume if still suspended (belt-and-suspenders)
        if (ctx.state === 'suspended') {
          ctx.resume()
        }
        if (sound === 'bell') playBell(ctx)
        else playChime(ctx)
      } catch {
        // Audio blocked or unavailable
      }
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: `${phaseLabel(phase)} complete!`,
        icon: '/icons/icon-192.svg',
      })
    }

    // Tab title flash indicator
    document.title = `⏰ ${phaseLabel(phase)} Complete - Pomodoro`
    setTimeout(() => {
      document.title = 'Pomodoro Timer'
    }, 3000)
  }, [getAudioCtx])

  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return { notify, primeAudio, requestNotificationPermission }
}
