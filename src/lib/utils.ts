import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TimerPhase } from './types'

/** Merge Tailwind classes with conflict resolution (ShadCN-style) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format seconds into MM:SS display string */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Return display label for a timer phase */
export function phaseLabel(phase: TimerPhase): string {
  switch (phase) {
    case 'focus': return 'FOCUS'
    case 'short_break': return 'SHORT BREAK'
    case 'long_break': return 'LONG BREAK'
  }
}

/** Format a date to a readable short string */
export function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** Format a date to a full string */
export function formatDateFull(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Format seconds to a human duration like "1h 23m" or "45m" */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  return `${mins}m`
}

/** Get today's date as YYYY-MM-DD */
export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
