export type TimerPhase = 'focus' | 'short_break' | 'long_break'

export type TimerStatus = 'idle' | 'running' | 'paused'

export interface SessionRecord {
  id: string
  type: TimerPhase
  startedAt: number
  completedAt: number
  duration: number
  taskName?: string
}

export interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  remaining: number
  totalDuration: number
  completedSessions: number
  currentCycleSessions: number
  tickedAt: number
}

export interface AppSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
  sound: 'bell' | 'chime' | 'none'
}

export type ThemeMode = 'light'
