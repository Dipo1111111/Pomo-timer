import React from 'react'

/* ─── Frost — Scandinavian light, airy precision ─── */

const CIRC = 2 * Math.PI * 85
const SEGMENTS = 12
const SEGMENT_LENGTH = CIRC / SEGMENTS

const s: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'Inter Tight', -apple-system, sans-serif",
    background: '#F8F9FB',
    color: '#1E2228',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '56px 24px',
    position: 'relative',
  },
  container: { maxWidth: 380, width: '100%' },

  header: { textAlign: 'center', marginBottom: 48 },
  logo: {
    fontSize: 8, fontWeight: 500, letterSpacing: 7,
    textTransform: 'uppercase', color: '#4A6A8A',
    marginBottom: 12,
  } as React.CSSProperties,

  timerSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    marginBottom: 48,
  },

  ringWrap: {
    position: 'relative', width: 220, height: 220,
    marginBottom: 24,
  } as React.CSSProperties,
  ringSvg: { transform: 'rotate(-90deg)' } as React.CSSProperties,
  digitsWrap: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  },
  time: {
    fontFamily: "'Inter Tight', -apple-system, sans-serif",
    fontSize: 44, fontWeight: 600, color: '#1E2228',
    letterSpacing: 1, lineHeight: 1,
  },
  colon: { opacity: 0.15, margin: '0 1px', fontWeight: 400 },
  phase: {
    fontSize: 9, fontWeight: 400, letterSpacing: 5,
    textTransform: 'uppercase', color: '#4A6A8A',
    marginTop: 10,
  },

  /* Spacer — negative space as design */
  spacer: { height: 1, background: '#4A6A8A', opacity: 0.1, marginBottom: 28 },

  /* Session info — minimal label pair */
  infoRow: {
    display: 'flex', justifyContent: 'center', gap: 36,
    marginBottom: 32,
  } as React.CSSProperties,
  infoItem: { textAlign: 'center' },
  infoValue: {
    fontFamily: "'Inter Tight', -apple-system, sans-serif",
    fontSize: 13, fontWeight: 500, color: '#1E2228',
    letterSpacing: 1,
  } as React.CSSProperties,
  infoLabel: {
    fontSize: 8, fontWeight: 400, letterSpacing: 3,
    textTransform: 'uppercase', color: '#4A6A8A',
    marginTop: 4,
  } as React.CSSProperties,

  controls: { display: 'flex', justifyContent: 'center', gap: 8 },
  btn: {
    fontFamily: "'Inter Tight', -apple-system, sans-serif",
    fontSize: 10, fontWeight: 500, letterSpacing: 3,
    textTransform: 'uppercase', cursor: 'pointer',
    padding: '12px 24px', transition: 'all 0.15s ease',
    background: 'transparent',
  } as React.CSSProperties,
  btnPrimary: {
    border: '1.5px solid #1E2228', color: '#1E2228',
  },
  btnGhost: {
    border: '1.5px solid transparent', color: '#4A6A8A',
  } as React.CSSProperties,

  footer: {
    textAlign: 'center', marginTop: 'auto', paddingTop: 40,
  },
  footerText: {
    fontSize: 8, fontWeight: 400, letterSpacing: 5,
    textTransform: 'uppercase', color: '#4A6A8A', opacity: 0.3,
  } as React.CSSProperties,
}

export default function FrostDesign() {
  /* Build segmented ring: filled segments then empty ones */
  const filledSegments = Math.round(SEGMENTS * 0.65)
  const segments = Array.from({ length: SEGMENTS }, (_, i) => ({
    offset: i * SEGMENT_LENGTH,
    filled: i < filledSegments,
  }))

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logo}>Pomodoro</div>
        </div>

        {/* Timer */}
        <div style={s.timerSection}>
          <div style={s.ringWrap}>
            <svg width="100%" height="100%" viewBox="0 0 220 220" style={s.ringSvg}>
              {/* Fine track — discrete segments */}
              {segments.map((seg, i) => (
                <circle key={i} cx="110" cy="110" r="85" fill="none"
                  stroke={seg.filled ? '#1E2228' : '#E8F0F4'}
                  strokeWidth={seg.filled ? 1.5 : 0.8}
                  strokeDasharray={`${SEGMENT_LENGTH - 3} ${CIRC}`}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="round" opacity={seg.filled ? 1 : 0.3} />
              ))}
              {/* Outer reference ring — extra fine */}
              <circle cx="110" cy="110" r="95" fill="none"
                stroke="#4A6A8A" strokeWidth="0.3" opacity="0.15" />
            </svg>
            <div style={s.digitsWrap}>
              <div style={s.time}>
                <span>15</span><span style={s.colon}>:</span><span>23</span>
              </div>
              <div style={s.phase}>Focus</div>
            </div>
          </div>
        </div>

        <div style={s.spacer} />

        {/* Info row */}
        <div style={s.infoRow}>
          <div style={s.infoItem}>
            <div style={s.infoValue}>02 / 04</div>
            <div style={s.infoLabel}>Session</div>
          </div>
          <div style={s.infoItem}>
            <div style={s.infoValue}>25:00</div>
            <div style={s.infoLabel}>Target</div>
          </div>
        </div>

        {/* Controls */}
        <div style={s.controls}>
          <button style={{ ...s.btn, ...s.btnGhost }}>Skip</button>
          <button style={{ ...s.btn, ...s.btnPrimary }}>Start</button>
          <button style={{ ...s.btn, ...s.btnGhost }}>Reset</button>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <div style={s.footerText}>Frost · Scandinavian minimal</div>
        </div>
      </div>
    </div>
  )
}
