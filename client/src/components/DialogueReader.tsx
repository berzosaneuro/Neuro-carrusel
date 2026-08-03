import { useState } from 'react';
import type { Dialogue } from '../types';

export default function DialogueReader({ dialogue }: { dialogue: Dialogue }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function select(qIndex: number, optIndex: number) {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-[15px] font-semibold mb-3">{dialogue.title}</h3>
        <div className="space-y-2.5 card p-4">
          {dialogue.lines.map((line, i) => (
            <p key={i} className="text-[14px]">
              <span className="font-semibold text-accent">{line.speaker}: </span>
              <span className="text-text">{line.text}</span>
            </p>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[15px] font-semibold mb-3">Comprehension check</h4>
        <div className="space-y-3">
          {dialogue.comprehension.map((q, qi) => {
            const selected = answers[qi];
            const answered = selected !== undefined;
            return (
              <div key={qi} className="card p-4">
                <p className="text-[14px] font-medium mb-3">{q.question}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    let style = 'option-tile';
                    if (answered) {
                      if (oi === q.answer) style = 'option-tile option-tile-correct';
                      else if (oi === selected) style = 'option-tile option-tile-wrong';
                    }
                    return (
                      <button
                        key={oi}
                        disabled={answered}
                        onClick={() => select(qi, oi)}
                        className={`text-[13px] px-3 py-2.5 ${style} disabled:cursor-default`}
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
