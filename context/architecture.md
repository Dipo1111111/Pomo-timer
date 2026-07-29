# Architecture — Pomodoro Timer PWA

## Tech Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 19 + TypeScript | ShadCN requires React. TypeScript for safety. |
| Build | Vite 8 | Fast, great PWA plugin, modern defaults. |
| CSS | Tailwind CSS v4 | Utility-first, composable, latest version. |
| UI Library | ShadCN UI | Radix primitives with Tailwind theming. Use only what we need (Button, Card, Dialog, Tabs, Switch). |
| Icons | Lucide React | Pairs with ShadCN. |
| Motion | Framer Motion | For purposeful animations (mode switches, page transitions). |
| Router | React Router v7 | Simple SPA routing — 3 views. |
| PWA | vite-plugin-pwa | Service worker generation, manifest, iOS meta tags. |
| State | React Context + hooks | Simple enough app — no Zustand/Redux needed. |
| Persistence | localStorage | Timer state, settings, and session history. |

## Folder Structure
```
src/
  main.tsx              — Entry point, router setup
  App.tsx               — Shell layout + routing
  index.css             — Tailwind import + CSS variables + global styles
  lib/
    timer-context.tsx   — Timer state context provider
    timer-engine.ts     — Pure timer logic (start, tick, pause, complete)
    storage.ts          — localStorage wrapper with JSON parse/stringify
    settings-context.tsx — Settings context provider
    stats.ts            — Stats computation from session history
    types.ts            — Shared TypeScript types
    utils.ts            — Formatting helpers (time display, dates)
  hooks/
    useTimer.ts         — React hook wrapping timer engine + persistence
    useNotification.ts  — Audio + visual notification on session end
    useVisibility.ts    — Track tab visibility for catch-up logic
  pages/
    TimerPage.tsx       — Main timer screen (the hero)
    StatsPage.tsx       — Session history and statistics
    SettingsPage.tsx    — Timer durations, auto-start, theme, sound
  components/
    timer/
      TimerDisplay.tsx  — Ring/circular countdown + time digits
      TimerControls.tsx — Start/Pause/Reset buttons
      PhaseIndicator.tsx — Shows current phase + session count + next break type
    layout/
      AppShell.tsx      — Main layout with nav + content area
      NavBar.tsx        — Bottom tab navigation (mobile) / sidebar (desktop)
    ui/
      (ShadCN-generated components — button, card, etc.)
      ThemeToggle.tsx   — Dark/light mode switch
public/
  icons/                — PWA icons (placeholder-generated)
```

## Data Flow
```
User clicks Start → useTimer.start() → ticks every 1s via setInterval
    → updates TimerContext.remaining (seconds)
    → SVG ring re-renders via stroke-dashoffset
    → on complete: play audio, show notification, advance phase

Visibility change:
    → page hidden: persist (remaining, tickedAt) to localStorage
    → page visible: read tickedAt, subtract elapsed real time

Settings change:
    → SettingsPage updates SettingsContext
    → SettingsContext persists to localStorage
    → TimerContext reads new durations on next cycle

Session completes:
    → push session record to TimerContext.history[]
    → history persists to localStorage
    → StatsPage reads history to compute charts
```

## Boundaries
- **No backend.** Everything is client-side, localStorage-only.
- **No authentication.** Single-user, personal tool.
- **Timer is the authority.** If state in memory differs from localStorage (e.g. closed tab mid-session), localStorage wins on reload — the timer catches up by calculating elapsed real time.
- **PWA is additive.** The app works identically as a website and as an installed PWA. No PWA-only features.

## Routing
| Path | View | Description |
|------|------|-------------|
| `/` | TimerPage | Main Pomodoro timer |
| `/stats` | StatsPage | Session history and statistics |
| `/settings` | SettingsPage | Configuration |
