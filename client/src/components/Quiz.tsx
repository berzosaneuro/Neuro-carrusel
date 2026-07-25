import { useState } from 'react';
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
    <div className="max-w-xl mx-auto">
      <p className="text-sm text-slate-400 mb-3">
        Question {index + 1} of {questions.length} · Score so far: {score}
      </p>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
        <p className="font-medium text-slate-900 dark:text-white mb-4">{question.question}</p>

        {question.type === 'mc' ? (
          <div className="space-y-2">
            {question.options.map((opt, i) => {
              let style = 'border-slate-300 dark:border-slate-700 hover:border-indigo-400';
              if (revealed) {
                if (i === question.answer) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                else if (i === selected) style = 'border-red-400 bg-red-50 dark:bg-red-950/40';
              } else if (i === selected) {
                style = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40';
              }
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border ${style} disabled:cursor-default transition`}
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
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {revealed && (
              <p className={`text-sm mt-2 ${lastCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                {lastCorrect ? 'Correct!' : `Correct answer: ${question.answer.replace('...', ' ... ')}`}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          {!revealed ? (
            <button
              onClick={check}
              disabled={question.type === 'mc' ? selected === null : fillValue.trim() === ''}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40"
            >
              Check
            </button>
          ) : (
            <button onClick={next} className="px-5 py-2 rounded-lg bg-indigo-600 text-white">
              {isLast ? 'Finish quiz' : 'Next question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
