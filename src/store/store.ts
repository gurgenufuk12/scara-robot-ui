// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import robotReducer from "./robotSlice";

export const store = configureStore({
  reducer: {
    robot: robotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
