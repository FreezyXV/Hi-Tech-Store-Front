// store.js
import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./features/categoriesSlice";
import cartReducer from "./features/cartSlice";
import brandsReducer from "./features/brandsSlice";
import modelsReducer from "./features/modelsSlice";
import variantsReducer from "./features/variantsSlice";
import wishlistReducer from "./features/wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    models: modelsReducer,
    variants: variantsReducer,
    wishlist: wishlistReducer,
  },
});

export default store;

