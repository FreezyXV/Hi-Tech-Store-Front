import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchSearchResults } from "../services/api";
import Footer from "../components/Footer";
import "../assets/styles.css";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="brand-page">
      <h1 className="PageTile">Search Results for "{query}"</h1>
      {results.length > 0 ? (
        results.map((result) => {
          const lowestPrice = result.variants?.length
            ? Math.min(...result.variants.map((variant) => variant.price))
            : null;

          return (
            <Link
              key={result._id}
              to={`/products/${result.category}/brands/${result.brand}/models/${result._id}`}
              className="model-card-link"
            >
              <div className="model-card">
                <img
                  src={result.imageUrls || "https://via.placeholder.com/150"}
                  alt={result.name}
                  className="model-image"
                />
                <div className="model-details">
                  <h2>{result.name}</h2>
                  <p>{result.brand}</p>
                  <p className="model-price">
                    {lowestPrice
                      ? `Starting at ${lowestPrice.toLocaleString()} €`
                      : "Price not available"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <p>No results found</p>
      )}
      <Footer />
    </div>
  );
};

export default SearchBarResults;
