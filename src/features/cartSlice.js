import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage
const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    const items = savedCart ? JSON.parse(savedCart) : [];
    // Filter out any items where item.variant or item.variant._id is missing
    return items.filter((item) => item && item.variant && item.variant._id);
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromLocalStorage(),
  },
  reducers: {
    addItemToCart: (state, action) => {
      const { variant, quantity } = action.payload;

      if (!variant || !variant._id || typeof quantity !== "number") {
        console.error("Invalid variant or quantity:", action.payload);
        return;
      }

      const existingItem = state.items.find(
        (item) => item.variant && item.variant._id === variant._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ variant, quantity });
      }

      saveCartToLocalStorage(state.items);
    },

    removeItemFromCart: (state, action) => {
      const { variantId } = action.payload;

      if (!variantId) {
        console.error("Invalid variantId:", action.payload);
        return;
      }

      state.items = state.items.filter(
        (item) => item.variant._id !== variantId
      );

      saveCartToLocalStorage(state.items);
    },
    updateItemQuantity: (state, action) => {
      const { variantId, quantity } = action.payload;

      if (!variantId || typeof quantity !== "number" || quantity < 1) {
        console.error(
          "Invalid payload for updateItemQuantity:",
          action.payload
        );
        return;
      }

      const item = state.items.find((item) => item.variant._id === variantId);

      if (item) {
        item.quantity = quantity;

        saveCartToLocalStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];

      saveCartToLocalStorage(state.items);
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
