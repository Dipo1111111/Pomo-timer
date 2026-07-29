# Code Standards — Pomodoro Timer PWA

## TypeScript
- Strict mode enabled in tsconfig
- Prefer `type` over `interface` for object types
- Prefer `const` assertions over enums
- Use `Date.now()` for timestamps (milliseconds)
- All durations stored as seconds internally
- All time displays formatted at render time

## Naming
- **Components**: PascalCase (`TimerDisplay.tsx`)
- **Hooks**: camelCase with `use` prefix (`useTimer.ts`)
- **Utilities**: camelCase (`formatTime.ts`)
- **Types**: PascalCase (`TimerState`, `SessionRecord`)
- **CSS classes**: Tailwind utility classes only. No custom CSS unless unavoidable.
- **Files**: Match the export name. One component per file.

## Component Conventions
- Components are functional with hooks
- Props typed inline or via exported type
- Default export for pages, named export for components
- Use React.memo only when proven necessary (profiled)
- All components handle their loading/empty/error states

## State Management
- React Context for global state (timer, settings)
- State is normalized — one source of truth
- Side effects (notifications, localStorage) in hooks, not in components
- Timer tick logic is a pure function in `timer-engine.ts`
- localStorage writes are debounced/throttled where appropriate

## CSS / Styling
- Tailwind utility classes for all styling
- CSS variables in `index.css` for design tokens (colors, spacing, radii)
- No inline styles except for dynamic values (SVG stroke-dashoffset)
- Dark mode via Tailwind's `dark:` variant
- Use ShadCN's `cn()` utility for conditional classes
- Responsive via Tailwind breakpoints (sm/md/lg/xl)

## Motion
- Framer Motion for animated page transitions and mode switches
- CSS transitions for hover/active states
- All animations wrapped with `@media (prefers-reduced-motion: reduce)` fallback
- Duration: 300ms for most transitions, 500ms for emphasis transitions

## Error Handling
- localStorage reads wrapped in try/catch (can throw if quota exceeded or corrupted)
- Audio playback wrapped in try/catch (iOS can block without user interaction)
- Timer never throws — graceful degradation on all edge cases
