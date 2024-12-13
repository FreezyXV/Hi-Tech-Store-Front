import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import { removeFromWishlist } from "../features/wishlistSlice";
import { addItemToCart } from "../features/cartSlice";
import "../assets/wishlist.css";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist?.items || []);

  const handleRemoveFromWishlist = (itemId) => {
    dispatch(removeFromWishlist(itemId));
    toast.success("Item removed from wishlist!");
  };

  const handleMoveToCart = (item) => {
    if (!item || !item.id) {
      toast.error("Invalid item. Unable to move to cart.");
      return;
    }
    const variant = { ...item, _id: item.id };
    dispatch(addItemToCart({ variant, quantity: 1 }));
    toast.success("Item moved to cart!");
    dispatch(removeFromWishlist(item.id));
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <p className="empty-wishlist-text">Your wishlist is currently empty.</p>
        <button onClick={() => navigate("/")} className="back-to-shopping">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="wishlist-page">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <div className="wishlist-container">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img
                src={item.imageUrls || "https://via.placeholder.com/150"}
                alt={item.name || "Wishlist Item"}
                className="wishlist-image"
              />
              <div className="wishlist-details">
                <h2>{item.name}</h2>
                <p>Price: €{item.price}</p>
                <div className="wishlist-actions">
                  <button
                    className="move-to-cart"
                    onClick={() => handleMoveToCart(item)}
                    aria-label={`Move ${item.name} to cart`}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="remove"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              {item.specifications && (
                <div className="wishlist-specs">
                  <h3>Specifications:</h3>
                  <ul>
                    {item.specifications.screen && (
                      <>
                        <li>
                          <strong>Screen Size:</strong>{" "}
                          {item.specifications.screen.size}
                        </li>
                        <li>
                          <strong>Screen Technology:</strong>{" "}
                          {item.specifications.screen.technology}
                        </li>
                        <li>
                          <strong>Resolution:</strong>{" "}
                          {item.specifications.screen.resolution}
                        </li>
                      </>
                    )}
                    {item.specifications.battery && (
                      <>
                        <li>
                          <strong>Battery Autonomy:</strong>{" "}
                          {item.specifications.battery.autonomy}
                        </li>
                        <li>
                          <strong>Battery Capacity:</strong>{" "}
                          {item.specifications.battery.capacity}
                        </li>
                      </>
                    )}
                    {item.specifications.features && (
                      <li>
                        <strong>Features:</strong>{" "}
                        {item.specifications.features.join(" · ")}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
