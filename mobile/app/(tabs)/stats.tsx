import { useEffect, useState, useMemo, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet, SafeAreaView, Platform } from 'react-native'
import Svg, { Circle, Line, Rect as SvgRect, Text as SvgText, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg'
import { Card, CardTitle, CardContent } from '@/components/ui/Card'
import { colors, fonts, fontSizes, spacing, radii } from '@/lib/tokens'
import { loadSessions } from '@/lib/storage'
import { computeStats, type StatsData, type DailyStats } from '@/lib/stats'
import { formatDuration } from '@/lib/utils'
import type { SessionRecord } from '@/lib/types'

/* ─── Platform-aware SVG tap handler ─── */
function svgTap(handler: () => void) {
  return Platform.select({
    web: { onClick: handler },
    default: { onPress: handler },
  })
}

/* ─── Parse ISO date string ("2026-07-30") as local midnight ─── */
function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/* ─── Safe day-of-week from ISO date string (avoids UTC timezone shift) ─── */
function weekdayShort(isoDate: string): string {
  return parseISODate(isoDate).toLocaleDateString(undefined, { weekday: 'short' })
}

/* ═══════════════════════════════════════════════════════════════
   Animated Card Wrapper (matches web's framer-motion stagger)
   ═══════════════════════════════════════════════════════════════ */

function AnimatedCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        delay: Math.round(delay * 1000),
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        delay: Math.round(delay * 1000),
        useNativeDriver: false,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], flex: 1 }}>
      {children}
    </Animated.View>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Mini Ring (animated progress)
   ═══════════════════════════════════════════════════════════════ */

function MiniRing({
  progress,
  size = 44,
  strokeWidth = 3,
  children,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r

  useEffect(() => {
    const target = Math.min(Math.max(progress, 0), 1)
    const duration = 700
    const startTime = Date.now()
    const startVal = 0

    const tick = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      // ease-out: t * (2 - t)
      const eased = t * (2 - t)
      setDisplayProgress(startVal + (target - startVal) * eased)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [progress])

  const offset = circ * (1 - displayProgress)
  const cx = size / 2
  const cy = size / 2

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.border} strokeWidth={strokeWidth} />
        {/* Progress arc */}
        <Circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={colors.accent} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {children && (
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </View>
      )}
    </View>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Stat Cards
   ═══════════════════════════════════════════════════════════════ */

function StatCard({ label, value, subtitle, delay }: { label: string; value: string; subtitle?: string; delay: number }) {
  return (
    <AnimatedCard delay={delay}>
      <View style={statCardStyles.card}>
        <Text style={statCardStyles.label}>{label}</Text>
        <Text style={statCardStyles.value}>{value}</Text>
        {subtitle && <Text style={statCardStyles.subtitle}>{subtitle}</Text>}
      </View>
    </AnimatedCard>
  )
}

function VisualStatCard({
  label, value, subtitle, progress, delay,
}: {
  label: string; value: string; subtitle?: string; progress: number; delay: number
}) {
  return (
    <AnimatedCard delay={delay}>
      <View style={statCardStyles.visualCard}>
        <View style={statCardStyles.visualLeft}>
          <Text style={statCardStyles.label}>{label}</Text>
          <Text style={statCardStyles.value} numberOfLines={1}>{value}</Text>
          {subtitle && <Text style={statCardStyles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        <MiniRing progress={progress} size={46} strokeWidth={3}>
          <Text style={statCardStyles.ringText}>{Math.round(progress * 100)}%</Text>
        </MiniRing>
      </View>
    </AnimatedCard>
  )
}

const statCardStyles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    justifyContent: 'center',
    minHeight: 68,
    flex: 1,
  },
  visualCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 68,
    flex: 1,
  },
  visualLeft: {
    flex: 1,
    marginRight: spacing[2],
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.inkMuted,
    marginBottom: 2,
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.inkMuted,
    marginTop: 1,
  },
  ringText: {
    fontFamily: fonts.sans,
    fontSize: 9,
    fontWeight: '600',
    color: colors.ink,
  },
})

