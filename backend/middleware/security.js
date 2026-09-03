// middleware/security.js
const rateLimit = require('express-rate-limit');

// Limite générale : protège toute l'API contre le spam / les bots
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requêtes / IP / 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, merci de réessayer dans quelques minutes.' }
});

// Limite stricte sur la connexion admin : contre le brute-force de mot de passe
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8, // 8 tentatives / IP / 15 min
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' }
});

// Limite sur la création de commande : évite le spam de faux WhatsApp
exports.orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de commandes envoyées. Réessayez un peu plus tard.' }
});
