# Architecture — React Native Pomodoro

## Tech Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React Native + Expo SDK 52 | Fastest path to native Android. Expo Go for dev. |
| Language | TypeScript | Shared types with web app. |
| Routing | Expo Router | File-based routing, tabs, deep linking. |
| SVG | react-native-svg | Same stroke-dasharray ring as web app. |
| Fonts | expo-font | Load Inter + EB Garamond same as web. |
| Audio | expo-av | Play chime/bell on timer complete. |
| Persistence | @react-native-async-storage/async-storage | Key-value store, same pattern as localStorage. |
| Animations | React Native Animated API | Framer Motion unavailable on RN. |
| Build | EAS Build (expo build:android) | Produces signed .aab for Play Store. |

## Folder Structure
```
mobile/
  app/                        # Expo Router pages
    _layout.tsx               # Root layout: onboarding gate + tab navigator
    index.tsx                 # Timer page
    stats.tsx                 # Stats page
    settings.tsx              # Settings page
    onboarding.tsx            # First-launch flow (2-3 screens)
  components/
    timer/
      TimerDisplay.tsx        # SVG ring + digits (react-native-svg)
      TimerControls.tsx       # Start/Pause/Reset/Skip buttons
      PhaseIndicator.tsx      # Phase label + task name
    layout/
      NavBar.tsx              # Bottom tab bar
    ui/
      Button.tsx              # ShadCN-style button
      Card.tsx                # ShadCN-style card
  lib/
    types.ts                  # Shared types (copied from web)
    utils.ts                  # Formatting helpers (copied from web)
    timer-engine.ts           # Pure timer logic (copied from web)
    timer-context.tsx         # Timer state management (ported)
    settings-context.tsx      # Settings management (ported)
    storage.ts                # AsyncStorage wrapper (ported from web localStorage)
```

## Data Flow
```
App opens → check AsyncStorage for onboarding_complete
  → false → onboarding screen → mark complete → main app
  → true → main app (tab navigator)

Timer starts → tick every 1s via setInterval
  → update React state → SVG ring re-renders
  → on complete → expo-av plays sound → advance phase

Settings change → persist to AsyncStorage → re-read on mount
Session completes → push record → persist to AsyncStorage
Stats page → read all sessions from AsyncStorage → compute
```

## Boundaries
- **No backend.** Everything is local, AsyncStorage-only.
- **No authentication.** Single-user, no accounts.
- **No cloud sync.** Sessions stay on device.
- **No payments.** Free app.
- **Expo Go** for development. EAS Build for production AAB.
