import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RoleType = 'user' | 'admin' | 'guest'

interface IInitialState {
  user: string | null;
  token: string | null;
  role: RoleType
}

const initialState: IInitialState = {
  user: null,
  token: null,
  role: 'guest'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IInitialState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = 'guest'
    },
  },
});

export const {login, logout} = authSlice.actions

export default authSlice.reducer