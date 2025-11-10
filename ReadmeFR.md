# Hi-Tech Store - Frontend

Ceci est le frontend pour Hi-Tech Store, une application e-commerce full-stack. Le frontend est construit avec React et Vite, et il fournit une interface moderne, réactive et conviviale pour acheter des produits électroniques.


## Table des Matières

*   [À Propos du Projet](#à-propos-du-projet)
*   [Construit Avec](#construit-avec)
*   [Architecture](#architecture)
*   [Démarrage](#démarrage)
    *   [Prérequis](#prérequis)
    *   [Installation](#installation)
*   [Utilisation](#utilisation)
    *   [Exécution du serveur de développement](#exécution-du-serveur-de-développement)
    *   [Construction pour la production](#construction-pour-la-production)
*   [Structure du Projet](#structure-du-projet)
*   [Fonctionnalités Clés](#fonctionnalités-clés)
*   [Variables d'Environnement](#variables-denvironnement)
*   [Déploiement](#déploiement)
*   [Contribution](#contribution)
*   [Licence](#licence)

## À Propos du Projet

Le frontend de Hi-Tech Store est une application monopage (SPA) qui offre une expérience d'achat fluide et agréable. Il communique avec l'API backend pour récupérer les données des produits, gérer les comptes utilisateurs et traiter les commandes.

### Fonctionnalités

*   **Design Réactif :** Application entièrement réactive qui fonctionne de manière transparente sur tous les appareils (mobile, tablette, desktop).
*   **Catalogue de Produits :** Parcourez les produits par catégorie, marque ou utilisez la puissante fonctionnalité de recherche.
*   **Détails des Produits :** Consultez des informations détaillées sur chaque produit, y compris les spécifications, images, avis et notes.
*   **Panier d'Achat :** Ajoutez des produits au panier, mettez à jour les quantités, supprimez des articles et consultez les totaux du panier en temps réel.
*   **Liste de Souhaits :** Les utilisateurs peuvent ajouter/supprimer des produits dans une liste de souhaits pour un achat futur.
*   **Paiement :** Processus de paiement sécurisé avec intégration Stripe Payment Intents.
*   **Comptes Utilisateurs :** Gestion complète des comptes - inscription, connexion, consultation de l'historique des commandes, mise à jour du profil, changement de mot de passe.
*   **Avis sur les Produits :** Les utilisateurs peuvent lire et rédiger des avis avec des notes pour les produits qu'ils ont achetés.
*   **Client API Intelligent :** Intercepteurs Axios avec logique de réessai automatique (2 réessais, timeout de 15s) et gestion des erreurs.
*   **Gestion d'État :** Redux Toolkit avec état normalisé utilisant `createEntityAdapter` pour des performances optimales.
*   **Limites d'Erreur :** React error boundaries pour gérer gracieusement les erreurs de composants.
*   **États de Chargement :** Chargeurs squelettes et indicateurs de chargement pour une meilleure UX.
*   **Notifications Toast :** Retour utilisateur en temps réel avec React Toastify.
*   **Animations :** Transitions et animations fluides utilisant Framer Motion.

## Construit Avec

| Technologie | Version | Objectif |
|-----------|---------|----------|
| [React](https://reactjs.org/) | 18.3.1 | Bibliothèque UI |
| [Vite](https://vitejs.dev/) | 5.3.4 | Outil de build et serveur de dev |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.2.7 | Gestion d'état |
| [React Router](https://reactrouter.com/) | 6.26.0 | Routage côté client |
| [Axios](https://axios-http.com/) | 1.7.3 | Client HTTP avec intercepteurs |
| [Stripe.js](https://stripe.com/docs/stripe-js) | Latest | Traitement des paiements |
| [Framer Motion](https://www.framer.com/motion/) | 11.3.24 | Animations |
| [React Slick](https://react-slick.neostack.com/) | 0.30.2 | Carrousels |
| [React Toastify](https://fkhadra.github.io/react-toastify/introduction) | 10.0.5 | Notifications |
| [React Icons](https://react-icons.github.io/react-icons/) | 5.2.1 | Bibliothèque d'icônes |

## Architecture

Le frontend suit une architecture basée sur les fonctionnalités avec Redux Toolkit pour la gestion d'état :

```
┌─────────────────────────────────────────────────────┐
│              Interface Utilisateur                   │
│            (Composants React - 16)                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                    Pages (14)                        │
│  Home, ProductList, ProductDetails, Cart, Checkout,  │
│  Login, Register, Profile, Orders, Wishlist, etc.    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Store Redux (8 slices)                  │
│  • authSlice (login, register, profile)              │
│  • cartSlice (opérations CRUD)                       │
│  • wishlistSlice (ajouter/supprimer)                 │
│  • productsSlice (normalisé avec entityAdapter)      │
│  • categoriesSlice (normalisé)                       │
│  • brandsSlice (normalisé)                           │
│  • ordersSlice (créer, récupérer)                    │
│  • reviewsSlice (opérations CRUD)                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            Couche Service API                        │
│  • Instance Axios avec URL de base                   │
│  • Intercepteur de requête (ajoute token JWT)        │
│  • Intercepteur de réponse (gestion erreurs, retry)  │
│  • Logique de réessai intelligente (2 tentatives,    │
│    timeout 15s)                                      │
│  • Plus de 30 fonctions d'endpoints API              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                   API Backend                        │
│              (http://localhost:5002)                 │
└─────────────────────────────────────────────────────┘
```

### Décisions Architecturales Clés

1. **Redux Toolkit avec Entity Adapters** : Utilise `createEntityAdapter` pour la gestion d'état normalisée des produits, catégories et marques.
2. **Logique de Réessai Intelligente** : Les intercepteurs Axios réessaient automatiquement les requêtes échouées (2 fois avec timeout de 15s) pour gérer les erreurs réseau transitoires.
3. **Gestion des Tokens JWT** : Les tokens sont stockés dans localStorage et automatiquement attachés aux requêtes via les intercepteurs Axios.
4. **Limites d'Erreur** : Les React error boundaries capturent les erreurs de composants et affichent une UI de secours.
5. **Division du Code** : React.lazy() et Suspense pour la division du code basée sur les routes pour optimiser la taille du bundle.
6. **Service API Centralisé** : Tous les appels API passent par une seule instance Axios avec gestion cohérente des erreurs.
7. **Routes Protégées** : Gardes de routes personnalisées pour protéger les pages authentifiées.

## Démarrage

Pour faire fonctionner le serveur de développement frontend, suivez ces étapes.

### Prérequis

*   Node.js et npm

### Installation

1.  **Naviguer vers le répertoire `FrontNew`**
    ```sh
    cd FrontNew
    ```
2.  **Installer les packages NPM**
    ```sh
    npm install
    ```
3.  **Configurer les variables d'environnement**
    *   Créer un fichier `.env` dans le répertoire `FrontNew`.
    *   Ajouter les variables d'environnement listées dans la section [Variables d'Environnement](#variables-denvironnement).

## Utilisation

### Exécution du serveur de développement

```sh
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

### Construction pour la production

```sh
npm run build
```

Cela construira l'application pour la production dans le répertoire `dist`.

## Structure du Projet

```
FrontNew/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants UI réutilisables (16)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── WishlistButton.jsx
│   │   ├── ReviewForm.jsx
│   │   ├── ReviewList.jsx
│   │   ├── SearchBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ... (4 de plus)
│   ├── pages/           # Pages de l'application (14)
│   │   ├── Home.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Orders.jsx
│   │   ├── Wishlist.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── BrandPage.jsx
│   │   └── SearchResults.jsx
│   ├── features/        # Slices Redux (8)
│   │   ├── auth/
│   │   │   └── authSlice.js
│   │   ├── cart/
│   │   │   └── cartSlice.js
│   │   ├── wishlist/
│   │   │   └── wishlistSlice.js
│   │   ├── products/
│   │   │   └── productsSlice.js
│   │   ├── categories/
│   │   │   └── categoriesSlice.js
│   │   ├── brands/
│   │   │   └── brandsSlice.js
│   │   ├── orders/
│   │   │   └── ordersSlice.js
│   │   └── reviews/
│   │       └── reviewsSlice.js
│   ├── services/        # Couche service API
│   │   └── api.js       # Instance Axios + plus de 30 endpoints
│   ├── assets/          # Assets statiques (CSS, images)
│   ├── utils/           # Fonctions utilitaires
│   ├── store.js         # Configuration du store Redux
│   ├── App.jsx          # Composant principal de l'app
│   └── main.jsx         # Point d'entrée de l'application
├── .env                 # Variables d'environnement
├── package.json
├── vite.config.js       # Configuration Vite
└── vercel.json          # Configuration de déploiement Vercel
```

## Fonctionnalités Clés

### Service API (`src/services/api.js`)
L'application utilise une instance Axios centralisée avec logique de réessai intelligente :

- **Intercepteur de Requête** : Ajoute automatiquement le token JWT à toutes les requêtes authentifiées
- **Intercepteur de Réponse** : Gère les erreurs et implémente la logique de réessai
- **Logique de Réessai** : 2 réessais automatiques avec timeout de 15 secondes
- **Plus de 30 Endpoints API** : Couverture complète de tous les endpoints backend

### Store Redux (`src/store.js`)
La gestion d'état avec Redux Toolkit inclut :

- **8 Slices de Fonctionnalités** : Organisés par domaine (auth, cart, wishlist, products, etc.)
- **Entity Adapters** : État normalisé pour les produits, catégories et marques
- **Async Thunks** : Pour toutes les opérations API avec états de chargement/erreur
- **Panier Persistant** : L'état du panier persiste entre les sessions

### Architecture des Composants
- **16 Composants Réutilisables** : Principe DRY avec composants partagés
- **14 Pages** : Parcours utilisateur complet de la navigation au paiement
- **Limites d'Erreur** : Gestion gracieuse des erreurs au niveau des composants
- **Routes Protégées** : Gardes d'authentification pour les pages sécurisées

## Variables d'Environnement

Les variables d'environnement suivantes sont requises :

*   `VITE_API_URL_LOCAL` - URL de l'API backend locale (par défaut : `http://localhost:5002`)
*   `VITE_API_URL_PROD` - URL de l'API backend en production (déploiement Vercel)
*   `VITE_STRIPE_PUBLIC_KEY` - Votre clé publique Stripe

### Exemple de fichier `.env` :

```env
VITE_API_URL_LOCAL=http://localhost:5002
VITE_API_URL_PROD=https://votre-backend.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
```

L'application utilise automatiquement l'URL API appropriée en fonction de l'environnement (développement vs production).

## Déploiement

L'application est configurée pour le déploiement sur Vercel. Le fichier `vercel.json` contient la configuration nécessaire pour déployer l'application. Vous pouvez également déployer sur GitHub Pages en utilisant le script `deploy:gh-pages`.

## Contribution

Les contributions sont ce qui fait de la communauté open source un endroit incroyable pour apprendre, inspirer et créer. Toutes les contributions que vous apportez sont **grandement appréciées**.

1.  Fork le Projet
2.  Créez votre Branche de Fonctionnalité (`git checkout -b feature/FonctionnaliteIncroyable`)
3.  Committez vos Changements (`git commit -m 'Ajouter une FonctionnaliteIncroyable'`)
4.  Poussez vers la Branche (`git push origin feature/FonctionnaliteIncroyable`)
5.  Ouvrez une Pull Request

## Licence

Distribué sous la licence ISC. Voir `LICENSE` pour plus d'informations.
