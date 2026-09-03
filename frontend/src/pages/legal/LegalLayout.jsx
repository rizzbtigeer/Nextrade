import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function LegalPage({ title, updated, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
        <ChevronLeft size={16} /> Retour à l'accueil
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">{title}</h1>
      {updated && <p className="mt-1 text-xs text-ink-soft">Dernière mise à jour : {updated}</p>}
      <div className="prose prose-sm mt-8 max-w-none space-y-5 text-sm leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
