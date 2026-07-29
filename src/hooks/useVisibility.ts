import { useEffect, useRef } from 'react'

interface VisibilityCallbacks {
  onHidden: () => void
  onVisible: () => void
}

/**
 * Track document visibility changes.
 * Calls onHidden when the tab goes to background,
 * onVisible when user returns.
 */
export function useVisibility({ onHidden, onVisible }: VisibilityCallbacks) {
  const callbacksRef = useRef({ onHidden, onVisible })
  callbacksRef.current = { onHidden, onVisible }

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        callbacksRef.current.onHidden()
      } else {
        callbacksRef.current.onVisible()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])
}
