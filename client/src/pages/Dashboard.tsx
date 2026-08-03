import { useEffect, useState } from 'react';
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
    <div className="min-h-full pb-10">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-4 bg-void-2/80 backdrop-blur border-b border-neon-cyan/15">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] tracking-[0.3em] text-neon-cyan-glow">ENGLISH OS</p>
            <p className="text-sm text-ink-dim">A2 → C1</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-neon-yellow" style={{ textShadow: '0 0 10px rgba(244,255,91,0.6)' }}>
              🔥 {user?.currentStreak ?? 0}
            </p>
            <p className="text-[10px] text-ink-dim">best {user?.bestStreak ?? 0}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-dim">Overall progress</p>
            <span className="text-xs text-neon-cyan-glow font-semibold">
              {completedUnits}/{totalUnits}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-black/50 overflow-hidden border border-neon-cyan/20">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta transition-all"
              style={{ width: `${overallPct}%`, boxShadow: '0 0 10px rgba(0,240,255,0.6)' }}
            />
          </div>
        </div>
      </header>

      <main className="px-5 pt-6">
        {loading && <p className="text-ink-dim font-display tracking-widest text-sm">LOADING COURSE…</p>}
        {error && <p className="text-neon-magenta-glow">{error}</p>}

        {!loading &&
          !error &&
          levels.map((level) => {
            const levelUnits = units.filter((u) => u.level === level.id);
            const levelCompleted = levelUnits.filter((u) => u.completed).length;
            return (
              <section key={level.id} className="mb-9">
                <div className="mb-3">
                  <h2 className="font-display text-lg font-bold text-white">{level.title}</h2>
                  <p className="text-sm text-ink-dim">{level.description}</p>
                  <p className="text-xs text-neon-cyan-glow mt-1">
                    {levelCompleted}/{levelUnits.length} completed
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {levelUnits.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} />
                  ))}
                </div>
              </section>
            );
          })}
      </main>
    </div>
  );
}
