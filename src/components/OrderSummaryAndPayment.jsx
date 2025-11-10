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

  const { cartItems, totalAmount } = location.state || {
    cartItems: [],
    totalAmount: 0,
  };

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [formErrors, setFormErrors] = useState({});

  const deliveryOptions = [
    {
      id: "standard",
      label: "Standard",
      price: 5,
      eta: "3-5 jours ouvrés",
      description: "Suivi inclus, livraison planifiée et sécurisée.",
      badge: "Recommandé",
    },
    {
      id: "express",
      label: "Express",
      price: 15,
      eta: "24-48h",
      description: "Priorité de traitement et assurance renforcée.",
      badge: "Rapide",
    },
  ];

  const deliveryCost = deliveryMethod === "express" ? 15 : 5;
  const grandTotal = totalAmount + deliveryCost;

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
    <div className="body app-gradient">
      <Elements stripe={stripePromise}>
        <section className="order-summary-page page-shell stack-lg">
          <div className="section-panel section-panel--subtle stack-md order-summary-hero">
            <p className="eyebrow">Finalisation</p>
            <h1 className="page-title">Commande &amp; paiement sécurisé</h1>
            <p className="page-lede">
              Vérifiez vos articles, renseignez l&apos;adresse puis choisissez le
              mode de livraison qui vous convient avant de confirmer.
            </p>
          </div>

          <div className="order-summary-layout">
            <div className="order-primary stack-lg">
              <div className="section-panel order-card">
                <div className="order-card__header">
                  <div>
                    <p className="eyebrow">Votre panier</p>
                    <h2>Articles sélectionnés</h2>
                  </div>
                  <span className="order-count">
                    {cartItems.length} {cartItems.length > 1 ? "articles" : "article"}
                  </span>
                </div>
                {cartItems.length > 0 ? (
                  <>
                    <div className="order-items">
                      {cartItems.map((item) => (
                        <article
                          key={item?.variant?._id || item?.variantId}
                          className="order-summary-item"
                        >
                          <img
                            src={
                              item?.variant?.imageUrls?.[0] || "https://via.placeholder.com/120"
                            }
                            alt={item?.variant?.name || "Article"}
                            className="order-item-image"
                            loading="lazy"
                          />
                          <div className="order-item-details">
                            <p className="item-name">{item?.variant?.name || "Produit"}</p>
                            <p className="item-meta">
                              Quantité&nbsp;: {item?.quantity || 1}
                            </p>
                            <p className="item-price">
                              €{(item?.variant?.price || 0).toFixed(2)} pièce
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="order-totals">
                      <div className="order-total-row">
                        <span>Sous-total</span>
                        <span>€ {totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="order-total-row">
                        <span>Livraison</span>
                        <span>
                          {deliveryCost === 0 ? "Offerte" : `€ ${deliveryCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="order-total-row order-total-row--grand">
                        <span>Total estimé</span>
                        <span>€ {grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="order-empty">
                    Votre panier est vide. Ajoutez quelques produits avant de poursuivre.
                  </p>
                )}
              </div>

              <div className="section-panel order-card">
                <div className="order-card__header">
                  <div>
                    <p className="eyebrow">Coordonnées</p>
                    <h2>Adresse de livraison</h2>
                  </div>
                  <span className="order-count order-count--muted">Obligatoire</span>
                </div>
                <form className="shipping-form" noValidate>
                  {["fullName", "address", "city", "postalCode", "country"].map((field) => (
                    <div
                      key={field}
                      className={`form-group ${
                        ["city", "postalCode"].includes(field) ? "form-group--half" : ""
                      }`}
                    >
                      <label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        id={field}
                        name={field}
                        autoComplete="on"
                        value={shippingAddress[field]}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            [field]: e.target.value,
                          })
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

              <div className="section-panel order-card">
                <div className="order-card__header">
                  <div>
                    <p className="eyebrow">Livraison</p>
                    <h2>Mode préféré</h2>
                  </div>
                </div>
                <div className="delivery-options">
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`delivery-option ${
                        deliveryMethod === option.id ? "delivery-option--selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={option.id}
                        checked={deliveryMethod === option.id}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div className="delivery-option__meta">
                        <div className="delivery-option__heading">
                          <h3>{option.label}</h3>
                          <span className="delivery-badge">{option.badge}</span>
                        </div>
                        <p className="delivery-option__eta">{option.eta}</p>
                        <p className="delivery-option__description">{option.description}</p>
                      </div>
                      <div className="delivery-option__price">
                        {option.price === 0 ? "Offert" : `€ ${option.price.toFixed(2)}`}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-panel order-payment-card sticky-summary">
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
        </section>
      </Elements>
      <Footer />
    </div>
  );
};

export default OrderSummaryAndPayment;
