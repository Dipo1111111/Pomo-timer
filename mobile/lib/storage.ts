import AsyncStorage from '@react-native-async-storage/async-storage'
import type { AppSettings, TimerState, SessionRecord } from './types'

const KEYS = {
  settings: 'pomodoro:settings',
  timerState: 'pomodoro:timerState',
  sessions: 'pomodoro:sessions',
  dataVersion: 'pomodoro:dataVersion',
  onboardingComplete: 'pomodoro:onboardingComplete',
} as const

const SESSION_DATA_VERSION = 3

// ─── Generic helpers ───

async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Failed to save ${key}:`, e)
  }
}

// ─── Defaults ───

const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  sound: 'chime',
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

// ─── Migration ───

async function migrateSessions(): Promise<void> {
  const version = await loadJSON<number>(KEYS.dataVersion, 0)
  if (version < SESSION_DATA_VERSION) {
    await AsyncStorage.removeItem(KEYS.sessions)
    await saveJSON(KEYS.dataVersion, SESSION_DATA_VERSION)
  }
}

// ─── Public API ───

export async function loadSettings(): Promise<AppSettings> {
  const saved = await loadJSON<AppSettings | null>(KEYS.settings, null)
  return saved ?? DEFAULT_SETTINGS
}

export function saveSettings(settings: AppSettings): Promise<void> {
  return saveJSON(KEYS.settings, settings)
}

export async function loadTimerState(): Promise<TimerState> {
  const saved = await loadJSON<TimerState | null>(KEYS.timerState, null)
  return saved ?? { ...DEFAULT_TIMER_STATE, tickedAt: Date.now() }
}

export function saveTimerState(state: TimerState): Promise<void> {
  return saveJSON(KEYS.timerState, state)
}

export async function loadSessions(): Promise<SessionRecord[]> {
  await migrateSessions()
  return loadJSON<SessionRecord[]>(KEYS.sessions, [])
}

export function saveSessions(sessions: SessionRecord[]): Promise<void> {
  return saveJSON(KEYS.sessions, sessions)
}

export async function isOnboardingComplete(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.onboardingComplete)
  return val === 'true'
}

export function setOnboardingComplete(): Promise<void> {
  return AsyncStorage.setItem(KEYS.onboardingComplete, 'true')
}
