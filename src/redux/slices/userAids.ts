import type { IUserAids, IUserAidsState } from "@/@types/userAids";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { API_KEY } from "@/config/api";
import { USER_AIDS_PAHTS } from "@/constants/userAidsPaths";
import axios from "axios";

const initialState: IUserAidsState = {
  errorMessage: "",
  isLoading: false,
  userAid: null,
  userAids: [],
};

const userAidsSlice = createSlice({
  name: "userAids",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setUserAids: (state, action: PayloadAction<IUserAids[]>) => {
      state.userAids = action.payload;
    },
  },
});

export const { setError, setLoading, setUserAids } = userAidsSlice.actions;

export default userAidsSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getUserAids = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const { data } = await axios.get(API_KEY + USER_AIDS_PAHTS.GET_USER_AIDS);
    console.log('data userAids in slice, ', data);
    dispatch(setUserAids(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
