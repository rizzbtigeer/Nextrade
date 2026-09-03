# Backend — Site de vente en gros (style Alibaba)

API Node.js / Express / MongoDB pour un site e-commerce B2B avec commande envoyée via WhatsApp.

## 1. Créer la base de données sur MongoDB Atlas (gratuit)

1. Va sur https://www.mongodb.com/cloud/atlas/register et crée un compte gratuit.
2. Une fois connecté, clique sur **"Build a Database"** → choisis l'offre **gratuite (M0)**.
3. Choisis une région proche (ex: Europe/Frankfurt ou Paris) → **Create**.
4. **Créer un utilisateur de base de données** :
   - Username : ex `grosmarket_admin`
   - Password : clique sur "Autogenerate" et **copie-le immédiatement** (tu ne le reverras plus).
5. **Network Access** (accès réseau) :
   - Ajoute `0.0.0.0/0` (autoriser depuis n'importe où) pour commencer — tu pourras restreindre plus tard.
6. Une fois le cluster créé, clique sur **"Connect"** → **"Drivers"** → copie l'URI de connexion, qui ressemble à :
   ```
   mongodb+srv://grosmarket_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Remplace `<password>` par le mot de passe copié à l'étape 4, et ajoute le nom de la base après `.net/` :
   ```
   mongodb+srv://grosmarket_admin:TonMotDePasse@cluster0.xxxxx.mongodb.net/gros-market?retryWrites=true&w=majority
   ```

## 2. Installer Node.js

Si ce n'est pas déjà fait : https://nodejs.org (version LTS conseillée). Vérifie avec :
```bash
node -v
npm -v
```

## 3. Configurer le projet

```bash
cd backend
npm install
cp .env.example .env
```

Ouvre le fichier `.env` et remplis :
- `MONGO_URI` → l'URI copiée à l'étape 1.7
- `JWT_SECRET` → une longue chaîne aléatoire (ex: génère avec `openssl rand -hex 32`)
- `WHATSAPP_PHONE_NUMBER` → ton numéro WhatsApp business, **format international sans le +** (ex: `237600000000` pour le Cameroun)

## 4. Créer le premier compte admin + un produit d'exemple

```bash
npm run seed
```

Cela crée :
- Un admin : `username: admin` / `password: ChangeMoi123!` (⚠️ à changer après ta première connexion)
- Une catégorie "Habits"
- Un produit d'exemple avec prix dégressifs

## 5. Démarrer le serveur

```bash
npm run dev
```

Le serveur tourne sur `http://localhost:5000`. Teste avec :
```bash
curl http://localhost:5000/api/health
```

## 6. Aperçu des routes de l'API

### Publiques (front-office)
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Liste des catégories |
| GET | `/api/products?category=&search=&page=&limit=` | Catalogue avec filtres |
| GET | `/api/products/:slug` | Fiche produit |
| POST | `/api/products/:id/click` | Enregistre un clic (stats) |
| POST | `/api/orders/whatsapp` | Envoie le panier, reçoit le message + lien WhatsApp |

### Admin (nécessitent un token JWT, header `Authorization: Bearer <token>`)
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Connexion admin |
| POST | `/api/auth/create-admin` | Créer un autre compte admin |
| POST/PUT/DELETE | `/api/categories` | Gérer les catégories |
| GET | `/api/products/admin/all` | Voir tous les produits (même indisponibles) |
| POST/PUT/DELETE | `/api/products` | Gérer les produits |
| POST | `/api/upload/image` | Upload d'une image (champ `image`), retourne `{ url }` |
| POST | `/api/upload/images` | Upload de plusieurs images (champ `images`, max 6), retourne `{ urls }` |
| GET | `/api/orders` | Historique des commandes |
| PUT | `/api/orders/:id/status` | Changer le statut d'une commande |

### Upload d'images

Les images sont stockées dans `backend/uploads/` et servies statiquement sur
`http://<host>:<port>/uploads/<fichier>`. Formats acceptés : jpeg, png, webp, gif — 5 Mo max par image.

Exemple avec curl (remplace `<TOKEN>` par le token admin) :
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer <TOKEN>" \
  -F "image=@/chemin/vers/photo.jpg"
```

**Important pour la mise en ligne** : le dossier `uploads/` doit être sur un disque persistant
(cela fonctionne bien sur un VPS classique ou un hébergement avec stockage permanent). Sur une
plateforme sans disque persistant (ex: certains hébergeurs serverless), les fichiers uploadés
seraient perdus au redémarrage — dans ce cas il faudrait basculer vers un stockage cloud comme
Cloudinary ou AWS S3. Pour ton usage (VPS + nom de domaine classique, comme prévu dans le cahier
des charges), le stockage sur disque local est suffisant.

## 7. Exemple d'utilisation — panier vers WhatsApp

Requête `POST /api/orders/whatsapp` :
```json
{
  "items": [
    { "productId": "665fa1...", "qty": 12 },
    { "productId": "665fa2...", "qty": 30 }
  ],
  "city": "Douala"
}
```

Réponse :
```json
{
  "order": { "...": "..." },
  "whatsappMessage": "Bonjour, je suis un revendeur. Je souhaite passer une commande en GROS :\n- Riz 50kg x 12 = 396 000 FCFA\n- Huile 5L x 30 = 210 000 FCFA\nTotal commande : 606 000 FCFA. Merci de me confirmer la disponibilité et les frais de livraison pour Douala.",
  "whatsappLink": "https://wa.me/237600000000?text=..."
}
```

Le front n'a qu'à faire `window.location.href = whatsappLink` (ou l'ouvrir dans un nouvel onglet) pour rediriger le client vers WhatsApp avec le message pré-rempli — exactement comme dans le cahier des charges.

**Important** : les prix sont **recalculés côté serveur** à partir des paliers de prix enregistrés en base — le prix affiché par le client dans son navigateur n'est jamais fait confiance, ce qui évite toute manipulation du panier.

## 8. Structure du projet

```
backend/
├── config/db.js              # Connexion MongoDB
├── models/                   # Product, Category, Admin, Order
├── controllers/               # Logique métier
├── routes/                    # Définition des endpoints
├── middleware/                # Auth JWT, gestion des erreurs
├── utils/                     # slugify, génération du message WhatsApp, JWT
├── seed/seed.js                # Données de démarrage
└── server.js                   # Point d'entrée
```

## Prochaine étape

Une fois que tu as testé cette API (avec Postman/Insomnia ou directement depuis le futur frontend), on passera au **frontend React** : catalogue façon Alibaba, fiche produit avec sélecteur de quantité et prix dégressif affiché en direct, panier, et bouton "Commander" qui déclenche la redirection WhatsApp.
