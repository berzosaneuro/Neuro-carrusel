import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import type { Level, UnitStatus } from '../types';
import UnitCard from '../components/UnitCard';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">English Course</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hi, {user?.name} 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-orange-500">🔥 {user?.currentStreak ?? 0} day streak</p>
              <p className="text-xs text-slate-400">Best: {user?.bestStreak ?? 0}</p>
            </div>
            <button
              onClick={logout}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Overall progress</h2>
            <span className="text-sm text-slate-500">
              {completedUnits}/{totalUnits} units
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading your course…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading &&
          !error &&
          levels.map((level) => {
            const levelUnits = units.filter((u) => u.level === level.id);
            const levelCompleted = levelUnits.filter((u) => u.completed).length;
            return (
              <section key={level.id} className="mb-10">
                <div className="mb-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{level.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{level.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {levelCompleted}/{levelUnits.length} completed
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
