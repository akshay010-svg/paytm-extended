import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const balanceSlice = createSlice({
  name: "balance",
  initialState: 100,
  reducers: {
    setBalance: (_state, action: PayloadAction<number>) =>
      action.payload,
  },
});

export const { setBalance } = balanceSlice.actions;
export const balanceReducer = balanceSlice.reducer;
