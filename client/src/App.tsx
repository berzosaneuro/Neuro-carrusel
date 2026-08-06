import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProgressProvider } from './context/ProgressContext';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import UnitPage from './pages/UnitPage';

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/unit/:unitId" element={<UnitPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <AppShell>
          <AnimatedRoutes />
        </AppShell>
      </HashRouter>
    </ProgressProvider>
  );
}

export default App;
