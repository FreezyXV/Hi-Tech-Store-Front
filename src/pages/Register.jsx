// Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../assets/auth.css";
import Footer from "../components/Footer";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await registerUser({ username, email, password });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Moderate";
  };

  return (
    <div className="body register-backdrop auth-page">
      <section className="register page-shell">
        <div className="auth-layout dual-panel">
          <div className="auth-highlight section-panel section-panel--subtle stack-lg">
            <p className="eyebrow">Member Advantage</p>
            <h1 className="auth-title">Register</h1>
            <p className="auth-lede">
              Créez votre espace personnel pour sauvegarder vos sélections,
              suivre vos commandes et recevoir des alertes exclusives.
            </p>
            <ul className="auth-perks">
              <li>Wishlist et panier synchronisés entre vos appareils.</li>
              <li>Notifications instantanées lors des drops limités.</li>
              <li>Historique d&apos;achats et reçus centralisés.</li>
            </ul>
          </div>
          <div className="auth-container section-panel">
            {error && <div className="error">{error}</div>}
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  required
                />
                <div
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                >
                  {passwordStrength && `Strength: ${passwordStrength}`}
                </div>
              </div>
              <button className="auth-button" type="submit">
                Register
              </button>
            </form>
            <p className="auth-footer">
              Already have an account?{" "}
              <Link to="/login" className="auth-inline-link">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Register;
