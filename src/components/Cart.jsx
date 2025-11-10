import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { removeItemFromCart, updateItemQuantity } from "../features/cartSlice";
import "../assets/cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total amount whenever cart items change
  useEffect(() => {
    calculateTotalAmount(cartItems);
  }, [cartItems]);

  const calculateTotalAmount = (items) => {
    const total = items.reduce(
      (sum, item) =>
        item?.variant?.price && item?.quantity
          ? sum + item.variant.price * item.quantity
          : sum,
      0
    );
    setTotalAmount(total);
  };

  const handleQuantityChange = (variantId, quantity) => {
    if (!variantId || quantity < 1) return;
    dispatch(updateItemQuantity({ variantId, quantity }));
  };

  const handleRemoveItem = (variantId) => {
    if (!variantId) return;
    dispatch(removeItemFromCart({ variantId }));
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
      return;
    }

    // Navigate to OrderSummaryAndPayment page with cart data
    navigate("/order-summary", { state: { cartItems, totalAmount } });
  };

  return (
    <div className="body cart-backdrop">
      <section className="page-shell stack-lg">
        <div className="section-panel section-panel--subtle cart-hero stack-md">
          <p className="eyebrow">Order Preview</p>
          <h1 className="cartTitle">Your Cart</h1>
          <p className="page-lede">
            Ajustez vos quantités, comparez vos coups de cœur puis finalisez en
            toute sérénité.
          </p>
        </div>
        <div className="cart-grid">
          <div className="cart-container section-panel stack-lg">
            {cartItems.length === 0 ? (
              <p>Your cart is empty. Add items to start shopping!</p>
            ) : (
              cartItems.map(
                (item, index) =>
                  item.variant && (
                    <div key={item.variant?._id || index} className="cart-item">
                      <div className="cart-media">
                        <img
                          src={item.variant?.imageUrls || "placeholder.jpg"}
                          alt={item.variant?.name || "Unknown Product"}
                          className="cart-item-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <h2>{item.variant?.name || "Unknown Product"}</h2>
                          <span className="chip">En stock</span>
                        </div>
                        <div className="cart-item-meta">
                          <p className="price">
                            € {item.variant?.price?.toFixed(2) || "N/A"}
                          </p>
                          <p className="item-total">
                            €
                            {(
                              (item.variant?.price || 0) *
                              (item.quantity || 1)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="cart-controls">
                          <div className="quantity-control">
                            <label>Quantity</label>
                            <input
                              type="number"
                              value={item.quantity || 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.variant?._id,
                                  parseInt(e.target.value, 10)
                                )
                              }
                              min="1"
                            />
                          </div>
                          <button
                            className="remove-button"
                            onClick={() => handleRemoveItem(item.variant?._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )
            )}
          </div>
          <aside className="cart-summary section-panel sticky-summary">
            <div className="cart-summaryMain stack-md">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Sous-total</span>
                <span>€ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Livraison estimée</span>
                <span>Offerte</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>€ {totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="checkoutButton"
                onClick={handleProceedToCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
            <div className="additional-info stack-md">
              <div className="info-section">
                <h3>Delivery</h3>
                <p>Expédition en 24h, livraison 3-5 jours ouvrés.</p>
              </div>
              <div className="info-section">
                <h3>Payment</h3>
                <p>Visa, Mastercard, PayPal &amp; paiement en 3x sécurisé.</p>
              </div>
              <div className="info-section">
                <h3>Support</h3>
                <p>support@hitechstore.com · +33 1 71 90 00 00</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
