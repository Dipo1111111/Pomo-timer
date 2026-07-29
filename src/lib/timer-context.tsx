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
import { useNotification } from '../hooks/useNotification'
import { useVisibility } from '../hooks/useVisibility'
import { generateId } from './utils'
import {
  loadTimerState,
  saveTimerState,
  loadSessions,
  saveSessions,
} from './storage'
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
}

const TimerContext = createContext<TimerContextValue | null>(null)

export function TimerProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const { notify, primeAudio, requestNotificationPermission } = useNotification()

  const [state, setState] = useState<TimerState>(() => {
    const saved = loadTimerState()
    // If it was running when saved, mark it as paused so user resumes manually
    if (saved.status === 'running') {
      return { ...saved, status: 'paused' }
    }
    return saved
  })

  const [currentTask, setCurrentTask] = useState('')
  const taskRef = useRef(currentTask)
  taskRef.current = currentTask

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // Persist state whenever it changes (debounced via ref comparison)
  useEffect(() => {
    saveTimerState(state)
  }, [state])

  // Clear interval helper
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Start tick interval
  const startTickInterval = useCallback(() => {
    if (intervalRef.current !== null) return
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'running') return prev
        const next = tickTimer(prev)
        // Check if timer completed
        if (next.remaining <= 0) {
          return { ...next, remaining: 0 }
        }
        return next
      })
    }, 1000)
  }, [])

  // Check for completion (separate from tick to handle the 0 boundary)
  useEffect(() => {
    if (state.status === 'running' && state.remaining <= 0) {
      handleComplete()
    }
  }, [state.remaining, state.status])

  // Tab visibility handling
  useVisibility({
    onHidden: useCallback(() => {
      // Save state immediately when tab hides
      saveTimerState(stateRef.current)
    }, []),
    onVisible: useCallback(() => {
      setState(prev => {
        if (prev.status !== 'running') return prev
        return catchUpTimer(prev, Date.now())
      })
    }, []),
  })

  // Request notification permission on first interaction
  useEffect(() => {
    requestNotificationPermission()
  }, [requestNotificationPermission])

  // Handle session completion
  const handleComplete = useCallback(() => {
    clearTimer()
    notify(stateRef.current.phase, settings.sound)

    // Record the session
    const session: SessionRecord = {
      id: generateId(),
      type: stateRef.current.phase,
      startedAt: Date.now() - (stateRef.current.totalDuration - stateRef.current.remaining),
      completedAt: Date.now(),
      duration: stateRef.current.totalDuration,
      taskName: taskRef.current || undefined,
    }

    // Clear the task after a completed focus session
    if (stateRef.current.phase === 'focus') {
      setCurrentTask('')
    }

    // Save session
    const allSessions = loadSessions()
    allSessions.push(session)
    saveSessions(allSessions)

    setState(prev => {
      // Increment cycle sessions if this was a focus session
      const newCycleSessions = prev.phase === 'focus'
        ? prev.currentCycleSessions + 1
        : prev.currentCycleSessions

      // Auto-advance if the next phase should auto-start
      const currentWithCycle = { ...prev, currentCycleSessions: newCycleSessions }

      if (stateRef.current.status !== 'running') return currentWithCycle

      const next = advancePhase({ ...currentWithCycle, status: 'idle', remaining: 0 }, settings)

      // Auto-start next phase
      const shouldAutoStart =
        (next.phase === 'focus' && settings.autoStartFocus) ||
        (next.phase !== 'focus' && settings.autoStartBreaks)

      if (shouldAutoStart) {
        return { ...next, status: 'running', tickedAt: Date.now() }
      }

      return next
    })
  }, [clearTimer, notify, settings])

  // Start the timer
  const start = useCallback(() => {
    primeAudio()
    setState(prev => {
      // If idle at 0 remaining (after completion without auto-start), advance first
      if (prev.status === 'idle' && prev.remaining <= 0) {
        const advanced = advancePhase(
          { ...prev, currentCycleSessions: prev.phase === 'focus' ? prev.currentCycleSessions + 1 : prev.currentCycleSessions },
          settings,
        )
        return { ...advanced, status: 'running', tickedAt: Date.now() }
      }
      return startTimer(prev)
    })
    startTickInterval()
  }, [settings, startTickInterval, primeAudio])

  // Pause the timer
  const pause = useCallback(() => {
    clearTimer()
    setState(prev => pauseTimer(prev))
  }, [clearTimer])

  // Reset the timer
  const reset = useCallback(() => {
    clearTimer()
    setState(prev => resetTimer(prev, settings))
  }, [clearTimer, settings])

  // Skip to next phase
  const skip = useCallback(() => {
    clearTimer()

    // If focus session, record the skipped session
    if (stateRef.current.phase === 'focus' && stateRef.current.status === 'running') {
      const session: SessionRecord = {
        id: generateId(),
        type: 'focus',
        startedAt: Date.now() - (stateRef.current.totalDuration - stateRef.current.remaining),
        completedAt: Date.now(),
        duration: stateRef.current.totalDuration - stateRef.current.remaining,
        taskName: taskRef.current || undefined,
      }
      const allSessions = loadSessions()
      allSessions.push(session)
      saveSessions(allSessions)
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

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return (
    <TimerContext.Provider value={{ state, currentTask, setCurrentTask, start, pause, reset, skip }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimerContext must be used within TimerProvider')
  return ctx
}
