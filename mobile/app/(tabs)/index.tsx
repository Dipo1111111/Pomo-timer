import { useRef, useEffect, useState } from 'react'
import { View, TextInput, StyleSheet, SafeAreaView, Animated } from 'react-native'
import { useTimerContext } from '@/lib/timer-context'
import { PhaseIndicator } from '@/components/timer/PhaseIndicator'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { colors, fonts, fontSizes, spacing } from '@/lib/tokens'

export default function TimerPage() {
  const { state, currentTask, setCurrentTask, start, pause, reset, skip } = useTimerContext()

  const isIdle = state.status === 'idle'

  // Show task input when no task is set and timer is idle
  const showTaskInput = !currentTask || (state.phase === 'focus' && isIdle && state.remaining > 0)

  // Animated entrance/exit for the task input
  const [taskInputVisible, setTaskInputVisible] = useState(showTaskInput)
  const taskInputAnim = useRef(new Animated.Value(showTaskInput ? 1 : 0)).current

  useEffect(() => {
    if (showTaskInput) {
      setTaskInputVisible(true)
    }
    Animated.timing(taskInputAnim, {
      toValue: showTaskInput ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !showTaskInput) setTaskInputVisible(false)
    })
  }, [showTaskInput, taskInputAnim])

  const handleStart = () => {
    start()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated task input wrapper */}
        {taskInputVisible && (
          <Animated.View
            style={{
              width: '100%',
              maxWidth: 280,
              opacity: taskInputAnim,
              transform: [
                {
                  translateY: taskInputAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                  }),
                },
              ],
            }}
            pointerEvents={showTaskInput ? 'auto' : 'none'}
          >
            <TextInput
              style={styles.taskInput}
              placeholder="What are you working on?"
              placeholderTextColor={colors.inkMuted}
              value={currentTask}
              onChangeText={setCurrentTask}
              returnKeyType="done"
              onSubmitEditing={handleStart}
            />
          </Animated.View>
        )}

        {/* Phase indicator with task name */}
        <PhaseIndicator phase={state.phase} taskName={currentTask || undefined} />

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
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[6],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  taskInput: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.ink,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    outlineStyle: 'none',
    minHeight: 36,
  },
})
