import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICounter {
  value: number;
}

// ! Error here ( must be use initailState as keyword for slice )
const initialState: ICounter = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  // ! Error here ( must be use initailState as keyword for slice )
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementBy: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementBy } = counterSlice.actions;

export default counterSlice.reducer;
