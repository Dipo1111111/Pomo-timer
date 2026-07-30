import { useEffect } from 'react'
import { useTimerContext } from '@/lib/timer-context'
import { useSettings } from '@/lib/settings-context'
import { useNotification } from '@/lib/useNotification'

/**
 * Invisible component that wires useNotification into the timer context.
 * Placed inside TimerProvider in the layout so the timer can play sounds.
 */
export function NotificationBridge() {
  const { setNotify, state } = useTimerContext()
  const { settings } = useSettings()
  const { notify } = useNotification()

  useEffect(() => {
    setNotify(() => notify(settings.sound))
  }, [setNotify, notify, settings.sound])

  return null
}
