import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchModelsWithStartPrice } from "../services/api";
import Footer from "../components/Footer";
import "../assets/styles.css";

const Brand = () => {
  const { categoryId, brandId } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandModels = async () => {
      try {
        if (!categoryId || !brandId) return;
        const modelsData = await fetchModelsWithStartPrice(categoryId, brandId);
        setModels(modelsData && modelsData.length > 0 ? modelsData : []);
      } catch (error) {
        setError("Failed to fetch brand models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandModels();
  }, [categoryId, brandId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="body">
      <div className="brand-page">
        <h1 className="page-title">Choisissez votre Modèle</h1>
        {models.length > 0 ? (
          <div className="models-grid">
            {models.map((model) => {
              const lowestPrice = model.startPrice ?? null;
              return (
                <Link
                  key={model._id}
                  to={`/products/${categoryId}/brands/${brandId}/models/${model._id}`}
                  className="model-card-link"
                >
                  <div className="model-card">
                    <img
                      src={model.imageUrls || "https://via.placeholder.com/150"}
                      alt={model.name || "Model Image"}
                      className="model-image"
                    />
                    <div className="model-details">
                      <h2>{model.name || "Model Name Not Available"}</h2>
                      <p>
                        {model.features?.length
                          ? model.features.join(" · ")
                          : "Features not available"}
                      </p>
                      <p className="model-price">
                        {lowestPrice
                          ? `Prix à partir de ${lowestPrice.toLocaleString()} €`
                          : "Price not available"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="no-models-message">No models found</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Brand;
