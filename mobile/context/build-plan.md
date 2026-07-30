# Build Plan — React Native Pomodoro

## Phase 1: Scaffold & Config
- [ ] Create Expo project with TypeScript template
- [ ] Install dependencies (react-native-svg, expo-font, expo-av, AsyncStorage, expo-router)
- [ ] Configure Expo Router (tabs layout, onboarding route)
- [ ] Load fonts (Inter, EB Garamond) via expo-font
- [ ] Define color constants matching Editorial theme

## Phase 2: Shared Logic
- [ ] Copy `timer-engine.ts`, `types.ts`, `utils.ts` from web app
- [ ] Write `storage.ts` — AsyncStorage wrapper (same API as web's localStorage wrapper)
- [ ] Write `settings-context.tsx` — settings state + persistence
- [ ] Write `timer-context.tsx` — timer state, tick interval, session recording

## Phase 3: UI Components — Timer
- [ ] Button component (primary/secondary/ghost/danger)
- [ ] Card component
- [ ] TimerDisplay (SVG ring + time digits via react-native-svg)
- [ ] TimerControls (Start/Pause/Reset/Skip)
- [ ] PhaseIndicator (phase label + task name)

## Phase 4: Screens
- [ ] Onboarding screen (2-3 pages, swipe/paginate)
- [ ] Timer screen (PhaseIndicator + TimerDisplay + TimerControls)
- [ ] Stats screen (stat cards + bar chart + recent sessions)
- [ ] Settings screen (duration sliders, toggles, sound selector)

## Phase 5: Navigation
- [ ] Root layout with onboarding gate
- [ ] Bottom tab navigator (Timer, Stats, Settings)
- [ ] Tab bar styling (matching web app's NavBar)

## Phase 6: Polish
- [ ] Test on Android via Expo Go
- [ ] Verify audio plays on timer complete
- [ ] Verify sessions persist and stats compute correctly
- [ ] Reduced-motion support (AccessibilityInfo)

## Phase 7: Ship
- [ ] Configure EAS Build
- [ ] Generate keystore
- [ ] Build signed .aab
- [ ] Upload to Play Console internal testing
