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
        <h3 className="font-display font-bold text-white mb-3">{dialogue.title}</h3>
        <div className="space-y-2.5 glass-panel rounded-2xl p-4">
          {dialogue.lines.map((line, i) => (
            <p key={i} className="text-sm">
              <span className="font-semibold text-neon-cyan-glow">{line.speaker}: </span>
              <span className="text-ink">{line.text}</span>
            </p>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display font-bold text-white mb-3">Comprehension check</h4>
        <div className="space-y-4">
          {dialogue.comprehension.map((q, qi) => {
            const selected = answers[qi];
            const answered = selected !== undefined;
            return (
              <div key={qi} className="glass-panel rounded-2xl p-4">
                <p className="text-sm font-medium text-white mb-3">{q.question}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    let style = 'tile-3d';
                    if (answered) {
                      if (oi === q.answer) style = 'tile-3d tile-3d-correct';
                      else if (oi === selected) style = 'tile-3d tile-3d-wrong';
                    }
                    return (
                      <button
                        key={oi}
                        disabled={answered}
                        onClick={() => select(qi, oi)}
                        className={`text-left text-sm px-3 py-2.5 ${style} disabled:cursor-default`}
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
