# Build Plan — Pomodoro Timer PWA

## Phase 1: Foundation
- [x] Scaffold Vite + React + TypeScript project
- [x] Install all dependencies
- [ ] Configure Tailwind CSS v4 (index.css with @import, CSS variables)
- [ ] Set up ShadCN UI (component primitives)
- [ ] Configure vite-plugin-pwa
- [ ] Write shared types (src/lib/types.ts)
- [ ] Write storage utilities (src/lib/storage.ts)
- [ ] Write utility functions (src/lib/utils.ts)

## Phase 2: Timer Engine
- [ ] Write pure timer-engine logic (src/lib/timer-engine.ts)
- [ ] Write timer context provider (src/lib/timer-context.tsx)
- [ ] Write settings context provider (src/lib/settings-context.tsx)
- [ ] Write useTimer hook (src/hooks/useTimer.ts)
- [ ] Write useNotification hook (src/hooks/useNotification.ts)
- [ ] Write useVisibility hook (src/hooks/useVisibility.ts)

## Phase 3: UI — Timer
- [ ] TimerDisplay component (SVG ring + digits)
- [ ] TimerControls component (Start/Pause/Reset)
- [ ] PhaseIndicator component
- [ ] TimerPage (compose timer components)

## Phase 4: UI — Layout & Navigation
- [ ] NavBar component (bottom tabs mobile, sidebar desktop)
- [ ] AppShell layout with animated page transitions
- [ ] ShadCN UI primitives (button, card, switch, tabs, dialog)

## Phase 5: UI — Stats & Settings
- [ ] StatsPage with daily focus chart + session counters
- [ ] Stats computation module
- [ ] SettingsPage with duration controls, toggles, theme switch
- [ ] ThemeToggle component

## Phase 6: PWA & Polish
- [ ] PWA manifest with iOS meta tags
- [ ] Generate placeholder icons
- [ ] Service worker config (offline cache)
- [ ] Audio alarm file/asset
- [ ] Verify iOS home screen install
- [ ] Dark/light mode testing
- [ ] Reduced-motion testing
- [ ] Lighthouse audit
