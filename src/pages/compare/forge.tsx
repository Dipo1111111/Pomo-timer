import React from 'react'

/* ─── Forge — dark, deep blue, clean, architectural ─── */

const CIRC = 2 * Math.PI * 80

const s: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'Inter', sans-serif",
    background: '#0F0F12',
    color: '#F0E8D0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 24px',
    position: 'relative',
  },
  container: { maxWidth: 380, width: '100%' },

  /* ─── Header ─── */
  header: {
    textAlign: 'center',
    marginBottom: 48,
  } as React.CSSProperties,
  logo: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 11, fontWeight: 700,
    color: '#4A90D9', letterSpacing: 4,
    textTransform: 'uppercase', opacity: 0.3,
  } as React.CSSProperties,

  /* ─── Timer Section ─── */
  timerSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    marginBottom: 40,
  } as React.CSSProperties,

  ringWrap: { position: 'relative', width: 220, height: 220, marginBottom: 20 },
  ringSvg: { transform: 'rotate(-90deg)' } as React.CSSProperties,
  digitsWrap: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  },
  time: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 48, fontWeight: 700, color: '#F0E8D0',
    letterSpacing: '0.02em', lineHeight: 1,
  },
  colon: { opacity: 0.1, fontWeight: 400, margin: '0 2px' },
  phase: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 9, fontWeight: 500, letterSpacing: 5,
    textTransform: 'uppercase', color: '#4A90D9', opacity: 0.5,
    marginTop: 10,
  } as React.CSSProperties,

  /* ─── Minimal stats ─── */
  statsRow: {
    display: 'flex', justifyContent: 'center', gap: 40,
    marginBottom: 32,
  } as React.CSSProperties,
  statItem: { textAlign: 'center' } as React.CSSProperties,
  statValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 11, fontWeight: 600, color: '#F0E8D0',
  } as React.CSSProperties,
  statLabel: {
    fontSize: 7, fontWeight: 500, letterSpacing: 2,
    textTransform: 'uppercase', color: '#F0E8D0', opacity: 0.1,
    marginTop: 4,
  } as React.CSSProperties,

  /* ─── Divider ─── */
  divider: {
    width: '100%', height: 1, background: '#F0E8D0',
    opacity: 0.03, marginBottom: 24,
  } as React.CSSProperties,

  /* ─── Controls ─── */
  controls: { display: 'flex', justifyContent: 'center', gap: 10 },
  btn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10, fontWeight: 600, letterSpacing: 3,
    textTransform: 'uppercase', cursor: 'pointer',
    padding: '12px 28px', background: 'transparent',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  btnPrimary: {
    border: '1.5px solid #4A90D9', color: '#4A90D9',
  },
  btnGhost: {
    border: '1.5px solid rgba(240,232,208,0.04)',
    color: '#F0E8D0', opacity: 0.15,
  } as React.CSSProperties,

  /* ─── Footer ─── */
  footer: {
    textAlign: 'center', marginTop: 'auto', paddingTop: 32,
  } as React.CSSProperties,
  footerText: {
    fontSize: 7, fontWeight: 400, letterSpacing: 4,
    textTransform: 'uppercase', color: '#F0E8D0', opacity: 0.04,
  } as React.CSSProperties,
}

export default function ForgeDesign() {
  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* ─── Header ─── */}
        <div style={s.header}>
          <div style={s.logo}>Pomodoro</div>
        </div>

        {/* ─── Timer ─── */}
        <div style={s.timerSection}>
          <div style={s.ringWrap}>
            <svg width="100%" height="100%" viewBox="0 0 220 220" style={s.ringSvg}>
              {/* Track — faint structural ring */}
              <circle cx="110" cy="110" r="80" fill="none"
                stroke="#F0E8D0" strokeWidth="1" opacity="0.03" />
              {/* Outer reference ring */}
              <circle cx="110" cy="110" r="93" fill="none"
                stroke="#F0E8D0" strokeWidth="0.3" opacity="0.02" />
              {/* Progress — electric blue */}
              <circle cx="110" cy="110" r="80" fill="none"
                stroke="#4A90D9" strokeWidth="4"
                strokeDasharray={CIRC} strokeDashoffset={CIRC * 0.35}
                strokeLinecap="round" />
            </svg>

            <div style={s.digitsWrap}>
              <div style={s.time}>
                <span>15</span><span style={s.colon}>:</span><span>23</span>
              </div>
              <div style={s.phase}>Focus</div>
            </div>
          </div>
        </div>

        {/* ─── Stats ─── */}
        <div style={s.statsRow}>
          <div style={s.statItem}>
            <div style={s.statValue}>02</div>
            <div style={s.statLabel}>Session</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statValue}>25:00</div>
            <div style={s.statLabel}>Target</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statValue}>09:37</div>
            <div style={s.statLabel}>Elapsed</div>
          </div>
        </div>

        <div style={s.divider} />

        {/* ─── Controls ─── */}
        <div style={s.controls}>
          <button style={{ ...s.btn, ...s.btnGhost }}>Skip</button>
          <button style={{ ...s.btn, ...s.btnPrimary }}>Begin</button>
          <button style={{ ...s.btn, ...s.btnGhost }}>Reset</button>
        </div>

        {/* ─── Footer ─── */}
        <div style={s.footer}>
          <div style={s.footerText}>Forge · deep blue</div>
        </div>
      </div>
    </div>
  )
}
