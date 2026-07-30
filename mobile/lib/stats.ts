import type { SessionRecord } from './types'

export interface DailyStats {
  date: string
  totalSeconds: number
  sessions: number
}

export interface StatsData {
  totalSessions: number
  totalFocusSeconds: number
  todaySeconds: number
  todaySessions: number
  currentStreak: number
  dailyBreakdown: DailyStats[]
}

/** Get today's date as YYYY-MM-DD */
function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Compute aggregate stats from session history */
export function computeStats(sessions: SessionRecord[]): StatsData {
  const today = todayKey()
  const focusSessions = sessions.filter(s => s.type === 'focus')

  // Daily breakdown
  const dailyMap = new Map<string, { totalSeconds: number; sessions: number }>()

  for (const s of focusSessions) {
    const key = new Date(s.completedAt).toISOString().slice(0, 10)
    const existing = dailyMap.get(key) ?? { totalSeconds: 0, sessions: 0 }
    existing.totalSeconds += s.duration
    existing.sessions += 1
    dailyMap.set(key, existing)
  }

  const sortedDays = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({
      date,
      totalSeconds: d.totalSeconds,
      sessions: d.sessions,
    }))

  const todayStats = dailyMap.get(today) ?? { totalSeconds: 0, sessions: 0 }

  // Streak: count consecutive days with a session, ending at today
  let streak = 0
  const checkDate = new Date()
  while (true) {
    const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
    if (dailyMap.has(key)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // Allow yesterday as the start of the streak (user hasn't completed a session today yet)
      if (streak === 0 && key === today) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }
      break
    }
  }

  return {
    totalSessions: focusSessions.length,
    totalFocusSeconds: focusSessions.reduce((sum, s) => sum + s.duration, 0),
    todaySeconds: todayStats.totalSeconds,
    todaySessions: todayStats.sessions,
    currentStreak: streak,
    dailyBreakdown: sortedDays.slice(-30), // Last 30 days
  }
}
