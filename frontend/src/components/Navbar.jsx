import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { BRAND_NAME } from '../config.js';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/catalogue${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        
        {/* ===== LOGO + BRAND - UPDATED ===== */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          {/* Logo Image - Added */}
          <img 
            src="/logo.png" 
            alt={`${BRAND_NAME} logo`}
            className="h-9 w-auto object-contain rounded-lg bg-white/10 p-1"
          />
          {/* Fallback icon if logo doesn't load */}
          {/* <Store size={20} strokeWidth={2.5} className="hidden" /> */}
          <span className="font-display text-xl font-bold tracking-tight">{BRAND_NAME}</span>
        </Link>

        {/* Search Form - UNCHANGED */}
        <form onSubmit={handleSearch} className="flex flex-1 items-stretch">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article : jean, chaussures, montre..."
            className="w-full rounded-l-md border-0 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Rechercher un article"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-r-md bg-brand px-4 text-white transition hover:bg-brand-dark"
            aria-label="Lancer la recherche"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Cart Link - UNCHANGED */}
        <Link
          to="/panier"
          className="relative flex shrink-0 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          <ShoppingCart size={20} />
          <span className="hidden sm:inline">Panier</span>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-ink">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}