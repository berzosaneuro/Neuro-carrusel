import { LEVELS, getOrderedUnits, getUnitById } from '../data/course';
import type { Profile, UnitStatus } from '../types';

const STORAGE_KEY = 'english_app_state_v1';

interface UnitRecord {
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
}

interface AppState {
  lastActiveDate: string | null;
  currentStreak: number;
  bestStreak: number;
  units: Record<string, UnitRecord>;
}

const EMPTY_STATE: AppState = {
  lastActiveDate: null,
  currentStreak: 0,
  bestStreak: 0,
  units: {},
};

function read(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE };
    return { ...EMPTY_STATE, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    // Corrupt or unavailable storage: start clean rather than crashing the app.
    return { ...EMPTY_STATE };
  }
}

function write(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or quota exceeded: progress stays in memory for this session.
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / msPerDay);
}

function bumpStreak(state: AppState) {
  const today = todayISO();
  if (state.lastActiveDate === today) return;

  state.currentStreak =
    state.lastActiveDate && daysBetween(state.lastActiveDate, today) === 1 ? state.currentStreak + 1 : 1;
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
  state.lastActiveDate = today;
}

export { LEVELS, getUnitById };

export function getProfile(): Profile {
  const state = read();
  return { currentStreak: state.currentStreak, bestStreak: state.bestStreak };
}

// Units unlock in order: a unit is playable once the previous one is completed.
export function getUnitStatuses(): UnitStatus[] {
  const state = read();
  let previousCompleted = true; // the first unit is always unlocked

  return getOrderedUnits().map((unit) => {
    const record = state.units[unit.id];
    const completed = !!record?.completed;
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
      bestScore: record?.bestScore ?? 0,
      totalQuestions: record?.totalQuestions ?? unit.quiz.length,
      attempts: record?.attempts ?? 0,
    };
  });
}

export function completeUnit(unitId: string, score: number, totalQuestions: number) {
  const passed = totalQuestions > 0 && score / totalQuestions >= 0.6;
  const state = read();
  const previous = state.units[unitId];

  state.units[unitId] = {
    completed: (previous?.completed ?? false) || passed,
    bestScore: Math.max(previous?.bestScore ?? 0, score),
    totalQuestions,
    attempts: (previous?.attempts ?? 0) + 1,
  };

  if (passed) bumpStreak(state);
  write(state);

  return { passed };
}
