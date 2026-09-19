import React from 'react';
import LegalLayout from './LegalLayout.jsx';
import { BRAND_NAME } from '../../config.js';

export default function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="2026">
      <p>
        Cette page explique quelles informations {BRAND_NAME} collecte lorsque vous utilisez le
        Site, et comment elles sont utilisées.
      </p>

      <h2>1. Données collectées</h2>
      <p>
        Le Site ne demande pas de créer de compte client. Les seules données personnelles
        transmises sont celles que vous partagez volontairement lorsque vous finalisez votre
        commande sur WhatsApp (nom, numéro de téléphone, ville de livraison, et toute information
        utile à la commande que vous choisissez de communiquer).
      </p>
      <p>
        Le Site enregistre également, de façon technique et non identifiante, le contenu des
        commandes préparées (articles, quantités, ville) afin de permettre à {BRAND_NAME} de
        suivre l'activité de la boutique.
      </p>

      <h2>2. Cookies et traceurs</h2>
      <p>
        Le Site utilise uniquement les données nécessaires à son fonctionnement (panier en cours,
        session administrateur). Il n'utilise pas de cookies publicitaires ni de traceurs tiers à
        des fins de suivi commercial.
      </p>

      <h2>3. Utilisation des données</h2>
      <p>
        Les informations transmises via WhatsApp sont utilisées exclusivement pour traiter votre
        commande (confirmation, livraison, paiement) et ne sont ni vendues, ni louées, ni
        partagées avec un tiers à des fins commerciales.
      </p>

      <h2>4. Conservation</h2>
      <p>
        L'historique des commandes est conservé dans le système de {BRAND_NAME} pour le suivi de
        l'activité et la gestion du service après-vente, pour une durée raisonnable et
        proportionnée à cet usage.
      </p>

      <h2>5. Sécurité</h2>
      <p>
        {BRAND_NAME} met en place des mesures techniques raisonnables (connexion sécurisée,
        accès restreint au back-office) pour protéger les informations traitées par le Site.
        Aucune transmission sur internet n'étant totalement exempte de risque, cette sécurité ne
        peut toutefois pas être garantie à 100 %.
      </p>

      <h2>6. Vos droits</h2>
      <p>
        Vous pouvez à tout moment demander à {BRAND_NAME}, via WhatsApp, quelles informations vous
        concernant ont été conservées, ou demander leur suppression, dans la limite de ce qui est
        nécessaire au suivi d'une commande en cours.
      </p>

      <h2>7. Contact</h2>
      <p>
        Pour toute question sur cette politique, contactez {BRAND_NAME} via les coordonnées
        indiquées en bas de page.
      </p>
    </LegalLayout>
  );
}
