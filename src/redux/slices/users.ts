import type { IUser, IUserState } from "@/@types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { USER_PAHTS } from "@/constants/userPaths";

const initialState: IUserState = {
  errorMessage: "",
  isLoading: false,
  user: null,
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setLoading, setError, setUsers, setUser } = userSlice.actions;

export default userSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get(API_KEY + USER_PAHTS.GET_USERS);
    // console.log("data users is , ", data);
    dispatch(setUsers(data));
  } catch (err) {
    if (err instanceof Error) setError(err.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getUser = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get(
      API_KEY + USER_PAHTS.GET_USER.replace(":id", String(id)),
    );

    // console.log("data user is , ", data);

    dispatch(setUser(data));
  } catch (err) {
    if (err instanceof Error) setError(err.message);
  } finally {
    dispatch(setLoading(false));
  }
};
