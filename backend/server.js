require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter, loginLimiter, orderLimiter } = require('./middleware/security');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const statsRoutes = require('./routes/statsRoutes');

connectDB();

const app = express();

// Le serveur est derrière un proxy (Render/Railway/Nginx) en production :
// nécessaire pour que express-rate-limit lise la vraie IP du visiteur.
app.set('trust proxy', 1);

// ===== Sécurité HTTP de base =====
// Content-Security-Policy adaptée : par défaut Helmet bloquerait les polices
// Google Fonts chargées par le frontend et empêcherait le site d'appeler sa
// propre API. On garde toutes les autres protections de Helmet activées.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    },
    // Le back-office étant sur le même domaine que l'API dans la plupart des
    // déploiements simples, on n'active pas crossOriginResourcePolicy strict
    // pour ne pas bloquer l'affichage des images produits par le frontend.
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(compression());

// CORS : en production, seule l'URL exacte du site (FRONTEND_URL) est autorisée.
// En développement, tout est autorisé pour ne pas bloquer le travail local.
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Origine non autorisée par la politique CORS'));
    }
  })
);

app.use(express.json({ limit: '2mb' }));

// Empêche l'injection d'opérateurs MongoDB via le corps des requêtes ($gt, $ne, etc.)
app.use(mongoSanitize());

// Limite générale anti-spam sur toute l'API
app.use('/api', apiLimiter);

// Sert les images uploadées : http://<host>/uploads/<fichier>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth/login', loginLimiter);
app.use('/api/orders/whatsapp', orderLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
