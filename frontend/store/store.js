// store.js
import { configureStore } from '@reduxjs/toolkit';
import categorySlice from './slices/category';
import layoutSlice from './slices/layout';

export const store = configureStore({
  reducer: {
    categories: categorySlice,
    layout: layoutSlice
  },
});