// ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchModelById,
  submitReview,
  fetchReviews,
  deleteReview,
  fetchUserProfile,
  addWishlistItem,
  removeWishlistItem,
} from "../services/api";
import { addItemToCart } from "../features/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlistSlice";
import Footer from "../components/Footer";
import VariantSelector from "../components/VariantSelector";
import Loader from "../components/Loader";
import "../assets/productPage.css";
import { toast } from "react-toastify";
import "../assets/ReactToastify.css";

import logoWishlistRouge from "../assets/logos/wishlistRouge.png";
import logoWishlistBlanc from "../assets/logos/wishlistBlanc.png";
import etoileBlanche from "../assets/logos/etoileBlanche.png";
import etoileJaune from "../assets/logos/etoileJaune.png";
import croix from "../assets/logos/croix.png";
import flecheDroiteBlanche from "../assets/logos/flecheDroiteBlanche1.png";
import flecheGaucheBlanche from "../assets/logos/flecheGaucheBlanche1.png";

const ProductPage = () => {
  const { categoryId, brandId, modelId } = useParams();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);
  const [username, setUsername] = useState(null);

  const [model, setModel] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [price, setPrice] = useState("N/A");
  const [stock, setStock] = useState("N/A");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // For image modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const modelData = await fetchModelById(categoryId, brandId, modelId);
        if (!modelData) {
          setError("Failed to load product details. Please try again.");
          return;
        }
        setModel(modelData);
        setVariants(modelData.variants || []);
        setFilteredVariants(modelData.variants || []);
      } catch (err) {
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId, brandId, modelId]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUsername(null);
      return;
    }

    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUsername(profile?.username || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    loadUserProfile();
  }, []);
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const reviewsData = await fetchReviews({ modelId });
        setReviews(reviewsData || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviewsData();
  }, [modelId]);

  useEffect(() => {
    const filterVariants = () => {
      if (!variants.length) return;

      const matchedVariants = variants.filter((variant) =>
        Object.keys(selectedAttributes).every(
          (key) =>
            !selectedAttributes[key] || variant[key] === selectedAttributes[key]
        )
      );

      setFilteredVariants(matchedVariants);
      setSelectedVariant(matchedVariants[0] || null);
      setPrice(matchedVariants[0]?.price || "N/A");
      setStock(matchedVariants[0]?.stock || "Out of Stock");
    };

    filterVariants();
  }, [selectedAttributes, variants]);

  const handleAttributeChange = (attribute, value) => {
    const updatedAttributes = { ...selectedAttributes, [attribute]: value };
    const attributeOrder = [
      "color",
      "chip",
      "ram",
      "storage",
      "bracelet",
      "braceletColor",
    ];
    const index = attributeOrder.indexOf(attribute);
    if (index !== -1) {
      // Clear subsequent attribute selections
      attributeOrder.slice(index + 1).forEach((attr) => {
        delete updatedAttributes[attr];
      });
    }
    setSelectedAttributes(updatedAttributes);
  };

  const handleAddToCart = (variant) => {
    if (!variant) {
      toast.error("No variant selected. Please select a valid variant.");
      return;
    }
    dispatch(addItemToCart({ variant, quantity: 1 }));
    toast.success("Item added to cart!");
  };

  const handleWishlistToggle = async () => {
    if (!selectedVariant) {
      toast.error("No variant selected. Please select a valid variant.");
      return;
    }

    const existsInWishlist = wishlist.find(
      (item) => item.id === selectedVariant._id
    );

    if (existsInWishlist) {
      dispatch(removeFromWishlist(selectedVariant._id));
      try {
        if (localStorage.getItem("authToken")) {
          await removeWishlistItem(selectedVariant._id);
        }
        toast.success("Removed from wishlist!");
      } catch (error) {
        console.error("Failed to remove wishlist item on server:", error);
        toast.error("Failed to sync wishlist with server.");
      }
    } else {
      dispatch(
        addToWishlist({
          id: selectedVariant._id,
          name: selectedVariant.name || model.name,
          price: selectedVariant.price,
          imageUrls: selectedVariant.imageUrls || model.imageUrls,
          specifications: {
            screen: model.screen || {},
            battery: model.battery || {},
            connectivity: model.connectivity || {},
            features: model.features || [],
          },
        })
      );
      try {
        if (localStorage.getItem("authToken")) {
          await addWishlistItem(selectedVariant._id);
        }
        toast.success("Added to wishlist!");
      } catch (error) {
        console.error("Failed to add wishlist item on server:", error);
        toast.error("Failed to sync wishlist with server.");
      }
    }
  };

  const handleReviewSubmit = async () => {
    if (!newReview.comment.trim() || newReview.rating === 0) {
      toast.error("Please provide a valid rating and comment.");
      return;
    }

    try {
      const reviewPayload = {
        user: username || "Anonymous",
        rating: newReview.rating,
        comment: newReview.comment,
      };
      const savedReview = await submitReview({
        modelId,
        variantId: selectedVariant?._id,
        review: reviewPayload,
      });
      setReviews((prev) => [...prev, savedReview]);
      setNewReview({ comment: "", rating: 0 });
      toast.success("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId, reviewUsername) => {
    // Only allow deletion if user is the review author
    if (reviewUsername !== username) {
      toast.error("You can only delete your own reviews.");
      return;
    }

    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review.");
    }
  };

  const handleNextImage = () => {
    if (selectedVariant?.imageUrls?.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % selectedVariant.imageUrls.length
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedVariant?.imageUrls?.length > 0) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedVariant.imageUrls.length) %
          selectedVariant.imageUrls.length
      );
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="body app-gradient">
        <div className="error-message-container">
          <p className="error-message">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="body app-gradient">
      <section className="product-page page-shell stack-lg">
        <div className="section-panel section-panel--subtle product-hero stack-md">
          <p className="eyebrow">
            {model?.brand?.name || "Hi-Tech Store Exclusive"}
          </p>
          <h1 className="page-title">{model?.name || "Product Details"}</h1>
          <p className="page-lede">
            Découvrez les finitions, les variantes et les avis clients avant
            d&apos;ajouter ce modèle à votre panier.
          </p>
        </div>
        <div className="product-layout dual-panel">
          <div className="product-main section-panel">
            <div className="product-image">
              <div className="image-container">
                <img
                  src={
                    selectedVariant?.imageUrls?.[currentImageIndex] ||
                    model?.imageUrls?.[0] ||
                    "placeholder.jpg"
                  }
                  alt={model?.name || "Product"}
                  className="product-image-slide"
                  onClick={() => handleImageClick(currentImageIndex)}
                  loading="lazy"
                />

                <button
                  onClick={handleWishlistToggle}
                  className="wishlist-btn"
                >
                  <img
                    src={
                      wishlist.some(
                        (item) => item.id === selectedVariant?._id
                      )
                        ? logoWishlistRouge
                        : logoWishlistBlanc
                    }
                    alt="Wishlist Icon"
                    className="wishlist-icon"
                  />
                </button>

                <button onClick={handlePrevImage} className="prev-image-btn">
                  <img
                    src={flecheGaucheBlanche}
                    alt="Left Arrow"
                    className="arrow-image prev-arrow"
                  />
                </button>

                <button onClick={handleNextImage} className="next-image-btn">
                  <img
                    src={flecheDroiteBlanche}
                    alt="Right Arrow"
                    className="arrow-image next-arrow"
                  />
                </button>
              </div>

              {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="close-modal" onClick={closeModal}>
                      &times;
                    </button>
                    <img
                      src={
                        selectedVariant?.imageUrls?.[currentImageIndex] ||
                        model?.imageUrls?.[0]
                      }
                      alt="Product"
                      className="modal-image"
                    />
                    <button
                      onClick={handlePrevImage}
                      className="prev-modal-image-btn"
                    >
                      <img
                        src={flecheGaucheBlanche}
                        alt="Left Arrow"
                        className="arrow-image prev-arrow"
                      />
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="next-modal-image-btn"
                    >
                      <img
                        src={flecheDroiteBlanche}
                        alt="Right Arrow"
                        className="arrow-image next-arrow"
                      />
                    </button>
                  </div>
                </div>
              )}

              {model && (
                <div className="product-specs">
                  <h2>Specifications</h2>
                  <ul>
                    {model.screen && (
                      <>
                        <li>
                          <strong>Screen Size:</strong> {model.screen.size}
                        </li>
                        <li>
                          <strong>Screen Technology:</strong>{" "}
                          {model.screen.technology}
                        </li>
                        <li>
                          <strong>Resolution:</strong> {model.screen.resolution}
                        </li>
                      </>
                    )}
                    {model.battery && (
                      <>
                        <li>
                          <strong>Battery Autonomy:</strong>{" "}
                          {model.battery.autonomy}
                        </li>
                        <li>
                          <strong>Battery Capacity:</strong>{" "}
                          {model.battery.capacity}
                        </li>
                      </>
                    )}
                    <li>
                      <strong>Features:</strong>{" "}
                      {model.features?.join(" · ") || "N/A"}
                    </li>
                  </ul>
                </div>
              )}

            </div>
          </div>

          <div className="variant-selector-main section-panel sticky-summary">
            <h2>{model ? model.name : "Unknown Model"}</h2>
            <p className="product-price">Price: {price} €</p>
            <p className="product-stock">Stock: {stock}</p>

            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              selectedAttributes={selectedAttributes}
              onAttributeChange={handleAttributeChange}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
        <div className="section-panel reviews-panel">
          <div className="reviews-section">
            <h2 className="review-title">Customer Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="review">
                  <h3>
                    <strong>{review.user?.username || "Anonymous"}</strong>
                  </h3>
                  <p>Rating: {review.rating} / 5</p>
                  <p>{review.comment}</p>
                  {/* Delete button - only show if user is review author */}
                  {username && review.user?.username === username && (
                    <button
                      onClick={() =>
                        handleDeleteReview(review._id, review.user?.username)
                      }
                      className="delete-review-btn"
                      aria-label="Delete your review"
                    >
                      <img src={croix} alt="Delete" className="delete-icon" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews available for this product yet.</p>
                <p className="no-reviews-subtext">Be the first to review!</p>
              </div>
            )}

            <div className="review-form">
              <textarea
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              />
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      newReview.rating >= star ? etoileJaune : etoileBlanche
                    }
                    alt={`Star ${star}`}
                    className="star-icon"
                    onClick={() =>
                      setNewReview({ ...newReview, rating: star })
                    }
                  />
                ))}
              </div>
              <button className="review-btn" onClick={handleReviewSubmit}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductPage;
