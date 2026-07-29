# Library Docs — Pomodoro Timer PWA

## Tailwind CSS v4
- Import with `@import "tailwindcss"` in CSS (no `tailwind.config.js`)
- Dark mode uses `@media (prefers-color-scheme: dark)` by default
- Configure with `@theme` directive in CSS for custom tokens
- Use `dark:` variant for dark mode overrides
- Reference: https://tailwindcss.com/docs/v4-beta

## ShadCN UI (Tailwind v4 adapted)
- We are NOT using the `npx shadcn` CLI — we install components manually
- Style pattern: ShadCN-style `cn()` helper + class-variance-authority
- Components: Button, Card, Switch, Tabs, Dialog, Slider, Progress
- All components use `cn()` from `@/lib/utils.ts` for className merging
- Theme variables go in `@theme` in `index.css`

## vite-plugin-pwa
- Configure in `vite.config.ts` under `VitePWA` object
- Generate service worker with `workbox` for offline caching
- Register in `main.tsx` with the `registerSW` helper
- Include `apple-touch-icon` links and `mask-icon` for iOS
- Set `display: "standalone"` and `start_url: "/"` in manifest
- iOS specific: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`

## React Router v7
- Simple SPA routing with `createBrowserRouter` or `<BrowserRouter>`
- Three routes: `/` (Timer), `/stats` (Stats), `/settings` (Settings)
- Use `<NavLink>` for navigation with active styling
- Animated transitions with Framer Motion's `<AnimatePresence>`

## Framer Motion
- `motion.div` for animated components
- `AnimatePresence` for exit animations (page transitions)
- `layoutId` for shared layout animations
- Variants for reusable animation definitions
- `transition={{ type: "spring", stiffness: 300, damping: 30 }}` for premium feel
- Always check `prefers-reduced-motion` with `useReducedMotion()`
