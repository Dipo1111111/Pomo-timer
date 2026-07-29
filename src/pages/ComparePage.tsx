import React from 'react'
import { useNavigate } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════
   Mini previews (hoisted — used by DESIGNS array)
   ═══════════════════════════════════════════════════════════════ */

/* ── Editorial ── */
function EditorialPreview() {
  return (
    <div style={{ background: '#F5F0EB', minHeight: '100vh', padding: '40px 24px', position: 'relative', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 10, fontStyle: 'italic', color: '#6B1A2A', fontWeight: 500 }}>pomodoro</div>
        <div style={{ width: 24, height: 1.5, background: '#6B1A2A', margin: '10px auto', opacity: 0.3 }} />
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.35 }}>Session II of IV</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
        <div style={{ position: 'relative', width: 125, height: 125 }}>
          <svg width="125" height="125" viewBox="0 0 125 125" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="62.5" cy="62.5" r="48" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.08" />
            <circle cx="62.5" cy="62.5" r="48" fill="none" stroke="#6B1A2A" strokeWidth="2.2" strokeDasharray="301.6" strokeDashoffset="105.6" strokeLinecap="round" />
            {[0, 90, 180, 270].map((a) => {
              const r = (a - 90) * Math.PI / 180
              return <line key={a} x1={62.5+48*Math.cos(r)} y1={62.5+48*Math.sin(r)} x2={62.5+44*Math.cos(r)} y2={62.5+44*Math.sin(r)} stroke="#6B1A2A" strokeWidth="0.6" opacity="0.12" />
            })}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 24, fontWeight: 500, color: '#2C2C2C' }}>15:23</span>
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 11, fontStyle: 'italic', color: '#6B1A2A', marginTop: 2 }}>focus</span>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: 1, background: '#2C2C2C', opacity: 0.08, marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, fontSize: 7, fontWeight: 400, letterSpacing: 2, textTransform: 'uppercase' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, fontWeight: 500, color: '#2C2C2C' }}>II</div><span style={{ opacity: 0.25 }}>Session</span></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, fontWeight: 500, color: '#2C2C2C' }}>25:00</div><span style={{ opacity: 0.25 }}>Target</span></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <div style={{ padding: '6px 18px', border: '1.5px solid transparent', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.3 }}>Skip</div>
        <div style={{ padding: '6px 22px', border: '1.5px solid #6B1A2A', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: '#6B1A2A' }}>Begin</div>
        <div style={{ padding: '6px 18px', border: '1.5px solid transparent', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.3 }}>Reset</div>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.2 }}>Pomodoro • 2026</div>
      </div>
    </div>
  )
}

/* ── Frost ── */
function FrostPreview() {
  const segs = 12
  const segLen = (2 * Math.PI * 42) / segs
  const filled = Math.round(segs * 0.65)
  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter Tight', sans-serif", color: '#2D3436' }}>
      <div style={{ textAlign: 'center', fontSize: 7, fontWeight: 500, letterSpacing: 6, textTransform: 'uppercase', color: '#B8C5D6', marginBottom: 28 }}>Pomodoro</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 110, height: 110 }}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r="50" fill="none" stroke="#B8C5D6" strokeWidth="0.3" opacity="0.15" />
            {Array.from({ length: segs }).map((_, i) => (
              <circle key={i} cx="55" cy="55" r="42" fill="none"
                stroke={i < filled ? '#2D3436' : '#B8C5D6'}
                strokeWidth={i < filled ? 1.2 : 0.6}
                strokeDasharray={`${segLen - 2} ${2 * Math.PI * 42}`}
                strokeDashoffset={i * segLen}
                strokeLinecap="round" opacity={i < filled ? 1 : 0.3} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 20, fontWeight: 600, letterSpacing: 1, color: '#2D3436' }}>15:23</span>
            <span style={{ fontSize: 6, fontWeight: 400, letterSpacing: 4, textTransform: 'uppercase', color: '#B8C5D6', marginTop: 4 }}>Focus</span>
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: '#B8C5D6', opacity: 0.1, marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, fontSize: 6, fontWeight: 400, letterSpacing: 3, textTransform: 'uppercase' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, fontWeight: 500, color: '#2D3436' }}>02/04</div><span style={{ color: '#B8C5D6' }}>Session</span></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, fontWeight: 500, color: '#2D3436' }}>25:00</div><span style={{ color: '#B8C5D6' }}>Target</span></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <div style={{ padding: '6px 14px', border: '1.5px solid transparent', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: '#B8C5D6' }}>Skip</div>
        <div style={{ padding: '6px 18px', border: '1.5px solid #2D3436', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: '#2D3436' }}>Start</div>
        <div style={{ padding: '6px 14px', border: '1.5px solid transparent', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: '#B8C5D6' }}>Reset</div>
      </div>
    </div>
  )
}

