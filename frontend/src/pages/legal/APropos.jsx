import React from 'react';
import LegalLayout from './LegalLayout.jsx';
import { BRAND_NAME } from '../../config.js';

export default function APropos() {
  return (
    <LegalLayout title={`À propos de ${BRAND_NAME}`}>
      <p>
        {BRAND_NAME} est une plateforme camerounaise qui met en relation des revendeurs avec des
        articles disponibles au prix de gros : habits, chaussures, montres et bien d'autres
        catégories à venir.
      </p>

      <h2>Notre fonctionnement</h2>
      <p>
        Contrairement à une boutique en ligne classique, {BRAND_NAME} ne prend aucun paiement sur
        le site. Vous parcourez le catalogue, vous composez votre commande, le prix de gros
        s'applique automatiquement selon la quantité choisie, puis vous êtes mis en relation
        directement avec nous sur WhatsApp pour finaliser la commande, convenir de la livraison et
        du paiement.
      </p>

      <h2>Pourquoi ce choix</h2>
      <p>
        Ce fonctionnement nous permet de rester flexibles sur la disponibilité réelle du stock, de
        discuter directement des frais de livraison selon votre ville, et de vous répondre
        personnellement plutôt que de vous laisser seul face à un système automatisé.
      </p>

      <h2>Nous contacter</h2>
      <p>
        Pour toute question qui ne concerne pas directement une commande, vous pouvez nous
        contacter aux coordonnées indiquées en bas de chaque page du site.
      </p>
    </LegalLayout>
  );
}
