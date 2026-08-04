import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <p className="text-[14px] text-text-tertiary tabular-nums">
        {index + 1} / {items.length} · {seen.size} {seen.size === 1 ? 'vista' : 'vistas'}
      </p>

      <div className="w-full" style={{ perspective: 1200 }}>
        <motion.button
          onClick={() => setFlipped((f) => !f)}
          whileTap={{ scale: 0.97 }}
          className="card w-full h-56 flex items-center justify-center px-6 text-center cursor-pointer select-none"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(180deg)' : undefined }}>
            {!flipped ? (
              <p className="text-3xl font-bold">{item.word}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-2xl font-bold text-accent">{item.translation}</p>
                <p className="text-[15px] text-text-secondary italic">"{item.example}"</p>
              </div>
            )}
          </div>
        </motion.button>
      </div>
      <p className="text-[13px] text-text-tertiary -mt-3">
        Toca la tarjeta para {flipped ? 'ver la palabra' : 'revelar el significado'}
      </p>

      <div className="flex gap-2.5 w-full">
        <button onClick={() => go(-1)} disabled={index === 0} className="btn btn-secondary flex-1 py-2.5">
          ← Anterior
        </button>
        <button
          onClick={() => go(1)}
          disabled={index === items.length - 1}
          className="btn btn-primary flex-1 py-2.5"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
