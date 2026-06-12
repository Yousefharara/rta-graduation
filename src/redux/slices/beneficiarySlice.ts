import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { BENEFICIARY_PATHS } from "@/constants/apiPaths";
import type { IBeneficiary, ICreateBeneficiary } from "@/@types/beneficiary";

export interface IBeneficiaryState {
  isLoading: boolean;
  errorMessage: string;
  beneficiaries: IBeneficiary[];
  beneficiary: IBeneficiary | null;
}

const initialState: IBeneficiaryState = {
  errorMessage: "",
  isLoading: false,
  beneficiaries: [],
  beneficiary: null,
};

const beneficiarySlice = createSlice({
  name: "beneficiaries",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setBeneficiaries: (state, action: PayloadAction<IBeneficiary[]>) => {
      state.beneficiaries = action.payload;
    },
    setBeneficiary: (state, action: PayloadAction<IBeneficiary>) => {
      state.beneficiary = action.payload;
    },
    addBeneficiary: (state, action: PayloadAction<IBeneficiary>) => {
      state.beneficiaries = [...state.beneficiaries, action.payload];
    },
    editBeneficiary: (state, action: PayloadAction<IBeneficiary>) => {
      state.beneficiaries = state.beneficiaries.map((beneificiary) =>
        beneificiary.id === action.payload.id ? action.payload : beneificiary,
      );
    },
    deleteBeneficiary: (state, action: PayloadAction<number>) => {
      state.beneficiaries = state.beneficiaries.filter(
        (beneficiary) => beneficiary.id !== action.payload,
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setBeneficiaries,
  setBeneficiary,
  addBeneficiary,
  editBeneficiary,
  deleteBeneficiary,
} = beneficiarySlice.actions;

export default beneficiarySlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getBeneficiaries = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get<IBeneficiary[]>(
      API_KEY + BENEFICIARY_PATHS.GET_BENEFICIARIES,
    );

    dispatch(setBeneficiaries(data));
  } catch (err) {
    if (err instanceof Error) setError(err.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const addBeneficiaryAction =
  (body: ICreateBeneficiary) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.post<IBeneficiary>(
        API_KEY + BENEFICIARY_PATHS.CREATE_BENEFICIARY,
        body,
      );
      dispatch(addBeneficiary(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getBeneficairy = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get<IBeneficiary>(
      API_KEY + BENEFICIARY_PATHS.GET_BENEFICIARY.replace(":id", String(id)),
    );

    dispatch(setBeneficiary(data));
  } catch (err) {
    if (err instanceof Error) setError(err.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const editBeneficiaryAction =
  (body: IBeneficiary) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      console.log("Inside editing >>>>>>");
      const { data } = await axios.patch<IBeneficiary>(
        API_KEY +
          BENEFICIARY_PATHS.EDIT_BENEFICIARY.replace(":id", String(body.id)),
        body,
      );
      console.log("Updating data : ", data);
      dispatch(editBeneficiary(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteBeneficiaryAction =
  (id: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      await axios.delete(
        API_KEY +
          BENEFICIARY_PATHS.DELETE_BENEFICIARY.replace(":id", id.toString()),
      );
      dispatch(deleteBeneficiary(id));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
