// src/components/Loader.jsx
import React from 'react';
import logoHome from '../assets/logos/NewLogo.png'; // Adjust the path as needed
import '../assets/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={logoHome} alt="Hi Tech Store Logo" className="loader-logo" />
      <h1 className="loader-text">Hi Tech Store</h1>
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
};

export default Loader;
