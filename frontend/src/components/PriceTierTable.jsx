import React from 'react';
import { formatFCFA } from '../utils/pricing.js';

export default function PriceTierTable({ priceTiers, activeQty }) {
  const sorted = [...priceTiers].sort((a, b) => a.minQty - b.minQty);
  const maxPrice = Math.max(...sorted.map((t) => t.price));

  return (
    <div className="overflow-hidden rounded-lg border border-ink/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-paper text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="px-4 py-2.5 font-semibold">Quantité</th>
            <th className="px-4 py-2.5 font-semibold">Prix / unité</th>
            <th className="px-4 py-2.5 font-semibold">Économie</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((tier, idx) => {
            const nextTier = sorted[idx + 1];
            const label = nextTier ? `${tier.minQty} - ${nextTier.minQty - 1}` : `${tier.minQty}+`;
            const isActive = activeQty >= tier.minQty && (!nextTier || activeQty < nextTier.minQty);
            const savingPct = Math.round((1 - tier.price / maxPrice) * 100);
            return (
              <tr
                key={tier.minQty}
                className={`border-t border-ink/8 transition ${
                  isActive ? 'bg-brand-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-ink">
                  {label}
                  {isActive && (
                    <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">
                      Votre palier
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-semibold text-ink tabular">
                  {formatFCFA(tier.price)}
                </td>
                <td className="px-4 py-2.5 text-ink-soft tabular">
                  {savingPct > 0 ? `-${savingPct}%` : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
