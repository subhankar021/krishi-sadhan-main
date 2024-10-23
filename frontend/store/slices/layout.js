import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosHttpInstance from "../../utils/axiosHttpInstance";

// Define the asynchronous thunk action
export const getLayout = createAsyncThunk("layout/getLayout", async () => {
  try {
    const response = await axiosHttpInstance.get('/api/layout/');
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error('Failed to fetch layout');
    }
  } catch (error) {
    throw error;
  }
});

export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    layout: undefined,
    isLoading: false,
    hasError: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLayout.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getLayout.fulfilled, (state, action) => {
        state.layout = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getLayout.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        console.error('Error fetching layout:', action.error.message);
      });
  }
});

// Selectors
export const selectlayout = (state) => state.layout.layout;
export const selectLoadingState = (state) => state.layout.isLoading;
export const selectErrorState = (state) => state.layout.hasError;

export default layoutSlice.reducer;
