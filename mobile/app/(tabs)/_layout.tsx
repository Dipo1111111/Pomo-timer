import { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, fonts, fontSizes } from '@/lib/tokens'
import { isOnboardingComplete } from '@/lib/storage'

/* ─── Tab icon map ─── */
const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  index: { focused: 'timer', default: 'timer-outline' },
  stats: { focused: 'bar-chart', default: 'bar-chart-outline' },
  settings: { focused: 'settings', default: 'settings-outline' },
}

const TAB_LABELS: Record<string, string> = {
  index: 'Timer',
  stats: 'Stats',
  settings: 'Settings',
}

/* ─── Animated Tab Item ─── */

function TabItem({
  routeName,
  isFocused,
  onPress,
}: {
  routeName: string
  isFocused: boolean
  onPress: () => void
}) {
  const colorAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [isFocused, colorAnim])

  const iconName = isFocused ? TAB_ICONS[routeName]?.focused : TAB_ICONS[routeName]?.default
  const label = TAB_LABELS[routeName] ?? routeName

  const tintColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.inkMuted, colors.accent],
  })

  const IconComponent = Ionicons

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={tabBarStyles.tab}
    >
      <Animated.View style={[tabBarStyles.tabInner, { opacity: colorAnim }]}>
        <IconComponent name={iconName as any} size={24} color={colors.accent} />
        <Text style={[tabBarStyles.tabLabel, { color: colors.accent }]}>{label}</Text>
      </Animated.View>
      {/* Inactive state rendered alongside for the cross-fade effect */}
      <Animated.View
        style={[
          tabBarStyles.tabInner,
          tabBarStyles.tabOverlay,
          { opacity: Animated.subtract(1, colorAnim) },
        ]}
        pointerEvents="none"
      >
        <IconComponent name={(TAB_ICONS[routeName]?.default) as any} size={24} color={colors.inkMuted} />
        <Text style={[tabBarStyles.tabLabel, { color: colors.inkMuted }]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

/* ─── Custom Tab Bar ─── */

function AnimatedTabBar({ state, descriptors, navigation }: any) {
  const indicatorAnim = useRef(new Animated.Value(state.index)).current

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: state.index,
      useNativeDriver: false,
      friction: 8,
      tension: 100,
    }).start()
  }, [state.index, indicatorAnim])

  const tabCount = state.routes.length
  const indicatorLeft = indicatorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0%', `${100 / tabCount}%`, `${(200 / tabCount)}%`],
    extrapolate: 'clamp',
  })

  return (
    <View style={tabBarStyles.container}>
      {/* Sliding indicator */}
      <Animated.View
        style={[
          tabBarStyles.indicator,
          {
            width: `${100 / tabCount}%`,
            left: indicatorLeft,
          },
        ]}
      />
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TabItem
            key={route.key}
            routeName={route.name}
            isFocused={isFocused}
            onPress={onPress}
          />
        )
      })}
    </View>
  )
}

const tabBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 56,
    paddingBottom: 4,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    position: 'relative',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  tabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '500',
  },
})

/* ─── Layout ─── */

export default function TabsLayout() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    isOnboardingComplete().then(done => {
      if (!done) {
        router.replace('/onboarding')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) return null

  return (
    <Tabs
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  )
}
