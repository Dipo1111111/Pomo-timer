# UI Tokens — Pomodoro Timer PWA

## Color Strategy
Dark-first — deep neutrals with a refined accent. The palette is restrained: nearly monochromatic with one cool-indigo accent that adds precision without warmth. Light mode flips to clean off-white with the same accent.

## Theme Variables

### Dark Mode (default)
```
--background: oklch(0.13 0.005 285)         /* Near-black with cool tint */
--surface: oklch(0.18 0.008 285)           /* Card/surface background */
--surface-hover: oklch(0.22 0.01 285)      /* Hover states */
--border: oklch(0.27 0.012 285)            /* Subtle borders */
--ink: oklch(0.93 0.01 285)                /* Primary text */
--ink-muted: oklch(0.65 0.02 285)          /* Secondary/muted text */
--accent: oklch(0.62 0.19 265)             /* Refined cool indigo — primary accent */
--accent-hover: oklch(0.55 0.22 265)       /* Accent hover */
--accent-subtle: oklch(0.25 0.06 265)      /* Accent on surfaces (bg tint) */
--success: oklch(0.62 0.15 160)            /* Break/complete — cool green */
--danger: oklch(0.62 0.18 25)              /* Alert/critical — desaturated red */
```

### Light Mode
```
--background: oklch(0.97 0.002 285)         /* Clean off-white */
--surface: oklch(0.94 0.004 285)           /* Card surface */
--surface-hover: oklch(0.90 0.006 285)     /* Hover */
--border: oklch(0.86 0.008 285)            /* Borders */
--ink: oklch(0.15 0.01 285)                /* Primary text */
--ink-muted: oklch(0.45 0.02 285)          /* Muted text */
--accent: oklch(0.50 0.22 265)             /* Same hue, deeper for contrast */
--accent-hover: oklch(0.42 0.25 265)       /* Accent hover */
--accent-subtle: oklch(0.88 0.04 265)      /* Accent tint on surfaces */
--success: oklch(0.50 0.15 160)            /* Break — cool green */
--danger: oklch(0.55 0.20 25)              /* Alert — desaturated red */
```

### Phase Colors (used for timer ring + indicators)
```
--phase-focus: var(--accent)                /* Focus session accent */
--phase-short-break: var(--success)         /* Short break accent */
--phase-long-break: oklch(0.65 0.15 220)   /* Long break — serene blue */
```

## Typography

### Font Family
- **Timer digits**: `"JetBrains Mono", "SF Mono", "Fira Code", monospace`
- **UI text**: `-apple-system, BlinkMacSystemFont, "SF Pro", "Inter", sans-serif`
- **Fallbacks**: System fonts only — no Google Fonts load needed for core

### Scale
```
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 2rem (32px)
--text-4xl: 2.5rem (40px)
--text-5xl: 4rem (64px)         /* Timer display — large */
--text-6xl: 5rem (80px)         /* Timer display — hero */
```

## Spacing
```
--spacing-1: 0.25rem  (4px)
--spacing-2: 0.5rem   (8px)
--spacing-3: 0.75rem  (12px)
--spacing-4: 1rem     (16px)
--spacing-5: 1.25rem  (20px)
--spacing-6: 1.5rem   (24px)
--spacing-8: 2rem     (32px)
--spacing-10: 2.5rem  (40px)
--spacing-12: 3rem    (48px)
--spacing-16: 4rem    (64px)
--spacing-20: 5rem    (80px)
```

## Radii
```
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem   (8px)
--radius-lg: 0.75rem  (12px)
--radius-xl: 1rem     (16px)
--radius-full: 9999px (Pill)
```

## Shadows (Dark)
```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3)
--shadow-md: 0 4px 6px rgba(0,0,0,0.4)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.5)
--shadow-glow: none  /* No glow — crisp edges only */
```

## Shadows (Light)
```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.07)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
```
