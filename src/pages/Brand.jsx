import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchModelsWithStartPrice } from "../services/api";
import Footer from "../components/Footer";
import "../assets/styles.css";
import "../assets/allModelsPage.css";

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
      } catch (fetchError) {
        setError("Failed to fetch brand models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandModels();
  }, [categoryId, brandId]);

  const brandName = useMemo(() => {
    if (models.length > 0) {
      return models[0]?.brand?.name || models[0]?.brandName || "Choisissez un modèle";
    }
    return "Cette marque";
  }, [models]);

  const resolveStartingPrice = (model) => {
    if (typeof model?.startPrice === "number") return model.startPrice;
    if (typeof model?.price === "number") return model.price;
    if (Array.isArray(model?.variants) && model.variants.length) {
      const numericPrices = model.variants
        .map((variant) => variant?.price)
        .filter((price) => typeof price === "number");
      if (numericPrices.length) return Math.min(...numericPrices);
    }
    return null;
  };

  const formatPrice = (value) =>
    typeof value === "number"
      ? `À partir de ${value.toLocaleString("fr-FR")} €`
      : "Tarif à venir";

  const totalVariants = models.reduce(
    (acc, model) =>
      acc + (typeof model.variantCount === "number" ? model.variantCount : 0),
    0
  );

  const heroStartingPrice = formatPrice(
    models.reduce((minPrice, model) => {
      const price = resolveStartingPrice(model);
      if (price === null) return minPrice;
      if (minPrice === null || price < minPrice) return price;
      return minPrice;
    }, null)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main-allproducts app-gradient">
      <div className="all-models-page page-shell stack-lg">
        <div className="section-panel section-panel--subtle brand-hero-panel brand-hero-panel--split">
          <div className="brand-hero-copy">
            <p className="eyebrow">Collection exclusive</p>
            <h1 className="page-title">{brandName}</h1>
            <p className="page-lede">
              Une sélection concise pour comparer les silhouettes, finitions et tarifs
              avant de plonger dans chaque fiche produit. Filtrez vos priorités, puis
              laissez-vous guider.
            </p>
            <div className="brand-hero-summary">
              <span>{models.length} modèles</span>
              <span>{heroStartingPrice}</span>
              <span>
                {totalVariants > 0 ? `${totalVariants}+ variantes` : "Variantes sur demande"}
              </span>
            </div>
          </div>
          <div className="brand-hero-sidebar">
            <p className="brand-hero-sidebar__eyebrow">Cap sur l&apos;essentiel</p>
            <h2>Choisissez un modèle</h2>
            <p>
              Comparez rapidement les coloris, options de stockage et niveaux de prix. Chaque
              carte vous amène directement à la fiche détaillée.
            </p>
            <div className="brand-hero-sidebar__actions">
              <Link
                className="brand-hero-sidebar__pill"
                to={`/products/${categoryId}`}
              >
                Retour catégorie
              </Link>
              <Link
                className="brand-hero-sidebar__pill brand-hero-sidebar__pill--primary"
                to="/cart"
              >
                Voir mon panier
              </Link>
            </div>
          </div>
        </div>
        <div className="section-panel model-collection">
          {models.length > 0 ? (
            <div className="models-list">
              {models.map((model, index) => {
                const highlights = model.features?.length
                  ? model.features.slice(0, 2).join(" · ")
                  : "Toutes les specs sur la fiche détaillée";
                const featurePills = model.features?.slice(0, 3) || [];
                const imageUrl = Array.isArray(model.imageUrls)
                  ? model.imageUrls[0]
                  : model.imageUrls || "https://via.placeholder.com/150";
                const startingPrice = resolveStartingPrice(model);
                const variantBadge =
                  typeof model.variantCount === "number" && model.variantCount > 0
                    ? `${model.variantCount} déclinaisons`
                    : "Voir la fiche";

                return (
                  <Link
                    key={model._id}
                    to={`/products/${categoryId}/brands/${brandId}/models/${model._id}`}
                    className={`model-card-link ${index % 2 === 0 ? "alt" : ""}`}
                  >
                    <div className="model-card">
                      <div className="model-media">
                        <img
                          src={imageUrl}
                          alt={model.name || "Model"}
                          className="model-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="model-details">
                        <div className="model-copy">
                          <p className="chip chip--soft">Disponible</p>
                          <h2>{model.name || "Modèle sans nom"}</h2>
                          <p className="model-subline">{brandName}</p>
                          <p className="model-meta">{highlights}</p>
                          <p className="model-price">{formatPrice(startingPrice)}</p>
                          {featurePills.length > 0 && (
                            <div className="model-pill-row">
                              {featurePills.map((feature) => (
                                <span key={feature} className="model-pill">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
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
              })}
            </div>
          ) : (
            <div className="models-empty">
              <p className="models-empty__eyebrow">Bientôt disponible</p>
              <h3>Aucun modèle répertorié</h3>
              <p>
                Nous travaillons à enrichir cette sélection. Revenez prochainement
                ou explorez d&apos;autres marques.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Brand;
