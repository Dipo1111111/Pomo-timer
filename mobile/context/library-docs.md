# Library Usage — React Native Pomodoro

## expo-router
- File-based routing in `mobile/app/`
- `_layout.tsx` defines navigation structure (tabs, stacks)
- `useRouter()` for programmatic navigation
- `<Link>` component for inline navigation
- Onboarding gate in root layout: check AsyncStorage, redirect to `/onboarding` or `/(tabs)`

## react-native-svg
- Used for timer ring: `<Svg>`, `<Circle>`, `<Text>` components
- Same stroke-dasharray/dashoffset math as web app
- Phase colors applied via stroke prop (dynamic)
- Font family for "25" text: "EB Garamond" via loaded font

## expo-font
- Load fonts at app startup before render
- Required: Inter (400, 500, 600, 700), EB Garamond (400, 700)
- Use `useFonts` hook with `SplashScreen.preventAutoHideAsync()`

## expo-av
- `Audio.Sound.createAsync()` for chime/bell sounds
- Generate tones programmatically (like web) or bundle tiny audio files
- Configure audio mode for playback even in background (if possible)

## @react-native-async-storage/async-storage
- Same key structure as web app
- `pomodoro:settings`, `pomodoro:timerState`, `pomodoro:sessions`
- Version key: `pomodoro:dataVersion`
- Safe JSON parse/stringify wrapper in `storage.ts`

## React Native Animated API
- Use `Animated.Value` + `Animated.timing` for transitions
- Phase color transitions on ring (300ms)
- Page transitions (slide up/fade)
- Respect `AccessibilityInfo.isReduceMotionEnabled()`
