import React from 'react';
import { formatFCFA } from '../utils/pricing.js';

/**
 * Échelle de prix : visualise les paliers de gros en un coup d'œil
 * (le "signature element" de l'identité visuelle — met en avant l'argument
 * central d'un site de gros : plus on achète, moins c'est cher).
 */
export default function PriceLadder({ priceTiers, compact = false }) {
  if (!priceTiers?.length) return null;
  const sorted = [...priceTiers].sort((a, b) => a.minQty - b.minQty);
  const maxPrice = Math.max(...sorted.map((t) => t.price));

  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      {sorted.map((tier, idx) => {
        const nextTier = sorted[idx + 1];
        const label = nextTier ? `${tier.minQty}-${nextTier.minQty - 1}` : `${tier.minQty}+`;
        const widthPct = Math.max(35, (tier.price / maxPrice) * 100);
        return (
          <div key={tier.minQty} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[11px] font-medium text-ink-soft tabular">
              {label}
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-ink/5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-brand-light to-brand"
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-[11px] font-semibold text-ink tabular">
              {formatFCFA(tier.price)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
