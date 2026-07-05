import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { API_KEY } from "@/config/api";
import axios from "axios";
import type { IArea } from "@/@types/area";
import { AREA_PATHS } from "@/constants/apiPaths";

interface IAreaState {
  error: string | null;
  isFetching: boolean;
  areas: IArea[];
  area: IArea | null;
}

const initialState: IAreaState = {
  error: "",
  isFetching: false,
  areas: [],
  area: null,
};

const areaSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAreas: (state, action: PayloadAction<IArea[]>) => {
      state.areas = action.payload;
    },
    setArea: (state, action: PayloadAction<IArea>) => {
      state.area = action.payload;
    },
  },
});

export const { setFetching, setError, setArea, setAreas } = areaSlice.actions;

export default areaSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getAreas = (token?: string) => async (dispatch: AppDispatch) => {
  dispatch(setFetching(true));
  dispatch(setError(null));
  try {
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;
    const { data } = await axios.get<IArea[]>(
      API_KEY + AREA_PATHS.GET_AREAS,
      headers,
    );
    dispatch(setAreas(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setFetching(false));
  }
};

export const getArea =
  (id: number, token?: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));

    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get<IArea>(
        API_KEY + AREA_PATHS.GET_AREA.replace(":id", String(id)),
        headers,
      );
      dispatch(setArea(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };
