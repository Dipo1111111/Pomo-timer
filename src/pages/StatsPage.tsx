import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { loadSessions } from '../lib/storage'
import { computeStats, type DailyStats } from '../lib/stats'
import { cn, formatDuration } from '../lib/utils'
import type { SessionRecord } from '../lib/types'

export default function StatsPage() {

  const stats = useMemo(() => {
    const sessions = loadSessions()
    return computeStats(sessions)
  }, [])

  const hasData = stats.totalSessions > 0
  const maxDailySeconds = Math.max(
    ...stats.dailyBreakdown.map(d => d.totalSeconds),
    1,
  )

  // Derived metrics
  const avgSessionSeconds =
    stats.totalSessions > 0
      ? Math.round(stats.totalFocusSeconds / stats.totalSessions)
      : 0

  const last14 = stats.dailyBreakdown.slice(-14)
  const avgDailySeconds =
    last14.length > 0
      ? Math.round(last14.reduce((s, d) => s + d.totalSeconds, 0) / last14.length)
      : 0

  const bestDay =
    last14.length > 0
      ? last14.reduce((best, d) =>
          d.totalSeconds > best.totalSeconds ? d : best,
        )
      : null

  const todayProgress = bestDay && stats.todaySeconds > 0
    ? stats.todaySeconds / Math.max(bestDay.totalSeconds, 1)
    : 0

  return (
    <div className="flex-1 flex flex-col px-6 py-6 max-w-2xl mx-auto w-full gap-5">
      <h1 className="text-xl font-bold text-ink">Statistics</h1>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          <p className="text-base text-ink-muted max-w-xs leading-relaxed">
            As you use the timer, your statistics will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* ─── Stat cards — 3×2 ─── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard
              label="Sessions"
              value={String(stats.totalSessions)}
              delay={0}
            />
            <StatCard
              label="Focus Time"
              value={formatDuration(stats.totalFocusSeconds)}
              delay={0.05}
            />
            <StatCard
              label="Avg Session"
              value={formatDuration(avgSessionSeconds)}
              delay={0.1}
            />

            <VisualStatCard
              label="Today"
              value={formatDuration(stats.todaySeconds)}
              subtitle={`${stats.todaySessions} session${stats.todaySessions !== 1 ? 's' : ''}`}
              progress={todayProgress}
              delay={0.15}
            />
            <StatCard
              label="Streak"
              value={`${stats.currentStreak}d`}
              delay={0.2}
            />
            <VisualStatCard
              label="Best Day"
              value={bestDay ? formatDuration(bestDay.totalSeconds) : '—'}
              subtitle={
                bestDay
                  ? new Date(bestDay.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : undefined
              }
              progress={1}
              delay={0.25}
            />
          </div>

          {/* ─── Summary strip ─── */}
          <div className="flex items-center gap-3 text-xs text-ink-muted px-0.5 flex-wrap">
            <span>
              Avg{' '}
              <span className="text-ink font-medium">
                {formatDuration(avgDailySeconds)}
              </span>{' '}
              / day
            </span>
            <span className="w-px h-3 bg-border" />
            <span>
              Best:{' '}
              <span className="text-ink font-medium">
                {bestDay ? formatDuration(bestDay.totalSeconds) : '—'}
              </span>
              {bestDay && (
                <>
                  {' '}
                  on{' '}
                  {new Date(bestDay.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </>
              )}
            </span>
            <span className="w-px h-3 bg-border" />
            <span>
              <span className="text-ink font-medium">{stats.totalSessions}</span> total ·{' '}
              <span className="text-ink font-medium">{stats.dailyBreakdown.length}</span> active days
            </span>
          </div>

          {/* ─── Weekly Activity heatmap ─── */}
          {stats.dailyBreakdown.length > 0 && (
            <WeeklyHeatmap dailyBreakdown={stats.dailyBreakdown} />
          )}

          {/* ─── Daily chart — last 14 days ─── */}
          {last14.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Daily Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyChart
                  data={last14}
                  maxValue={maxDailySeconds}
                  avgValue={avgDailySeconds}
                />
              </CardContent>
            </Card>
          )}

          {/* ─── Recent sessions ─── */}
          <RecentSessions
            sessions={
              loadSessions()
                .filter(s => s.type === 'focus')
                .sort((a, b) => b.completedAt - a.completedAt)
            }
          />
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Visualization Components
   ═══════════════════════════════════════════════════════════════ */

/* ─── Mini Ring ─── */
function MiniRing({
  progress,
  size = 44,
  strokeWidth = 3,
  children,
  className,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
  className?: string
}) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(Math.max(progress, 0), 1))

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-current text-border"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={cn('stroke-current transition-all duration-700 ease-out', className || 'text-accent')}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Weekly Activity Heatmap (28 days, 4×7) ─── */
function WeeklyHeatmap({ dailyBreakdown }: { dailyBreakdown: DailyStats[] }) {
  // Build map of date → totalSeconds
  const dayMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of dailyBreakdown) {
      m.set(d.date, d.totalSeconds)
    }
    return m
  }, [dailyBreakdown])

  // Build the last 28 days as ISO strings, aligned to start of week
  const grid = useMemo(() => {
    const cells: { date: string; day: number; seconds: number; iso: string }[] = []
    const now = new Date()
    const DAY = 86400000

    // Find the Monday of ~4 weeks ago
    // Walk back 28 days, then align so the first cell is Monday
    const start = new Date(now.getTime() - 27 * DAY)
    // Shift back to Monday if needed
    const dayOfWeek = start.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start.setDate(start.getDate() + mondayOffset)

    for (let i = 0; i < 28; i++) {
      const date = new Date(start.getTime() + i * DAY)
      const iso = date.toISOString().slice(0, 10)
      cells.push({
        date: iso,
        day: date.getDay(),
        seconds: dayMap.get(iso) || 0,
        iso,
      })
    }
    return cells
  }, [dayMap])

  const maxSeconds = Math.max(...grid.map(c => c.seconds), 1)
  const weeks = [grid.slice(0, 7), grid.slice(7, 14), grid.slice(14, 21), grid.slice(21, 28)]
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Month label for the grid
  const monthLabel = grid.length > 0
    ? new Date(grid[grid.length - 1]?.iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : ''

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="px-4 pt-3 pb-0 mb-2">
        <CardTitle className="text-sm">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex">
          {/* Day labels column */}
          <div className="flex flex-col gap-[3px] pr-2 pt-5">
            {dayLabels.map((label, i) => (
              <span key={label} className="text-[8px] text-ink-muted/50 h-[14px] leading-[14px] text-right">
                {i % 2 === 0 ? label : ''}
              </span>
            ))}
          </div>
          {/* Grid */}
          <div className="flex-1">
            {/* Month header */}
            <div className="text-[9px] text-ink-muted/60 mb-1 text-right">{monthLabel}</div>
            {/* Rows */}
            <div className="flex flex-col gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex gap-[3px]">
                  {week.map((cell) => {
                    const intensity = cell.seconds / maxSeconds
                    return (
                      <div
                        key={cell.date}
                        className="group relative flex-1 aspect-square"
                      >
                        <div
                          className={cn(
                            'w-full h-full rounded-[2px] transition-colors duration-200',
                            cell.seconds === 0
                              ? 'bg-surface-hover/30'
                              : intensity > 0.75
                                ? 'bg-accent'
                                : intensity > 0.5
                                  ? 'bg-accent/70'
                                  : intensity > 0.25
                                    ? 'bg-accent/45'
                                    : 'bg-accent/20',
                          )}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 pointer-events-none">
                          <div className="bg-surface-hover text-ink text-[10px] px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                            {new Date(cell.date).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {cell.seconds > 0 && ` · ${formatDuration(cell.seconds)}`}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* Intensity legend */}
          <div className="flex flex-col items-center justify-end gap-[3px] pl-2 pb-0.5">
            <span className="text-[7px] text-ink-muted/40 leading-none">less</span>
            <div className="w-[8px] h-[14px] rounded-[1px] bg-surface-hover/30" />
            <div className="w-[8px] h-[14px] rounded-[1px] bg-accent/20" />
            <div className="w-[8px] h-[14px] rounded-[1px] bg-accent/45" />
            <div className="w-[8px] h-[14px] rounded-[1px] bg-accent/70" />
            <div className="w-[8px] h-[14px] rounded-[1px] bg-accent" />
            <span className="text-[7px] text-ink-muted/40 leading-none">more</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Daily Trend — SVG line chart ─── */
function DailyChart({
  data,
  maxValue,
  avgValue,
}: {
  data: DailyStats[]
  maxValue: number
  avgValue: number
}) {
  const W = 640
  const H = 200
  const PAD = { top: 20, right: 16, bottom: 32, left: 12 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const count = data.length

  const points = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(count - 1, 1)) * innerW,
    y: PAD.top + innerH - (d.totalSeconds / maxValue) * innerH,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? 0},${PAD.top + innerH} L${points[0]?.x ?? 0},${PAD.top + innerH} Z`

  const avgY = avgValue > 0
    ? PAD.top + innerH - (avgValue / maxValue) * innerH
    : null

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Average line */}
        {avgY !== null && (
          <>
            <line
              x1={PAD.left} y1={avgY}
              x2={W - PAD.right} y2={avgY}
              stroke="var(--color-accent)"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="5 4"
            />
            <text
              x={W - PAD.right} y={avgY - 6}
              fill="var(--color-accent)"
              fillOpacity="0.4"
              fontSize="11"
              textAnchor="end"
              fontFamily="var(--font-sans)"
            >
              avg
            </text>
          </>
        )}

        {/* Data points with hover */}
        {points.map((p) => (
          <g key={p.date} className="group">
            <rect
              x={p.x - (innerW / count) / 2}
              y={PAD.top}
              width={innerW / count}
              height={innerH}
              fill="transparent"
              className="cursor-pointer"
            />
            <circle
              cx={p.x} cy={p.y} r="4"
              fill="var(--color-bg)"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            />
            {/* Tooltip */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              <rect
                x={p.x - 46} y={p.y - 34}
                width="92" height="24" rx="5"
                fill="var(--color-surface-hover)"
              />
              <text
                x={p.x} y={p.y - 18}
                fill="var(--color-ink)"
                fontSize="12"
                textAnchor="middle"
                fontWeight="700"
                fontFamily="var(--font-sans)"
              >
                {formatDuration(p.totalSeconds)}
              </text>
            </g>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => {
          if (i % 2 !== 0 && count > 7) return null
          const dayName = new Date(p.date).toLocaleDateString(undefined, { weekday: 'short' })
          return (
            <text
              key={p.date}
              x={p.x}
              y={H - 6}
              fill="var(--color-ink-muted)"
              fillOpacity="0.55"
              fontSize="11"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              {dayName}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Stat Card Components
   ═══════════════════════════════════════════════════════════════ */

/* ─── Text-only stat card ─── */
function StatCard({
  label,
  value,
  subtitle,
  delay,
}: {
  label: string
  value: string
  subtitle?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className="h-full p-0">
        <CardContent className="flex flex-col gap-0.5 justify-center min-h-[4.25rem] px-4 py-3">
          <span className="text-xs text-ink-muted">{label}</span>
          <span className="text-xl font-bold text-ink leading-tight">{value}</span>
          {subtitle && (
            <span className="text-[10px] text-ink-muted">{subtitle}</span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ─── Stat card with ring visualization ─── */
function VisualStatCard({
  label,
  value,
  subtitle,
  progress,
  delay,
}: {
  label: string
  value: string
  subtitle?: string
  progress: number
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className="h-full p-0">
        <CardContent className="flex items-center gap-3 justify-between min-h-[4.25rem] px-4 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs text-ink-muted">{label}</span>
            <span className="text-xl font-bold text-ink leading-tight truncate">{value}</span>
            {subtitle && (
              <span className="text-[10px] text-ink-muted truncate">{subtitle}</span>
            )}
          </div>
          <MiniRing progress={progress} size={46} strokeWidth={3}>
            <span className="text-[9px] font-semibold text-ink">
              {Math.round(progress * 100)}%
            </span>
          </MiniRing>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Recent Sessions
   ═══════════════════════════════════════════════════════════════ */

function RecentSessions({ sessions }: { sessions: SessionRecord[] }) {
  const [showAll, setShowAll] = useState(false)
  const displayCount = showAll ? sessions.length : 5

  if (sessions.length === 0) return null

  return (
    <Card className="p-0">
      <CardHeader className="px-4 pt-3 pb-0 mb-2">
        <CardTitle className="text-sm">Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <div className="flex flex-col">
          {sessions.slice(0, displayCount).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-ink font-medium shrink-0">
                  {formatDuration(session.duration)}
                </span>
                {session.taskName ? (
                  <span className="text-[11px] text-ink truncate max-w-[140px]">
                    {session.taskName}
                  </span>
                ) : (
                  <span className="text-[11px] text-ink-muted truncate">
                    {new Date(session.completedAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 bg-accent-subtle text-accent">
                {session.taskName ? 'Focus' : 'Focus'}
              </span>
            </div>
          ))}
        </div>

        {sessions.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 text-xs font-medium text-ink-muted hover:text-ink transition-colors duration-150 w-full text-center py-1.5"
          >
            {showAll ? 'Show less' : `Show all ${sessions.length} sessions`}
          </button>
        )}
      </CardContent>
    </Card>
  )
}
