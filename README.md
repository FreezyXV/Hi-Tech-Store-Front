# Hi-Tech Store - Frontend

This is the frontend for the Hi-Tech Store, a full-stack e-commerce application.

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
    *   Add the following environment variable to connect to the backend API:
        ```
        VITE_API_URL_LOCAL=http://localhost:5002
        ```
4.  **Start the development server**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase.
*   `npm run preview`: Serves the production build locally.

## Project Structure

*   `src/components`: Reusable UI components.
*   `src/pages`: Application pages.
*   `src/features`: Redux slices and state management.
*   `src/services`: API service for communicating with the backend.
*   `src/assets`: Static assets like CSS and images.

## Technologies Used

*   **React**
*   **Vite**
*   **Redux Toolkit**
*   **React Router**
*   **Axios**
*   **Stripe.js**