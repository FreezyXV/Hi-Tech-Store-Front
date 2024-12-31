import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchModels } from '../services/api';


export const fetchModelsAsync = createAsyncThunk(
  'models/fetchModels',
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await fetchModels(brandId);
      return response.data;
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
        state.error = action.payload;
      });
  },
});

export default modelsSlice.reducer;
