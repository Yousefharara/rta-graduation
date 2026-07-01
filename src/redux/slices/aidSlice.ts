import type { IAid, ICreateAid } from "@/@types/aid";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { AID_PATHS } from "@/constants/apiPaths";

interface IAidState {
  error: string | null;
  isCreating: boolean;
  isFetching: boolean;
  aids: IAid[];
  aid: IAid | null;
}

const initialState: IAidState = {
  error: null,
  isCreating: false,
  isFetching: false,
  aids: [],
  aid: null,
};

const aidSlice = createSlice({
  name: "aids",
  initialState,
  reducers: {
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
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
    addAid: (state, action: PayloadAction<IAid>) => {
      state.aids = [...state.aids, action.payload];
    },
  },
});

export const { setCreating, addAid, setFetching, setError, setAids, setAid } =
  aidSlice.actions;

export default aidSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getAids = (token: string) =>  async (dispatch: AppDispatch) => {
  dispatch(setFetching(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get(API_KEY + AID_PATHS.GET_AIDS, {headers: {Authorization: `Bearer ${token}`}});

    dispatch(setAids(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setFetching(false));
  }
};

export const addAidAction =
  (body: ICreateAid, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(null));

    console.log("body is < ", body);
    try {
      const { data } = await axios.post<IAid>(
        API_KEY + AID_PATHS.CREATE_AID,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("data is < ", data);
      dispatch(addAid(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setCreating(false));
    }
  };
