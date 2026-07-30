import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native'
import { colors, radii, spacing, fontSizes, fonts } from '@/lib/tokens'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps {
  title?: string
  onPress: () => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  children?: React.ReactNode
  style?: ViewStyle
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {children}
      {title && (
        <Text style={[
          styles.text,
          variantTextStyles[variant],
          sizeTextStyles[size],
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    gap: spacing[2],
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily: fonts.sans,
    fontWeight: '600',
  },
})

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: colors.accent,
    minHeight: 48,
    paddingHorizontal: spacing[6],
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
    paddingHorizontal: spacing[5],
  },
  ghost: {
    backgroundColor: 'transparent',
    minHeight: 48,
    paddingHorizontal: spacing[4],
  },
  danger: {
    backgroundColor: colors.danger,
    minHeight: 48,
    paddingHorizontal: spacing[6],
  },
}

const variantTextStyles: Record<Variant, { color: string }> = {
  primary: { color: colors.white },
  secondary: { color: colors.inkMuted },
  ghost: { color: colors.inkMuted },
  danger: { color: colors.white },
}

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { minHeight: 36, paddingHorizontal: spacing[3] },
  md: { minHeight: 48, paddingHorizontal: spacing[6] },
  lg: { minHeight: 56, paddingHorizontal: spacing[8] },
  icon: { minHeight: 48, minWidth: 48, paddingHorizontal: 0 },
}

const sizeTextStyles: Record<Size, { fontSize: number }> = {
  sm: { fontSize: fontSizes.sm },
  md: { fontSize: fontSizes.base },
  lg: { fontSize: fontSizes.lg },
  icon: { fontSize: fontSizes.base },
}
