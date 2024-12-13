// PaymentForm.js
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { fetchPaymentIntent, placeOrder } from "../services/api";
import "../assets/PaymentPage.css";

const PaymentForm = ({
  cartItems,
  totalAmount,
  shippingAddress,
  deliveryMethod,
  validateForm,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Custom styling for the Stripe CardElement
  const cardStyle = {
    base: {
      color: "#222",
      fontFamily: "'Muli', sans-serif",
      fontSize: "22px",
      "::placeholder": {
        color: "#aaa",
      },
    },
    invalid: {
      color: "#ff5252",
    },
    complete: {
      color: "#4caf50",
    },
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert("Please enter your card details.");
      return;
    }

    const deliveryCost = deliveryMethod.toLowerCase() === "express" ? 15 : 5;
    const adjustedTotalAmount = totalAmount + deliveryCost;

    try {
      setIsSubmitting(true);
      setPaymentError(null);

      // Prepare the payload for fetching the payment intent
      const paymentIntentPayload = {
        items: cartItems.map((item) => ({
          id: item.variant._id,
          quantity: item.quantity,
        })),
        totalAmount: adjustedTotalAmount,
        deliveryMethod, // Ensure deliveryMethod is included
        shippingAddress, // Include if backend requires it for calculations
      };

      // Fetch the client secret from the backend
      const { clientSecret } = await fetchPaymentIntent(paymentIntentPayload);

      if (!clientSecret) {
        throw new Error(
          "Unable to process payment at the moment. Please try again later."
        );
      }

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.fullName,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country,
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment Error:", error.message);
        setPaymentError(error.message);
        return;
      }

      // Prepare the order payload with the confirmed payment intent ID
      const orderPayload = {
        items: cartItems.map((item) => ({
          variant: item.variant._id,
          quantity: item.quantity,
          price: item.variant.price,
        })),
        shippingAddress,
        deliveryMethod,
        totalAmount: adjustedTotalAmount,
        paymentIntentId: paymentIntent.id,
      };

      // Place the order
      const response = await placeOrder(orderPayload);

      if (!response?.order?._id) {
        throw new Error("Failed to place the order. Please try again.");
      }

      // Clear the cart and trigger the success callback
      onSuccess(response.order._id);
    } catch (error) {
      console.error("Order Placement Error:", error.message);
      setPaymentError(error.message || "Order placement failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="payment-method">
      <h2>Payment Method</h2>
      <CardElement options={{ style: cardStyle }} />
      {paymentError && <p className="error-message">{paymentError}</p>}
      <button
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
        className="submit-order-btn"
      >
        {isSubmitting ? "Processing Payment..." : "Place Order"}
      </button>
    </div>
  );
};

export default PaymentForm;
