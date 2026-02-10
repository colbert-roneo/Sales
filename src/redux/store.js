import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './slices/salesSlice';
import itemReducer from './slices/itemSlice';

export const store = configureStore({
  reducer: {
    sales: salesReducer,
    items: itemReducer,
  },
});