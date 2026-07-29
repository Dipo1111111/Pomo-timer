# UI Rules — Pomodoro Timer PWA

## Visual Identity
- **Minimalist luxury**: Every element has a reason. No decoration for its own sake.
- **Crisp, not soft**: Sharp edges, clean borders. No blur, no glow, no frosted glass.
- **Dark-first**: Dark mode is the default and must look most refined. Light mode is clean but secondary.
- **The timer is the hero**: The SVG ring + digits dominate the screen. Nothing competes.

## Layout Rules
- Timer screen: vertical center, single column, max 480px wide
- Stats/Settings: scrollable, top nav bar, max 720px wide
- Bottom navigation on mobile (<=768px), left sidebar on desktop (>768px)
- Full viewport height on timer page. No unnecessary scroll.
- Apple-style generous whitespace — let content breathe.

## Navigation
- Three tabs: Timer (clock icon), Stats (bar-chart icon), Settings (settings icon)
- Active tab: accent color + subtle indicator
- Inactive tabs: muted ink color
- Tab labels hidden on mobile (icons only), visible on desktop

## Timer Ring (SVG)
- Circle drawn with `stroke-dasharray` and `stroke-dashoffset`
- Stroke width: 6px on mobile, 8px on desktop
- Track (background ring): `var(--surface)` color
- Progress (active ring): phase color (`--phase-focus`, etc.)
- Ring animation: smooth CSS transition on dashoffset (300ms ease)
- No glow, no drop-shadow on ring
- Timer digits inside the ring: monospace, hero size, bold weight
- Phase label (FOCUS / BREAK) below digits in smaller muted text
- Session counter: "Session 2/4" below phase label

## Timer Controls
- Three buttons in a row: Reset (secondary), Start/Pause (primary), Skip (secondary)
- Primary button: filled accent bg, white text, pill shape
- Secondary buttons: subtle border, no bg, muted text
- Button size: large touch targets (min 48px height)
- Start → Pause morphing (icon/text swap on same button) — subtle animation

## Cards (Stats page)
- Dark surface on dark bg, light surface on light bg
- No border by default — use subtle bg difference
- Padding: `--spacing-6` inside cards
- Corner radius: `--radius-lg`
- No nested cards
- No side-stripe borders

## Stats Page
- Daily focus time as small bar chart (SVG or CSS bars)
- Stats cards: Total sessions, Total focus time, Current streak, Today's focus
- Numbers bold and large, labels muted and small
- Recent sessions list below cards — small, compact, scrollable

## Settings Page
- Grouped sections with subtle dividers
- Slider + label for timer durations (e.g., "Focus: 25 min" with slider)
- Switches for auto-start toggles
- Theme selector (Dark / Light / System)
- Sound selector with preview button
- Clean, scannable, no visual noise

## Empty States
- Stats: First session message — "Complete your first focus session to see stats"
- Welcome state on first load — timer is ready, "Tap Start to begin"

## Animations
- **Page transitions**: Slide up/fade on enter, slide down/fade on exit — 300ms
- **Timer mode switch**: Ring color transitions smoothly (300ms ease)
- **Session complete**: Brief scale pulse on ring (500ms) + fade in next phase label
- **Button hover**: Subtle bg change (150ms)
- **Stats count-up**: Numbers animate from 0 to target on mount (500ms ease-out)
- **Reduced motion**: All animations become instant crossfades or skip entirely
