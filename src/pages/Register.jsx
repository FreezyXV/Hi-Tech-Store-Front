// Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="body">
      <div className="register">
        <div className="auth-container">
          <h1 className="auth-title">Register</h1>
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
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Log In
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
