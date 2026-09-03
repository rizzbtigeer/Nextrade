export const BRAND_NAME = 'NexTrade';
export const BRAND_TAGLINE = 'Le prix de gros, direct du stock au revendeur';

// Chemin d'accès au back-office. À définir dans .env (VITE_ADMIN_BASE_PATH) avec
// une valeur difficile à deviner (pas "admin"), pour éviter que le dashboard
// soit trouvé par de simples essais d'URL. Ne JAMAIS remettre "admin" en production.
// Exemple : VITE_ADMIN_BASE_PATH=portail-9k2m7x
export const ADMIN_BASE_PATH = (import.meta.env.VITE_ADMIN_BASE_PATH || 'admin').replace(/^\/+|\/+$/g, '');

// Numéro affiché à titre informatif (le vrai numéro utilisé pour la commande
// vient de WHATSAPP_PHONE_NUMBER côté backend, dans le .env du serveur)
export const WHATSAPP_DISPLAY_NUMBER = '+237 657 505 924';

export const CITIES = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Autre ville'];
