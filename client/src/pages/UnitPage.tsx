import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-danger">{error}</p>
        <Link to="/" className="btn btn-primary px-5 py-2.5">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-border border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-12">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-4 bg-bg/90 backdrop-blur-md border-b border-border">
        <Link to="/" className="text-[13px] text-text-secondary hover:text-text transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-[16px] font-semibold mt-1">{unit.title}</h1>
        <p className="text-[13px] text-text-secondary">{unit.subtitle}</p>
      </header>

      <nav className="px-5 pt-5">
        <ol className="flex gap-1.5 flex-wrap">
          {STEPS.map((s, i) => {
            const active = s === step;
            const stepIndex = STEPS.indexOf(step);
            const isPast = i < stepIndex;
            return (
              <li key={s}>
                <button
                  onClick={() => !result && setStep(s)}
                  disabled={!!result}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors disabled:cursor-default ${
                    active
                      ? 'bg-accent border-accent text-white'
                      : isPast
                        ? 'border-success/40 text-success bg-success-soft'
                        : 'border-border text-text-tertiary'
                  }`}
                >
                  {s}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <main className="px-5 py-7">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center card p-8"
            >
              <p className="text-5xl mb-4">{result.passed ? '🎉' : '💪'}</p>
              <h2 className="text-[18px] font-semibold mb-2">
                {result.passed ? 'Unit completed!' : 'Almost there'}
              </h2>
              <p className="text-text-secondary mb-6 text-[14px]">
                You scored {result.score} out of {result.total}.{' '}
                {result.passed ? 'The next unit is now unlocked.' : 'You need 60% to pass — try again!'}
              </p>
              <div className="flex flex-col gap-2.5">
                {!result.passed && (
                  <button
                    onClick={() => {
                      setResult(null);
                      setStep('Quiz');
                    }}
                    className="btn btn-secondary py-2.5"
                  >
                    Retry quiz
                  </button>
                )}
                <button onClick={() => navigate('/')} className="btn btn-primary py-2.5">
                  Back to dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {step === 'Vocabulary' && <Flashcards items={unit.vocabulary} />}
              {step === 'Grammar' && (
                <div className="space-y-4">
                  <h3 className="text-[16px] font-semibold">{unit.grammar.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-[14px]">{unit.grammar.explanation}</p>
                  <div className="card p-4 space-y-2">
                    {unit.grammar.examples.map((ex, i) => (
                      <p key={i} className="text-[13px] text-text-secondary">
                        <span className="text-accent">•</span> {ex}
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
                    className="btn btn-primary px-6 py-2.5"
                  >
                    Continue →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
