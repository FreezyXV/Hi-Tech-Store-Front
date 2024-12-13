import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("wishlist");
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    console.warn("Could not load wishlist from localStorage", e);
    return [];
  }
};

const saveWishlistToLocalStorage = (wishlist) => {
  try {
    const serializedState = JSON.stringify(wishlist);
    localStorage.setItem("wishlist", serializedState);
  } catch (e) {
    console.warn("Could not save wishlist to localStorage", e);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlistFromLocalStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const variant = action.payload;
      const exists = state.items.find((item) => item.id === variant.id);
      if (!exists) {
        state.items.push(variant);
        saveWishlistToLocalStorage(state.items); // Save to localStorage
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToLocalStorage(state.items); // Save to localStorage
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

