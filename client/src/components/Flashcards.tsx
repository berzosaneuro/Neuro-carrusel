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
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-slate-400">
        Card {index + 1} of {items.length} · {seen.size}/{items.length} viewed
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="card-flip w-full max-w-md h-56 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-md flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none"
        key={`${index}-${flipped}`}
      >
        {!flipped ? (
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.word}</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{item.translation}</p>
            <p className="text-sm italic text-slate-500 dark:text-slate-400">"{item.example}"</p>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-4">Tap to {flipped ? 'see the word' : 'reveal meaning'}</p>
      </button>

      <div className="flex gap-3">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={() => go(1)}
          disabled={index === items.length - 1}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
