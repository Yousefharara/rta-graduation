import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { API_KEY } from "@/config/api";
import { AID_TYPES_PATHS } from "@/constants/apiPaths";
import axios from "axios";
import type { IAidType } from "@/@types/aidType";
import type { ICreateAid } from "@/@types/aid";

interface IAidTypesState {
  error: string | null;
  isLoading: boolean;
  aidTypes: IAidType[];
  aidType: IAidType | null;
}

const initialState: IAidTypesState = {
  error: null,
  isLoading: false,
  aidTypes: [],
  aidType: null,
};

const aidTypesSlice = createSlice({
  name: "aidTypes",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAidTypes: (state, action: PayloadAction<IAidType[]>) => {
      state.aidTypes = action.payload;
    },
    setAidType: (state, action: PayloadAction<IAidType>) => {
      state.aidType = action.payload;
    },
    addAidType: (state, action: PayloadAction<IAidType>) => {
      state.aidTypes = [...state.aidTypes, action.payload];
    },
    updateAidType: (state, action: PayloadAction<IAidType>) => {
      state.aidTypes = state.aidTypes.map((type: IAidType) =>
        type.id === action.payload.id ? action.payload : type,
      );
    },
    removeAidType: (state, action: PayloadAction<number>) => {
      state.aidTypes = state.aidTypes.filter(
        (type: IAidType) => Number(type.id) !== action.payload,
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setAidTypes,
  setAidType,
  addAidType,
  updateAidType,
  removeAidType,
} = aidTypesSlice.actions;

export default aidTypesSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getAidTypes =
  (token?: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get<IAidType[]>(
        API_KEY + AID_TYPES_PATHS.GET_AID_TYPES,
        headers,
      );
      dispatch(setAidTypes(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAidType =
  (id: number, token?: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get<IAidType>(
        API_KEY + AID_TYPES_PATHS.GET_AID_TYPE.replace(":id", String(id)),
        headers,
      );
      dispatch(setAidType(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createAidTypeAction =
  (body: ICreateAid, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { data } = await axios.post<IAidType>(
        API_KEY + AID_TYPES_PATHS.CREATE_AID_TYPE,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(addAidType(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const editAidTypeAction =
  (id: number, name: string, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { data } = await axios.patch<IAidType>(
        API_KEY + AID_TYPES_PATHS.EDIT_AID_TYPE.replace(":id", String(id)),
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(updateAidType(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteAidTypeAction =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await axios.delete(
        API_KEY + AID_TYPES_PATHS.DELETE_AID_TYPE.replace(":id", String(id)),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(removeAidType(id));
      return { success: true };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setLoading(false));
    }
  };
