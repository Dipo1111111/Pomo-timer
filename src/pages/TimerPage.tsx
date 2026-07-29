import { useTimerContext } from '../lib/timer-context'
import { useSettings } from '../lib/settings-context'
import { TimerDisplay } from '../components/timer/TimerDisplay'
import { TimerControls } from '../components/timer/TimerControls'
import { PhaseIndicator } from '../components/timer/PhaseIndicator'

export default function TimerPage() {
  const { state, start, pause, reset, skip } = useTimerContext()
  const { settings } = useSettings()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
      {/* Phase indicator */}
      <PhaseIndicator
        phase={state.phase}
        currentCycleSessions={state.currentCycleSessions}
        sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
      />

      {/* Timer ring */}
      <TimerDisplay
        remaining={state.remaining}
        totalDuration={state.totalDuration}
        phase={state.phase}
        status={state.status}
      />

      {/* Controls */}
      <TimerControls
        status={state.status}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />
    </div>
  )
}
