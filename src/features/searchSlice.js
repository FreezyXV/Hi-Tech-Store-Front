import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const searchModelsAsync = createAsyncThunk(
  "search/searchModels",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/search?q=${query}`);
      return response.data; // Search results
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search models");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchModelsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchModelsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store search results
      })
      .addCase(searchModelsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to search models";
      });
  },
});

export default searchSlice.reducer;
