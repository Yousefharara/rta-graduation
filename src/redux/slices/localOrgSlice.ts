import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { ORG_PATHS } from "@/constants/apiPaths";
import type { ICreateLocalOrg, ILocalOrg } from "@/@types/localOrg";

export interface ILocalOrgState {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  localOrgs: ILocalOrg[];
  localOrg: ILocalOrg | null;
}

const initialState: ILocalOrgState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  localOrgs: [],
  localOrg: null,
};

const localOrgSlice = createSlice({
  name: "beneficiaries",
  initialState,
  reducers: {
    setFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },

    setCreating(state, action: PayloadAction<boolean>) {
      state.isCreating = action.payload;
    },

    setUpdating(state, action: PayloadAction<boolean>) {
      state.isUpdating = action.payload;
    },

    setDeleting(state, action: PayloadAction<boolean>) {
      state.isDeleting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLocalOrgs: (state, action: PayloadAction<ILocalOrg[]>) => {
      state.localOrgs = action.payload;
    },
    setLocalOrg: (state, action: PayloadAction<ILocalOrg>) => {
      state.localOrg = action.payload;
    },
    addLocalOrg: (state, action: PayloadAction<ILocalOrg>) => {
      state.localOrgs = [...state.localOrgs, action.payload];
    },
    editLocalOrg: (state, action: PayloadAction<ILocalOrg>) => {
      state.localOrgs = state.localOrgs.map((org) =>
        org.id === action.payload.id ? action.payload : org,
      );
    },
    deleteLocalOrg: (state, action: PayloadAction<number>) => {
      state.localOrgs = state.localOrgs.filter(
        (org) => org.id !== action.payload,
      );
    },
  },
});

export const {
  setFetching,
  setCreating,
  setUpdating,
  setDeleting,
  setError,
  setLocalOrgs,
  addLocalOrg,
  deleteLocalOrg,
  editLocalOrg,
  setLocalOrg,
} = localOrgSlice.actions;

export default localOrgSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getLocalOrgs =
  (token: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.get<ILocalOrg[]>(
        API_KEY + ORG_PATHS.GET_ORGS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setLocalOrgs(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };

export const addLocalOrgAction =
  (body: ICreateLocalOrg, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(null));

    try {
      const { data } = await axios.post<ILocalOrg>(
        API_KEY + ORG_PATHS.CREATE_ORG,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(addLocalOrg(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setCreating(false));
    }
  };

export const getLocalOrg =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));

    try {
      const { data } = await axios.get<ILocalOrg>(
        API_KEY + ORG_PATHS.GET_ORG.replace(":id", String(id)),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setLocalOrg(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };

export const editLocalOrgAction =
  (body: ILocalOrg, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setUpdating(true));
    dispatch(setError(null));

    try {
      const { data } = await axios.put<ILocalOrg>(
        API_KEY + ORG_PATHS.EDIT_ORG.replace(":id", String(body.id)),
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(editLocalOrg(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setUpdating(false));
    }
  };

export const deleteLocalOrgAction =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setDeleting(true));
    dispatch(setError(null));

    try {
      await axios.delete(
        API_KEY + ORG_PATHS.DELETE_ORG.replace(":id", id.toString()),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(deleteLocalOrg(id));
      return { success: true };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setDeleting(false));
    }
  };

export const verifyLocalOrgAction =
  (id: number, is_verified: boolean, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setUpdating(true));
    dispatch(setError(null));

    try {
      const { data } = await axios.patch(
        API_KEY + ORG_PATHS.VERFIY_ORG.replace(":id", String(id)),
        { is_verified },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(setLocalOrgs([]));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setUpdating(false));
    }
  };
