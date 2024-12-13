import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const fetchVariantsAsync = createAsyncThunk(
  "variants/fetchVariants",
  async ({ categoryId, brandId, modelId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/categories/${categoryId}/brands/${brandId}/models/${modelId}/variants`
      );

      const variantsData = response.data.data;

      if (!variantsData || variantsData.length === 0) {
        throw new Error("No variants found for the provided model.");
      }

      return {
        model: null,
        variants: variantsData,
      };
    } catch (error) {
      console.error("Error while fetching variants:", error);
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch variants."
      );
    }
  }
);

const variantsSlice = createSlice({
  name: "variants",
  initialState: {
    model: null,
    variants: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantsAsync.pending, (state) => {
        console.info("Fetching variants...");
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVariantsAsync.fulfilled, (state, action) => {
        console.info(
          "Variants fetch successful. Model and Variants data loaded."
        );
        state.status = "succeeded";
        state.model = action.payload.model;
        state.variants = action.payload.variants;
      })
      .addCase(fetchVariantsAsync.rejected, (state, action) => {
        console.error("Failed to fetch variants. Error:", action.payload);
        state.status = "failed";
        state.error =
          action.payload || "An error occurred while fetching variants.";
      });
  },
});

export default variantsSlice.reducer;
