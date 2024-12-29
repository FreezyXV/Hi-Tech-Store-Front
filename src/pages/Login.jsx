// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../assets/auth.css";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser({ email, password });
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        navigate("/account");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred while logging in");
    }
  };

  return (
    <div className="body">
      <div className="login">
        <div className="auth-container">
          <h1 className="auth-title">Login</h1>
          {error && <div className="error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="auth-button" type="submit">
              Login
            </button>
          </form>
          <div>
          <p>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </a>
          </p>
          <p>
            New on Hi Tech Store?{" "}
            <a href="/register" className="register-link">
              Register
            </a>
          </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
