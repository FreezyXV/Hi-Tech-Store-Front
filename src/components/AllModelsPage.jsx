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
    <div className="main-allproducts app-gradient">
      <div className="all-models-page page-shell stack-lg">
        <div className="section-panel section-panel--subtle stack-md">
          <p className="eyebrow">Full Lineup</p>
          <h1 className="page-title">All Models</h1>
          <p className="page-lede">
            Compare les silhouettes, les coloris et les configurations avant de
            basculer vers la fiche produit.
          </p>
        </div>
        <div className="section-panel model-collection">
          <div className="models-list">
            {models.length > 0 ? (
              models.map((model, index) => {
                const brandLabel =
                  model.brandName ||
                  model.brand?.name ||
                  "Fiche détaillée";
                const highlights = model.features?.length
                  ? model.features.slice(0, 2).join(" · ")
                  : "Toutes les specs dans la fiche produit";
                const variantBadge =
                  typeof model.variantCount === "number" && model.variantCount > 0
                    ? `${model.variantCount} déclinaisons`
                    : "Voir la fiche";
                return (
                  <Link
                    key={model._id}
                    to={`/products/${categoryId}/brands/${model.brandId}/models/${model._id}`}
                    className={`model-card-link ${index % 2 === 0 ? "alt" : ""}`}
                  >
                    <div className="model-card">
                      <div className="model-media">
                        <img
                          src={model.imageUrls || "https://via.placeholder.com/150"}
                          alt={model.name}
                          className="model-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="model-details">
                        <div className="model-copy">
                          <p className="chip chip--soft">Disponible</p>
                          <h2>{model.name}</h2>
                          <p className="model-subline">{brandLabel}</p>
                          <p className="model-meta">{highlights}</p>
                        </div>
                        <div className="model-cta">
                          <span className="model-cta-label">{variantBadge}</span>
                          <span className="model-arrow" aria-hidden="true">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="models-empty">
                <p className="models-empty__eyebrow">Catalogue à venir</p>
                <h3>Les modèles se préparent encore</h3>
                <p>
                  Revenez un peu plus tard ou explorez une autre catégorie pour
                  découvrir nos nouveautés.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllModelsPage;
