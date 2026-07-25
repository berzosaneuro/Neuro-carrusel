import { useState } from 'react';
import type { VocabItem } from '../types';

export default function Flashcards({ items }: { items: VocabItem[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));

  const item = items[index];

  function go(delta: number) {
    const next = Math.min(Math.max(index + delta, 0), items.length - 1);
    setIndex(next);
    setFlipped(false);
    setSeen((s) => new Set(s).add(next));
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-xs font-display tracking-widest text-ink-dim">
        CARD {index + 1}/{items.length} · {seen.size}/{items.length} VIEWED
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="card-flip glass-panel w-full max-w-md h-56 rounded-2xl flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none border-neon-cyan/25 glow-cyan"
        key={`${index}-${flipped}`}
      >
        {!flipped ? (
          <p className="font-display text-2xl font-bold text-white">{item.word}</p>
        ) : (
          <div className="space-y-3">
            <p className="font-display text-xl font-bold text-neon-magenta-glow">{item.translation}</p>
            <p className="text-sm italic text-ink-dim">"{item.example}"</p>
          </div>
        )}
        <p className="text-[10px] tracking-widest text-neon-cyan-glow mt-4 font-display">
          TAP TO {flipped ? 'SEE THE WORD' : 'REVEAL MEANING'}
        </p>
      </button>

      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="btn-3d btn-3d-ghost flex-1 py-2.5 text-sm"
        >
          ← PREV
        </button>
        <button
          onClick={() => go(1)}
          disabled={index === items.length - 1}
          className="btn-3d btn-3d-primary flex-1 py-2.5 text-sm"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
