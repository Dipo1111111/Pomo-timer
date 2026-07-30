# Memory

Last updated: 2026-07-29

---

## Session: Initial Build — Pomodoro Timer PWA

Last updated: 2026-07-29

### What was built
Full Pomodoro timer web app with PWA support. Complete file structure:

**Foundation:**
- `vite.config.ts` — Configured with Tailwind CSS v4 plugin, `@/` path alias, React Router, PWA plugin with workbox service worker
- `src/index.css` — Tailwind v4 theme with OKLCH color tokens, light/dark mode variables, reduced-motion support
- `src/lib/types.ts` — Shared TypeScript types (TimerPhase, TimerState, SessionRecord, AppSettings)
- `src/lib/utils.ts` — Utility functions (cn(), formatTime, generateId, phaseLabel, formatDuration)
- `src/lib/storage.ts` — localStorage wrapper with safe-parse, defaults, persistence for settings/timer/sessions

**Timer Engine:**
- `src/lib/timer-engine.ts` — Pure functions for timer state transitions (start, pause, reset, tick, advance phase, catch up from tab backgrounding)
- `src/lib/timer-context.tsx` — React context provider managing timer lifecycle, tick interval, visibility catch-up, session recording, auto-advance, auto-start
- `src/lib/settings-context.tsx` — React context provider for app settings, dark/light/system theme resolution, DOM class toggling
- `src/hooks/useNotification.ts` — Web Audio API chime/bell generation, browser notifications, tab title flash
- `src/hooks/useVisibility.ts` — Document visibility tracking for timer catch-up

**UI Components:**
- `src/components/ui/button.tsx` — ShadCN-style button with variants (primary/secondary/ghost/danger) and sizes
- `src/components/ui/card.tsx` — ShadCN-style card with header/title/description/content sub-components
- `src/components/ui/ThemeToggle.tsx` — Dark/Light/System segmented control
- `src/components/timer/TimerDisplay.tsx` — SVG ring countdown with stroke-dasharray animation, phase-colored
- `src/components/timer/TimerControls.tsx` — Start/Pause morphing button + Reset + Skip
- `src/components/timer/PhaseIndicator.tsx` — Animated phase label with session counter
- `src/components/layout/NavBar.tsx` — Bottom nav mobile / sidebar desktop with active states
- `src/components/layout/AppShell.tsx` — Root layout with animated page transitions

**Pages:**
- `src/pages/TimerPage.tsx` — Main timer view composing Display + Controls + PhaseIndicator
- `src/pages/StatsPage.tsx` — Stats dashboard with 4 stat cards, daily bar chart (30-day), recent sessions list, empty state
- `src/pages/SettingsPage.tsx` — Settings with duration sliders, auto-start toggles, sound selector (chime/bell/silent), theme picker
- `src/App.tsx` — Router setup with BrowserRouter, nested routes under AppShell
- `src/main.tsx` — Entry point

**PWA:**
- PWA manifest with iOS meta tags (apple-mobile-web-app-capable, status-bar-style, icons)
- Service worker via vite-plugin-pwa (workbox, 11 precached entries)
- SVG icons for favicon, 192x192, 512x512, maskable
- Offline-capable core timer

**Context System (per PRODUCT-PLANNER):**
- `CLAUDE.md` — Agent instructions with context file read order, core rules, skill references
- `context/project-overview.md` — Product description, users, goals
- `context/architecture.md` — Tech stack, folder structure, data flow, routing
- `context/build-plan.md` — Phased feature list
- `context/code-standards.md` — TypeScript, naming, component, CSS conventions
- `context/library-docs.md` — How to use each library in this project
- `context/ui-tokens.md` — Color palette (OKLCH), typography, spacing scale, radii, shadows
- `context/ui-rules.md` — Visual identity, layout rules, component-specific design
- `context/ui-registry.md` — Living doc of all built components with props, states, descriptions
- `context/progress-tracker.md` — Full checklist (all initial items complete)
- `PRODUCT.md` — Strategic product document
- `_PLANNING_STATE.md` — Planning session state (anti-rot)
- Memory system set up in `.claude/projects/`