/* ═══════════════════════════════════════════════════════════════
   Weekly Activity Heatmap (with tap tooltips)
   ═══════════════════════════════════════════════════════════════ */

function WeeklyHeatmap({ dailyBreakdown }: { dailyBreakdown: DailyStats[] }) {
  const [tooltipCell, setTooltipCell] = useState<{ date: string; seconds: number; x: number; y: number } | null>(null)

  const dayMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of dailyBreakdown) {
      m.set(d.date, d.totalSeconds)
    }
    return m
  }, [dailyBreakdown])

  const grid = useMemo(() => {
    const cells: { date: string; day: number; seconds: number }[] = []
    const now = new Date()
    const DAY = 86400000

    const start = new Date(now.getTime() - 27 * DAY)
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
      })
    }
    return cells
  }, [dayMap])

  const maxSeconds = Math.max(...grid.map(c => c.seconds), 1)
  const weeks = [grid.slice(0, 7), grid.slice(7, 14), grid.slice(14, 21), grid.slice(21, 28)]
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const monthLabel = grid.length > 0
    ? parseISODate(grid[grid.length - 1].date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : ''

  const getIntensity = (seconds: number) => {
    if (seconds === 0) return colors.surfaceHover + '40'
    const intensity = seconds / maxSeconds
    if (intensity > 0.75) return colors.accent
    if (intensity > 0.5) return colors.accent + 'B3'
    if (intensity > 0.25) return colors.accent + '73'
    return colors.accent + '33'
  }

  const handleCellPress = (cell: typeof grid[0], x: number, y: number) => {
    if (tooltipCell?.date === cell.date) {
      setTooltipCell(null)
    } else {
      setTooltipCell({ ...cell, x, y })
    }
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[3], paddingBottom: 0, marginBottom: spacing[2] }}>
        <CardTitle>Weekly Activity</CardTitle>
      </View>
      <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[4], paddingTop: 0 }}>
        <View style={heatmapStyles.container}>
          {/* Day labels */}
          <View style={heatmapStyles.dayLabels}>
            {dayLabels.map((label, i) => (
              <Text key={label} style={[heatmapStyles.dayLabel, i % 2 !== 0 && { opacity: 0 }]}>
                {label}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={{ flex: 1 }}>
            <Text style={heatmapStyles.monthLabel}>{monthLabel}</Text>
            <View style={{ gap: 3 }}>
              {weeks.map((week, wi) => (
                <View key={wi} style={{ flexDirection: 'row', gap: 3 }}>
                  {week.map((cell) => (
                    <TouchableOpacity
                      key={cell.date}
                      onPress={() => handleCellPress(cell, 0, 0)}
                      style={[
                        heatmapStyles.cell,
                        { backgroundColor: getIntensity(cell.seconds) },
                      ]}
                      activeOpacity={0.7}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View style={heatmapStyles.legend}>
            <Text style={heatmapStyles.legendLabel}>less</Text>
            <View style={[heatmapStyles.legendCell, { backgroundColor: colors.surfaceHover + '40' }]} />
            <View style={[heatmapStyles.legendCell, { backgroundColor: colors.accent + '33' }]} />
            <View style={[heatmapStyles.legendCell, { backgroundColor: colors.accent + '73' }]} />
            <View style={[heatmapStyles.legendCell, { backgroundColor: colors.accent + 'B3' }]} />
            <View style={[heatmapStyles.legendCell, { backgroundColor: colors.accent }]} />
            <Text style={heatmapStyles.legendLabel}>more</Text>
          </View>
        </View>

        {/* Tapped cell tooltip */}
        {tooltipCell && (
          <View style={heatmapStyles.tooltip}>
            <Text style={heatmapStyles.tooltipText}>
              {parseISODate(tooltipCell.date).toLocaleDateString(undefined, {
                weekday: 'short', month: 'short', day: 'numeric',
              })}
              {tooltipCell.seconds > 0 ? ` · ${formatDuration(tooltipCell.seconds)}` : ''}
            </Text>
          </View>
        )}
      </View>
    </Card>
  )
}

const heatmapStyles = StyleSheet.create({
  container: { flexDirection: 'row', marginTop: spacing[1] },
  dayLabels: { marginRight: spacing[1], paddingTop: 20 },
  dayLabel: { fontSize: 8, fontFamily: fonts.sans, color: colors.inkMuted, height: 14, lineHeight: 14, textAlign: 'right', marginBottom: 3 },
  monthLabel: { fontSize: 9, fontFamily: fonts.sans, color: colors.inkMuted, opacity: 0.6, textAlign: 'right', marginBottom: spacing[1] },
  cell: { flex: 1, aspectRatio: 1, borderRadius: 2 },
  legend: { alignItems: 'center', justifyContent: 'flex-end', paddingLeft: spacing[1], paddingBottom: 1, gap: 3 },
  legendCell: { width: 8, height: 14, borderRadius: 1 },
  legendLabel: { fontSize: 7, fontFamily: fonts.sans, color: colors.inkMuted, opacity: 0.4, lineHeight: 9 },
  tooltip: {
    marginTop: spacing[2],
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.md,
    alignSelf: 'center',
  },
  tooltipText: { fontSize: 10, fontFamily: fonts.sans, color: colors.ink },
})

/* ═══════════════════════════════════════════════════════════════
   Daily Trend — SVG Line Chart (full-width with tap tooltips)
   ═══════════════════════════════════════════════════════════════ */

function DailyChart({
  data,
  maxValue,
  avgValue,
}: {
  data: DailyStats[]
  maxValue: number
  avgValue: number
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Fixed viewBox matching web's 640×200 — SVG fills 100% width via aspectRatio
  const W = 640
  const H = 200
  const PAD = { top: 20, right: 16, bottom: 32, left: 12 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const count = data.length

  const points = useMemo(() => data.map((d, i) => ({
    x: PAD.left + (i / Math.max(count - 1, 1)) * innerW,
    y: PAD.top + innerH - (d.totalSeconds / maxValue) * innerH,
    ...d,
  })), [data, maxValue, innerW, innerH, count])

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const lastX = points[points.length - 1]?.x ?? 0
  const areaPath = `${linePath} L${lastX},${PAD.top + innerH} L${points[0]?.x ?? 0},${PAD.top + innerH} Z`

  const avgY = avgValue > 0 ? PAD.top + innerH - (avgValue / maxValue) * innerH : null

  return (
    <Card style={{ padding: spacing[4] }}>
      <CardTitle>Daily Trend</CardTitle>
      <CardContent>
        {/* SVG fills container width via "100%", scales to viewBox */}
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>

          {/* Area fill */}
          <Path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <Path
            d={linePath}
            fill="none"
            stroke={colors.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Average line */}
          {avgY !== null && (
            <>
              <Line
                x1={PAD.left} y1={avgY}
                x2={W - PAD.right} y2={avgY}
                stroke={colors.accent}
                strokeOpacity="0.25"
                strokeWidth="1"
                strokeDasharray="5 4"
              />
              <SvgText
                x={W - PAD.right} y={avgY - 6}
                fill={colors.accent}
                fillOpacity="0.4"
                fontSize="11"
                textAnchor="end"
                fontFamily={fonts.sans}
              >
                avg
              </SvgText>
            </>
          )}

          {/* Hit targets + data points */}
          {points.map((p, i) => {
            const hitW = Math.max(innerW / count, 24)
            return (
              <G key={p.date}>
                {/* Invisible hit rectangle for tap (web: onClick, native: onPress) */}
                <SvgRect
                  x={p.x - hitW / 2}
                  y={PAD.top}
                  width={hitW}
                  height={innerH}
                  fill="transparent"
                  {...svgTap(() => setSelectedIndex(selectedIndex === i ? null : i))}
                />
                {/* Dot — hidden by default; shown when selected */}
                <Circle
                  cx={p.x} cy={p.y} r="4"
                  fill={selectedIndex === i ? colors.accent : colors.bg}
                  stroke={colors.accent}
                  strokeWidth="2.5"
                  {...svgTap(() => setSelectedIndex(selectedIndex === i ? null : i))}
                />
                {/* Tooltip for selected point */}
                {selectedIndex === i && (
                  <G>
                    <SvgRect
                      x={p.x - 46} y={p.y - 34}
                      width="92" height="24" rx="5"
                      fill={colors.surfaceHover}
                    />
                    <SvgText
                      x={p.x} y={p.y - 18}
                      fill={colors.ink}
                      fontSize="12"
                      textAnchor="middle"
                      fontWeight="700"
                      fontFamily={fonts.sans}
                    >
                      {formatDuration(p.totalSeconds)}
                    </SvgText>
                  </G>
                )}
              </G>
            )
          })}

          {/* X-axis labels */}
          {points.map((p, i) => {
            if (i % 2 !== 0 && count > 7) return null
            return (
              <SvgText
                key={p.date}
                x={p.x}
                y={H - 6}
                fill={colors.inkMuted}
                fillOpacity="0.55"
                fontSize="11"
                textAnchor="middle"
                fontFamily={fonts.sans}
              >
                {weekdayShort(p.date)}
              </SvgText>
            )
          })}
        </Svg>
      </CardContent>
    </Card>
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
    <Card style={{ padding: spacing[4] }}>
      <CardTitle>Recent Sessions</CardTitle>
      <CardContent>
        {sessions.slice(0, displayCount).map((session) => (
          <View key={session.id} style={sessionStyles.row}>
            <View style={sessionStyles.rowLeft}>
              <Text style={sessionStyles.duration}>
                {formatDuration(session.duration)}
              </Text>
              {session.taskName ? (
                <Text style={sessionStyles.taskName} numberOfLines={1}>
                  {session.taskName}
                </Text>
              ) : (
                <Text style={sessionStyles.date}>
                  {new Date(session.completedAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
            <View style={sessionStyles.badge}>
              <Text style={sessionStyles.badgeText}>Focus</Text>
            </View>
          </View>
        ))}

        {sessions.length > 5 && (
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            style={sessionStyles.toggleButton}
          >
            <Text style={sessionStyles.toggleText}>
              {showAll ? 'Show less' : `Show all ${sessions.length} sessions`}
            </Text>
          </TouchableOpacity>
        )}
      </CardContent>
    </Card>
  )
}

const sessionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
    minWidth: 0,
  },
  duration: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.ink,
  },
  taskName: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink,
    maxWidth: 140,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.inkMuted,
  },
  badge: {
    backgroundColor: colors.accentSubtle,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeText: {
    fontFamily: fonts.sans,
    fontSize: 10,
    fontWeight: '500',
    color: colors.accent,
  },
  toggleButton: {
    marginTop: spacing[2],
    paddingVertical: 6,
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '500',
    color: colors.inkMuted,
  },
})

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions().then(allSessions => {
      setSessions(allSessions)
      setStats(computeStats(allSessions))
      setLoading(false)
    })
  }, [])

  if (loading) return null

  const hasData = (stats?.totalSessions ?? 0) > 0
  const maxDailySeconds = stats
    ? Math.max(...stats.dailyBreakdown.map(d => d.totalSeconds), 1)
    : 1

  const avgSessionSeconds = stats && stats.totalSessions > 0
    ? Math.round(stats.totalFocusSeconds / stats.totalSessions)
    : 0

  const last14 = stats?.dailyBreakdown.slice(-14) ?? []
  const avgDailySeconds = last14.length > 0
    ? Math.round(last14.reduce((s, d) => s + d.totalSeconds, 0) / last14.length)
    : 0

  const bestDay = last14.length > 0
    ? last14.reduce((best, d) =>
        d.totalSeconds > best.totalSeconds ? d : best,
      )
    : null

  const todayProgress = bestDay && stats && stats.todaySeconds > 0
    ? stats.todaySeconds / Math.max(bestDay.totalSeconds, 1)
    : 0

  if (!stats || !hasData) {
    return (
      <SafeAreaView style={pageStyles.container}>
        <View style={pageStyles.empty}>
          <Text style={pageStyles.emptyText}>
            As you use the timer, your statistics will appear here.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={pageStyles.container}>
      <View style={pageStyles.pageWrapper}>
        <ScrollView contentContainerStyle={pageStyles.scroll}>
          <Text style={pageStyles.pageTitle}>Statistics</Text>

          {/* ─── Stat cards — 2-column grid (matches web grid-cols-2 gap-3) ─── */}
          <View style={pageStyles.grid}>
            <View style={pageStyles.gridItem}>
              <StatCard label="Sessions" value={String(stats.totalSessions)} delay={0} />
            </View>
            <View style={pageStyles.gridItem}>
              <StatCard label="Focus Time" value={formatDuration(stats.totalFocusSeconds)} delay={0.05} />
            </View>
            <View style={pageStyles.gridItem}>
              <StatCard label="Avg Session" value={formatDuration(avgSessionSeconds)} delay={0.1} />
            </View>
            <View style={pageStyles.gridItem}>
              <VisualStatCard
                label="Today"
                value={formatDuration(stats.todaySeconds)}
                subtitle={`${stats.todaySessions} session${stats.todaySessions !== 1 ? 's' : ''}`}
                progress={todayProgress}
                delay={0.15}
              />
            </View>
            <View style={pageStyles.gridItem}>
              <StatCard label="Streak" value={`${stats.currentStreak}d`} delay={0.2} />
            </View>
            <View style={pageStyles.gridItem}>
              <VisualStatCard
                label="Best Day"
                value={bestDay ? formatDuration(bestDay.totalSeconds) : '—'}
                subtitle={
                  bestDay
                    ? parseISODate(bestDay.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : undefined
                }
                progress={1}
                delay={0.25}
              />
            </View>
          </View>

          {/* ─── Summary strip ─── */}
          <View style={pageStyles.summary}>
            <Text style={pageStyles.summaryText}>
              Avg{' '}
              <Text style={pageStyles.summaryBold}>{formatDuration(avgDailySeconds)}</Text>{' '}
              / day
            </Text>
            <View style={pageStyles.summaryDivider} />
            <Text style={pageStyles.summaryText}>
              Best:{' '}
              <Text style={pageStyles.summaryBold}>
                {bestDay ? formatDuration(bestDay.totalSeconds) : '—'}
              </Text>
              {bestDay && (
                <Text style={pageStyles.summaryText}>
                  {' on '}
                  {parseISODate(bestDay.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              )}
            </Text>
            <View style={pageStyles.summaryDivider} />
            <Text style={pageStyles.summaryText}>
              <Text style={pageStyles.summaryBold}>{stats.totalSessions}</Text> total ·{' '}
              <Text style={pageStyles.summaryBold}>{stats.dailyBreakdown.length}</Text> active days
            </Text>
          </View>

          {/* ─── Weekly Activity heatmap ─── */}
          {stats.dailyBreakdown.length > 0 && (
            <WeeklyHeatmap dailyBreakdown={stats.dailyBreakdown} />
          )}

          {/* ─── Daily chart — last 14 days ─── */}
          {last14.length > 0 && (
            <DailyChart data={last14} maxValue={maxDailySeconds} avgValue={avgDailySeconds} />
          )}

          {/* ─── Recent sessions ─── */}
          <RecentSessions
            sessions={
              sessions
                .filter(s => s.type === 'focus')
                .sort((a, b) => b.completedAt - a.completedAt)
            }
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pageWrapper: {
    flex: 1,
    maxWidth: 672,
    width: '100%',
    alignSelf: 'center',
  },
  scroll: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    paddingBottom: 100,
    gap: spacing[5],
  },
  pageTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.ink,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.base,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  summaryText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.inkMuted,
  },
  summaryBold: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '500',
    color: colors.ink,
  },
  summaryDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
})
