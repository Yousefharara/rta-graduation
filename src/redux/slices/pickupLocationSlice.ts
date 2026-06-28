import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { API_KEY } from "@/config/api";
import { PICKUP_LOCATION_PATHS } from "@/constants/apiPaths";
import axios from "axios";
import type { IPickupLocation } from "@/@types/pickupLocation";

interface IPickupLocationState {
  errorMessage: string | null;
  isLoading: boolean;
  pickupLocations: IPickupLocation[];
  currentPickupLocation: IPickupLocation | null;
}

const initialState: IPickupLocationState = {
  errorMessage: null,
  isLoading: false,
  pickupLocations: [],
  currentPickupLocation: null,
};

const pickupLocationSlice = createSlice({
  name: "pickupLocations",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    setPickupLocations: (state, action: PayloadAction<IPickupLocation[]>) => {
      state.pickupLocations = action.payload;
    },
    setPickupLocation: (state, action: PayloadAction<IPickupLocation>) => {
      state.currentPickupLocation = action.payload;
    },
    addPickupLocation: (state, action: PayloadAction<IPickupLocation>) => {
      state.pickupLocations = [...state.pickupLocations, action.payload];
    },
    updatePickupLocation: (state, action: PayloadAction<IPickupLocation>) => {
      state.pickupLocations = state.pickupLocations.map((loc) =>
        loc.id === action.payload.id ? action.payload : loc
      );
      if (state.currentPickupLocation && state.currentPickupLocation.id === action.payload.id) {
        state.currentPickupLocation = action.payload;
      }
    },
    removePickupLocation: (state, action: PayloadAction<number>) => {
      state.pickupLocations = state.pickupLocations.filter(
        (loc) => loc.id !== action.payload
      );
      if (state.currentPickupLocation && state.currentPickupLocation.id === action.payload) {
        state.currentPickupLocation = null;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setPickupLocations,
  setPickupLocation,
  addPickupLocation,
  updatePickupLocation,
  removePickupLocation,
} = pickupLocationSlice.actions;

export default pickupLocationSlice.reducer;

// Actions
export const getPickupLocations = (token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get<IPickupLocation[]>(
      API_KEY + PICKUP_LOCATION_PATHS.GET_PICKUP_LOCATIONS,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setPickupLocations(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getPickupLocation = (id: number, token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get<IPickupLocation>(
      API_KEY + PICKUP_LOCATION_PATHS.GET_PICKUP_LOCATION.replace(":id", String(id)),
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setPickupLocation(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const editPickupLocationAction = (
  id: number,
  body: Partial<IPickupLocation>,
  token: string
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.put<IPickupLocation>(
      API_KEY + PICKUP_LOCATION_PATHS.EDIT_PICKUP_LOCATION.replace(":id", String(id)),
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(updatePickupLocation(data));
    return { success: true, data };
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
    return { success: false, error: err };
  } finally {
    dispatch(setLoading(false));
  }
};

export const deletePickupLocationAction = (id: number, token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await axios.delete(
      API_KEY + PICKUP_LOCATION_PATHS.DELETE_PICKUP_LOCATION.replace(":id", String(id)),
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(removePickupLocation(id));
    return { success: true };
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
    return { success: false, error: err };
  } finally {
    dispatch(setLoading(false));
  }
};