/* ── Forge — deep crimson, architectural ── */
function ForgePreview() {
  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', padding: '36px 20px', fontFamily: "'Inter Tight', sans-serif", color: '#EDE8DC' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: '#4A82C4', letterSpacing: 4, textTransform: 'uppercase', opacity: 0.3 }}>Pomodoro</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 115, height: 115 }}>
          <svg width="115" height="115" viewBox="0 0 115 115" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="57.5" cy="57.5" r="42" fill="none" stroke="#EDE8DC" strokeWidth="1" opacity="0.03" />
            <circle cx="57.5" cy="57.5" r="42" fill="none" stroke="#4A82C4" strokeWidth="3" strokeDasharray="263.9" strokeDashoffset="92.4" strokeLinecap="round" />
            <circle cx="57.5" cy="57.5" r="48" fill="none" stroke="#EDE8DC" strokeWidth="0.3" opacity="0.02" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#EDE8DC', letterSpacing: '0.02em' }}>15:23</span>
            <span style={{ fontSize: 7, fontWeight: 500, letterSpacing: 5, textTransform: 'uppercase', color: '#4A82C4', opacity: 0.5, marginTop: 4 }}>Focus</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 16, fontSize: 6, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: '#EDE8DC' }}>02</div><span style={{ opacity: 0.1 }}>Session</span></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: '#EDE8DC' }}>25:00</div><span style={{ opacity: 0.1 }}>Target</span></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: '#EDE8DC' }}>09:37</div><span style={{ opacity: 0.1 }}>Elapsed</span></div>
      </div>
      <div style={{ width: '100%', height: 1, background: '#EDE8DC', opacity: 0.03, marginBottom: 14 }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <div style={{ padding: '6px 14px', border: '1.5px solid rgba(237,232,220,0.04)', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.15 }}>Skip</div>
        <div style={{ padding: '6px 18px', border: '1.5px solid #4A82C4', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: '#4A82C4' }}>Begin</div>
        <div style={{ padding: '6px 14px', border: '1.5px solid rgba(237,232,220,0.04)', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.15 }}>Reset</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Design Config
   ═══════════════════════════════════════════════════════════════ */

const DESIGNS = [
  {
    id: 'editorial',
    name: 'Editorial',
    tagline: 'Serif · Oxblood · Classic',
    description: 'Warm ivory and oxblood. EB Garamond for the display, Inter for body. Tick marks at cardinal points. Refined like a printed page.',
    palette: ['#F5F0EB', '#6B1A2A', '#2C2C2C', '#FFFFFF'],
    font: 'EB Garamond + Inter',
    preview: EditorialPreview,
  },
  {
    id: 'frost',
    name: 'Frost',
    tagline: 'Scandinavian · Segmented · Airy',
    description: 'White, charcoal, and ice blue. 12-segment ring, Inter Tight throughout. Lightweight and precise — like Nordic design.',
    palette: ['#FAFAF8', '#B8C5D6', '#2D3436', '#E8F0F4'],
    font: 'Inter Tight',
    preview: FrostPreview,
  },
  {
    id: 'forge',
    name: 'Forge',
    tagline: 'Blue · Dark · Bold',
    description: 'Black and deep blue. Space Grotesk display, Inter Tight body. Clean, dark, architectural — bold blue accent.',
    palette: ['#0D0D0D', '#4A82C4', '#EDE8DC', '#1A1A1A'],
    font: 'Space Grotesk + Inter Tight',
    preview: ForgePreview,
  },
]

export default function ComparePage() {
  const navigate = useNavigate()

  return (
    <div style={{
      background: '#F0F0ED',
      minHeight: '100vh',
      minWidth: '100vw',
      padding: 0,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Inter", sans-serif',
    }}>
      {/* Figma-style header */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6B7AFF' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', letterSpacing: -0.2 }}>Pomodoro — Design Explorer</span>
        </div>
        <div style={{ fontSize: 11, color: '#999', letterSpacing: 0.3 }}>3 themes</div>
      </div>

      {/* Figma canvas (whiteboard) */}
      <div style={{
        background: '#F0F0ED',
        padding: '60px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        flexWrap: 'wrap',
        minHeight: 'calc(100vh - 48px)',
        alignItems: 'flex-start',
      }}>
        {DESIGNS.map((design) => (
          <DesignCard
            key={design.id}
            {...design}
            onClick={() => navigate(`/compare/${design.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Design Card ─── */

function DesignCard({
  name,
  tagline,
  description,
  palette,
  font,
  preview: Preview,
  onClick,
}: {
  name: string
  tagline: string
  description: string
  palette: string[]
  font: string
  preview: React.ComponentType
  onClick: () => void
}) {
  return (
    <div style={{
      width: 340,
      background: 'white',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
      cursor: 'pointer',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      opacity: 1,
    }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)'
      }}
    >
      {/* Preview frame */}
      <div style={{
        height: 420,
        overflow: 'hidden',
        position: 'relative',
        background: '#FAFAF8',
        borderBottom: '1px solid #f0f0ee',
      }}>
        <div style={{
          transform: 'scale(0.55)',
          transformOrigin: 'top center',
          width: '181.8%',
          height: '181.8%',
          pointerEvents: 'none',
        }}>
          <Preview />
        </div>
        {/* Click overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.2s',
          background: 'rgba(0,0,0,0.02)',
          cursor: 'pointer',
        }}
          className="preview-overlay"
        >
          <span style={{
            background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 20px',
            borderRadius: 40, fontSize: 12, fontWeight: 500, letterSpacing: 0.5,
          }}>View full</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{name}</h3>
          <span style={{ fontSize: 10, color: '#999', letterSpacing: 0.5 }}>{font}</span>
        </div>
        <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0', fontStyle: 'italic' }}>{tagline}</p>
        <p style={{ fontSize: 12, color: '#666', margin: '6px 0 0', lineHeight: 1.5 }}>{description}</p>

        {/* Palette */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          {palette.map((color) => (
            <div key={color} style={{
              width: 20, height: 20, borderRadius: '50%',
              background: color,
              border: '1px solid rgba(0,0,0,0.06)',
              flexShrink: 0,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        .preview-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
