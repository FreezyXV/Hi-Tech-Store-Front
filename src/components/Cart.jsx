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
    <div className="body">
      <h1 className="cartTitle">Your Cart</h1>
      <div className="wrapper-productPage">
        <div className="cart-container">
          {cartItems.length === 0 ? (
            <p>Your cart is empty. Add items to start shopping!</p>
          ) : (
            <>
              {cartItems.map(
                (item, index) =>
                  item.variant && (
                    <div key={item.variant?._id || index} className="cart-item">
                      <img
                        src={item.variant?.imageUrls || "placeholder.jpg"}
                        alt={item.variant?.name || "Unknown Product"}
                        className="cart-item-image"
                        loading="lazy"
                      />
                      <div className="cart-item-details">
                        <h2>{item.variant?.name || "Unknown Product"}</h2>
                        <p>
                          Price: € {item.variant?.price?.toFixed(2) || "N/A"}
                        </p>
                        <div className="quantity-control">
                          <label>Quantity:</label>
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
                      <p className="item-total">
                        Total: €
                        {(item.variant?.price * (item.quantity || 1)).toFixed(
                          2
                        ) || "N/A"}
                      </p>
                    </div>
                  )
              )}
            </>
          )}
        </div>
        <div className="cart-summary">
          <div className="cart-summaryMain">
            <h2>Order Summary</h2>
            <p>Total Amount: € {totalAmount.toFixed(2)}</p>
            <button
              className="checkoutButton"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
          {/* Additional Information Section */}
          <div className="additional-info">
            <div className="info-section">
              <h3>Delivery Information</h3>
              <p>
                Delivery typically takes 3-5 business days. Express delivery
                options are available at checkout.
              </p>
            </div>
            <div className="info-section">
              <h3>Payment Options</h3>
              <p>
                We accept Visa, MasterCard, PayPal, and other major payment
                methods. Secure checkout guaranteed.
              </p>
            </div>
            <div className="info-section">
              <h3>Return Policy</h3>
              <p>
                Enjoy a hassle-free return policy. Items can be returned within
                30 days of purchase. See our return policy for more details.
              </p>
            </div>
            <div className="info-section">
              <h3>Need Help?</h3>
              <p>
                Contact our customer support team at support@hitechstore.com or
                call 01 71 90 00 00.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
