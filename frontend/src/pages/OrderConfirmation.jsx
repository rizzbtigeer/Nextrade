import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const { state } = useLocation();

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <CheckCircle2 size={48} className="mx-auto text-whatsapp" />
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Commande envoyée !</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Une fenêtre WhatsApp s'est ouverte avec le récapitulatif de votre commande. Envoyez le
        message pour que nous confirmions la disponibilité et les frais de livraison.
      </p>

      {state?.whatsappLink && (
        <a
          href={state.whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-whatsapp px-6 py-3 text-sm font-semibold text-white hover:bg-whatsapp-dark"
        >
          <MessageCircle size={18} />
          La fenêtre ne s'est pas ouverte ? Cliquez ici
        </a>
      )}

      <div>
        <Link to="/catalogue" className="mt-8 inline-block text-sm font-semibold text-brand hover:underline">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
