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
      .catch(() => setError('Could not load your course. Please try again.'))
      .finally(() => setLoading(false));
  }, [token]);

  const totalUnits = units.length;
  const completedUnits = units.filter((u) => u.completed).length;
  const overallPct = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="min-h-dvh pb-12">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-5 bg-bg/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">English</h1>
            <p className="text-[13px] text-text-tertiary">A2 → C1</p>
          </div>
          {user && (user.currentStreak > 0 || user.bestStreak > 0) && (
            <div className="text-right">
              <p className="text-[15px] font-semibold tabular-nums">🔥 {user.currentStreak}</p>
              <p className="text-[11px] text-text-tertiary">best {user.bestStreak}</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[12px] font-medium text-text-secondary">Progress</p>
            <span className="text-[12px] font-medium text-text-secondary tabular-nums">
              {completedUnits}/{totalUnits}
            </span>
          </div>
          <div className="h-1.5 w-full progress-track">
            <motion.div
              className="h-full progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.05, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <div>
                    <h2 className="text-[15px] font-semibold">{level.title}</h2>
                    <p className="text-[13px] text-text-secondary mt-0.5">{level.description}</p>
                  </div>
                  <span className="text-[12px] text-text-tertiary tabular-nums shrink-0 ml-3">
                    {levelCompleted}/{levelUnits.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {levelUnits.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} />
                  ))}
                </div>
              </motion.section>
            );
          })}
      </main>
    </div>
  );
}
