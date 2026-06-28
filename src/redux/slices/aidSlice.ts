import type { IAid } from "@/@types/aid";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { AID_PAHTS } from "@/constants/aidPaths";
import { API_KEY } from "@/config/api";

interface IAidState {
  error: string | null,
  isLoading: boolean,
  aids: IAid[],
  aid: IAid | null,
}

const initialState: IAidState = {
  error: null,
  isLoading: false,
  aids: [],
  aid: null,
};

const aidSlice = createSlice({
  name: "aids",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAids: (state, action: PayloadAction<IAid[]>) => {
      state.aids = action.payload;
    },
    setAid: (state, action: PayloadAction<IAid>) => {
      state.aid = action.payload;
    },
  },
});

export const { setLoading, setError, setAids, setAid } = aidSlice.actions;

export default aidSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getAids = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get(API_KEY + AID_PAHTS.GET_AIDS);

    dispatch(setAids(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getAid = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get(API_KEY + AID_PAHTS.GET_AID.replace(":id", String(id)));

    dispatch(setAid(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
