# NexTrade — Journal des modifications

Ce document résume tout ce qui a été ajouté ou modifié par rapport à la version
précédente du projet, pour que tu puisses t'y retrouver rapidement.

## 1. Pages légales + footer
- Nouveau dossier `frontend/src/pages/legal/` : À propos, Conditions Générales
  d'Utilisation, Politique de confidentialité, Mentions légales.
- `Footer.jsx` mis à jour avec les liens vers ces pages.
- Certains champs (nom légal, adresse, hébergeur...) sont marqués
  `[à compléter]` — à remplir avec les vraies informations du client avant la
  mise en ligne définitive (voir aussi le Guide de mise en production).

## 2. Responsive + performance
- `AdminLayout.jsx` : le menu latéral admin, auparavant toujours visible et
  fixe (cassait l'affichage sur petit écran), a maintenant un menu mobile
  (bouton hamburger) en dessous de la taille "desktop".
- Tableaux admin (`AdminProducts.jsx`, `AdminAdmins.jsx`) : ajout du défilement
  horizontal sur mobile au lieu de couper le contenu.
- `Home.jsx` : la première image du carrousel se charge immédiatement, les
  3 autres sont différées de 200ms (améliore le temps d'affichage perçu).
- `index.html` : préchargement (`<link rel="preload">`) de la première image
  du carrousel.
- Toutes les pages secondaires (légales + admin) sont désormais chargées à la
  demande (`React.lazy`) plutôt qu'au premier chargement du site — le visiteur
  qui vient acheter ne télécharge jamais le code du back-office.
- `vite.config.js` : séparation des grosses dépendances (React, recharts) dans
  des fichiers à part + génération de versions compressées (gzip/brotli) au
  moment du build.
- Vulnérabilités npm connues corrigées (`npm audit fix`) côté backend et
  frontend, dans la mesure du possible sans casser la compatibilité.

## 3. Lien admin sécurisé
- Le chemin `/admin` est remplacé par un chemin configurable
  (`VITE_ADMIN_BASE_PATH` dans `frontend/.env`), à changer avant la mise en
  ligne pour une valeur non devinable.
- Les pages admin portent une balise `noindex` pour ne jamais apparaître dans
  Google.
- L'ancien chemin `/admin` (si différent du chemin configuré) redirige
  simplement vers l'accueil.

## 4. Sécurité générale (backend)
- `helmet`, `compression`, `express-mongo-sanitize` ajoutés.
- CORS restreint à l'URL exacte du site en production (`FRONTEND_URL`).
- Limitation du nombre de requêtes (anti-spam / anti brute-force) sur l'API,
  le login admin, et la création de commandes (`middleware/security.js`).
- Verrouillage temporaire d'un compte admin après 5 échecs de connexion
  (`models/Admin.js`, `controllers/authController.js`).
- Message d'erreur de connexion qui ne révèle pas si le nom d'utilisateur
  existe.

## 5. Graphique du tableau de bord admin
- Nouvel endpoint backend `GET /api/stats/dashboard`
  (`controllers/statsController.js`, `routes/statsRoutes.js`).
- Nouvelle page `frontend/src/pages/admin/AdminDashboard.jsx` (librairie
  `recharts`) : courbe des commandes sur 14 jours, répartition par statut,
  top articles par nombre de clics, chiffres clés.
- C'est maintenant la première page affichée après connexion admin.

## 6. Mise en production
- Voir le fichier séparé **Guide_mise_en_production_NexTrade.docx** : liste
  complète de ce qu'il faut faire pour héberger le site en ligne (base de
  données, hébergement, nom de domaine, variables d'environnement,
  stockage des images, check-list de lancement).

## Points d'attention avant le lancement
- Le mot de passe admin par défaut créé par `backend/seed/seed.js`
  (`admin` / `ChangeMoi123!`) doit être changé immédiatement en production.
- Le stockage des images (dossier `backend/uploads`) doit être migré vers un
  service externe (Cloudinary ou équivalent) avant un hébergement définitif —
  détails dans le guide de mise en production, section 5.
