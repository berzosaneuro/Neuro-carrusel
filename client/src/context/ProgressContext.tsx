import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { completeUnit as persistUnit, getProfile, getUnitStatuses } from '../store/progress';
import type { Profile, UnitStatus } from '../types';

interface ProgressContextValue {
  profile: Profile;
  units: UnitStatus[];
  completeUnit: (unitId: string, score: number, totalQuestions: number) => { passed: boolean };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(getProfile);
  const [units, setUnits] = useState<UnitStatus[]>(getUnitStatuses);

  const completeUnit = useCallback((unitId: string, score: number, totalQuestions: number) => {
    const result = persistUnit(unitId, score, totalQuestions);
    setProfile(getProfile());
    setUnits(getUnitStatuses());
    return result;
  }, []);

  const value = useMemo(() => ({ profile, units, completeUnit }), [profile, units, completeUnit]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
