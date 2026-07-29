import type { SessionRecord, TimerState, AppSettings, TimerPhase } from './types'

const KEYS = {
  settings: 'pomodoro:settings',
  timerState: 'pomodoro:timerState',
  sessions: 'pomodoro:sessions',
  dataVersion: 'pomodoro:data_version',
} as const

/** Bump this to clear stale seed/sample data from localStorage */
const SESSION_DATA_VERSION = 2

const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  sound: 'chime',
  theme: 'dark',
  visualTheme: 'forge',
}

const DEFAULT_TIMER_STATE: TimerState = {
  phase: 'focus',
  status: 'idle',
  remaining: 25 * 60,
  totalDuration: 25 * 60,
  completedSessions: 0,
  currentCycleSessions: 0,
  tickedAt: Date.now(),
}

/** Safe JSON parse */
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Read settings from localStorage, merging with defaults for missing keys */
export function loadSettings(): AppSettings {
  const raw = safeParse(localStorage.getItem(KEYS.settings), DEFAULT_SETTINGS)
  // Merge with defaults so new fields are never undefined
  return { ...DEFAULT_SETTINGS, ...raw }
}

/** Write settings to localStorage */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings))
  } catch {
    // localStorage quota exceeded — silently degrade
  }
}

/** Read timer state from localStorage */
export function loadTimerState(): TimerState {
  return safeParse(localStorage.getItem(KEYS.timerState), DEFAULT_TIMER_STATE)
}

/** Write timer state to localStorage */
export function saveTimerState(state: TimerState): void {
  try {
    localStorage.setItem(KEYS.timerState, JSON.stringify(state))
  } catch {
    // silently degrade
  }
}

/** Read session history — clears stale seed data on version bump */
export function loadSessions(): SessionRecord[] {
  const storedVersion = parseInt(localStorage.getItem(KEYS.dataVersion) || '0', 10)
  if (storedVersion < SESSION_DATA_VERSION) {
    localStorage.removeItem(KEYS.sessions)
    localStorage.setItem(KEYS.dataVersion, String(SESSION_DATA_VERSION))
    return []
  }
  return safeParse(localStorage.getItem(KEYS.sessions), [])
}

/** Write session history */
export function saveSessions(sessions: SessionRecord[]): void {
  try {
    localStorage.setItem(KEYS.sessions, JSON.stringify(sessions))
  } catch {
    // silently degrade
  }
}

/** Compute remaining seconds for a phase given settings */
export function getPhaseDuration(phase: TimerPhase, settings: AppSettings): number {
  switch (phase) {
    case 'focus': return settings.focusDuration * 60
    case 'short_break': return settings.shortBreakDuration * 60
    case 'long_break': return settings.longBreakDuration * 60
  }
}

export { DEFAULT_SETTINGS, DEFAULT_TIMER_STATE }
