import { Button } from '../ui/button'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import type { TimerStatus } from '../../lib/types'

interface TimerControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const isRunning = status === 'running'
  const isIdle = status === 'idle'

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Reset */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        aria-label="Reset timer"
        className="rounded-full"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      {/* Start / Pause */}
      <Button
        variant="primary"
        size="lg"
        onClick={isRunning ? onPause : onStart}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        className="min-w-[140px] rounded-full"
      >
        {isRunning ? (
          <>
            <Pause className="h-5 w-5 fill-current" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5 fill-current" />
            <span>{isIdle ? 'Start' : 'Resume'}</span>
          </>
        )}
      </Button>

      {/* Skip */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkip}
        aria-label="Skip to next phase"
        className="rounded-full"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  )
}
