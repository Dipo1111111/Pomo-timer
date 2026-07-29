export type TimerPhase = 'focus' | 'short_break' | 'long_break'

export type TimerStatus = 'idle' | 'running' | 'paused'

export interface SessionRecord {
  id: string
  type: TimerPhase
  startedAt: number  // Date.now()
  completedAt: number
  duration: number   // seconds
}

export interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  remaining: number      // seconds
  totalDuration: number  // seconds
  completedSessions: number
  currentCycleSessions: number  // sessions in current 4-session cycle
  tickedAt: number  // Date.now() when remaining was last updated
}

export interface AppSettings {
  focusDuration: number    // minutes
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
  sound: 'bell' | 'chime' | 'none'
  theme: 'dark' | 'light' | 'system'
  visualTheme: 'editorial' | 'frost' | 'forge'
}

export type ThemeMode = 'dark' | 'light'
