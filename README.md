# Site officiel de STELAIR

Site web complet pour l'artiste ivoirien **STELAIR** : vitrine publique (accueil,
biographie, musique, videos, contact/booking) + page d'administration privee pour
tout gerer sans toucher au code (images, videos, musique, textes, reseaux sociaux,
contacts, demandes de collaboration).

## Stack technique

- **Frontend** : React (JavaScript) + Vite + CSS pur (pas de Tailwind/Bootstrap), pensé responsive PC/mobile
- **Backend** : Node.js + Express + MongoDB (Mongoose)
- **Stockage images/videos** : Cloudinary (jamais perdu apres deploiement)
- **Authentification admin** : JWT
- **Hebergement prevu** : Frontend sur Netlify, Backend sur Railway, Base de donnees sur MongoDB Atlas

## Structure du projet

```
stelair-website/
├── backend/         API Express + MongoDB + Cloudinary
└── frontend/        Site React (public + page admin)
```

---

## 1. Installation en local

### Prerequis
- Node.js 18+ installe
- Un compte MongoDB Atlas (gratuit) → recuperez votre chaine de connexion (MONGO_URI)
- Un compte Cloudinary (vous en avez deja un) → recuperez `Cloud Name`, `API Key`, `API Secret` dans le Dashboard

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Ouvrez `.env` et remplissez au minimum :
- `MONGO_URI` (votre base MongoDB Atlas)
- `JWT_SECRET` (n'importe quelle longue chaine aleatoire)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (identifiants de connexion a la page admin)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Puis creez le compte admin et les donnees de depart (biographie, reseaux sociaux, contacts) :

```bash
npm run seed
```

Lancez le serveur :

```bash
npm run dev
```

Vous verrez s'afficher une URL locale (`http://localhost:5000`) et une URL reseau —
utile si vous testez depuis votre telephone sur le meme Wifi.

### Frontend

Dans un **second terminal** :

```bash
cd frontend
npm install
cp .env.example .env
```

Le fichier `.env` par defaut pointe deja vers `http://localhost:5000/api`, rien a
changer en local. Vous pouvez changer `VITE_ADMIN_PATH` pour choisir l'adresse
secrete de votre page admin (par defaut `/backstage`).

Lancez le frontend :

```bash
npm run dev
```

Le terminal affichera deux liens :
- **Local** : `http://localhost:5173` → a utiliser sur votre PC
- **Network** : `http://192.168.x.x:5173` → a ouvrir sur votre telephone (connecte au meme Wifi) pour tester la compatibilite mobile

### Se connecter a la page admin

Ouvrez `http://localhost:5173/backstage/connexion` (ou le chemin que vous avez
choisi dans `VITE_ADMIN_PATH`) et connectez-vous avec l'email/mot de passe defini
dans le `.env` du backend (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

Depuis la page admin vous pouvez ajouter :
- Les **heros** (grandes bannieres image/video) de chaque page
- Les **titres/albums/playlists** (collez simplement le lien Spotify, Deezer ou
  SoundCloud, l'ecoute directe sur le site se configure automatiquement)
- Les **clips YouTube** (collez le lien YouTube, la lecture directe sur le site
  se configure automatiquement)
- Le contenu de la **biographie**
- Les **reseaux sociaux** (Instagram, Facebook, TikTok, X...)
- Les **plateformes de streaming** (Spotify, Apple Music, SoundCloud, Deezer...)
- Les **agents/contacts**
- Consulter les **demandes de collaboration** envoyees via le formulaire public

Un lien discret (le petit point "•" en bas du site, a cote du copyright) mene
vers la page de connexion admin sans etre visible dans le menu principal.

---

## 2. Premier contenu a ajouter (recommande)

1. Allez dans **Heros** → ajoutez au moins une image pour la page "Accueil"
2. Allez dans **Musique** → collez vos liens Spotify (les 3 tracks + les 3 albums que vous avez fournis) et cochez "Mettre en avant" sur votre titre du moment
3. Allez dans **Videos** → collez votre lien YouTube
4. Allez dans **Biographie** → ajoutez votre photo, votre texte est deja pre-rempli via le seed
5. Verifiez **Reseaux sociaux**, **Plateformes** et **Agents** (deja pre-remplis via le seed avec vos liens)

---

## 3. Deploiement en production

### Base de donnees : MongoDB Atlas
Deja fait si vous avez suivi l'etape 1. Assurez-vous d'autoriser l'acces depuis
"Anywhere" (0.0.0.0/0) dans Network Access le temps du deploiement, ou d'ajouter
l'IP de Railway.

### Backend sur Railway
1. Creez un nouveau projet Railway → "Deploy from GitHub repo" (poussez d'abord le
   dossier `backend/` sur un repo GitHub), ou utilisez `railway up` en CLI.
2. Dans l'onglet **Variables** de Railway, ajoutez toutes les variables de votre
   fichier `.env` (MONGO_URI, JWT_SECRET, CLOUDINARY_*, ADMIN_EMAIL, ADMIN_PASSWORD,
   CLIENT_URL = URL Netlify une fois connue, ADMIN_ROUTE_SECRET).
3. Railway detecte automatiquement Node.js et lance `npm start`.
4. Une fois deploye, copiez l'URL Railway (ex: `https://stelair-api.up.railway.app`).
5. Lancez `npm run seed` une fois en production (Railway → onglet "Deployments" →
   ouvrez un shell, ou lancez le script en local en pointant temporairement
   `MONGO_URI` vers la meme base Atlas).

### Frontend sur Netlify
1. Poussez le dossier `frontend/` sur un repo GitHub.
2. Sur Netlify : "Add new site" → "Import an existing project" → connectez le repo.
3. Build command : `npm run build` — Publish directory : `dist` (deja configure
   dans `netlify.toml`).
4. Dans **Site settings → Environment variables**, ajoutez :
   - `VITE_API_URL` = URL de votre backend Railway + `/api` (ex: `https://stelair-api.up.railway.app/api`)
   - `VITE_ADMIN_PATH` = le chemin secret de votre choix
5. Redeployez. Le fichier `_redirects` est deja present pour que toutes les URLs
   (y compris `/backstage`) fonctionnent correctement sur Netlify (obligatoire pour
   les sites React "single page application").
6. Retournez sur Railway et mettez a jour `CLIENT_URL` avec l'URL Netlify finale
   pour que le CORS autorise bien votre site en production.

### Images et videos apres deploiement
Toutes les images/videos passent par Cloudinary des l'upload (jamais stockees sur
Railway ou Netlify qui effacent les fichiers a chaque redeploiement) — donc rien
ne devrait "sauter" apres la mise en ligne. Verifiez simplement que les variables
`CLOUDINARY_*` sont bien renseignees sur Railway.

---

## 4. Notes techniques importantes

- **Collage de liens intelligent** : pour la musique et les videos, il suffit de
  coller le lien "normal" copie depuis l'app Spotify/YouTube/Deezer/SoundCloud.
  Le site convertit automatiquement ce lien en lecteur integre (voir
  `frontend/src/utils/embedHelpers.js`).
- **Suppression propre des images** : quand vous remplacez ou supprimez une image
  depuis l'admin, l'ancienne version est automatiquement supprimee de Cloudinary
  pour ne pas gaspiller d'espace de stockage.
- **Securite** : les mots de passe admin sont hashes (bcrypt), les routes de
  modification sont protegees par JWT, et un anti-spam (rate limiting) protege le
  formulaire de connexion et le formulaire public de collaboration.
- **Formulaire de collaboration** : chaque soumission est stockee en base et
  visible dans l'admin (onglet "Demandes de collab"), avec un statut a mettre a
  jour (nouveau / en cours / traite / archive).
