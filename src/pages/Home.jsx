import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAsync } from "../features/categoriesSlice";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "../assets/home.css";
import Footer from "../components/Footer";

import SmartphoneBanner from "../assets/logos/SmartphoneBanner.jpg";
import TabletBanner from "../assets/logos/TabletBanner1.jpeg";
import WatchBanner from "../assets/logos/WatchBanner.jpg";
import LaptopBanner from "../assets/logos/LaptopBanner.jpg";

// Banner slide data
const banners = [
  {
    title: "WEB3 AI PHONE",
    subtitle: "COMPUTER IN YOUR POCKET",
    imageUrls: SmartphoneBanner,
    categoryName: "Smartphones",
  },
  {
    title: "EXPLORE THE FUTURE",
    subtitle: "TECH INNOVATIONS",
    imageUrls: TabletBanner,
    categoryName: "Tablets",
  },
  {
    title: "SMART SOLUTIONS",
    subtitle: "DIGITAL WATCHES",
    imageUrls: WatchBanner,
    categoryName: "Watches",
  },
  {
    title: "ULTIMATE WORK PARTNER",
    subtitle: "PREMIUM LAPTOPS",
    imageUrls: LaptopBanner,
    categoryName: "Laptops",
  },
];

const categoryImages = {
  Laptops: "https://i.imgur.com/CJSKpJw.png",
  TVs: "https://i.imgur.com/wZIgTlc.png",
  Smartphones: "https://i.imgur.com/44Qo6kt.png",
  Consoles: "https://i.imgur.com/5XRdtQh.png",
  Headphones: "https://i.imgur.com/yEzh7H6.jpeg",
  Watches: "https://i.imgur.com/rQz4hcC.png",
  Tablets: "https://i.imgur.com/YpyCwuD.png",
};

const Home = () => {
  const dispatch = useDispatch();

  const {
    data: categories,
    status: categoriesStatus,
    error: categoriesError,
  } = useSelector(
    (state) => state.categories || { data: [], status: "idle", error: null }
  );

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategoriesAsync());
    }
  }, [categoriesStatus, dispatch]);

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  if (categoriesStatus === "loading") {
    return <p className="loading-message">Loading categories...</p>;
  }

  if (categoriesStatus === "failed") {
    return (
      <p className="error-message">
        Error loading categories:{" "}
        {categoriesError || "An unexpected error occurred."}
      </p>
    );
  }

  return (
    <div className="body">
      <div className="home-page">
        {/* Banner Slider */}
        <Slider {...sliderSettings} className="luxury-banner-slider">
          {banners.map((banner, index) => {
            const matchedCategory = Object.values(categories).find(
              (category) => category.name === banner.categoryName
            );

            const categoryId = matchedCategory?._id;

            return (
              <div key={index} className="luxury-banner">
                <div className="banner-content">
                  <h1>{banner.title}</h1>
                  <h2>{banner.subtitle}</h2>
                  {categoryId && (
                    <Link
                      to={`/products/${categoryId}`}
                      className="explore-button"
                    >
                      Explore More
                    </Link>
                  )}
                </div>
                <div className="banner-image">
                  <img src={banner.imageUrls} alt={banner.subtitle} />
                </div>
              </div>
            );
          })}
        </Slider>

        {/* Categories Section */}
        <section className="categories-section">
          <h2>Explore Our Categories</h2>
          <div className="categories-grid">
            {Object.values(categories).length > 0 ? (
              Object.values(categories).map((category) => (
                <Link
                  key={category._id}
                  to={`/products/${category._id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    <img
                      src={
                        categoryImages[category.name] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={category.name}
                    />
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              ))
            ) : (
              <p className="empty-message">
                No categories available at the moment.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
