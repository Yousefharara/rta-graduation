import { type RoleType } from "@/constants/roles";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { AUTH_PATHS } from "@/constants/apiPaths";
import { API_KEY } from "@/config/api";
import type { IAuth } from "@/@types/auth";
import type { IUsers } from "@/@types/users";

interface IInitialState {
  user: IUsers | null;
  accessToken: string | null;
  role: RoleType | undefined;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: IInitialState = {
  user: null,
  accessToken: null,
  role: "guest",
  errorMessage: "",
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    login: (state, action: PayloadAction<IInitialState>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.user?.role;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.role = "guest";
    },
  },
});

export const { login, logout, setError, setLoading } = authSlice.actions;

export default authSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const setLogin = (body: IAuth) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.post(API_KEY + AUTH_PATHS.LOGIN, body);
    console.log('data test login : ', data);
    dispatch(login(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
