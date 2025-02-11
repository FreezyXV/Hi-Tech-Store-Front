// // src/App.jsx
// import React, { useState, Suspense, lazy } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Loader from "./components/Loader";

// const Home = lazy(() => import("./pages/Home"));
// const Category = lazy(() => import("./pages/Category"));
// const Brand = lazy(() => import("./pages/Brand"));
// const ProductPage = lazy(() => import("./pages/ProductPage"));
// const Account = lazy(() => import("./pages/Account"));
// const Cart = lazy(() => import("./components/Cart"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const SearchBarResults = lazy(() => import("./pages/SearchBarResults"));
// const AllModelsPage = lazy(() => import("./components/AllModelsPage"));
// const OrderSummaryAndPayment = lazy(() =>
//   import("./components/OrderSummaryAndPayment")
// );
// const OrderConfirmation = lazy(() => import("./components/OrderConfirmation"));
// const WishlistPage = lazy(() => import("./components/WishlistPage"));

// const FallbackLoader = () => <Loader />;

// const ErrorBoundary = ({ children }) => {
//   return <Suspense fallback={<FallbackLoader />}>{children}</Suspense>;
// };

// const App = () => {
//   const [keyword, setKeyword] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const searchQuery = e.target.elements.searchInput.value.trim();
//     if (searchQuery) {
//       setKeyword(searchQuery);
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   return (
//     <>
//       <Navbar onSearch={handleSearch} />

//       <ErrorBoundary>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/products/:categoryId" element={<Category />} />
//           <Route
//             path="/products/:categoryId/brands/:brandId"
//             element={<Brand />}
//           />
//           <Route
//             path="/products/:categoryId/brands/:brandId/models/:modelId"
//             element={<ProductPage />}
//           />
//           <Route path="/account" element={<Account />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/search"
//             element={<SearchBarResults keyword={keyword} />}
//           />
//           <Route
//             path="/products/:categoryId/all-models"
//             element={<AllModelsPage />}
//           />
//           <Route path="/order-summary" element={<OrderSummaryAndPayment />} />
//           <Route
//             path="/order-confirmation/:orderId"
//             element={<OrderConfirmation />}
//           />
//           <Route path="/wishlist" element={<WishlistPage />} />
//         </Routes>
//       </ErrorBoundary>

//       <ToastContainer autoClose={3000} position="top-right" />
//     </>
//   );
// };

// export default App;



// src/App.jsx
import React, { useState, Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCategoriesAsync } from "./features/categoriesSlice";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const Category = lazy(() => import("./pages/Category"));
const Brand = lazy(() => import("./pages/Brand"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Account = lazy(() => import("./pages/Account"));
const Cart = lazy(() => import("./components/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SearchBarResults = lazy(() => import("./pages/SearchBarResults"));
const AllModelsPage = lazy(() => import("./components/AllModelsPage"));
const OrderSummaryAndPayment = lazy(() =>
  import("./components/OrderSummaryAndPayment")
);
const OrderConfirmation = lazy(() => import("./components/OrderConfirmation"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));

const FallbackLoader = () => <Loader />;

const ErrorBoundary = ({ children }) => {
  return <Suspense fallback={<FallbackLoader />}>{children}</Suspense>;
};

const App = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch categories once on app load.
  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:categoryId" element={<Category />} />
          <Route path="/products/:categoryId/brands/:brandId" element={<Brand />} />
          <Route path="/products/:categoryId/brands/:brandId/models/:modelId" element={<ProductPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchBarResults keyword={keyword} />} />
          <Route path="/products/:categoryId/all-models" element={<AllModelsPage />} />
          <Route path="/order-summary" element={<OrderSummaryAndPayment />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </ErrorBoundary>

      <ToastContainer autoClose={3000} position="top-right" />
    </>
  );
};

export default App;
