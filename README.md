# Hi-Tech Store - Frontend

This is the frontend for the Hi-Tech Store, a full-stack e-commerce application. The frontend is built with React and Vite, and it provides a modern, responsive, and user-friendly interface for shopping for electronic products.


## Table of Contents

*   [About The Project](#about-the-project)
*   [Built With](#built-with)
*   [Architecture](#architecture)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
    *   [Running the development server](#running-the-development-server)
    *   [Building for production](#building-for-production)
*   [Project Structure](#project-structure)
*   [Key Features](#key-features)
*   [Environment Variables](#environment-variables)
*   [Deployment](#deployment)
*   [Contributing](#contributing)
*   [License](#license)

## About The Project

The Hi-Tech Store frontend is a single-page application (SPA) that provides a seamless and enjoyable shopping experience. It communicates with the backend API to fetch product data, manage user accounts, and process orders.

### Features

*   **Responsive Design:** Fully responsive application that works seamlessly on all devices (mobile, tablet, desktop).
*   **Product Catalog:** Browse products by category, brand, or use the powerful search functionality.
*   **Product Details:** View detailed information about each product, including specifications, images, reviews, and ratings.
*   **Shopping Cart:** Add products to cart, update quantities, remove items, and view real-time cart totals.
*   **Wishlist:** Users can add/remove products to a wishlist for future purchase.
*   **Checkout:** Secure checkout process with Stripe Payment Intents integration.
*   **User Accounts:** Complete account management - register, login, view order history, update profile, change password.
*   **Product Reviews:** Users can read and write reviews with ratings for products they've purchased.
*   **Smart API Client:** Axios interceptors with automatic retry logic (2 retries, 15s timeout) and error handling.
*   **State Management:** Redux Toolkit with normalized state using `createEntityAdapter` for optimal performance.
*   **Error Boundaries:** React error boundaries to gracefully handle component errors.
*   **Loading States:** Skeleton loaders and loading indicators for better UX.
*   **Toast Notifications:** Real-time user feedback with React Toastify.
*   **Animations:** Smooth transitions and animations using Framer Motion.

## Built With

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://reactjs.org/) | 18.3.1 | UI library |
| [Vite](https://vitejs.dev/) | 5.3.4 | Build tool and dev server |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.2.7 | State management |
| [React Router](https://reactrouter.com/) | 6.26.0 | Client-side routing |
| [Axios](https://axios-http.com/) | 1.7.3 | HTTP client with interceptors |
| [Stripe.js](https://stripe.com/docs/stripe-js) | Latest | Payment processing |
| [Framer Motion](https://www.framer.com/motion/) | 11.3.24 | Animations |
| [React Slick](https://react-slick.neostack.com/) | 0.30.2 | Carousels |
| [React Toastify](https://fkhadra.github.io/react-toastify/introduction) | 10.0.5 | Notifications |
| [React Icons](https://react-icons.github.io/react-icons/) | 5.2.1 | Icon library |

## Architecture

The frontend follows a feature-based architecture with Redux Toolkit for state management:

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
│              (React Components - 16)                 │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                  Pages (14)                          │
│  Home, ProductList, ProductDetails, Cart, Checkout,  │
│  Login, Register, Profile, Orders, Wishlist, etc.    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            Redux Store (8 slices)                    │
│  • authSlice (login, register, profile)              │
│  • cartSlice (CRUD operations)                       │
│  • wishlistSlice (add/remove)                        │
│  • productsSlice (normalized with entityAdapter)     │
│  • categoriesSlice (normalized)                      │
│  • brandsSlice (normalized)                          │
│  • ordersSlice (create, fetch)                       │
│  • reviewsSlice (CRUD operations)                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              API Service Layer                       │
│  • Axios instance with base URL                      │
│  • Request interceptor (adds JWT token)              │
│  • Response interceptor (error handling, retry)      │
│  • Smart retry logic (2 retries, 15s timeout)        │
│  • 30+ API endpoint functions                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                 Backend API                          │
│              (http://localhost:5002)                 │
└─────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Redux Toolkit with Entity Adapters**: Uses `createEntityAdapter` for normalized state management of products, categories, and brands.
2. **Smart Retry Logic**: Axios interceptors automatically retry failed requests (2 times with 15s timeout) to handle transient network errors.
3. **JWT Token Management**: Tokens are stored in localStorage and automatically attached to requests via Axios interceptors.
4. **Error Boundaries**: React error boundaries catch component errors and display fallback UI.
5. **Code Splitting**: React.lazy() and Suspense for route-based code splitting to optimize bundle size.
6. **Centralized API Service**: All API calls go through a single Axios instance with consistent error handling.
7. **Protected Routes**: Custom route guards to protect authenticated pages.

## Getting Started

To get the frontend development server up and running, follow these steps.

### Prerequisites

*   Node.js and npm

### Installation

1.  **Navigate to the `FrontNew` directory**
    ```sh
    cd FrontNew
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**
    *   Create a `.env` file in the `FrontNew` directory.
    *   Add the environment variables listed in the [Environment Variables](#environment-variables) section.

## Usage

### Running the development server

```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for production

```sh
npm run build
```

This will build the application for production in the `dist` directory.

## Project Structure

```
FrontNew/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (16)
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
│   │   └── ... (4 more)
│   ├── pages/           # Application pages (14)
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
│   ├── features/        # Redux slices (8)
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
│   ├── services/        # API service layer
│   │   └── api.js       # Axios instance + 30+ endpoints
│   ├── assets/          # Static assets (CSS, images)
│   ├── utils/           # Utility functions
│   ├── store.js         # Redux store configuration
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── package.json
├── vite.config.js       # Vite configuration
└── vercel.json          # Vercel deployment config
```

## Key Features

### API Service (`src/services/api.js`)
The application uses a centralized Axios instance with smart retry logic:

- **Request Interceptor**: Automatically adds JWT token to all authenticated requests
- **Response Interceptor**: Handles errors and implements retry logic
- **Retry Logic**: 2 automatic retries with 15-second timeout
- **30+ API Endpoints**: Complete coverage of all backend endpoints

### Redux Store (`src/store.js`)
State management with Redux Toolkit includes:

- **8 Feature Slices**: Organized by domain (auth, cart, wishlist, products, etc.)
- **Entity Adapters**: Normalized state for products, categories, and brands
- **Async Thunks**: For all API operations with loading/error states
- **Persistent Cart**: Cart state persists across sessions

### Component Architecture
- **16 Reusable Components**: DRY principle with shared components
- **14 Pages**: Complete user journey from browsing to checkout
- **Error Boundaries**: Graceful error handling at component level
- **Protected Routes**: Authentication guards for secure pages

## Environment Variables

The following environment variables are required:

*   `VITE_API_URL_LOCAL` - Local backend API URL (default: `http://localhost:5002`)
*   `VITE_API_URL_PROD` - Production backend API URL (Vercel deployment)
*   `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key

### Example `.env` file:

```env
VITE_API_URL_LOCAL=http://localhost:5002
VITE_API_URL_PROD=https://your-backend.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

The application automatically uses the appropriate API URL based on the environment (development vs production).

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration for deploying the application. You can also deploy to GitHub Pages using the `deploy:gh-pages` script.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the ISC License. See `LICENSE` for more information.
