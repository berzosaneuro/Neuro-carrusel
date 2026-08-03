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
      <p className="text-[13px] text-text-tertiary mb-3 tabular-nums">
        Question {index + 1} of {questions.length} · Score {score}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="card p-5"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.16 }}
        >
          <p className="font-medium mb-4">{question.question}</p>

          {question.type === 'mc' ? (
            <div className="space-y-2">
              {question.options.map((opt, i) => {
                let style = 'option-tile';
                if (revealed) {
                  if (i === question.answer) style = 'option-tile option-tile-correct';
                  else if (i === selected) style = 'option-tile option-tile-wrong';
                } else if (i === selected) {
                  style = 'option-tile option-tile-selected';
                }
                return (
                  <button
                    key={i}
                    disabled={revealed}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left px-4 py-2.5 ${style} disabled:cursor-default`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <input
                value={fillValue}
                disabled={revealed}
                onChange={(e) => setFillValue(e.target.value)}
                placeholder="Type your answer…"
                className="field w-full px-4 py-2.5"
              />
              {revealed && (
                <p className={`text-[13px] mt-2 font-medium ${lastCorrect ? 'text-success' : 'text-danger'}`}>
                  {lastCorrect ? 'Correct!' : `Correct answer: ${question.answer.replace('...', ' ... ')}`}
                </p>
              )}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            {!revealed ? (
              <button
                onClick={check}
                disabled={question.type === 'mc' ? selected === null : fillValue.trim() === ''}
                className="btn btn-primary px-6 py-2.5"
              >
                Check
              </button>
            ) : (
              <button onClick={next} className="btn btn-primary px-6 py-2.5">
                {isLast ? 'Finish' : 'Next →'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
