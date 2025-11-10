import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/OrderConfirmation.css";
import Footer from "../components/Footer";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="body app-gradient">
      <section className="order-confirmation page-shell stack-lg">
        <div className="section-panel section-panel--subtle stack-md confirmation-hero">
          <p className="eyebrow">Commande validée</p>
          <h1 className="page-title">Merci pour votre confiance</h1>
          <p className="page-lede">
            Votre commande est en cours de préparation. Nous vous informerons à chaque
            étape jusqu&apos;à la livraison.
          </p>
        </div>

        <div className="confirmation-grid">
          <div className="section-panel confirmation-card">
            <div className="status-pill">
              <span aria-hidden="true">✓</span> Paiement confirmé
            </div>
            <h2>Commande #{orderId}</h2>
            <p className="confirmation-text">
              Nous avons bien reçu votre commande. Vous recevrez un e-mail de
              confirmation avec le récapitulatif complet dans les prochaines minutes.
            </p>
            <ul className="confirmation-checklist">
              <li>Préparation logistique en 24h</li>
              <li>Suivi colis disponible dans votre espace compte</li>
              <li>E-mail envoyé à l&apos;adresse utilisée lors du paiement</li>
            </ul>
            <button
              onClick={() => navigate("/")}
              className="continue-shopping-btn"
            >
              Continuer mes achats
            </button>
          </div>

          <div className="section-panel confirmation-support">
            <h3>Besoin d&apos;aide&nbsp;?</h3>
            <p>
              Notre équipe reste joignable 7j/7 pour toute question concernant votre
              commande ou la livraison.
            </p>
            <div className="support-card">
              <p>
                <strong>Email :</strong> support@hitechstore.com
              </p>
              <p>
                <strong>Téléphone :</strong> +33 1 71 90 00 00
              </p>
              <p>
                <strong>Chat :</strong> Disponible depuis votre espace client
              </p>
            </div>
            <a className="support-link" href="/contact">
              Contacter le support
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
