import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import type { TimerState, SessionRecord } from './types'
import { useSettings } from './settings-context'
import { generateId } from './utils'
import { loadTimerState, saveTimerState, loadSessions, saveSessions } from './storage'
import {
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimer,
  catchUpTimer,
  advancePhase,
} from './timer-engine'

interface TimerContextValue {
  state: TimerState
  currentTask: string
  setCurrentTask: (task: string) => void
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  notify: () => void
  setNotify: (fn: () => void) => void
}

const TimerContext = createContext<TimerContextValue | null>(null)

export function TimerProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()

  const [state, setState] = useState<TimerState>(() => ({
    phase: 'focus',
    status: 'idle',
    remaining: 25 * 60,
    totalDuration: 25 * 60,
    completedSessions: 0,
    currentCycleSessions: 0,
    tickedAt: Date.now(),
  }))
  const [stateReady, setStateReady] = useState(false)
  const [currentTask, setCurrentTask] = useState('')
  const [notifyFn, setNotifyFn] = useState<() => void>(() => {})

  const taskRef = useRef(currentTask)
  taskRef.current = currentTask

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const notifyRef = useRef(notifyFn)
  notifyRef.current = notifyFn

  // Load persisted state on mount
  useEffect(() => {
    loadTimerState().then(saved => {
      const restored = saved.status === 'running'
        ? { ...saved, status: 'paused' as const }
        : saved
      setState(restored)
      setStateReady(true)
    })
  }, [])

  // Persist state on change
  useEffect(() => {
    if (stateReady) saveTimerState(state)
  }, [state, stateReady])

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTickInterval = useCallback(() => {
    if (intervalRef.current !== null) return
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'running') return prev
        return tickTimer(prev)
      })
    }, 1000)
  }, [])

  const handleComplete = useCallback(() => {
    clearTimer()

    // Play notification via ref
    try { notifyRef.current() } catch {}

    const session: SessionRecord = {
      id: generateId(),
      type: stateRef.current.phase,
      startedAt: Date.now() - (stateRef.current.totalDuration - stateRef.current.remaining),
      completedAt: Date.now(),
      duration: stateRef.current.totalDuration,
      taskName: taskRef.current || undefined,
    }

    if (stateRef.current.phase === 'focus') {
      setCurrentTask('')
    }

    loadSessions().then(all => {
      all.push(session)
      saveSessions(all)
    })

    setState(prev => {
      const newCycleSessions = prev.phase === 'focus'
        ? prev.currentCycleSessions + 1
        : prev.currentCycleSessions

      if (prev.status !== 'running') return { ...prev, currentCycleSessions: newCycleSessions }

      const next = advancePhase({ ...prev, status: 'idle', remaining: 0, currentCycleSessions: newCycleSessions }, settings)

      const shouldAutoStart =
        (next.phase === 'focus' && settings.autoStartFocus) ||
        (next.phase !== 'focus' && settings.autoStartBreaks)

      if (shouldAutoStart) {
        return { ...next, status: 'running', tickedAt: Date.now() }
      }

      return next
    })
  }, [clearTimer, settings])

  // Check for completion
  useEffect(() => {
    if (state.status === 'running' && state.remaining <= 0 && stateReady) {
      handleComplete()
    }
  }, [state.remaining, state.status, handleComplete, stateReady])

  // Initialize timer state after loading
  useEffect(() => {
    if (!stateReady) return
    if (state.status !== 'running') return
    startTickInterval()
  }, [stateReady])

  const start = useCallback(() => {
    setState(prev => {
      if (prev.remaining <= 0 && prev.status === 'idle') {
        const advanced = advancePhase(
          { ...prev, currentCycleSessions: prev.phase === 'focus' ? prev.currentCycleSessions + 1 : prev.currentCycleSessions },
          settings,
        )
        return { ...advanced, status: 'running', tickedAt: Date.now() }
      }
      return startTimer(prev)
    })
    startTickInterval()
  }, [settings, startTickInterval])

  const pause = useCallback(() => {
    clearTimer()
    setState(prev => pauseTimer(prev))
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setState(prev => resetTimer(prev, settings))
  }, [clearTimer, settings])

  const skip = useCallback(() => {
    clearTimer()
    if (stateRef.current.phase === 'focus' && stateRef.current.status === 'running') {
      const session: SessionRecord = {
        id: generateId(),
        type: 'focus',
        startedAt: Date.now() - (stateRef.current.totalDuration - stateRef.current.remaining),
        completedAt: Date.now(),
        duration: stateRef.current.totalDuration - stateRef.current.remaining,
        taskName: taskRef.current || undefined,
      }
      loadSessions().then(all => {
        all.push(session)
        saveSessions(all)
      })
      setCurrentTask('')
    }
    setState(prev => {
      const nextCycleSessions = prev.phase === 'focus'
        ? prev.currentCycleSessions + 1
        : prev.currentCycleSessions
      return {
        ...advancePhase({ ...prev, currentCycleSessions: nextCycleSessions }, settings),
        status: 'idle',
      }
    })
  }, [clearTimer, settings])

  // Visibility catch-up
  useEffect(() => {
    const handleAppState = () => {
      setState(prev => {
        if (prev.status !== 'running') return prev
        return catchUpTimer(prev, Date.now())
      })
    }
    // Re-catch-up when app comes to foreground
    const sub = setTimeout(handleAppState, 100)
    return () => clearTimeout(sub)
  }, [])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  if (!stateReady) return null

  return (
    <TimerContext.Provider value={{
      state, currentTask, setCurrentTask,
      start, pause, reset, skip,
      notify: notifyRef.current,
      setNotify: setNotifyFn,
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimerContext must be used within TimerProvider')
  return ctx
}
