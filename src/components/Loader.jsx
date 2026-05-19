import React from 'react';
import logoHome from '../assets/logos/NewLogo.png';
import '../assets/Loader.css';

const Loader = () => (
  <div className="loader-container">
    <div className="loader-inner">
      <img src={logoHome} alt="Hi Tech Store Logo" className="loader-logo" />
      <h1 className="loader-text">Hi Tech Store</h1>

      <div className="progress-track">
        <div className="progress-bar">
          <div className="progress-fill" />
        </div>
        <p className="loader-status">
          Loading
          <span className="loader-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>
      </div>

      <div className="loader-notice">
        <div className="notice-card">
          <span className="notice-icon">⚡</span>
          <div className="notice-content">
            <p className="notice-title">Free Tier Server</p>
            <p className="notice-body">
              This app runs on a free-tier database. The initial load may take
              up to 30 seconds while the server wakes up. Thanks for your patience!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
