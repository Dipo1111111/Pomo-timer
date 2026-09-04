import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NavBar } from './NavBar'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const pageTransition = {
  duration: 0.2,
  ease: 'easeOut' as const,
}

export function AppShell() {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full min-h-full md:flex-row">
      {/* Sidebar + bottom nav */}
      <NavBar />

      {/* Main content area — pb clears mobile tab bar (56px) */}
      <main className="flex-1 flex flex-col pb-14 md:pb-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
