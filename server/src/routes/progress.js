import { Router } from 'express';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';
import { getUnitById } from '../data/course.js';
import { buildUnitStatuses } from './course.js';

export const progressRouter = Router();

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function updateStreak(user) {
  const today = todayISO();
  if (user.last_active_date === today) {
    return { current: user.current_streak, best: user.best_streak };
  }

  let current;
  if (user.last_active_date && daysBetween(user.last_active_date, today) === 1) {
    current = user.current_streak + 1;
  } else {
    current = 1;
  }
  const best = Math.max(user.best_streak, current);

  db.prepare(
    'UPDATE users SET last_active_date = ?, current_streak = ?, best_streak = ? WHERE id = ?'
  ).run(today, current, best, user.id);

  return { current, best };
}

progressRouter.post('/complete', requireAuth, (req, res) => {
  const { unitId, score, totalQuestions } = req.body || {};
  const unit = getUnitById(unitId);
  if (!unit) return res.status(404).json({ error: 'Unit not found' });

  const statuses = buildUnitStatuses(req.userId);
  const status = statuses.find((s) => s.id === unitId);
  if (status.locked) {
    return res.status(403).json({ error: 'This unit is locked' });
  }

  const numericScore = Number(score);
  const numericTotal = Number(totalQuestions);
  if (
    !Number.isFinite(numericScore) ||
    !Number.isFinite(numericTotal) ||
    numericTotal !== unit.quiz.length ||
    numericScore < 0 ||
    numericScore > numericTotal
  ) {
    return res.status(400).json({ error: 'Invalid score payload' });
  }

  const passed = numericScore / numericTotal >= 0.6;

  const existing = db
    .prepare('SELECT * FROM unit_progress WHERE user_id = ? AND unit_id = ?')
    .get(req.userId, unitId);

  const bestScore = Math.max(existing?.best_score ?? 0, numericScore);
  const attempts = (existing?.attempts ?? 0) + 1;
  const completed = (existing?.completed ?? 0) || (passed ? 1 : 0);

  db.prepare(
    `INSERT INTO unit_progress (user_id, unit_id, completed, best_score, total_questions, attempts, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, unit_id) DO UPDATE SET
       completed = excluded.completed,
       best_score = excluded.best_score,
       total_questions = excluded.total_questions,
       attempts = excluded.attempts,
       updated_at = datetime('now')`
  ).run(req.userId, unitId, completed, bestScore, numericTotal, attempts);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  const streak = passed ? updateStreak(user) : { current: user.current_streak, best: user.best_streak };

  const updatedStatuses = buildUnitStatuses(req.userId);

  res.json({
    passed,
    bestScore,
    attempts,
    streak,
    units: updatedStatuses,
  });
});
