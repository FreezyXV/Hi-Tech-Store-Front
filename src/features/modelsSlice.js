import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchModelsAsync = createAsyncThunk(
  'models/fetchModels',
  async ({ categoryId, brandId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/categories/${categoryId}/brands/${brandId}/models`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch models');
    }
  }
);


const modelsSlice = createSlice({
  name: 'models',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchModelsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchModelsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch models';
      });
  },
});


export default modelsSlice.reducer;
