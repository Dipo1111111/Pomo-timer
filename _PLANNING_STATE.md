# Planning State — React Native Pomodoro (Mobile)

## Status
Scoping architecture context files for the mobile app. No code written yet.

## Decisions Made
- **Stack**: React Native + Expo + Expo Router + react-native-svg + expo-font + expo-av + AsyncStorage
- **Location**: `mobile/` subfolder in existing repo (alongside the web app)
- **Auth**: None. Skip entirely.
- **Onboarding**: 2-3 screen first-launch flow. Persists completion flag in AsyncStorage.
- **Design**: Pixel-perfect match of current web app's Editorial theme. Same colors, fonts, spacing, layout.
- **Shared code**: `timer-engine.ts`, `types.ts`, `utils.ts` copied verbatim (pure TS, zero React deps)
- **Navigation**: Expo Router with bottom tabs (Timer, Stats, Settings) + onboarding route
- **Animations**: React Native Animated API (no framer-motion in RN)
- **Audio**: expo-av for sound on timer complete
- **Persistence**: AsyncStorage (same key structure as localStorage in web app)
- **Precaching**: No offline SW needed — React Native is always "offline" capable
- **Build target**: Android .aab for Play Store internal/closed testing
- **No payments**, no backend, no cloud sync

## What's Been Confirmed With User
- Same repo, `mobile/` subfolder ✓
- Expo Go for development ✓
- Same visual design down to the pixel ✓
- Onboarding on first launch, then straight into app ✓
- No sign-in ✓
- Ship as .aab for internal testing ✓

## Next Step
Build context files in `mobile/context/` then produce implementation plan.
