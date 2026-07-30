# UI Registry — Pomodoro Timer PWA

> Living document of built components.

## Timer Components

### TimerDisplay
- **File**: `src/components/timer/TimerDisplay.tsx`
- **Props**: `remaining`, `totalDuration`, `phase`, `status`, `className?`
- **Description**: SVG ring countdown with centered time digits. Uses stroke-dasharray/offset for progress. Phase-colored ring (indigo for focus, green for short break, blue for long break). No glow, no shadows.
- **States**: Shows remaining time and progress ring proportion. Transitions smoothly when phase changes.

### TimerControls
- **File**: `src/components/timer/TimerControls.tsx`
- **Props**: `status`, `onStart`, `onPause`, `onReset`, `onSkip`
- **Description**: Three-button row: Reset (ghost icon), Start/Pause (primary pill, morphs icon+label), Skip (ghost icon). Touch targets min 44px.

### PhaseIndicator
- **File**: `src/components/timer/PhaseIndicator.tsx`
- **Props**: `phase`, `currentCycleSessions`, `sessionsBeforeLongBreak`, `className?`
- **Description**: Animated phase label (FOCUS / SHORT BREAK / LONG BREAK) with session counter or next-phase hint. Framer Motion animations on phase transitions.

## Layout Components

### AppShell
- **File**: `src/components/layout/AppShell.tsx`
- **Description**: Root layout with sidebar (desktop) / bottom nav (mobile) + animated page transitions via Framer Motion. Uses `<Outlet>` for nested routes.

### NavBar
- **File**: `src/components/layout/NavBar.tsx`
- **Props**: None (reads route from React Router)
- **Description**: Three-item nav (Timer, Stats, Settings) with Lucide icons. Fixed bottom bar on mobile, vertical sidebar on desktop. Active item highlighted with accent color.

## Shared UI Components

### Button (ShadCN-style)
- **File**: `src/components/ui/button.tsx`
- **Variants**: `primary` (filled accent), `secondary` (ghost with border), `ghost` (no border), `danger` (red)
- **Sizes**: `sm`, `md`, `lg`, `icon`
- **Common**: Rounded-full, focus ring, disabled state, active scale transform

### Card (ShadCN-style)
- **File**: `src/components/ui/card.tsx`
- **Sub-components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- **Style**: Rounded-xl, surface background, no border (uses bg difference)

### ThemeToggle
- **File**: `src/components/ui/ThemeToggle.tsx`
- **Props**: `className?`
- **Description**: Segmented control with three options (Dark / Light / System) using Moon/Sun/Monitor icons. Active option has accent bg.

## PWA Components

### PwaUpdateBanner
- **File**: `src/components/pwa/PwaUpdateBanner.tsx`
- **Props**: None (reads timer state from TimerContext, uses `useRegisterSW` from `virtual:pwa-register/react`)
- **Description**: Handles service worker updates. Auto-updates + reloads when timer is idle (seamless). Shows a minimal pill-shaped banner ("Update available" + "Refresh" button) when the timer is running, so a focus session is never interrupted. Registered in `App.tsx` inside `TimerProvider`.

## Pages

### TimerPage
- **File**: `src/pages/TimerPage.tsx`
- **Route**: `/`
- **Description**: Main Pomodoro timer — PhaseIndicator + TimerDisplay + TimerControls vertically centered. Full viewport height on mobile.

### StatsPage
- **File**: `src/pages/StatsPage.tsx`
- **Route**: `/stats`
- **Description**: Stats dashboard — 4 stat cards (Total Sessions, Total Focus Time, Today, Streak), daily bar chart (30 days), recent sessions list. Empty state when no data.

### SettingsPage
- **File**: `src/pages/SettingsPage.tsx`
- **Route**: `/settings`
- **Description**: Grouped settings — Timer duration sliders, auto-start toggles, sound selector, theme picker. All persisted to localStorage.
