// DropdownMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../assets/dropdownMenu.css";

const DropdownMenu = ({
  models,
  categoryId,
  visible,
  loadingModels,
  onModelClick,
}) => {
  if (!visible) return null;

  const limitedModels = models[categoryId]?.slice(0, 4) || [];

  return (
    <div className={`dropdown-menu ${visible ? "visible" : ""}`}>
      <Link
        to={`/products/${categoryId}/all-models`}
        className="dropdown-item explore-all"
        onClick={onModelClick}
      >
        <div className="item-text">
          <span className="exploreAll">Explore All</span>
        </div>
      </Link>
      <div className="dropdown-items">
        {loadingModels ? (
          <p className="loading">Loading models...</p>
        ) : limitedModels.length > 0 ? (
          limitedModels.map((model) => (
            <Link
              key={model._id}
              to={`/products/${categoryId}/brands/${model.brandId}/models/${model._id}`}
              className="dropdown-item"
              onClick={onModelClick}
            >
              <img
                src={model.imageUrls || "https://via.placeholder.com/100"}
                alt={model.name || "Model"}
                className="item-image"
                loading="lazy"
              />
              <div className="item-text">
                <span className="item-name">{model.name}</span>
                <span className="item-action">BUY NOW →</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-models">No models available</p>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
