// api.js
import axios from "axios";

// Determine the API URL based on environment variables
const API_URL =
  import.meta.env.VITE_API_URL_LOCAL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:5002";
console.log(`API_URL: ${API_URL}`);

// Function to retrieve the token from localStorage
const getToken = () => localStorage.getItem("authToken");

// Create an axios instance with the base URL and timeout
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to handle API errors with retry logic
const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    console.error("Request timeout:", error.message);
    throw new Error("Request timed out. Please try again.");
  }

  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      "An error occurred";

    if (status >= 400 && status < 500) {
      // Client-side errors
      throw new Error(message);
    } else if (status >= 500) {
      // Server-side errors
      console.error("Server error:", error.response.data);
      throw new Error("Server error occurred. Please try again later.");
    }
  } else if (error.request) {
    // Network errors (no response received)
    console.error("Network error:", error.message);
    throw new Error("Network error occurred. Please check your connection.");
  } else {
    // Something else happened
    console.error("Unexpected error:", error.message);
    throw new Error("An unexpected error occurred.");
  }
};

// Retry utility function
const retryRequest = async (requestFn, maxRetries = 2, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries + 1) {
        throw error; // Final attempt failed
      }

      // Only retry on network errors or 5xx errors
      const shouldRetry =
        !error.response ||
        error.response.status >= 500 ||
        error.code === 'ECONNABORTED';

      if (!shouldRetry) {
        throw error; // Don't retry client errors
      }

      console.log(`Request failed (attempt ${attempt}/${maxRetries + 1}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
};

export { axiosInstance, handleApiError, retryRequest };

// Fetch categories
export const fetchCategories = async () => {
  return retryRequest(async () => {
    try {
      const response = await axiosInstance.get("/categories");
      console.log("Categories fetched:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      handleApiError(error);
    }
  });
};

export const fetchPaymentIntent = async (orderPayload) => {
  try {
    console.log("Order Payload before fetchPaymentIntent:", orderPayload);
    const response = await axiosInstance.post(
      "/orders/create-payment-intent",
      orderPayload
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch brands for a specific category
export const fetchBrands = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/brands`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    handleApiError(error);
  }
};

// Fetch models for a specific brand
export const fetchModels = async (categoryId, brandId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/brands/${brandId}/models`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    handleApiError(error);
  }
};

// Updated to include categoryId and brandId, and match the corrected route
export const fetchModelsWithStartPrice = async (categoryId, brandId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/brands/${brandId}/models-with-start-price`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching models with start price:", error);
    handleApiError(error);
  }
};

// Fetch models by category
export const fetchModelsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/models`
    );
    console.log("Fetched models:", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching models for category:", error);
    handleApiError(error);
  }
};

// Fetch all models directly by category
export const fetchAllModelsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/all-models`
    );
    console.log("Fetched models:", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching models by category:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch models");
  }
};

// Fetch a specific model by ID
export const fetchModelById = async (categoryId, brandId, modelId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/brands/${brandId}/models/${modelId}`
    );
    const modelData = response.data.data;

    if (!modelData.variants || modelData.variants.length === 0) {
      console.warn("No variants found for this model:", modelData);
      return { ...modelData, variants: [] };
    }

    if (
      typeof modelData.variants[0] === "object" &&
      modelData.variants[0]._id
    ) {
      console.log("Model and variants fetched successfully:", modelData);
      return modelData;
    } else {
      const variantDetails = await Promise.all(
        modelData.variants.map((variantId) => fetchVariantById(variantId))
      );
      console.log(
        "Model and variants fetched successfully:",
        modelData,
        variantDetails
      );
      return { ...modelData, variants: variantDetails };
    }
  } catch (error) {
    console.error("Error fetching model:", error);
    handleApiError(error);
  }
};

// Fetch a single variant by ID
export const fetchVariantById = async (variantId) => {
  try {
    const response = await axiosInstance.get(`/variants/${variantId}`);
    return response.data.data || {};
  } catch (error) {
    console.error("Error fetching variant by ID:", error);
    handleApiError(error);
  }
};

// Fetch variants for a specific model
export const fetchVariants = async (categoryId, brandId, modelId) => {
  try {
    const response = await axiosInstance.get(
      `/categories/${categoryId}/brands/${brandId}/models/${modelId}/variants`
    );
    console.log("Variants fetched:", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching variants:", error);
    handleApiError(error);
  }
};

// Fetch cart details
export const fetchCart = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data.items || [];
  } catch (error) {
    handleApiError(error);
  }
};

// Add an item to the cart
export const addToCartAsync = async (item) => {
  try {
    const response = await axiosInstance.post("/cart/add", item);
    return response.data.cart || {};
  } catch (error) {
    handleApiError(error);
  }
};

export const placeOrder = async (orderPayload) => {
  try {
    const response = await axiosInstance.post("/orders", orderPayload);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

// User authentication APIs
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response?.data?.token) {
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    handleApiError(error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration API Error:", error);
    handleApiError(error);
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data;
  } catch (err) {
    throw new Error("Error fetching user profile");
  }
};

// changeUserPassword
export const changeUserPassword = async (passwords) => {
  try {
    const response = await axiosInstance.put(
      "/auth/change-password",
      passwords
    );
    return response.data;
  } catch (err) {
    throw new Error("Error changing password");
  }
};

// Fetch search results
export const fetchSearchResults = async (query) => {
  try {
    const response = await axiosInstance.get(`/search?q=${query}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    handleApiError(error); // Handle errors using the centralized error handler
  }
};

// Fetch multiple variants by IDs
export const fetchVariantsByIds = async (variantIds) => {
  try {
    const response = await axiosInstance.post("/variants/batch", {
      variantIds,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching variants by IDs:", error);
    handleApiError(error);
  }
};

// Fetch reviews
export const fetchReviews = async ({ modelId, variantId }) => {
  try {
    const url = modelId
      ? `/reviews/models/${modelId}`
      : `/reviews/variants/${variantId}`;
    const response = await axiosInstance.get(url);
    return response.data; // Assuming API returns an array of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};

// Submit review
export const submitReview = async ({ modelId, variantId, review }) => {
  try {
    const url = modelId
      ? `/reviews/models/${modelId}`
      : `/reviews/variants/${variantId}`;
    const response = await axiosInstance.post(url, review);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw new Error("Failed to submit review");
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
};

export const fetchWishlistFromServer = async () => {
  try {
    const response = await axiosInstance.get("/auth/wishlist");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching wishlist from server:", error);
    handleApiError(error);
  }
};

export const addWishlistItem = async (variantId) => {
  try {
    await axiosInstance.post("/auth/wishlist", { variantId });
  } catch (error) {
    console.error("Error adding wishlist item:", error);
    handleApiError(error);
  }
};

export const removeWishlistItem = async (variantId) => {
  try {
    await axiosInstance.delete(`/auth/wishlist/${variantId}`);
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    handleApiError(error);
  }
};

export default axiosInstance;
