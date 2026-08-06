import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { getUnitById } from '../store/progress';
import Flashcards from '../components/Flashcards';
import DialogueReader from '../components/DialogueReader';
import Quiz from '../components/Quiz';

const STEPS = ['Vocabulary', 'Grammar', 'Listening', 'Quiz'] as const;
type Step = (typeof STEPS)[number];
const STEP_LABELS: Record<Step, string> = {
  Vocabulary: 'Vocabulario',
  Grammar: 'Gramática',
  Listening: 'Escucha',
  Quiz: 'Prueba',
};

export default function UnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { units, completeUnit } = useProgress();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('Vocabulary');
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);

  const unit = unitId ? getUnitById(unitId) : undefined;
  const status = units.find((u) => u.id === unitId);

  useEffect(() => {
    setStep('Vocabulary');
    setResult(null);
  }, [unitId]);

  if (!unit || !status || status.locked) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-danger text-[15px]">
          {unit && status?.locked
            ? 'Esta unidad está bloqueada. Completa la unidad anterior primero.'
            : 'No se encontró esta unidad.'}
        </p>
        <Link to="/" className="btn btn-primary px-5 py-3">
          Volver al panel
        </Link>
      </div>
    );
  }

  function handleQuizFinish(score: number) {
    const total = unit!.quiz.length;
    const { passed } = completeUnit(unit!.id, score, total);
    setResult({ score, total, passed });
  }

  return (
    <div className="min-h-dvh pb-12">
      <header className="sticky top-0 z-30 px-5 pt-6 pb-4 bg-bg/90 backdrop-blur-md border-b border-border">
        <Link to="/" className="text-[13px] text-text-secondary hover:text-text transition-colors">
          ← Panel
        </Link>
        <h1 className="text-[19px] font-bold mt-1">{unit.title}</h1>
        <p className="text-[14px] text-text-secondary">{unit.subtitle}</p>
      </header>

      <nav className="px-5 pt-5">
        <ol className="flex gap-1.5 flex-wrap">
          {STEPS.map((s, i) => {
            const active = s === step;
            const stepIndex = STEPS.indexOf(step);
            const isPast = i < stepIndex;
            return (
              <li key={s}>
                <motion.button
                  onClick={() => !result && setStep(s)}
                  disabled={!!result}
                  whileTap={!result ? { scale: 0.94 } : undefined}
                  className={`text-[13px] font-semibold px-3.5 py-1.5 rounded-full border transition-colors disabled:cursor-default ${
                    active
                      ? 'bg-accent border-accent text-white'
                      : isPast
                        ? 'border-success/40 text-success bg-success-soft'
                        : 'border-border text-text-tertiary'
                  }`}
                >
                  {STEP_LABELS[s]}
                </motion.button>
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
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="text-center card p-8"
            >
              <motion.p
                className="text-5xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.1 }}
              >
                {result.passed ? '🎉' : '💪'}
              </motion.p>
              <h2 className="text-[20px] font-bold mb-2">
                {result.passed ? '¡Unidad completada!' : 'Casi lo consigues'}
              </h2>
              <p className="text-text-secondary mb-6 text-[15px]">
                Has acertado {result.score} de {result.total}.{' '}
                {result.passed
                  ? 'La siguiente unidad ya está desbloqueada.'
                  : 'Necesitas un 60% para aprobar — ¡inténtalo de nuevo!'}
              </p>
              <div className="flex flex-col gap-2.5">
                {!result.passed && (
                  <button
                    onClick={() => {
                      setResult(null);
                      setStep('Quiz');
                    }}
                    className="btn btn-secondary py-3"
                  >
                    Reintentar
                  </button>
                )}
                <button onClick={() => navigate('/')} className="btn btn-primary py-3">
                  Volver al panel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 'Vocabulary' && <Flashcards items={unit.vocabulary} />}
              {step === 'Grammar' && (
                <div className="space-y-4">
                  <h3 className="text-[18px] font-bold">{unit.grammar.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-[15px]">{unit.grammar.explanation}</p>
                  <div className="card p-4 space-y-2">
                    {unit.grammar.examples.map((ex, i) => (
                      <p key={i} className="text-[14px] text-text-secondary">
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
                    className="btn btn-primary px-6 py-3"
                  >
                    Continuar →
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
