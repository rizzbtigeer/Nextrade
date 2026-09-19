import React from 'react';
import LegalLayout from './LegalLayout.jsx';
import { BRAND_NAME } from '../../config.js';

export default function ConditionsUtilisation() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation et de Vente" updated="2026">
      <p>
        Les présentes conditions régissent l'utilisation du site {BRAND_NAME} (ci-après « le
        Site ») ainsi que le processus de commande qui y est proposé. En utilisant ce Site, vous
        acceptez les conditions décrites ci-dessous.
      </p>

      <h2>1. Objet du site</h2>
      <p>
        Le Site permet de consulter un catalogue d'articles vendus au prix de gros et de préparer
        une commande (choix des articles et des quantités). <strong>Le Site ne traite aucun
        paiement en ligne.</strong> Une fois la commande préparée, l'utilisateur est redirigé vers
        l'application WhatsApp pour finaliser la commande directement avec {BRAND_NAME}.
      </p>

      <h2>2. Nature non contractuelle du panier</h2>
      <p>
        Le récapitulatif généré sur le Site (articles, quantités, prix total) est une base de
        discussion et ne constitue pas une vente conclue. La commande n'est confirmée qu'après
        échange et accord explicite entre l'acheteur et {BRAND_NAME} sur WhatsApp, notamment
        concernant la disponibilité réelle du stock, les frais et délais de livraison, et les
        modalités de paiement.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix affichés sur le Site sont exprimés en Francs CFA (FCFA) et s'entendent hors frais
        de livraison, sauf mention contraire. Ils varient selon la quantité commandée (tarifs
        dégressifs). {BRAND_NAME} se réserve le droit de modifier ses prix à tout moment ; le prix
        applicable est celui confirmé au moment de l'échange WhatsApp.
      </p>

      <h2>4. Paiement et livraison</h2>
      <p>
        Le paiement s'effectue exclusivement en dehors du Site, selon les modalités convenues avec
        {` ${BRAND_NAME}`} sur WhatsApp (Mobile Money, Orange Money, espèces à la livraison, ou
        autre moyen proposé). Les délais et frais de livraison dépendent de la ville de livraison
        et sont communiqués avant confirmation de la commande.
      </p>

      <h2>5. Disponibilité des articles</h2>
      <p>
        Les stocks affichés sur le Site peuvent ne pas refléter la disponibilité en temps réel.
        {` ${BRAND_NAME}`} s'efforce de tenir le catalogue à jour mais ne peut garantir la
        disponibilité d'un article tant que la commande n'a pas été confirmée sur WhatsApp.
      </p>

      <h2>6. Utilisation autorisée du site</h2>
      <p>
        Vous vous engagez à utiliser le Site de bonne foi et à ne pas tenter d'en perturber le
        fonctionnement (tentative d'intrusion, extraction automatisée du catalogue, envoi de
        commandes abusives ou frauduleuses, etc.).
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        {BRAND_NAME} met tout en œuvre pour assurer l'exactitude des informations publiées sur le
        Site, mais ne saurait être tenu responsable d'erreurs ponctuelles (photo, description,
        prix) corrigées dès qu'elles sont constatées.
      </p>

      <h2>8. Modification des conditions</h2>
      <p>
        {BRAND_NAME} peut modifier les présentes conditions à tout moment. La version en vigueur
        est celle publiée sur cette page à la date de votre commande.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question relative à ces conditions, contactez {BRAND_NAME} via les coordonnées
        indiquées en bas de page.
      </p>
    </LegalLayout>
  );
}
