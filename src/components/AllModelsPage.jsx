import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAllModelsByCategory } from "../services/api";
import Footer from '../components/Footer';
import "../assets/allModelsPage.css";

const AllModelsPage = () => {
  const { categoryId } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsData = await fetchAllModelsByCategory(categoryId);
        setModels(modelsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="main-allproducts">
    <div className="all-models-page">
      <h1 className="page-title">All Models</h1>
      <div className="models-list">
        {models.length > 0 ? (
          models.map((model) => (
            <Link
              key={model._id}
              to={`/products/${categoryId}/brands/${model.brandId}/models/${model._id}`}
              className="model-card-link"
            >
              <div className="model-card">
                <img
                  src={model.imageUrls || "https://via.placeholder.com/150"}
                  alt={model.name}
                  className="model-image"
                />
                <div className="model-details">
                  <h2>{model.name}</h2>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>No models available for this category.</div>
        )}
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default AllModelsPage;
