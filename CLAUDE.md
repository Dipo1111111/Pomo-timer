# CLAUDE.md — Pomodoro Timer PWA

## Read Order
At the start of every session, read these files in order:
1. `context/project-overview.md` — What we're building and why
2. `context/architecture.md` — Stack, structure, data flow, boundaries
3. `context/build-plan.md` — What to build and in what order
4. `context/code-standards.md` — How to write code
5. `context/library-docs.md` — How to use each library
6. `context/ui-tokens.md` — Design tokens (colors, typography, spacing)
7. `context/ui-rules.md` — Visual identity and layout rules
8. `context/ui-registry.md` — Built components reference
9. `context/progress-tracker.md` — Current progress and next steps

## Core Rules
- **No backend.** Everything is client-side, localStorage-only.
- **No authentication.** Single-user personal tool.
- **Dark-first, light-optional.** Dark mode is the default experience.
- **No glow.** No blur, no frosted glass, no neon effects. Clean and crisp.
- **Timer is the hero.** No UI element competes with the timer display.
- **WCAG AA contrast.** Minimum 4.5:1 for body text.

## Skills to Use
- `/architect` — Before any complex feature to align on approach
- `/remember` — At end of every session without fail
- `/review` — After completing a feature, before moving to next
- `/impeccable craft` — For designing and building UI components (includes visual guidance)

## Memory System
Persistent memory at `C:\Users\USER\.claude\projects\C--Users-USER-Documents-Pomodoro-app\memory\`
- Write memories for user preferences, design decisions, and project state
- Keep MEMORY.md index updated

## Context Files
All context files live in `context/`. Update them as the project evolves:
- `progress-tracker.md` — Check off completed items after each feature
- `ui-registry.md` — Register new components as they're built
- `architecture.md` — Update if stack or structure changes
