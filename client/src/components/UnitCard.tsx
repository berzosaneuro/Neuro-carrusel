import { Link } from 'react-router-dom';
import type { UnitStatus } from '../types';

export default function UnitCard({ unit }: { unit: UnitStatus }) {
  const pct = unit.totalQuestions > 0 ? Math.round((unit.bestScore / unit.totalQuestions) * 100) : 0;

  const base = 'rounded-2xl p-4 flex flex-col gap-2 h-full transition';
  const stateClasses = unit.locked
    ? 'border border-ink-dim/20 bg-void-2/40 opacity-50 cursor-not-allowed'
    : unit.completed
      ? 'tile-3d border-neon-green/40 shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_14px_rgba(57,255,157,0.25)]'
      : 'tile-3d';

  const content = (
    <div className={`${base} ${stateClasses}`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
          Unit {unit.order}
        </span>
        {unit.locked && <span aria-label="locked">🔒</span>}
        {!unit.locked && unit.completed && <span aria-label="completed" className="text-neon-green-glow">✔</span>}
      </div>
      <h3 className="font-semibold text-white leading-snug">{unit.title}</h3>
      <p className="text-sm text-ink-dim">{unit.subtitle}</p>

      {unit.attempts > 0 && (
        <div className="mt-auto pt-2">
          <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-green transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-ink-dim mt-1">
            Best: {unit.bestScore}/{unit.totalQuestions}
          </p>
        </div>
      )}
    </div>
  );

  if (unit.locked) return content;
  return (
    <Link to={`/unit/${unit.id}`} className="active:scale-[0.97] transition-transform">
      {content}
    </Link>
  );
}
