import type { TimerState, TimerPhase, AppSettings } from './types'

export function getDuration(phase: TimerPhase, settings: AppSettings): number {
  switch (phase) {
    case 'focus': return settings.focusDuration * 60
    case 'short_break': return settings.shortBreakDuration * 60
    case 'long_break': return settings.longBreakDuration * 60
  }
}

export function startTimer(state: TimerState): TimerState {
  if (state.status === 'running') return state
  const remaining = state.remaining > 0 ? state.remaining : state.totalDuration
  return { ...state, status: 'running', remaining, tickedAt: Date.now() }
}

export function pauseTimer(state: TimerState): TimerState {
  if (state.status !== 'running') return state
  return { ...state, status: 'paused', tickedAt: Date.now() }
}

export function resetTimer(state: TimerState, settings: AppSettings): TimerState {
  const totalDuration = getDuration(state.phase, settings)
  return { ...state, status: 'idle', remaining: totalDuration, totalDuration, tickedAt: Date.now() }
}

export function tickTimer(state: TimerState): TimerState {
  if (state.status !== 'running') return state
  return { ...state, remaining: Math.max(0, state.remaining - 1), tickedAt: Date.now() }
}

export function catchUpTimer(state: TimerState, now: number): TimerState {
  if (state.status !== 'running') return state
  const elapsed = Math.floor((now - state.tickedAt) / 1000)
  if (elapsed <= 0) return state
  // Cap catch-up to prevent huge leaps on suspend
  const maxCatchUp = Math.min(elapsed, 600)
  return { ...state, remaining: Math.max(0, state.remaining - maxCatchUp), tickedAt: now }
}

export function advancePhase(state: TimerState, settings: AppSettings): TimerState {
  const nextPhase = getNextPhase(state.phase, state.currentCycleSessions, settings.sessionsBeforeLongBreak)
  const nextTotalDuration = getDuration(nextPhase, settings)
  // Reset cycle counter after a long break so short breaks reappear
  const resetCycle = state.phase === 'long_break' && nextPhase === 'focus'
  return {
    ...state,
    phase: nextPhase,
    remaining: nextTotalDuration,
    totalDuration: nextTotalDuration,
    status: 'idle',
    currentCycleSessions: resetCycle ? 0 : state.currentCycleSessions,
  }
}

function getNextPhase(
  current: TimerPhase,
  cycleSessions: number,
  sessionsBeforeLongBreak: number,
): TimerPhase {
  if (current === 'focus') {
    if (cycleSessions >= sessionsBeforeLongBreak) return 'long_break'
    return 'short_break'
  }
  return 'focus'
}
