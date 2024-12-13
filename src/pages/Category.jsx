import React, { useEffect, useState } from "react";
import { fetchBrands } from "../services/api";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import "../assets/styles.css";

const Category = () => {
  const { categoryId } = useParams();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryBrands = async () => {
      try {
        const brandsData = await fetchBrands(categoryId);
        if (brandsData && brandsData.length > 0) {
          setBrands(brandsData);
        } else {
          setBrands([]);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch category brands");
        setLoading(false);
      }
    };

    fetchCategoryBrands();
  }, [categoryId]);

  const brandImages = {
    Apple: "https://i.imgur.com/kj8359y.png",
    Samsung: "https://i.imgur.com/1JZRwVk.png",
    LG: "https://i.imgur.com/xbaTSU3.png",
    ASUS: "https://i.imgur.com/xplG1of.png",
    "Sony Playstation": "https://i.imgur.com/tCgvuAu.png",
    Sony: "https://i.imgur.com/MI4OPNe.png",
    Dell: "https://i.imgur.com/lROcjlo.png",
    Bose: "https://i.imgur.com/NRCHhdC.png",
    Microsoft: "https://i.imgur.com/e3DWcUJ.png",
    Nintendo: "https://i.imgur.com/gU7rUUW.png",
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="body">
      <div className="categoryPage">
        <h1 className="page-title">Choisissez une marque</h1>
        <div className="brand-grid">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand._id} className="brand-card">
                <Link to={`/products/${categoryId}/brands/${brand._id}`}>
                  <div
                    className="brand-image"
                    style={{
                      backgroundImage: `url(${brandImages[brand.name] || ""})`,
                    }}
                  ></div>
                  <h2>{brand.name}</h2>
                </Link>
              </div>
            ))
          ) : (
            <p>No brands found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
