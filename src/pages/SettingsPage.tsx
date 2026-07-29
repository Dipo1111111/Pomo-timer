import { useSettings } from '../lib/settings-context'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full gap-6">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>

      {/* Timer durations */}
      <Card>
        <CardHeader>
          <CardTitle>Timer Durations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <DurationSlider
            label="Focus"
            value={settings.focusDuration}
            min={5}
            max={60}
            step={5}
            onChange={(v) => updateSettings({ focusDuration: v })}
          />
          <DurationSlider
            label="Short Break"
            value={settings.shortBreakDuration}
            min={1}
            max={15}
            step={1}
            onChange={(v) => updateSettings({ shortBreakDuration: v })}
          />
          <DurationSlider
            label="Long Break"
            value={settings.longBreakDuration}
            min={5}
            max={30}
            step={5}
            onChange={(v) => updateSettings({ longBreakDuration: v })}
          />
          <DurationSlider
            label="Sessions before Long Break"
            value={settings.sessionsBeforeLongBreak}
            min={2}
            max={8}
            step={1}
            onChange={(v) => updateSettings({ sessionsBeforeLongBreak: v })}
          />
        </CardContent>
      </Card>

      {/* Auto-start */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Start</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ToggleRow
            label="Auto-start breaks"
            description="Automatically start break timer after a focus session"
            checked={settings.autoStartBreaks}
            onChange={(v) => updateSettings({ autoStartBreaks: v })}
          />
          <ToggleRow
            label="Auto-start focus"
            description="Automatically start next focus session after a break"
            checked={settings.autoStartFocus}
            onChange={(v) => updateSettings({ autoStartFocus: v })}
          />
        </CardContent>
      </Card>

      {/* Sound */}
      <Card>
        <CardHeader>
          <CardTitle>Sound</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['chime', 'bell', 'none'] as const).map((sound) => (
              <button
                key={sound}
                onClick={() => updateSettings({ sound })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                  settings.sound === sound
                    ? 'bg-accent text-white border-accent'
                    : 'bg-transparent text-ink-muted border-border hover:text-ink hover:border-ink-muted'
                }`}
              >
                {sound === 'none' ? 'Silent' : sound.charAt(0).toUpperCase() + sound.slice(1)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <ThemeOption
              id="editorial"
              label="Editorial"
              description="Warm ivory, oxblood, EB Garamond serif"
              colors={['#F5F0EB', '#6B1A2A', '#2C2C2C']}
              selected={settings.visualTheme === 'editorial'}
              onSelect={() => updateSettings({ visualTheme: 'editorial' })}
            />
            <ThemeOption
              id="frost"
              label="Frost"
              description="White, charcoal, Inter Tight, segmented ring"
              colors={['#FAFAF8', '#2D3436', '#B8C5D6']}
              selected={settings.visualTheme === 'frost'}
              onSelect={() => updateSettings({ visualTheme: 'frost' })}
            />
            <ThemeOption
              id="forge"
              label="Forge"
              description="Black, deep blue, Space Grotesk, bold blue accent"
              colors={['#0D0D0D', '#4A82C4', '#EDE8DC']}
              selected={settings.visualTheme === 'forge'}
              onSelect={() => updateSettings({ visualTheme: 'forge' })}
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

function DurationSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-ink">{label}</label>
        <span className="text-sm font-mono text-accent">{value} min</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          bg-surface-hover
          accent-accent
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-accent
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-xs text-ink-muted">
        <span>{min} min</span>
        <span>{max} min</span>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-ink">{label}</span>
        <span className="text-xs text-ink-muted">{description}</span>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-surface-hover rounded-full peer-checked:bg-accent transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-150 peer-checked:translate-x-5" />
      </div>
    </label>
  )
}

function ThemeOption({
  id,
  label,
  description,
  colors,
  selected,
  onSelect,
}: {
  id: string
  label: string
  description: string
  colors: string[]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-4 w-full p-3 rounded-xl border transition-all duration-150 text-left ${
        selected
          ? 'border-accent bg-accent/5'
          : 'border-border bg-transparent hover:border-ink-muted/30'
      }`}
    >
      {/* Palette preview */}
      <div className="flex gap-1 flex-shrink-0">
        {colors.map((color) => (
          <div
            key={color}
            className="w-8 h-8 rounded-lg border border-black/5"
            style={{ background: color }}
          />
        ))}
      </div>
      {/* Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-xs text-ink-muted truncate">{description}</span>
      </div>
      {/* Selected dot */}
      {selected && (
        <div className="ml-auto w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0" />
      )}
    </button>
  )
}
