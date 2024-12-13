import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (productId) => {
  const response = await axios.get(`/api/reviews/${productId}`);
  return response.data;
});

export const addReview = createAsyncThunk('reviews/addReview', async (review) => {
  const response = await axios.post('/api/reviews', review);
  return response.data;
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export default reviewsSlice.reducer;
