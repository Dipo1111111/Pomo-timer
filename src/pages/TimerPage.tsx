import { useState } from 'react'
import { useTimerContext } from '../lib/timer-context'
import { TimerDisplay } from '../components/timer/TimerDisplay'
import { TimerControls } from '../components/timer/TimerControls'
import { PhaseIndicator } from '../components/timer/PhaseIndicator'

export default function TimerPage() {
  const { state, currentTask, setCurrentTask, start, pause, reset, skip } = useTimerContext()
  const [taskInput, setTaskInput] = useState(currentTask)

  const handleStart = () => {
    if (taskInput.trim() && !currentTask) {
      setCurrentTask(taskInput.trim())
    }
    start()
  }

  const isIdle = state.status === 'idle'

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
      {/* Task input — only show when idle or before a task is set */}
      {(!currentTask || (state.phase === 'focus' && isIdle && state.remaining > 0)) && (
        <div className="w-full max-w-xs">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && taskInput.trim()) {
                setCurrentTask(taskInput.trim())
              }
            }}
            placeholder="What are you working on?"
            className="w-full text-center text-sm bg-transparent text-ink placeholder:text-ink-muted/40 border-b border-border/40 pb-1.5 outline-none focus:border-accent transition-colors duration-200"
          />
        </div>
      )}

      {/* Phase indicator with task name */}
      <PhaseIndicator
        phase={state.phase}
        taskName={currentTask || undefined}
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
        onStart={handleStart}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />
    </div>
  )
}