### Decisions made
- **Stack**: React + Vite + TypeScript + Tailwind CSS v4 + ShadCN-style primitives + Framer Motion + React Router v7
- **Design**: Minimalist luxury, dark-first with light mode option, cool indigo accent, no glow/bloom/frosted glass
- **Persistence**: localStorage for all state (timer, settings, session history)
- **Audio**: Web Audio API generated tones (no external sound files needed)
- **Timer catch-up**: On tab visibility change, calculate elapsed real time to catch up
- **No backend**: Fully client-side, single-user personal tool
- **Phase colors**: Indigo for focus, green for short break, blue for long break
- **Timer ring**: SVG stroke-dasharray/offset with 300ms linear transition
- **Animation**: Framer Motion for page transitions and phase changes, CSS transitions for interactive states

### Problems solved
- Timer continues accurately even when tab is backgrounded (visibility API + elapsed time calculation)
- iOS PWA limitations handled: no background JS execution, so no fake background ticking; instead catch up on return
- Audio generated programmatically via Web Audio API — no external files to manage
- Tailwind v4 theming with OKLCH color space — CSS variables defined in @theme, overridden in .light class
- TypeScript strict mode — all unused imports removed, type fixes applied

### Current state
Everything builds cleanly (`npm run build` succeeds — TypeScript clean, Vite bundles in 1.88s, PWA service worker generated with 11 precached entries). All components written, all wiring complete. The app should be fully functional.

### Next session starts with
1. Run `npm run dev` to start the dev server
2. Test the timer: start, pause, reset, let it complete, verify auto-advance
3. Test on iOS: load in Safari, add to home screen, run as PWA
4. Verify dark/light mode switching in Settings
5. Verify stats page shows data after completing sessions
6. Run `/remember restore` at start of next session

### Open questions
- Need to test actual iOS PWA behavior (audio on backgrounded timer, home screen icon appearance)
- Might want to fine-tune the TimerDisplay SVG sizing for different viewports
- Consider adding a "completed session" visual feedback (brief pulse animation on ring)

---

## Session: Polish — Name fix, theme flash fix, seed data wipe, empty state

Last updated: 2026-07-29

### What was built
**Fixes (3):**
- **Name reverted** — "Commodoro" → "Pomodoro" in `LoadingScreen.tsx`, `NavBar.tsx`, `index.html`, `vite.config.ts` PWA manifest. The "Commodoro" name was a typo the user made; original name restored.
- **Theme flash killed** — Added inline `<script>` in `index.html` that reads `localStorage.getItem('pomodoro:settings')` and sets `data-visual-theme` attribute on `<html>` synchronously before the first paint. Prevents the flash of default (Forge) theme before React hydrates.
- **Seed data wiped** — Added `SESSION_DATA_VERSION = 2` guard in `src/lib/storage.ts`. On next load, stale sample sessions in localStorage are detected (version < 2) and cleared. Users start fresh — no more hardcoded 18h sessions or fake 24min averages.

**Empty state simplified:**
- `StatsPage.tsx` — Replaced entire skeleton UI (6 ghost cards, skeleton heatmap, fake chart bars, ghost session rows) with a single text-only empty state: "As you use the timer, your statistics will appear here." No emoji, no icons, no fake layout.

### Decisions made
- **No skeleton placeholders for empty data** — The user explicitly rejected showing a "ghost layout" when there's nothing to show. Skeleton loaders are only useful during actual loading (e.g., network fetch). For a localStorage-only app, empty state = simple text, not fake cards.
- **LocalStorage data versioning** — Added version key to `storage.ts` to cleanly migrate away from stale development data without hardcoding a specific clear.
- **Theme fix at the HTML level** — Reading localStorage inline in `<head>` is the only way to beat the first paint. Settings context sync remains in place for runtime changes.

