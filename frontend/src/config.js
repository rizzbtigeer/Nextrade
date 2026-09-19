// ============================================================
// MARQUE
// ============================================================
export const BRAND_NAME = 'NexTrade';
export const BRAND_TAGLINE = 'Le prix de gros, direct du stock au revendeur';

// ============================================================
// URL DE PRODUCTION (canonical, Open Graph, sitemap)
// À définir dans .env : VITE_PRODUCTION_URL=https://nextrade.cm
// ============================================================
export const PRODUCTION_URL = (
  import.meta.env.VITE_PRODUCTION_URL || 'https://nextrade.cm'
).replace(/\/+$/, '');

// ============================================================
// BACK-OFFICE
// Chemin d'accès au back-office. À définir dans .env (VITE_ADMIN_BASE_PATH)
// avec une valeur difficile à deviner (pas "admin"), pour éviter que le
// dashboard soit trouvé par de simples essais d'URL.
// NE JAMAIS remettre "admin" en production.
// Exemple : VITE_ADMIN_BASE_PATH=portail-9k2m7x
// ============================================================
export const ADMIN_BASE_PATH = (
  import.meta.env.VITE_ADMIN_BASE_PATH || 'admin'
).replace(/^\/+|\/+$/g, '');

// ============================================================
// WHATSAPP
// - WHATSAPP_DISPLAY_NUMBER : numéro affiché à titre informatif.
//   Le vrai numéro utilisé pour la commande vient de WHATSAPP_PHONE_NUMBER
//   côté backend, dans le .env du serveur.
// - WHATSAPP_LINK : lien wa.me utilisé pour les CTA "Commander sur WhatsApp".
//   Basé sur le numéro affiché (chiffres uniquement, sans le "+").
// ============================================================
export const WHATSAPP_DISPLAY_NUMBER = '+237657505924';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_DISPLAY_NUMBER.replace(/\D/g, '')}`;

// ============================================================
// CONTACT
// ============================================================
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@nextrade.cm';

// ============================================================
// VILLES DE LIVRAISON
// ============================================================
export const CITIES = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Bamenda',
  'Garoua',
  'Autre ville',
];