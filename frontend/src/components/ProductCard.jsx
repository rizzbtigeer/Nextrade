import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import PriceLadder from './PriceLadder.jsx';
import { formatFCFA, lowestTierPrice } from '../utils/pricing.js';
import api from '../api/axios.js';

export default function ProductCard({ product }) {
  const handleClick = () => {
    // Enregistre le clic pour les statistiques admin (best-effort, non bloquant)
    api.post(`/products/${product._id}/click`).catch(() => {});
  };

  return (
    <Link
      to={`/produit/${product.slug}`}
      onClick={handleClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink/8 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-paper">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft/30">
            <Package size={40} />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2 py-0.5 text-[11px] font-medium text-white">
          Dès {product.moq} unité{product.moq > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-ink">{product.name}</p>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-brand tabular">
            {formatFCFA(lowestTierPrice(product.priceTiers))}
          </span>
          <span className="text-xs text-ink-soft">/ unité min.</span>
        </div>

        <PriceLadder priceTiers={product.priceTiers} compact />
      </div>
    </Link>
  );
}
