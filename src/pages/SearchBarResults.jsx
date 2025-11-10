import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchSearchResults } from "../services/api";
import Footer from "../components/Footer";
import "../assets/allModelsPage.css";

const SearchBarResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetchSearchResults(query);
        console.log("Search results fetched:", response);
        setResults(response);
      } catch (error) {
        setError("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  const resolveStartingPrice = (model) => {
    if (typeof model?.startPrice === "number") return model.startPrice;
    if (typeof model?.price === "number") return model.price;
    if (Array.isArray(model?.variants) && model.variants.length) {
      const numericPrices = model.variants
        .map((variant) => variant?.price)
        .filter((price) => typeof price === "number");
      if (numericPrices.length) {
        return Math.min(...numericPrices);
      }
    }
    return null;
  };

  const formatPrice = (value) =>
    typeof value === "number"
      ? `À partir de ${value.toLocaleString("fr-FR")} €`
      : "Tarif à venir";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main-allproducts app-gradient">
      <div className="all-models-page page-shell stack-lg">
        <div className="section-panel section-panel--subtle stack-md">
          <p className="eyebrow">Résultats</p>
          <h1 className="page-title">
            Résultats pour &laquo; {query || "—"} &raquo;
          </h1>
          <p className="page-lede">
            Parcourez les modèles correspondants à votre recherche. Chaque carte
            vous amène directement sur la fiche détaillée pour finaliser votre
            sélection.
          </p>
        </div>
        <div className="section-panel model-collection">
          {results.length > 0 ? (
            <div className="models-list">
              {results.map((result, index) => {
                const categoryId = result.category?.id;
                const brandId = result.brand?.id;
                const imageUrl = Array.isArray(result.imageUrls)
                  ? result.imageUrls[0]
                  : result.imageUrls || "https://via.placeholder.com/150";

                if (!categoryId || !brandId) {
                  return null;
                }

                const highlights = result.features?.length
                  ? result.features.slice(0, 2).join(" · ")
                  : "Specs complètes sur la fiche produit";

                const label =
                  typeof result.variantCount === "number" && result.variantCount > 0
                    ? `${result.variantCount} déclinaisons`
                    : "Voir la fiche";
                const startingPrice = resolveStartingPrice(result);

                return (
                  <Link
                    key={result._id}
                    to={`/products/${categoryId}/brands/${brandId}/models/${result._id}`}
                    className={`model-card-link ${index % 2 === 0 ? "alt" : ""}`}
                  >
                    <div className="model-card">
                      <div className="model-media">
                        <img
                          src={imageUrl}
                          alt={result.name}
                          className="model-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="model-details">
                        <div className="model-copy">
                          <p className="chip chip--soft">Disponible</p>
                          <h2>{result.name}</h2>
                          <p className="model-subline">{result.brand?.name}</p>
                          <p className="model-meta">{highlights}</p>
                          <p className="model-price">{formatPrice(startingPrice)}</p>
                        </div>
                        <div className="model-cta">
                          <span className="model-cta-label">{label}</span>
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
              <p className="models-empty__eyebrow">Aucun résultat</p>
              <h3>Essayez un autre terme</h3>
              <p>Modifiez votre requête ou explorez les catégories du catalogue.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchBarResults;
