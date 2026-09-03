import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { BRAND_NAME, WHATSAPP_DISPLAY_NUMBER } from '../config.js';

const LEGAL_LINKS = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/conditions-utilisation', label: "Conditions Générales d'Utilisation" },
  { to: '/confidentialite', label: 'Politique de confidentialité' },
  { to: '/mentions-legales', label: 'Mentions légales' }
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">{BRAND_NAME}</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Achats en gros pour revendeurs. Habits, chaussures, montres, et bien plus à venir.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Commander
            </h4>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
              <MessageCircle size={16} className="text-whatsapp" />
              Toute commande se négocie sur WhatsApp : {WHATSAPP_DISPLAY_NUMBER}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Comment ça marche
            </h4>
            <p className="mt-2 text-sm text-ink-soft">
              Choisissez vos articles et quantités, le prix de gros s'applique automatiquement,
              puis validez : on continue la discussion (dispo, livraison) sur WhatsApp.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Informations légales
            </h4>
            <ul className="mt-2 space-y-1.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink-soft transition hover:text-brand hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-ink/10 pt-6 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} {BRAND_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
