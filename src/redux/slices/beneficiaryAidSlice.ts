import type { IBeneficiaryAid } from "@/@types/beneficiaryAid";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { BENEFICIARY_AID_PATHS } from "@/constants/apiPaths";

interface BeneficiaryAidState {
  loading: boolean;
  error: string | null;
  aids: IBeneficiaryAid[];
  currentAid: IBeneficiaryAid | null;
}

const initialState: BeneficiaryAidState = {
  loading: false,
  error: null,
  aids: [],
  currentAid: null,
};

const beneficiaryAidSlice = createSlice({
  name: "beneficiaryAids",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAids: (state, action: PayloadAction<IBeneficiaryAid[]>) => {
      state.aids = action.payload;
    },
    setSingleAid: (state, action: PayloadAction<IBeneficiaryAid | null>) => {
      state.currentAid = action.payload;
    },
    updateAidStatus: (
      state,
      action: PayloadAction<{ id: number; status: IBeneficiaryAid["status"] }>
    ) => {
      const { id, status } = action.payload;
      state.aids = state.aids.map((aid) =>
        aid.id === id ? { ...aid, status } : aid,
      );
      if (state.currentAid && state.currentAid.id === id) {
        state.currentAid.status = status;
      }
    },
    removeAid: (state, action: PayloadAction<number>) => {
      state.aids = state.aids.filter((aid) => aid.id !== action.payload);
      if (state.currentAid && state.currentAid.id === action.payload) {
        state.currentAid = null;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setAids,
  setSingleAid,
  updateAidStatus,
  removeAid,
} = beneficiaryAidSlice.actions;
export default beneficiaryAidSlice.reducer;

// Async thunks
export const getBeneficiaryAids = (token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get<IBeneficiaryAid[]>(
      API_KEY + BENEFICIARY_AID_PATHS.GET_BENEFICIARY_AIDS,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch(setAids(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getBeneficiaryAid = (id: number, token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get<IBeneficiaryAid>(
      API_KEY + BENEFICIARY_AID_PATHS.GET_BENEFICIARY_AID.replace(":id", String(id)),
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch(setSingleAid(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const editBeneficiaryAidStatus = (
  id: number,
  status: IBeneficiaryAid["status"],
  token: string,
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await axios.put(
      API_KEY +
        BENEFICIARY_AID_PATHS.EDIT_BENEFICIARY_AID.replace(":id", String(id)),
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch(updateAidStatus({ id, status }));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteBeneficiaryAid = (id: number, token: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await axios.delete(
      API_KEY + BENEFICIARY_AID_PATHS.DELETE_BENEFICIARY_AID.replace(":id", String(id)),
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch(removeAid(id));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
