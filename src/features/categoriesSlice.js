// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { normalize, schema } from "normalizr";
// import { fetchCategories } from "../services/api";

// const variantSchema = new schema.Entity("variants", {}, { idAttribute: "_id" });
// const modelSchema = new schema.Entity(
//   "models",
//   { variants: [variantSchema] },
//   { idAttribute: "_id" }
// );
// const brandSchema = new schema.Entity(
//   "brands",
//   { models: [modelSchema] },
//   { idAttribute: "_id" }
// );
// const categorySchema = new schema.Entity(
//   "categories",
//   { brands: [brandSchema] },
//   { idAttribute: "_id" }
// );

// export const fetchCategoriesAsync = createAsyncThunk(
//   "categories/fetchCategories",
//   async (_, { rejectWithValue }) => {
//     try {
//       const categoriesData = await fetchCategories();

//       const normalizedData = normalize(categoriesData, [categorySchema]);

//       return normalizedData.entities;
//     } catch (error) {
//       console.error("Error in fetchCategoriesAsync:", error);
//       return rejectWithValue(error.message || "Failed to fetch categories");
//     }
//   }
// );

// const initialState = {
//   data: {},
//   brands: {},
//   models: {},
//   variants: {},
//   status: "idle",
//   error: null,
// };

// const categoriesSlice = createSlice({
//   name: "categories",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategoriesAsync.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = action.payload.categories || {};
//         state.brands = action.payload.brands || {};
//         state.models = action.payload.models || {};
//         state.variants = action.payload.variants || {};
//       })
//       .addCase(fetchCategoriesAsync.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to fetch categories";
//       });
//   },
// });

// export default categoriesSlice.reducer;

// export const selectCategories = (state) => state.categories.data;
// export const selectBrands = (state) => state.categories.brands;
// export const selectModels = (state) => state.categories.models;
// export const selectVariants = (state) => state.categories.variants;

// export const selectCategoryWithBrands = (state, categoryId) => {
//   const category = state.categories.data[categoryId];
//   if (!category) return null;

//   return {
//     ...category,
//     brands: category.brands.map((brandId) => state.categories.brands[brandId]),
//   };
// };

// export const selectModelWithVariants = (state, modelId) => {
//   const model = state.categories.models[modelId];
//   if (!model) return null;

//   return {
//     ...model,
//     variants: model.variants.map(
//       (variantId) => state.categories.variants[variantId]
//     ),
//   };
// };


// features/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { normalize, schema } from "normalizr";
import { fetchCategories } from "../services/api";

// Define normalizr schemas
const variantSchema = new schema.Entity("variants", {}, { idAttribute: "_id" });
const modelSchema = new schema.Entity(
  "models",
  { variants: [variantSchema] },
  { idAttribute: "_id" }
);
const brandSchema = new schema.Entity(
  "brands",
  { models: [modelSchema] },
  { idAttribute: "_id" }
);
const categorySchema = new schema.Entity(
  "categories",
  { brands: [brandSchema] },
  { idAttribute: "_id" }
);

// Thunk to fetch and normalize categories
export const fetchCategoriesAsync = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categoriesData = await fetchCategories();
      // Normalize the data structure for easier access in the Redux store
      const normalizedData = normalize(categoriesData, [categorySchema]);
      return normalizedData.entities;
    } catch (error) {
      console.error("Error in fetchCategoriesAsync:", error);
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

const initialState = {
  data: {},
  brands: {},
  models: {},
  variants: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.categories || {};
        state.brands = action.payload.brands || {};
        state.models = action.payload.models || {};
        state.variants = action.payload.variants || {};
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

export default categoriesSlice.reducer;

// Selectors
export const selectCategories = (state) => state.categories.data;
export const selectBrands = (state) => state.categories.brands;
export const selectModels = (state) => state.categories.models;
export const selectVariants = (state) => state.categories.variants;

// Example selector: Get a category along with its brands
export const selectCategoryWithBrands = (state, categoryId) => {
  const category = state.categories.data[categoryId];
  if (!category) return null;

  return {
    ...category,
    brands: category.brands.map((brandId) => state.categories.brands[brandId]),
  };
};

// Example selector: Get a model along with its variants
export const selectModelWithVariants = (state, modelId) => {
  const model = state.categories.models[modelId];
  if (!model) return null;

  return {
    ...model,
    variants: model.variants.map((variantId) => state.categories.variants[variantId]),
  };
};
