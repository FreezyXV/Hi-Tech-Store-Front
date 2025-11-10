// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../assets/auth.css";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        navigate("/account");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="body app-gradient auth-page">
      <section className="login page-shell">
        <div className="auth-layout dual-panel">
          <div className="auth-highlight section-panel section-panel--subtle stack-lg">
            <p className="eyebrow">Welcome Back</p>
            <h1 className="auth-title">Login</h1>
            <p className="auth-lede">
              Reprenez vos recherches là où vous les avez laissées et accédez à
              l&apos;intégralité de vos commandes.
            </p>
            <ul className="auth-perks">
              <li>Tracking temps-réel des expéditions.</li>
              <li>Historique complet des achats et factures.</li>
              <li>Wishlist synchronisée entre mobile et desktop.</li>
            </ul>
          </div>
          <div className="auth-container section-panel">
            {error && <div className="error">{error}</div>}
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  aria-invalid={emailError ? "true" : "false"}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {emailError && (
                  <span id="email-error" className="field-error">
                    {emailError}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    aria-invalid={passwordError ? "true" : "false"}
                    aria-describedby={
                      passwordError ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {passwordError && (
                  <span id="password-error" className="field-error">
                    {passwordError}
                  </span>
                )}
              </div>
              <button
                className="auth-button"
                type="submit"
                disabled={isLoading || emailError || passwordError}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="auth-footer stack-md">
              <Link to="/forgot-password" className="auth-inline-link">
                Forgot your password?
              </Link>
              <p>
                New on Hi Tech Store?{" "}
                <Link to="/register" className="auth-inline-link">
                  Register
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

export default Login;
