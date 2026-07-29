import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './lib/settings-context'
import { TimerProvider } from './lib/timer-context'
import { AppShell } from './components/layout/AppShell'
import { LoadingScreen } from './components/layout/LoadingScreen'
import TimerPage from './pages/TimerPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import ComparePage from './pages/ComparePage'
import EditorialDesign from './pages/compare/editorial'
import FrostDesign from './pages/compare/frost'
import ForgeDesign from './pages/compare/forge'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return <LoadingScreen onDone={() => setLoaded(true)} />
  }

  return (
    <BrowserRouter>
      <SettingsProvider>
        <TimerProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<TimerPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            {/* Theme explorer — standalone, no AppShell */}
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/compare/editorial" element={<EditorialDesign />} />
            <Route path="/compare/frost" element={<FrostDesign />} />
            <Route path="/compare/forge" element={<ForgeDesign />} />
          </Routes>
        </TimerProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
