import type { IBeneficiaryAid } from "@/@types/beneficiaryAid";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { BENEFICIARY_AID_PATHS } from "@/constants/apiPaths";

export interface ICreateBeneficiaryAid {
  beneficiary_id: number;
  aid_type_id: number;
  status: IBeneficiaryAid["status"];
  order_id: number | null;
  pickup_location_id?: number;
}

interface BeneficiaryAidState {
  loading: boolean;
  error: string | null;
  beneficiaryAids: IBeneficiaryAid[];
  beneficiaryAid: IBeneficiaryAid | null;
}

const initialState: BeneficiaryAidState = {
  loading: false,
  error: null,
  beneficiaryAids: [],
  beneficiaryAid: null,
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
      state.beneficiaryAids = action.payload;
    },
    setSingleAid: (state, action: PayloadAction<IBeneficiaryAid | null>) => {
      state.beneficiaryAid = action.payload;
    },
    addAid: (state, action: PayloadAction<IBeneficiaryAid>) => {
      state.beneficiaryAids = [...state.beneficiaryAids, action.payload];
    },
    updateAidStatus: (
      state,
      action: PayloadAction<{ id: number; status: IBeneficiaryAid["status"] }>,
    ) => {
      const { id, status } = action.payload;
      state.beneficiaryAids = state.beneficiaryAids.map((aid) =>
        aid.id === id ? { ...aid, status } : aid,
      );
      if (state.beneficiaryAid && state.beneficiaryAid.id === id) {
        state.beneficiaryAid.status = status;
      }
    },
    removeAid: (state, action: PayloadAction<number>) => {
      state.beneficiaryAids = state.beneficiaryAids.filter(
        (aid) => aid.id !== action.payload,
      );
      if (state.beneficiaryAid && state.beneficiaryAid.id === action.payload) {
        state.beneficiaryAid = null;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setAids,
  setSingleAid,
  addAid,
  updateAidStatus,
  removeAid,
} = beneficiaryAidSlice.actions;
export default beneficiaryAidSlice.reducer;

// Async thunks
export const getBeneficiaryAids =
  (token: string) => async (dispatch: AppDispatch) => {
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

export const createBeneficiaryAidAction =
  (body: ICreateBeneficiaryAid, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    console.log('createBeneficiaryAidAction : ', body);
    try {
      const { data } = await axios.post<IBeneficiaryAid>(
        API_KEY + BENEFICIARY_AID_PATHS.CREATE_BENEFICIARY_AID,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(addAid(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getBeneficiaryAid =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.get<IBeneficiaryAid>(
        API_KEY +
          BENEFICIARY_AID_PATHS.GET_BENEFICIARY_AID.replace(":id", String(id)),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(setSingleAid(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const editBeneficiaryAidStatus =
  (id: number, status: IBeneficiaryAid["status"], token: string) =>
  async (dispatch: AppDispatch) => {
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

export const deleteBeneficiaryAid =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await axios.delete(
        API_KEY +
          BENEFICIARY_AID_PATHS.DELETE_BENEFICIARY_AID.replace(
            ":id",
            String(id),
          ),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(removeAid(id));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
