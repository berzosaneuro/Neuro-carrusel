import { Router } from 'express';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';
import { LEVELS, getOrderedUnits, getUnitById } from '../data/course.js';

export const courseRouter = Router();

function getProgressMap(userId) {
  const rows = db.prepare('SELECT * FROM unit_progress WHERE user_id = ?').all(userId);
  const map = new Map();
  for (const row of rows) map.set(row.unit_id, row);
  return map;
}

// Returns ordered units annotated with locked/completed/bestScore for this user.
export function buildUnitStatuses(userId) {
  const ordered = getOrderedUnits();
  const progress = getProgressMap(userId);

  let previousCompleted = true; // first unit is always unlocked
  return ordered.map((unit) => {
    const p = progress.get(unit.id);
    const completed = !!p?.completed;
    const locked = !previousCompleted;
    previousCompleted = completed;
    return {
      id: unit.id,
      level: unit.level,
      order: unit.order,
      title: unit.title,
      subtitle: unit.subtitle,
      locked,
      completed,
      bestScore: p?.best_score ?? 0,
      totalQuestions: p?.total_questions ?? unit.quiz.length,
      attempts: p?.attempts ?? 0,
    };
  });
}

courseRouter.get('/', requireAuth, (req, res) => {
  const units = buildUnitStatuses(req.userId);
  res.json({ levels: LEVELS, units });
});

courseRouter.get('/units/:id', requireAuth, (req, res) => {
  const unit = getUnitById(req.params.id);
  if (!unit) return res.status(404).json({ error: 'Unit not found' });

  const statuses = buildUnitStatuses(req.userId);
  const status = statuses.find((s) => s.id === unit.id);
  if (status.locked) {
    return res.status(403).json({ error: 'This unit is locked. Complete the previous unit first.' });
  }

  res.json({ unit, status });
});
