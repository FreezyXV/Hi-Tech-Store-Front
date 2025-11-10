import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../assets/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus({
        type: "error",
        message: "Please enter the email address linked to your account.",
      });
      return;
    }

    setStatus({
      type: "success",
      message:
        "If an account exists for this email, a secure reset link will arrive in your inbox shortly.",
    });
    setEmail("");
  };

  return (
    <div className="body app-gradient auth-page">
      <section className="login page-shell">
        <div className="auth-layout dual-panel">
          <div className="auth-highlight section-panel section-panel--subtle stack-lg">
            <p className="eyebrow">Need a reset?</p>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-lede">
              Récupérez l&apos;accès à votre compte en quelques secondes. Nous
              vous enverrons un lien sécurisé pour réinitialiser votre mot de
              passe et reprendre vos découvertes high-tech.
            </p>
            <ul className="auth-perks">
              <li>Réinitialisation rapide et protégée par chiffrement.</li>
              <li>Compatible desktop, mobile et tablette.</li>
              <li>Equipe support disponible 24/7 en cas de besoin.</li>
            </ul>
          </div>

          <div className="auth-container section-panel">
            {status.message && (
              <div
                className={`auth-message ${
                  status.type === "error"
                    ? "auth-message--error"
                    : "auth-message--success"
                }`}
                role="status"
              >
                {status.message}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email">Email address:</label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button className="auth-button" type="submit">
                Send reset link
              </button>
            </form>

            <div className="auth-footer stack-md">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="auth-inline-link">
                  Back to login
                </Link>
              </p>
              <p>
                New to Hi Tech Store?{" "}
                <Link to="/register" className="auth-inline-link">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
