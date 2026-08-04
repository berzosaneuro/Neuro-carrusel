import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { UnitStatus } from '../types';

export default function UnitCard({ unit }: { unit: UnitStatus }) {
  const pct = unit.totalQuestions > 0 ? Math.round((unit.bestScore / unit.totalQuestions) * 100) : 0;

  const content = (
    <div
      className={`card p-4 flex flex-col gap-1.5 h-full min-h-[118px] ${
        unit.locked ? 'opacity-40' : 'card-interactive'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text-tertiary tabular-nums">Unidad {unit.order}</span>
        {unit.locked && <span className="text-text-tertiary text-[14px]">🔒</span>}
        {!unit.locked && unit.completed && <span className="text-success text-[14px]">✓</span>}
      </div>
      <h3 className="text-[15px] font-semibold leading-snug">{unit.title}</h3>
      <p className="text-[13px] text-text-secondary leading-snug">{unit.subtitle}</p>

      {unit.attempts > 0 && (
        <div className="mt-auto pt-2">
          <div className="h-1.5 w-full progress-track">
            <div className="h-full progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );

  if (unit.locked) return content;
  return (
    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -2 }}>
      <Link to={`/unit/${unit.id}`}>{content}</Link>
    </motion.div>
  );
}