### Next session starts with
Discuss marketing, psychology, positioning, and audience strategy. The user was about to explain their vision for "what we are, who is, who can" and viral psychology around the "we" angle before the session ended. This was framed as the main product/marketing conversation for the app.

---

## Session: Audio fix — sound wasn't playing

Last updated: 2026-07-29

### What was built
**Audio fix:**
- `src/hooks/useNotification.ts` — Added `primeAudio()` function that creates and resumes the AudioContext. Browser AudioContexts are blocked outside of user gestures; the old code only created the context inside `notify()` which fires from a timer callback (not a gesture), so Chrome silently suspended it and the try-catch swallowed the error.
- `src/lib/timer-context.tsx` — Calls `primeAudio()` inside the `start()` handler, which runs from a user click on Start. This creates and resumes the AudioContext while the browser allows it, so sound is ready when the timer completes.

### Problems solved
- **Sound never played on timer completion** — Web Audio API requires AudioContext creation/resume in a user gesture. Creating it lazily inside `notify()` (setInterval callback) was silently blocked by Chrome. Fix: create + resume on Start button click (valid user gesture), with a belt-and-suspenders resume in `notify()` as fallback.

### Current state
App logic and fixes are complete. Name is reverted, theme flash is gone, seed data is wiped, stats shows clean empty state, and audio now works on timer completion.

### Next session starts with
Discuss marketing, psychology, positioning, and audience strategy. The user wanted to talk about "what we are, who is, who can" and viral psychology around the "we" angle.

### Open questions
- User mentioned marketing/psychology strategy — needs to be discussed next session
- No other open issues

---

## Session: Task names, build fixes, default theme = editorial

Last updated: 2026-07-29

### What was built
**Task name feature:**
- `src/lib/types.ts` — Added `taskName?: string` to `SessionRecord`
- `src/lib/timer-context.tsx` — Added `currentTask` state + `setCurrentTask` context methods. Saves task name with each completed session. Uses a ref to avoid stale closure issues with the timer callback. Auto-clears task after focus session completes.
- `src/pages/TimerPage.tsx` — Added clean text input at the top: "What are you working on?" Type a task, hit Enter or click Start. Input disappears once task is set and timer is running.
- `src/components/timer/PhaseIndicator.tsx` — Shows the current task name during focus instead of the useless "Session X/4" counter. During breaks, shows "NEXT: FOCUS".
- `src/pages/StatsPage.tsx` — RecentSessions shows the task name next to each session duration.

**Session counter removed:**
- PhaseIndicator no longer shows "Session X/4" at all. Task name replaced it entirely.

**Vercel build errors fixed:**
- `src/pages/SettingsPage.tsx` — Removed unused `id` param in ThemeOption
- `src/pages/StatsPage.tsx` — Removed unused `i` in sessions map
- `src/pages/compare/editorial.tsx` — Fixed duplicate `strokeDasharray` attribute

**Default theme = editorial:**
- `src/lib/storage.ts` — Default `visualTheme` changed from `'forge'` to `'editorial'`
- `index.html` — `<html>` now has `data-visual-theme="editorial"` by default. Inline script overrides it if localStorage has a saved theme. Fresh browsers get editorial from the first paint.

### Decisions made
- **Task name is the core session identity** — Every focus session is tied to a real task. The "Session X/4" counter was meaningless metadata; the task name is what matters.
- **Editorial is the default theme** — When the user opens the app for the first time, they see Editorial (warm ivory + oxblood + serif), not Forge (black + blue). Changed in both storage.ts default and the HTML attribute.

### Current state
App is clean. TypeScript compiles with no errors. Vercel deploy should pass. Fresh browser experience: Editorial theme, clean stats page, task input ready. Returning users: their saved theme and settings preserved.

### Next session starts with
Discuss marketing, psychology, positioning, and audience strategy. The user wanted to talk about "what we are, who is, who can" and viral psychology around the "we" angle.

### Open questions
- Marketing/psychology strategy needs discussion
- No other open issues
