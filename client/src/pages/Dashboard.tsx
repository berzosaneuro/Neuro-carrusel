import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import type { Level, UnitStatus } from '../types';
import UnitCard from '../components/UnitCard';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [units, setUnits] = useState<UnitStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .getCourse(token)
      .then(({ levels, units }) => {
        setLevels(levels);
        setUnits(units);
      })
      .catch(() => setError('No se pudo cargar el curso. Inténtalo de nuevo.'))
      .finally(() => setLoading(false));
  }, [token]);

  const totalUnits = units.length;
  const completedUnits = units.filter((u) => u.completed).length;
  const overallPct = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="min-h-dvh pb-12">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-5 bg-bg/85 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[19px] font-bold tracking-tight">Inglés</h1>
            <p className="text-[14px] text-text-tertiary">A2 → C1</p>
          </div>
          {user && (user.currentStreak > 0 || user.bestStreak > 0) && (
            <motion.div
              className="text-right"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <p className="text-[17px] font-bold tabular-nums">
                <span className="streak-flame">🔥</span> {user.currentStreak}
              </p>
              <p className="text-[12px] text-text-tertiary">mejor: {user.bestStreak}</p>
            </motion.div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[13px] font-medium text-text-secondary">Progreso</p>
            <span className="text-[13px] font-medium text-text-secondary tabular-nums">
              {completedUnits}/{totalUnits}
            </span>
          </div>
          <div className="h-2 w-full progress-track">
            <motion.div
              className="h-full progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>
        </div>
      </header>

      <main className="px-5 pt-6">
        {loading && (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        )}
        {error && <p className="text-danger text-sm">{error}</p>}

        {!loading &&
          !error &&
          levels.map((level, levelIndex) => {
            const levelUnits = units.filter((u) => u.level === level.id);
            const levelCompleted = levelUnits.filter((u) => u.completed).length;
            return (
              <motion.section
                key={level.id}
                className="mb-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.06, type: 'spring', stiffness: 200, damping: 22 }}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <div>
                    <h2 className="text-[17px] font-bold">{level.title}</h2>
                    <p className="text-[14px] text-text-secondary mt-0.5">{level.description}</p>
                  </div>
                  <span className="text-[13px] text-text-tertiary tabular-nums shrink-0 ml-3">
                    {levelCompleted}/{levelUnits.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {levelUnits.map((unit, unitIndex) => (
                    <motion.div
                      key={unit.id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: levelIndex * 0.06 + unitIndex * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 22,
                      }}
                    >
                      <UnitCard unit={unit} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
      </main>
    </div>
  );
}
