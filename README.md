# Hi-Tech Store - Frontend

This is the frontend for the Hi-Tech Store, a full-stack e-commerce application. The frontend is built with React and Vite, and it provides a modern, responsive, and user-friendly interface for shopping for electronic products.


## Table of Contents

*   [About The Project](#about-the-project)
*   [Built With](#built-with)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
    *   [Running the development server](#running-the-development-server)
    *   [Building for production](#building-for-production)
*   [Project Structure](#project-structure)
*   [Environment Variables](#environment-variables)
*   [Deployment](#deployment)
*   [Contributing](#contributing)
*   [License](#license)

## About The Project

The Hi-Tech Store frontend is a single-page application (SPA) that provides a seamless and enjoyable shopping experience. It communicates with the backend API to fetch product data, manage user accounts, and process orders.

### Features

*   **Responsive Design:** The application is fully responsive and works on all devices.
*   **Product Catalog:** Browse products by category, brand, or search.
*   **Product Details:** View detailed information about each product, including specifications, images, and reviews.
*   **Shopping Cart:** Add products to the shopping cart and manage them easily.
*   **Checkout:** Secure checkout process with Stripe integration.
*   **User Accounts:** Users can create accounts, view their order history, and manage their profile.
*   **Wishlist:** Users can add products to a wishlist for future purchase.

## Built With

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Redux Toolkit](https://redux-toolkit.js.org/)
*   [React Router](https://reactrouter.com/)
*   [Axios](https://axios-http.com/)
*   [Stripe.js](https://stripe.com/docs/stripe-js)
*   [Framer Motion](https://www.framer.com/motion/)
*   [React Slick](https://react-slick.neostack.com/)
*   [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

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

*   `src/components`: Reusable UI components.
*   `src/pages`: Application pages.
*   `src/features`: Redux slices and state management.
*   `src/services`: API service for communicating with the backend.
*   `src/assets`: Static assets like CSS and images.
*   `src/store.js`: Redux store configuration.

## Environment Variables

The following environment variables are required:

*   `VITE_API_URL_LOCAL`: The URL of the backend API (e.g., `http://localhost:5002`).
*   `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key.

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
