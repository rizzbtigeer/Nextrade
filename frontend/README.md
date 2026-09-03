# Frontend — Gros237 (React + Tailwind)

Site vitrine + panier + back-office admin pour un site de vente en gros, avec commande finalisée sur WhatsApp.

## 1. Installer

```bash
cd frontend
npm install
cp .env.example .env
```

Dans `.env`, vérifie que `VITE_API_URL` pointe vers ton backend (par défaut `http://localhost:5000/api`).

## 2. Lancer en développement

Assure-toi que le **backend tourne déjà** (`npm run dev` dans le dossier `backend`), puis :

```bash
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`.

## 3. Se connecter à l'admin

Va sur `http://localhost:5173/admin/login` avec le compte créé par `npm run seed` côté backend :
- `username: admin`
- `password: ChangeMoi123!`

Depuis l'admin tu peux : créer des catégories, ajouter des articles avec leurs paliers de prix et images (URL), et suivre les commandes reçues.

## 4. Ce qui est inclus

**Front-office (public)**
- Accueil : hero, catégories, articles en avant, explication du parcours
- Catalogue : filtre par catégorie, recherche, pagination
- Fiche produit : galerie, table des paliers de prix avec palier actif mis en évidence, sélecteur de quantité, calcul du total en direct
- Panier : quantités modifiables, total recalculé, ville de livraison, bouton **"Commander sur WhatsApp"** qui envoie le panier au backend (qui revérifie les prix) et ouvre WhatsApp avec le message pré-rempli

**Back-office (admin, protégé par connexion)**
- Gestion des articles (créer/modifier/supprimer, paliers de prix dynamiques, stock, MOQ, visibilité)
- Gestion des catégories (ajout facile de nouvelles catégories, ex: Chaussures, Montres)
- Historique des commandes avec changement de statut (en attente / confirmée / annulée)

## 5. Identité visuelle

- **Couleurs** : orange marché de gros (`#D9480F`) comme accent principal, bleu nuit (`#0F1B2D`) pour les zones sombres/texte, or (`#F5A623`) pour les mises en avant, vert WhatsApp (`#22C55E`) pour les actions de commande.
- **Typographie** : Poppins pour les titres, Inter pour le texte courant.
- **Élément signature** : "l'échelle de prix" — une visualisation compacte des paliers de gros, présente sur chaque carte produit et détaillée sur la fiche produit, pour rendre immédiatement visible l'argument central d'un site de gros (plus on achète, moins c'est cher).

## 6. Upload de photos

Dans le formulaire d'article (admin), tu peux maintenant glisser-déposer ou cliquer pour envoyer
des photos directement depuis ton téléphone/ordinateur (jpeg, png, webp, gif — 5 Mo max, 6 photos
max par article). Les fichiers sont envoyés au backend, stockés sur le serveur, et prévisualisés
immédiatement avec un bouton pour les retirer.

## 7. Build pour la mise en ligne

```bash
npm run build
```

Génère le dossier `dist/` à déployer (ex: Netlify, Vercel, ou dans le même hébergement que le backend).
