import React, { useMemo } from "react";
import { motion } from "framer-motion";
import "../assets/productPage.css";

const ATTRIBUTE_PRIORITY = ["color", "chip", "ram", "storage"];

const VariantSelector = ({
  variants,
  selectedAttributes,
  onAttributeChange,
}) => {
  if (!variants || variants.length === 0) {
    return <p>No variants available for this product.</p>;
  }

  const getRelevantAttributes = () => {
    if (!variants[0]) return [];

    const attributes = Object.keys(variants[0]).filter(
      (key) =>
        ![
          "_id",
          "imageUrls",
          "price",
          "stock",
          "createdAt",
          "updatedAt",
          "sku",
          "name",
          "modelId",
        ].includes(key)
    );

    // First, filter attributes that exist in variants
    const existingAttributes = attributes.filter((attribute) =>
      variants.some(
        (variant) => variant[attribute] && variant[attribute] !== "N/A"
      )
    );

    return [
      ...ATTRIBUTE_PRIORITY.filter((priorityAttr) =>
        existingAttributes.includes(priorityAttr)
      ),
      ...existingAttributes.filter(
        (attr) => !ATTRIBUTE_PRIORITY.includes(attr)
      ),
    ];
  };

  const getOptionsForAttribute = (attribute, dependencies = {}) => {
    let filteredVariants = variants;

    Object.keys(dependencies).forEach((key) => {
      filteredVariants = filteredVariants.filter(
        (variant) => variant[key] === dependencies[key]
      );
    });

    return [
      ...new Set(
        filteredVariants
          .map((variant) => variant[attribute] || "N/A")
          .filter(
            (value) => value !== "N/A" && value !== null && value !== undefined
          )
      ),
    ].sort((a, b) => {
      if (attribute === "ram" || attribute === "storage") {
        // Convert storage values like '128GB', '1TB' to sortable numbers in MB
        const convertToMB = (val) => {
          if (val.includes("TB")) return parseInt(val) * 1024;
          if (val.includes("GB")) return parseInt(val);
          return parseInt(val);
        };
        return convertToMB(a) - convertToMB(b);
      }
      return isNaN(a) || isNaN(b) ? a.localeCompare(b) : a - b;
    });
  };

  const relevantAttributes = useMemo(() => getRelevantAttributes(), [variants]);

  const optionsForAttributes = useMemo(() => {
    return relevantAttributes.map((attribute, index) => {
      const dependencies = relevantAttributes
        .slice(0, index)
        .reduce((acc, attr) => {
          if (selectedAttributes[attr]) {
            acc[attr] = selectedAttributes[attr];
          }
          return acc;
        }, {});

      return {
        attribute,
        options: getOptionsForAttribute(attribute, dependencies),
      };
    });
  }, [relevantAttributes, selectedAttributes, variants]);

  return (
    <div className="variant-selector">
      {optionsForAttributes.map(
        ({ attribute, options }) =>
          options.length > 0 && (
            <div key={attribute} className="attribute-section">
              <h3 className="attribute-title">
                {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
              </h3>
              <div className="attribute-options">
                {options.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => onAttributeChange(attribute, option)}
                    className={`attribute-option ${
                      selectedAttributes[attribute] === option ? "selected" : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Select ${option} for ${attribute}`}
                    tabIndex={0}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default VariantSelector;
