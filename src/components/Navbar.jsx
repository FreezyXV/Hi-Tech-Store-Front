import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAsync } from "../features/categoriesSlice";
import { fetchModelsByCategory } from "../services/api";
import DropdownMenu from "../components/DropdownMenu";
import SearchBar from "../components/SearchBar";
import "../assets/navbar.css";

// Logo Imports
import logoHome from "../assets/logos/NewLogo.png";
import AccueilBlanc from "../assets/logos/accueilBlanc.png";
import AccueilNoir from "../assets/logos/accueilNoir.png";
import logoPanierNoir from "../assets/logos/sac-de-coursesNoir.png";
import logoPanierBlanc from "../assets/logos/sac-de-courses.png";
import logoLogoutNoir from "../assets/logos/se-deconnecterNoir.png";
import logoLogoutBlanc from "../assets/logos/se-deconnecterBlanc.png";
import logoUserNoir from "../assets/logos/utilisateurNoir.png";
import logoUserBlanc from "../assets/logos/utilisateurBlanc.png";
import logoLoginNoir from "../assets/logos/connexionNoir.png";
import logoLoginBlanc from "../assets/logos/connexionBlanc.png";
import logoSignUpNoir from "../assets/logos/enregistrement-en-ligneNoir.png";
import logoSignUpBlanc from "../assets/logos/enregistrement-en-ligneBlanc.png";
import logoWishlistRouge from "../assets/logos/wishlistRouge.png";
import logoWishlistBlanc from "../assets/logos/wishlistBlanc.png";
import BurgerMenu from "../assets/logos/burgerMenu.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: categories,
    status,
    error,
  } = useSelector((state) => state.categories);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const [clickedCategory, setClickedCategory] = useState(null);
  const [models, setModels] = useState({});
  const [loadingModels, setLoadingModels] = useState(false);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  }, [navigate]);

  const handleCategoryClick = useCallback(
    async (categoryId) => {
      if (!models[categoryId]) {
        try {
          setLoadingModels(true);
          const fetchedModels = await fetchModelsByCategory(categoryId);
          setModels((prevModels) => ({
            ...prevModels,
            [categoryId]: fetchedModels,
          }));
        } catch (error) {
          console.error(
            `Failed to fetch models for category ${categoryId}:`,
            error.message
          );
        } finally {
          setLoadingModels(false);
        }
      }
      setClickedCategory((prev) => (prev === categoryId ? null : categoryId));
    },
    [models]
  );

  const handleBurgerMenuClick = useCallback((event) => {
    event.stopPropagation(); // Prevent the event from bubbling up to the parent
    setIsCategoriesVisible((prev) => {
      if (prev) {
        setClickedCategory(null); // Reset clickedCategory when closing the menu
      }
      return !prev; // Toggle visibility
    });
  }, []);

  const handleOutsideClick = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setClickedCategory(null);
      setIsCategoriesVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const closeMenu = useCallback(() => {
    setIsCategoriesVisible(false);
    setClickedCategory(null);
  }, []);

  const renderButton = useCallback(
    (iconBlack, iconWhite, text, path, onClick = null) => (
      <button
        className="right-nav-buttons"
        onClick={onClick || (() => navigate(path))}
        aria-label={text}
      >
        <div className="icon-wrapper">
          <img
            src={iconBlack}
            alt={`${text} icon`}
            className="icon icon-black"
          />
          <img
            src={iconWhite}
            alt={`${text} icon`}
            className="icon icon-white"
          />
        </div>
        <span className="navbar-icon-text">{text}</span>
      </button>
    ),
    [navigate]
  );

  if (status === "loading") {
    return <nav className="navbar">Loading categories...</nav>;
  }

  if (status === "failed") {
    return (
      <nav className="navbar">
        Error loading categories: {error?.message || "Unknown error."}
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        {/* Logo Section */}
        <div
          className="navbar-section"
          onClick={() => navigate("/")}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <img
            src={isMobile ? AccueilBlanc : logoHome}
            alt="Home"
            className="home-logo"
          />

          {/* Burger Menu */}
          {isMobile && (
            <div
              className="burger-menu"
              onClick={handleBurgerMenuClick}
              role="button"
              tabIndex="0"
              aria-label="Toggle Categories Menu"
              aria-haspopup="true"
              aria-expanded={isCategoriesVisible}
            >
              <img className="burger-menuImg" src={BurgerMenu} alt="Menu" />
            </div>
          )}
        </div>

        {/* Dropdown Categories */}
        {(!isMobile || isCategoriesVisible) && (
          <div
            className={`navbar-categories ${
              isCategoriesVisible ? "visible" : ""
            }`}
            ref={dropdownRef}
          >
            {/* Home Button */}
            <div className="nav-home-button">
              <button
                onClick={() => navigate("/")}
                className="nav-categories-button-accueil"
              >
                <div className="icon-wrapper-accueil">
                  <img
                    src={AccueilNoir}
                    alt="Home"
                    className="accueilLogoNoir"
                  />
                  <img
                    src={AccueilBlanc}
                    alt="Home"
                    className="accueilLogoBlanc"
                  />
                </div>
                <p className="navbar-home-text">Home</p>
              </button>
            </div>

            {/* Category Buttons */}
            {categories && Object.keys(categories).length > 0 ? (
              Object.values(categories).map((category) => (
                <div
                  key={category._id}
                  className={`dropdown-container ${
                    clickedCategory === category._id ? "active" : ""
                  }`}
                >
                  <button
                    className="nav-categories-button"
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.name || "Category"}
                  </button>
                  <DropdownMenu
                    models={models}
                    categoryId={category._id}
                    visible={clickedCategory === category._id}
                    loadingModels={loadingModels}
                    onModelClick={closeMenu}
                  />
                </div>
              ))
            ) : (
              <p className="no-categories">No categories available</p>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="navbar-search">
          <SearchBar />
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          <div className="icon-container">
            {isLoggedIn ? (
              <>
                {renderButton(
                  logoUserNoir,
                  logoUserBlanc,
                  "Account",
                  "/account"
                )}
                {renderButton(
                  logoLogoutNoir,
                  logoLogoutBlanc,
                  "Logout",
                  "/",
                  handleLogout
                )}
              </>
            ) : (
              <>
                {renderButton(logoLoginNoir, logoLoginBlanc, "Login", "/login")}
                {renderButton(
                  logoSignUpNoir,
                  logoSignUpBlanc,
                  "Sign Up",
                  "/register"
                )}
              </>
            )}
            {renderButton(logoPanierNoir, logoPanierBlanc, "Cart", "/cart")}
            {renderButton(
              logoWishlistBlanc,
              logoWishlistRouge,
              "Wishlist",
              "/wishlist"
            )}
          </div>
        </div>
      </nav>

      {/* Global Overlay */}
      {isCategoriesVisible && (
        <div className="global-overlay" onClick={closeMenu}></div>
      )}
    </>
  );
};

export default Navbar;
