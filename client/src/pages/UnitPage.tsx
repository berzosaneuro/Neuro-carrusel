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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!unit) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading unit…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{unit.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{unit.subtitle}</p>
        </div>
      </header>

      <nav className="max-w-3xl mx-auto px-4 pt-6">
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
                  className={`text-sm px-3 py-1.5 rounded-full border transition ${
                    active
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : isPast
                        ? 'border-emerald-400 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-300 dark:border-slate-700 text-slate-500'
                  } disabled:cursor-default`}
                >
                  {i + 1}. {s}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {result ? (
          <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10">
            <p className="text-5xl mb-4">{result.passed ? '🎉' : '💪'}</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {result.passed ? 'Unit completed!' : 'Almost there'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You scored {result.score} out of {result.total}.{' '}
              {result.passed ? 'The next unit is now unlocked.' : 'You need 60% to pass — try again!'}
            </p>
            <div className="flex justify-center gap-3">
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setStep('Quiz');
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Retry quiz
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {step === 'Vocabulary' && <Flashcards items={unit.vocabulary} />}
            {step === 'Grammar' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{unit.grammar.title}</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{unit.grammar.explanation}</p>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 space-y-2">
                  {unit.grammar.examples.map((ex, i) => (
                    <p key={i} className="text-sm text-slate-700 dark:text-slate-300">
                      • {ex}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {step === 'Listening' && <DialogueReader dialogue={unit.dialogue} />}
            {step === 'Quiz' && <Quiz questions={unit.quiz} onFinish={handleQuizFinish} />}

            {step !== 'Quiz' && (
              <div className="max-w-2xl mx-auto flex justify-end mt-8">
                <button
                  onClick={() => setStep(STEPS[STEPS.indexOf(step) + 1])}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  Continue →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
