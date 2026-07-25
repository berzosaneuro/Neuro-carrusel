import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../api/client';
import type { Unit } from '../types';
import Flashcards from '../components/Flashcards';
import DialogueReader from '../components/DialogueReader';
import Quiz from '../components/Quiz';

const STEPS = ['Vocabulary', 'Grammar', 'Listening', 'Quiz'] as const;
type Step = (typeof STEPS)[number];

export default function UnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { token, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('Vocabulary');
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);

  useEffect(() => {
    if (!token || !unitId) return;
    setUnit(null);
    setResult(null);
    setStep('Vocabulary');
    api
      .getUnit(token, unitId)
      .then(({ unit }) => setUnit(unit))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Could not load this unit.');
      });
  }, [token, unitId]);

  async function handleQuizFinish(score: number) {
    if (!token || !unit) return;
    try {
      const res = await api.completeUnit(token, unit.id, score, unit.quiz.length);
      setResult({ score, total: unit.quiz.length, passed: res.passed });
      await refreshUser();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your progress.');
    }
  }

  if (error) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-neon-magenta-glow">{error}</p>
        <Link to="/" className="btn-3d btn-3d-primary px-5 py-2.5 text-sm">
          BACK TO DASHBOARD
        </Link>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-full flex items-center justify-center text-neon-cyan-glow font-display tracking-widest text-sm">
        LOADING UNIT…
      </div>
    );
  }

  return (
    <div className="min-h-full pb-10">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-4 bg-void-2/80 backdrop-blur border-b border-neon-cyan/15">
        <Link to="/" className="text-xs font-display tracking-widest text-neon-cyan-glow">
          ← DASHBOARD
        </Link>
        <h1 className="font-display text-lg font-bold text-white mt-1">{unit.title}</h1>
        <p className="text-sm text-ink-dim">{unit.subtitle}</p>
      </header>

      <nav className="px-5 pt-5">
        <ol className="flex gap-2 flex-wrap">
          {STEPS.map((s, i) => {
            const active = s === step;
            const stepIndex = STEPS.indexOf(step);
            const isPast = i < stepIndex;
            return (
              <li key={s}>
                <button
                  onClick={() => !result && setStep(s)}
                  disabled={!!result}
                  className={`text-xs font-display font-semibold tracking-wide px-3 py-1.5 rounded-full border transition disabled:cursor-default ${
                    active
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple border-transparent text-void'
                      : isPast
                        ? 'border-neon-green/50 text-neon-green-glow'
                        : 'border-ink-dim/25 text-ink-dim'
                  }`}
                >
                  {i + 1}. {s.toUpperCase()}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <main className="px-5 py-7">
        {result ? (
          <div className="text-center glass-panel rounded-2xl p-8 glow-magenta">
            <p className="text-5xl mb-4">{result.passed ? '🎉' : '💪'}</p>
            <h2 className="font-display text-xl font-bold text-white mb-2">
              {result.passed ? 'UNIT COMPLETED!' : 'ALMOST THERE'}
            </h2>
            <p className="text-ink-dim mb-6">
              You scored {result.score} out of {result.total}.{' '}
              {result.passed ? 'The next unit is now unlocked.' : 'You need 60% to pass — try again!'}
            </p>
            <div className="flex flex-col gap-3">
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setStep('Quiz');
                  }}
                  className="btn-3d btn-3d-ghost py-2.5 text-sm"
                >
                  RETRY QUIZ
                </button>
              )}
              <button onClick={() => navigate('/')} className="btn-3d btn-3d-primary py-2.5 text-sm">
                BACK TO DASHBOARD
              </button>
            </div>
          </div>
        ) : (
          <>
            {step === 'Vocabulary' && <Flashcards items={unit.vocabulary} />}
            {step === 'Grammar' && (
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold text-white">{unit.grammar.title}</h3>
                <p className="text-ink leading-relaxed">{unit.grammar.explanation}</p>
                <div className="glass-panel rounded-2xl p-4 space-y-2">
                  {unit.grammar.examples.map((ex, i) => (
                    <p key={i} className="text-sm text-ink-dim">
                      <span className="text-neon-cyan-glow">▸</span> {ex}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {step === 'Listening' && <DialogueReader dialogue={unit.dialogue} />}
            {step === 'Quiz' && <Quiz questions={unit.quiz} onFinish={handleQuizFinish} />}

            {step !== 'Quiz' && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(STEPS[STEPS.indexOf(step) + 1])}
                  className="btn-3d btn-3d-primary px-6 py-2.5 text-sm"
                >
                  CONTINUE →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
