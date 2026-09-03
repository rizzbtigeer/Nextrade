import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange, min = 1, step = 1 }) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(value + step);

  return (
    <div className="inline-flex items-center rounded-md border border-ink/15">
      <button
        type="button"
        onClick={decrease}
        className="flex h-10 w-10 items-center justify-center text-ink-soft transition hover:bg-paper disabled:opacity-30"
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
        className="h-10 w-16 border-x border-ink/15 text-center text-sm font-semibold tabular focus:outline-none"
      />
      <button
        type="button"
        onClick={increase}
        className="flex h-10 w-10 items-center justify-center text-ink-soft transition hover:bg-paper"
        aria-label="Augmenter la quantité"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
