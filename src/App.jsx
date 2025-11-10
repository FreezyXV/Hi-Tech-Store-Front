import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import "./assets/theme.css";

const Home = lazy(() => import("./pages/Home"));
const Category = lazy(() => import("./pages/Category"));
const Brand = lazy(() => import("./pages/Brand"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Account = lazy(() => import("./pages/Account"));
const Cart = lazy(() => import("./components/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const SearchBarResults = lazy(() => import("./pages/SearchBarResults"));
const AllModelsPage = lazy(() => import("./components/AllModelsPage"));
const OrderSummaryAndPayment = lazy(() =>
  import("./components/OrderSummaryAndPayment")
);
const OrderConfirmation = lazy(() => import("./components/OrderConfirmation"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));

const App = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.elements.searchInput.value.trim();
    if (searchQuery) {
      setKeyword(searchQuery);
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />

      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:categoryId" element={<Category />} />
            <Route
              path="/products/:categoryId/brands/:brandId"
              element={<Brand />}
            />
            <Route
              path="/products/:categoryId/brands/:brandId/models/:modelId"
              element={<ProductPage />}
            />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/search"
              element={<SearchBarResults keyword={keyword} />}
            />
            <Route
              path="/products/:categoryId/all-models"
              element={<AllModelsPage />}
            />
            <Route path="/order-summary" element={<OrderSummaryAndPayment />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <ToastContainer autoClose={3000} position="top-right" />
    </>
  );
};

export default App;
