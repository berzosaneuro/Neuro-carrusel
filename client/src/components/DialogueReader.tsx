import { useState } from 'react';
import type { Dialogue } from '../types';

export default function DialogueReader({ dialogue }: { dialogue: Dialogue }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function select(qIndex: number, optIndex: number) {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{dialogue.title}</h3>
        <div className="space-y-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-4">
          {dialogue.lines.map((line, i) => (
            <p key={i} className="text-sm">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{line.speaker}: </span>
              <span className="text-slate-700 dark:text-slate-200">{line.text}</span>
            </p>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Comprehension check</h4>
        <div className="space-y-4">
          {dialogue.comprehension.map((q, qi) => {
            const selected = answers[qi];
            const answered = selected !== undefined;
            return (
              <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">{q.question}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    let style = 'border-slate-300 dark:border-slate-700';
                    if (answered) {
                      if (oi === q.answer) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                      else if (oi === selected) style = 'border-red-400 bg-red-50 dark:bg-red-950/40';
                    }
                    return (
                      <button
                        key={oi}
                        disabled={answered}
                        onClick={() => select(qi, oi)}
                        className={`text-left text-sm px-3 py-2 rounded-lg border ${style} disabled:cursor-default transition`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
