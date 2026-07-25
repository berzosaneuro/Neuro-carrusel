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
      <p className="text-xs font-display tracking-widest text-ink-dim mb-3">
        QUESTION {index + 1}/{questions.length} · SCORE {score}
      </p>
      <div className="glass-panel rounded-2xl p-5 glow-cyan">
        <p className="font-medium text-white mb-4">{question.question}</p>

        {question.type === 'mc' ? (
          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              let style = 'tile-3d';
              if (revealed) {
                if (i === question.answer) style = 'tile-3d tile-3d-correct';
                else if (i === selected) style = 'tile-3d tile-3d-wrong';
              } else if (i === selected) {
                style = 'tile-3d tile-3d-selected';
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
              className="w-full rounded-xl border border-neon-cyan/25 bg-void-2/60 px-4 py-2.5 text-white placeholder:text-ink-dim focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition"
            />
            {revealed && (
              <p className={`text-sm mt-2 font-semibold ${lastCorrect ? 'text-neon-green-glow' : 'text-neon-magenta-glow'}`}>
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
              className="btn-3d btn-3d-primary px-6 py-2.5 text-sm"
            >
              CHECK
            </button>
          ) : (
            <button onClick={next} className="btn-3d btn-3d-magenta px-6 py-2.5 text-sm">
              {isLast ? 'FINISH QUIZ' : 'NEXT →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
