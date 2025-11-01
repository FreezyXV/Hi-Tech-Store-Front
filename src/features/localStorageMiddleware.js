// src/features/localStorageMiddleware.js

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart.items);
    localStorage.setItem("cart", serializedState);
  } catch (e) {
    console.error("Could not save state to localStorage", e);
  }
};

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("cart/")) {
    const state = store.getState();
    saveToLocalStorage(state);
  }
  return result;
};

export default localStorageMiddleware;
