import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Code2, Sparkles } from 'lucide-react';
import { BRAND_NAME, WHATSAPP_DISPLAY_NUMBER } from '../config.js';

const LEGAL_LINKS = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/conditions-utilisation', label: "Conditions Générales d'Utilisation" },
  { to: '/confidentialite', label: 'Politique de confidentialité' }
  // { to: '/mentions-legales', label: 'Mentions légales' }
];

const PARTNERS = [
  {
    name: 'ChrisTech.cm',
    url: 'https://christech.cm',
    label: 'Développement'
  },
  {
    name: 'DreamDigital.cm',
    url: 'https://dreamdigital.cm',
    label: 'Design & Digital'
  }
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
                  <Link
                    to={link.to}
                    className="text-sm text-ink-soft transition hover:text-brand hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== CRÉDITS DÉVELOPPEUR ===== */}
        <div className="mt-8 border-t border-ink/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-ink-soft/70">
              © {new Date().getFullYear()} {BRAND_NAME}. Tous droits réservés.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Code2 size={14} className="text-brand" />
                Développé par
              </span>
              {PARTNERS.map((partner, idx) => (
                <React.Fragment key={partner.name}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 font-semibold text-ink transition hover:text-brand"
                    title={`${partner.label} — ${partner.name}`}
                  >
                    <Sparkles
                      size={12}
                      className="text-gold opacity-0 transition group-hover:opacity-100"
                    />
                    <span className="border-b border-transparent transition group-hover:border-brand">
                      {partner.name}
                    </span>
                  </a>
                  {idx < PARTNERS.length - 1 && (
                    <span className="text-ink-soft/40">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}