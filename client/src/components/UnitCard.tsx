import { Link } from 'react-router-dom';
import type { UnitStatus } from '../types';

export default function UnitCard({ unit }: { unit: UnitStatus }) {
  const pct = unit.totalQuestions > 0 ? Math.round((unit.bestScore / unit.totalQuestions) * 100) : 0;

  const base =
    'rounded-xl border p-4 flex flex-col gap-2 transition h-full';
  const stateClasses = unit.locked
    ? 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 opacity-60 cursor-not-allowed'
    : unit.completed
      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:shadow-md'
      : 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 hover:shadow-md';

  const content = (
    <div className={`${base} ${stateClasses}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Unit {unit.order}
        </span>
        {unit.locked && <span aria-label="locked">🔒</span>}
        {!unit.locked && unit.completed && <span aria-label="completed">✅</span>}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white leading-snug">{unit.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{unit.subtitle}</p>

      {unit.attempts > 0 && (
        <div className="mt-auto pt-2">
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Best: {unit.bestScore}/{unit.totalQuestions}
          </p>
        </div>
      )}
    </div>
  );

  if (unit.locked) return content;
  return <Link to={`/unit/${unit.id}`}>{content}</Link>;
}
