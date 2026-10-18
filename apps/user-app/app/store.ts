import { configureStore } from "@reduxjs/toolkit";
import { balanceReducer } from "@repo/store/balance";

export const store = configureStore({
  reducer: {
    balance: balanceReducer,
  },
});