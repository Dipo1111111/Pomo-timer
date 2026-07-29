# Product

## Register

product

## Users

Solo user (the developer) working at a desk or on a phone in low-distraction environments. The primary context is focused work sessions where the timer runs in the foreground or sits in a browser tab. On mobile, the PWA lives on the home screen for quick access.

## Product Purpose

A beautiful, intuitive Pomodoro timer that helps the user maintain focus and track their work patterns. It provides the classic Pomodoro cycle (focus → short break → long break) with session history and stats so the user understands their productivity over time. Success means the user keeps coming back to it daily — it's their go-to focus tool.

## Brand Personality

Minimalist luxury. Clean, bold, refined. Apple-like in its restraint — every element has a reason to exist. The interface is confident (big typography, crisp spacing) but never loud. It feels premium, not playful.

Three words: **refined, confident, calm**

## Anti-references

- No glow / bloom / neon effects — keep edges clean and crisp
- No flat generic SaaS dashboard look (gray cards, blue gradients, side-stripe borders)
- No playful or gamified aesthetics (no badges, confetti, cartoon icons)
- No glassmorphism or frosted glass decorative effects

## Design Principles

1. **Focus on the focus tool** — the timer is the star. Everything else (stats, settings) is secondary and accessed without breaking the timer experience.
2. **Crisp, not soft** — sharp edges, clean typography, precise spacing. No blur, no glow, no frosted glass.
3. **Dark-first, light-optional** — dark mode is the default experience. Light mode is a secondary option. Both must look equally intentional.
4. **Motion with purpose** — animations exist to orient and delight (mode transitions, session completion), not for decoration. Respect reduced motion preferences.
5. **Offline-first** — as a PWA, the core timer must work without network. Stats and settings are stored locally.

## Accessibility & Inclusion

- WCAG AA contrast minimum (4.5:1 body, 3:1 large text)
- Support `prefers-reduced-motion`
- Timer must be operable via keyboard
- Color is not the only indicator of mode (focus vs break)
- Touch targets at least 44px on mobile
