# Planning State — Pomodoro Timer PWA

## Current Status
Pre-build — All architect decisions finalized. Writing context files and starting implementation.

## Decisions Made
- **Register**: Product app (Pomodoro timer, not marketing)
- **Brand**: Minimalist luxury — refined, confident, calm
- **Theme**: Dark-first with light mode as secondary option. No glow/bloom.
- **Stack**: React + Vite + TypeScript + Tailwind v4 + ShadCN UI
- **PWA**: iOS home screen install with offline support via `vite-plugin-pwa`
- **Persistence**: localStorage for timer state, settings, and stats
- **Notifications**: Audio alarm + visual flash + tab title update (iOS constraints)
- **Routing**: React Router with 3 views (Timer, Stats, Settings)
- **Motion**: CSS transitions + Framer Motion, respects `prefers-reduced-motion`
- **Features**: Classic Pomodoro cycle + session history/stats + customizable settings

## Resolved Questions
- Stack preference: React + TypeScript + Vite ✓
- CSS framework: Tailwind CSS v4 ✓
- UI library: ShadCN UI ✓
- Design direction: Minimalist luxury, dark-first ✓
- Scope: Personal use, no backend, no accounts ✓

## Next Step
Build the 9 context files, then implement:

1. Create context files (project-overview, architecture, build-plan, code-standards, library-docs, ui-tokens, ui-rules, ui-registry, progress-tracker)
2. Write/update CLAUDE.md
3. Scaffold and configure project (Tailwind, ShadCN, PWA)
4. Build timer engine (hooks, context, persistence)
5. Build UI components (Timer display, controls, layout, stats, settings)
6. Configure PWA (manifest, icons, service worker)
7. Polish and verify

## Design Decisions
- **Primary accent**: A crisp, refined hue — not warm, not cold. Thinking a desaturated indigo or deep teal.
- **Background**: Deep neutral (#0a0a0b range) for dark mode. Clean off-white for light.
- **Typography**: Monospace or clean sans-serif for the timer digits. System font stack for UI text.
- **Timer visual**: SVG ring with stroke-dasharray for countdown, clean edges, no glow.
