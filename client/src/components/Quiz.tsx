import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '../types';

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isFillCorrect(userAnswer: string, correct: string) {
  const norm = normalize(userAnswer);
  const options = correct.split('...').map(normalize);
  if (options.length > 1) {
    // "have...seen" style answers: accept if all parts are present in order
    return options.every((part) => norm.includes(part));
  }
  return norm === normalize(correct);
}

interface Props {
  questions: QuizQuestion[];
  onFinish: (score: number) => void;
}

export default function Quiz({ questions, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function check() {
    let correct = false;
    if (question.type === 'mc') {
      correct = selected === question.answer;
    } else {
      correct = isFillCorrect(fillValue, question.answer);
    }
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setRevealed(true);
  }

  function next() {
    if (isLast) {
      onFinish(score);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setFillValue('');
    setRevealed(false);
  }

  return (
    <div>
      <p className="text-[14px] text-text-tertiary mb-3 tabular-nums">
        Pregunta {index + 1} de {questions.length} · Puntuación {score}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="card p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-semibold text-[16px] mb-4">{question.question}</p>

          {question.type === 'mc' ? (
            <div className="space-y-2.5">
              {question.options.map((opt, i) => {
                let style = 'option-tile';
                if (revealed) {
                  if (i === question.answer) style = 'option-tile option-tile-correct';
                  else if (i === selected) style = 'option-tile option-tile-wrong';
                } else if (i === selected) {
                  style = 'option-tile option-tile-selected';
                }
                return (
                  <motion.button
                    key={i}
                    disabled={revealed}
                    onClick={() => setSelected(i)}
                    whileTap={!revealed ? { scale: 0.97 } : undefined}
                    className={`w-full text-left px-4 py-3 ${style} disabled:cursor-default`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div>
              <input
                value={fillValue}
                disabled={revealed}
                onChange={(e) => setFillValue(e.target.value)}
                placeholder="Escribe tu respuesta…"
                className="field w-full px-4 py-3"
              />
              {revealed && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[14px] mt-2 font-medium ${lastCorrect ? 'text-success' : 'text-danger'}`}
                >
                  {lastCorrect ? '¡Correcto!' : `Respuesta correcta: ${question.answer.replace('...', ' ... ')}`}
                </motion.p>
              )}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            {!revealed ? (
              <button
                onClick={check}
                disabled={question.type === 'mc' ? selected === null : fillValue.trim() === ''}
                className="btn btn-primary px-6 py-3"
              >
                Comprobar
              </button>
            ) : (
              <button onClick={next} className="btn btn-primary px-6 py-3">
                {isLast ? 'Finalizar' : 'Siguiente →'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
