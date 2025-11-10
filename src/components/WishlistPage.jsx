import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import { removeFromWishlist, setWishlist } from "../features/wishlistSlice";
import { addItemToCart } from "../features/cartSlice";
import {
  fetchWishlistFromServer,
  removeWishlistItem,
} from "../services/api";
import "../assets/wishlist.css";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist?.items || []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const normalizeWishlistItems = (items = []) =>
      items.map((item) => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        imageUrls: item.imageUrls,
        specifications: item.specifications || {},
      }));

    const syncWishlist = async () => {
      try {
        const serverWishlist = await fetchWishlistFromServer();
        dispatch(setWishlist(normalizeWishlistItems(serverWishlist)));
      } catch (error) {
        console.error("Failed to sync wishlist from server:", error);
        toast.error("Unable to sync wishlist with server.");
      }
    };

    syncWishlist();
  }, [dispatch]);

  const syncServerRemoval = async (itemId) => {
    if (!localStorage.getItem("authToken")) return;
    try {
      await removeWishlistItem(itemId);
    } catch (error) {
      console.error("Failed to remove wishlist item on server:", error);
      toast.error("Unable to update wishlist on server.");
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    dispatch(removeFromWishlist(itemId));
    toast.success("Item removed from wishlist!");
    await syncServerRemoval(itemId);
  };

  const handleMoveToCart = async (item) => {
    if (!item || !item.id) {
      toast.error("Invalid item. Unable to move to cart.");
      return;
    }
    const variant = { ...item, _id: item.id };
    dispatch(addItemToCart({ variant, quantity: 1 }));
    toast.success("Item moved to cart!");
    dispatch(removeFromWishlist(item.id));
    await syncServerRemoval(item.id);
  };

  const renderEmptyState = () => (
    <div className="section-panel section-panel--subtle stack-md empty-wishlist">
      <h1 className="wishlist-title">Your Wishlist</h1>
      <p className="page-lede">Votre liste est vide pour l&apos;instant.</p>
      <button onClick={() => navigate("/")} className="back-to-shopping">
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="body wishlist-backdrop">
      <section className="wishlist-page page-shell stack-lg">
        <div className="section-panel section-panel--subtle stack-md">
          <p className="eyebrow">Saved For Later</p>
          <h1 className="wishlist-title">Your Wishlist</h1>
          <p className="page-lede">
            Gardez un œil sur vos configurations favorites et transférez-les
            dans le panier en un clic.
          </p>
        </div>
        <div className="wishlist-container stack-lg">
          {!wishlist || wishlist.length === 0
            ? renderEmptyState()
            : wishlist.map((item) => {
                const imageSrc = Array.isArray(item.imageUrls)
                  ? item.imageUrls[0]
                  : item.imageUrls || "https://via.placeholder.com/150";

                return (
                  <article key={item.id} className="wishlist-card section-panel">
                    <div className="wishlist-card-grid">
                      <div className="wishlist-media">
                        <img
                          src={imageSrc}
                          alt={item.name || "Wishlist Item"}
                          className="wishlist-image"
                        />
                      </div>
                      <div className="wishlist-details">
                        <p className="chip">Wishlist</p>
                        <h2>{item.name}</h2>
                        <p className="wishlist-price">€{item.price}</p>
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
                          <h3>Specifications</h3>
                          <ul>
                            {item.specifications.screen && (
                              <>
                                <li>
                                  <strong>Screen Size:</strong>{" "}
                                  {item.specifications.screen.size}
                                </li>
                                <li>
                                  <strong>Technology:</strong>{" "}
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
                                  <strong>Autonomy:</strong>{" "}
                                  {item.specifications.battery.autonomy}
                                </li>
                                <li>
                                  <strong>Capacity:</strong>{" "}
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
                  </article>
                );
              })}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WishlistPage;
