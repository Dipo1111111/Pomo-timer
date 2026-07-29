import React from 'react'

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    background: '#F5F0EB',
    color: '#2C2C2C',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 24px',
    position: 'relative',
  },
  container: { maxWidth: 400, width: '100%' },
  header: { textAlign: 'center', marginBottom: 12, paddingBottom: 32 },
  headerTop: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 13, fontStyle: 'italic', color: '#6B2A3C',
    letterSpacing: 1, marginBottom: 4,
  },
  divider: { width: 40, height: 1, background: '#6B2A3C', margin: '0 auto 24px', opacity: 0.4 },
  sessionLine: {
    fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const,
    color: '#2C2C2C', opacity: 0.35,
  },
  timerSection: {
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', marginBottom: 48,
  },
  ringWrapper: { position: 'relative' as const, width: 220, height: 220, marginBottom: 32 },
  digitsContainer: {
    position: 'absolute' as const, inset: 0,
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center',
  },
  timeDigits: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 52, fontWeight: 500, color: '#2C2C2C',
    letterSpacing: 0, lineHeight: 1,
  },
  timeColon: { color: '#6B2A3C', opacity: 0.6, margin: '0 2px' },
  durationLabel: {
    fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const,
    color: '#2C2C2C', opacity: 0.35, marginTop: 10,
  },
  sessionRoman: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 14, fontStyle: 'italic', color: '#6B2A3C',
    marginTop: 8,
  },
  dividerWide: {
    width: '100%', height: 1, background: '#2C2C2C',
    opacity: 0.1, marginBottom: 32,
  },
  controls: { display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 },
  btn: {
    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
    letterSpacing: 3, textTransform: 'uppercase' as const,
    padding: '14px 36px', cursor: 'pointer', background: 'transparent',
    transition: 'all 0.2s ease',
  },
  btnPrimary: {
    border: '1.5px solid #6B2A3C', color: '#6B2A3C',
  },
  btnGhost: {
    border: '1.5px solid transparent', color: '#2C2C2C', opacity: 0.4,
  },
  footer: { textAlign: 'center' as const, marginTop: 'auto', paddingTop: 40 },
  footerText: {
    fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const,
    color: '#2C2C2C', opacity: 0.2,
  },
  dotDecoration: {
    display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16,
  },
  dot: {
    width: 4, height: 4, borderRadius: '50%', background: '#6B2A3C', opacity: 0.4,
  },
  /* Timer ring decorative dots */
  ringDecor: {
    position: 'absolute' as const, top: -4, left: '50%',
    marginLeft: -3, width: 6, height: 6,
    borderRadius: '50%', background: '#6B2A3C',
  } as React.CSSProperties,
}

export default function EditorialDesign() {
  const circumference = 2 * Math.PI * 95

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>pomodoro</div>
          <div style={styles.divider} />
          <div style={styles.sessionLine}>Session II of IV</div>
        </div>

        {/* Timer */}
        <div style={styles.timerSection}>
          <div style={styles.ringWrapper}>
            {/* Decorative top dot */}
            <div style={styles.ringDecor} />

            <svg width="100%" height="100%" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="110" cy="110" r="95" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.08" />
              <circle cx="110" cy="110" r="95" fill="none" stroke="#6B2A3C" strokeWidth="2"
                strokeLinecap="round" strokeDasharray={`${circumference * 0.35} ${circumference * 0.65}`}
                strokeDashoffset={circumference * 0.35} />
              {/* Decorative dots on the active arc */}
              <circle cx="110" cy="15" r="2" fill="#6B2A3C" opacity="0.6" />
            </svg>

            <div style={styles.digitsContainer}>
              <div style={styles.timeDigits}>
                <span>15</span><span style={styles.timeColon}>:</span><span>23</span>
              </div>
              <div style={styles.durationLabel}>Remaining</div>
              <div style={styles.sessionRoman}>focus</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.dividerWide} />

        {/* Controls */}
        <div style={styles.controls}>
          <button style={{ ...styles.btn, ...styles.btnGhost }}>Skip</button>
          <button style={{ ...styles.btn, ...styles.btnPrimary }}>Begin</button>
          <button style={{ ...styles.btn, ...styles.btnGhost }}>Reset</button>
        </div>

        {/* Decorative dots */}
        <div style={styles.dotDecoration}>
          <div style={styles.dot} />
          <div style={{ ...styles.dot, opacity: 0.2 }} />
          <div style={{ ...styles.dot, opacity: 0.2 }} />
        </div>

        {/* Next break hint */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.25 }}>Next</div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 14, fontStyle: 'italic', color: '#6B2A3C', marginTop: 4,
          }}>short respite</div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerText}>Pomodoro • twenty twenty-six</div>
        </div>
      </div>
    </div>
  )
}
