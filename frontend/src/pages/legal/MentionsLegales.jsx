import React from 'react';
import LegalLayout from './LegalLayout.jsx';
import { BRAND_NAME, WHATSAPP_DISPLAY_NUMBER } from '../../config.js';

export default function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales" updated="[à compléter]">
      <p className="rounded-md bg-gold/10 p-3 text-xs text-ink-soft">
        Certaines informations ci-dessous sont à compléter par l'exploitant du site avant sa mise
        en ligne définitive (nom légal, statut, adresse, éventuel numéro RCCM/contribuable).
      </p>

      <h2>Éditeur du site</h2>
      <p>
        Nom / Raison sociale : [à compléter]
        <br />
        Statut : [Entreprise individuelle / Établissement / Société — à compléter selon la
        situation réelle]
        <br />
        Adresse : [à compléter], Cameroun
        <br />
        Numéro de contact : {WHATSAPP_DISPLAY_NUMBER}
        <br />
        Numéro RCCM / Contribuable (si applicable) : [à compléter]
      </p>

      <h2>Responsable de la publication</h2>
      <p>[Nom du responsable — à compléter]</p>

      <h2>Hébergement</h2>
      <p>
        Le Site est hébergé par : Dream Digital
        <br />
        Adresse de l'hébergeur : dreamdigital.cm
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Le contenu du Site (textes, images, logo, mise en page) est la propriété de{' '}
        {BRAND_NAME} ou de ses fournisseurs, sauf mention contraire. Toute reproduction sans
        autorisation préalable est interdite.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        {BRAND_NAME} s'efforce de fournir des informations aussi précises que possible sur le
        Site, mais ne peut être tenu responsable des omissions, inexactitudes ou carences dans la
        mise à jour, qu'elles soient de son fait ou du fait de tiers.
      </p>
    </LegalLayout>
  );
}
