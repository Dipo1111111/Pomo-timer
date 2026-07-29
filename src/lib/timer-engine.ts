import type { TimerPhase, TimerState } from './types'
import type { AppSettings } from './types'
import { getPhaseDuration } from './storage'

export interface TimerActions {
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  complete: () => void
  skip: () => void
}

export function computeNextPhase(
  currentPhase: TimerPhase,
  currentCycleSessions: number,
  settings: AppSettings,
): TimerPhase {
  if (currentPhase === 'focus') {
    // After a focus session, check if it's time for a long break
    if (currentCycleSessions >= settings.sessionsBeforeLongBreak) {
      return 'long_break'
    }
    return 'short_break'
  }
  // After any break, go back to focus
  return 'focus'
}

/** Advance to the next phase and return the new state */
export function advancePhase(
  current: TimerState,
  settings: AppSettings,
): TimerState {
  const nextPhase = computeNextPhase(
    current.phase,
    current.currentCycleSessions,
    settings,
  )

  // Reset cycle counter after long break
  const nextCycleSessions =
    nextPhase === 'focus'
      ? current.currentCycleSessions + 1
      : nextPhase === 'long_break'
        ? 0
        : current.currentCycleSessions

  const duration = getPhaseDuration(nextPhase, settings)

  return {
    ...current,
    phase: nextPhase,
    status: 'idle',
    remaining: duration,
    totalDuration: duration,
    currentCycleSessions: nextCycleSessions,
    tickedAt: Date.now(),
  }
}

/** Start the timer from idle or paused */
export function startTimer(state: TimerState): TimerState {
  if (state.status === 'running') return state
  return {
    ...state,
    status: 'running',
    tickedAt: Date.now(),
  }
}

/** Pause the running timer */
export function pauseTimer(state: TimerState): TimerState {
  if (state.status !== 'running') return state
  return {
    ...state,
    status: 'paused',
    tickedAt: Date.now(),
  }
}

/** Reset the current phase */
export function resetTimer(state: TimerState, settings: AppSettings): TimerState {
  const duration = getPhaseDuration(state.phase, settings)
  return {
    ...state,
    status: 'idle',
    remaining: duration,
    totalDuration: duration,
    tickedAt: Date.now(),
  }
}

/** Tick one second */
export function tickTimer(state: TimerState): TimerState {
  if (state.status !== 'running') return state
  return {
    ...state,
    remaining: Math.max(0, state.remaining - 1),
    tickedAt: Date.now(),
  }
}

/** Catch up on elapsed time when the tab was hidden */
export function catchUpTimer(state: TimerState, now: number): TimerState {
  if (state.status !== 'running') return state
  const elapsed = Math.floor((now - state.tickedAt) / 1000)
  if (elapsed <= 0) return state
  return {
    ...state,
    remaining: Math.max(0, state.remaining - elapsed),
    tickedAt: now,
  }
}
