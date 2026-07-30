# UI Rules — React Native Pomodoro

> Exact pixel match of the web PWA. Nothing changes visually.

## Visual Identity
- **Minimalist luxury**: Every element has a reason. No decoration for its own sake.
- **Crisp, not soft**: Sharp edges, clean borders. No blur, no glow, no frosted glass.
- **Editorial theme**: Warm ivory bg, oxblood accent, serif display type.
- **The timer is the hero**: SVG ring + digits dominate the screen. Nothing competes.

## Layout
- Timer screen: vertical center, single column, max 480px
- Stats/Settings: scrollable, top-safe-area inset
- Bottom tab bar: 3 tabs (Timer, Stats, Settings), icons + active label
- Full screen height on timer. No unnecessary scroll.
- Apple-style generous whitespace — let content breathe.

## Timer Ring (SVG)
- Circle drawn with `stroke-dasharray` / `stroke-dashoffset`
- Stroke width: 6px
- Track (background ring): `accent-subtle` color
- Progress (active ring): phase color
- Ring animation: smooth transition on dashoffset (300ms)
- Timer digits inside ring: serif (EB Garamond), hero size (64px), bold
- Phase label below digits: "FOCUS" or "BREAK" in muted text

## Timer Controls
- Three buttons in a row: Reset (secondary), Start/Pause (primary pill), Skip (secondary)
- Primary: filled oxblood bg, white text, pill shape, 48px height
- Secondary: subtle border, no bg, muted text
- Start morphs to Pause (same button, swap icon+label)

## Cards (Stats page)
- Warm surface bg, no border (bg difference only)
- Padding: 24px inside cards
- Corner radius: 12px
- No nested cards
- Stat numbers bold large, labels muted small

## Bottom Navigation
- Three tabs: Timer (clock icon), Stats (bar-chart icon), Settings (settings icon)
- Active tab: oxblood accent + label shown
- Inactive tabs: muted ink
- Icons same as web (Lucide — use equivalent RN icons or SVG)

## Settings
- Grouped sections with dividers
- Slider + label for durations
- Switches for auto-start toggles
- Editorial theme is the only visual theme (no theme switcher)

## Empty States
- Stats: "Complete your first focus session to see statistics"
- No loading/placeholder skeletons — data is instant from local storage
