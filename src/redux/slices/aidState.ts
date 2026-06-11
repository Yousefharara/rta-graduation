// store/slices/aidSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AidState {
  currentStep: number;
}

const initialState: AidState = {
  currentStep: 0,
};

const aidSlice = createSlice({
  name: "aid",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
  },
});

export const { setCurrentStep } = aidSlice.actions;
export default aidSlice.reducer;