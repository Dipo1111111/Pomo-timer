export type VisualThemeId = 'editorial' | 'frost' | 'forge'

export interface RingConfig {
  /** Stroke width of the main progress ring */
  progressWidth: number
  /** Whether to render a segmented ring (Frost) vs continuous */
  segmented?: boolean
  /** Number of segments (for segmented rings) */
  segmentCount?: number
  /** How many segments are filled */
  segmentsFilled?: number
  /** Show tick marks at cardinal points (Editorial) */
  tickMarks?: boolean
  /** Show an inner multiplier/accent ring (Forge) */
  innerRing?: boolean
  /** Opacity of the inner ring */
  innerRingOpacity?: number
  /** Show a multiplier badge (Forge) */
  multiplierBadge?: boolean
  /** Show session count as Roman numerals in the ring area */
  romanNumerals?: boolean
}

export interface VisualTheme {
  id: VisualThemeId
  name: string
  description: string
  ring: RingConfig
  /** Font family for the timer digits (applied via CSS var --font-display) */
  displayFontLabel: string
  /** Body font label (for the info card) */
  bodyFontLabel: string
}

export const VISUAL_THEMES: Record<VisualThemeId, VisualTheme> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Warm ivory and oxblood. EB Garamond serif display, classic tick marks. Refined, substantial.',
    displayFontLabel: 'EB Garamond',
    bodyFontLabel: 'Inter',
    ring: {
      progressWidth: 2.5,
      tickMarks: true,
      romanNumerals: false,
    },
  },
  frost: {
    id: 'frost',
    name: 'Frost',
    description: 'Scandinavian light. Segmented ring with 12 discrete arcs. Inter Tight, airy and precise.',
    displayFontLabel: 'Inter Tight',
    bodyFontLabel: 'Inter Tight',
    ring: {
      progressWidth: 1.5,
      segmented: true,
      segmentCount: 12,
      segmentsFilled: 8,
    },
  },
  forge: {
    id: 'forge',
    name: 'Forge',
    description: 'Black and deep blue. Space Grotesk display, Inter Tight body. Clean, dark, architectural — bold blue accent.',
    displayFontLabel: 'Space Grotesk',
    bodyFontLabel: 'Inter Tight',
    ring: {
      progressWidth: 4,
    },
  },
}

export function getVisualTheme(id: string): VisualTheme {
  return VISUAL_THEMES[id as VisualThemeId] ?? VISUAL_THEMES.editorial
}
