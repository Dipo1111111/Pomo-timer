import { StyleSheet } from 'react-native'

// ─── Editorial Theme Colors ───
export const colors = {
  bg: '#F2EDE4',
  surface: '#EBE4D8',
  surfaceHover: '#E3DACC',
  border: '#D9CFC0',
  ink: '#3D3935',
  inkMuted: '#6B6560',
  accent: '#632228',
  accentHover: '#4D1A1F',
  accentSubtle: '#E8D8D4',
  phaseFocus: '#632228',
  phaseShortBreak: '#5A7D5A',
  phaseLongBreak: '#5A7A8A',
  success: '#5A7D5A',
  danger: '#632228',
  white: '#FFFFFF',
} as const

// ─── Typography ───
export const fonts = {
  sans: 'Inter',
  display: 'EBGaramond',
} as const

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  hero: 64,
} as const

// ─── Spacing ───
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const

// ─── Radii ───
export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const

// ─── Common Styles ───
export const commonStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
})
