import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosHttpInstance from "../../utils/axiosHttpInstance";

export const getCategoriesList = createAsyncThunk("categoriesList/getCategoriesList", async () => {
  try {
    const response = await axiosHttpInstance.get('/api/categories/list');
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch categories');
    }
  } catch (error) {
    throw error;
  }
});

export const categorySlice = createSlice({
  name: "categoriesList",
  initialState: {
    categories: undefined,
    isLoading: false,
    hasError: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesList.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCategoriesList.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getCategoriesList.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        // Optionally log or handle the error
        console.error('Error fetching categories:', action.error.message);
      });
  }
});

// Selectors
export const selectCategories = (state) => state.categories.categories;
export const selectLoadingState = (state) => state.categories.isLoading;
export const selectErrorState = (state) => state.categories.hasError;

export default categorySlice.reducer;
