import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/OrderConfirmation.css";
import Footer from '../components/Footer';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="body">
    <div className="order-confirmation-container">
      <div className="confirmation-card">
        <h1>Thank You for Your Order! </h1>
        <p className="confirmation-text">
          Your order has been successfully placed.
        </p>
        <p className="order-id">
          <strong>Order ID:</strong> {orderId}
        </p>
        <p className="notification-text">
          You will receive a confirmation email shortly. We’ll notify you once
          your order is shipped.
        </p>
        <button
          onClick={() => navigate("/")}
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
      <div className="additional-info">
        <h2>Need Help?</h2>
        <p>
          If you have any questions or concerns about your order, please{" "}
          <a href="/contact">contact our support team</a>.
        </p>
        <p>We’re here to help you 24/7!</p>
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default OrderConfirmation;
