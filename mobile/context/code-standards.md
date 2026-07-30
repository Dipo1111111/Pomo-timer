# Code Standards — React Native Pomodoro

## TypeScript
- Strict mode enabled. No `any`.
- Same types as web app (`TimerPhase`, `TimerState`, `SessionRecord`, `AppSettings`).
- Shared pure modules copied from `src/lib/` — keep in sync manually.

## Naming
- Files: `kebab-case.tsx` for components, `kebab-case.ts` for libs
- Components: PascalCase (`TimerDisplay`, `TimerControls`)
- Functions: camelCase (`startTimer`, `formatTime`)
- Types: PascalCase (`TimerState`, `SessionRecord`)
- Constants: UPPER_SNAKE_CASE for config, camelCase for module-level

## Component Conventions
- Each component file exports one component as named export
- Props interface defined above component (not in separate file unless shared)
- Components are functional — no class components
- Style objects defined at module level (not inline) using `StyleSheet.create()`

## State Management
- React Context for global state (timer, settings)
- `useState` + `useCallback` for component-local state
- No external state libraries

## Persistence
- AsyncStorage keys prefixed with `pomodoro:` (same as web app's localStorage keys)
- Version key for data migration (`SESSION_DATA_VERSION`)
- Safe JSON parse with try-catch

## CSS / Styling
- No inline styles. Use `StyleSheet.create()`.
- Tokens defined in `lib/tokens.ts` (colors, spacing, typography)
- Platform-specific styles only when necessary (StatusBar height, etc.)

## Accessibility
- `accessibilityLabel` on all interactive elements
- `prefers-reduced-motion` via `AccessibilityInfo`
- Minimum touch target 44×44dp
