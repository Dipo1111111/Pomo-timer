import { View, Text, StyleSheet, type ViewStyle } from 'react-native'
import { colors, radii, spacing, fontSizes, fonts } from '@/lib/tokens'

interface CardProps {
  children?: React.ReactNode
  style?: ViewStyle
}

interface CardHeaderProps {
  children?: React.ReactNode
}

interface CardTitleProps {
  children: string
}

interface CardDescriptionProps {
  children: string
}

interface CardContentProps {
  children?: React.ReactNode
}

export function Card({ children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

export function CardHeader({ children }: CardHeaderProps) {
  return <View style={styles.header}>{children}</View>
}

export function CardTitle({ children }: CardTitleProps) {
  return <Text style={styles.title}>{children}</Text>
}

export function CardDescription({ children }: CardDescriptionProps) {
  return <Text style={styles.description}>{children}</Text>
}

export function CardContent({ children }: CardContentProps) {
  return <View style={styles.content}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[6],
    overflow: 'hidden',
  },
  header: {
    marginBottom: spacing[2],
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.ink,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.inkMuted,
    marginTop: spacing[1],
  },
  content: {
    marginTop: spacing[2],
  },
})
