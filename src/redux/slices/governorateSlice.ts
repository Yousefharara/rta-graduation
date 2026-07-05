import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { API_KEY } from "@/config/api";
import { GOVERNORATE_PATHS } from "@/constants/apiPaths";
import axios from "axios";
import type { IGovernorate } from "@/@types/governorate";

interface IGovernorateState {
  error: string | null;
  isFetching: boolean;
  governorates: IGovernorate[];
  governorate: IGovernorate | null;
}

const initialState: IGovernorateState = {
  error: "",
  isFetching: false,
  governorates: [],
  governorate: null,
};

const governorateSlice = createSlice({
  name: "governorates",
  initialState,
  reducers: {
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setGovernorates: (state, action: PayloadAction<IGovernorate[]>) => {
      state.governorates = action.payload;
    },
    setGovernorate: (state, action: PayloadAction<IGovernorate>) => {
      state.governorate = action.payload;
    },
  },
});

export const { setFetching, setError, setGovernorate, setGovernorates } =
  governorateSlice.actions;

export default governorateSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getGovernorates =
  (token?: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));
    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get<IGovernorate[]>(
        API_KEY + GOVERNORATE_PATHS.GET_GOVERNORATES,
        headers,
      );
      dispatch(setGovernorates(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };

export const getGovernorate =
  (id: number, token?: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));

    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get<IGovernorate>(
        API_KEY + GOVERNORATE_PATHS.GET_GOVERNORATE.replace(":id", String(id)),
        headers,
      );
      dispatch(setGovernorate(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };
