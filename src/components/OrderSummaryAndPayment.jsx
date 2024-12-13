// OrderSummaryAndPayment.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { clearCart } from "../features/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import "../assets/OrderSummaryAndPayment.css";
import "../assets/PaymentPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const OrderSummaryAndPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [formErrors, setFormErrors] = useState({});

  // Validate the shipping form
  const validateForm = () => {
    const errors = {};
    Object.entries(shippingAddress).forEach(([key, value]) => {
      if (!value.trim()) {
        // Capitalize the first letter of the field name for the error message
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
        errors[key] = `${fieldName} is required.`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle successful order placement
  const handleSuccess = (orderId) => {
    dispatch(clearCart());
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="body">
      <Elements stripe={stripePromise}>
        <div className="order-summary-page">
          <div className="order-summary-container">
            <h1>Order Summary</h1>
            <div className="order-summary">
              {cartItems.map((item) => (
                <div key={item.variant._id} className="order-summary-item">
                  <img
                    src={item.variant.imageUrls[0] || "placeholder.jpg"}
                    alt={item.variant.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <p className="item-name">{item.variant.name}</p>
                    <p className="item-price">
                      {item.quantity} x €{item.variant.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <h2 className="total-amount">Total: €{totalAmount.toFixed(2)}</h2>
            </div>

            <div className="delivery-details">
              <h2>Shipping Address</h2>
              <form>
                {["fullName", "address", "city", "postalCode", "country"].map((field) => (
                  <div key={field} className="form-group">
                    <label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={shippingAddress[field]}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, [field]: e.target.value })
                      }
                      className={formErrors[field] ? "input-error" : ""}
                    />
                    {formErrors[field] && (
                      <span className="error-message">{formErrors[field]}</span>
                    )}
                  </div>
                ))}
              </form>
            </div>

            <div className="delivery-method">
              <h2>Delivery Method</h2>
              <div className="radioLabel">
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="radio"
                  />
                  Standard (€5.00)
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={deliveryMethod === "express"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="radio"
                  />
                  Express (€15.00)
                </label>
              </div>
            </div>

            <PaymentForm
              cartItems={cartItems}
              totalAmount={totalAmount}
              shippingAddress={shippingAddress}
              deliveryMethod={deliveryMethod}
              validateForm={validateForm}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </Elements>
      <Footer />
    </div>
  );
};

export default OrderSummaryAndPayment;
