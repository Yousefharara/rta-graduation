import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { VERIFY_BENEFICIARY_PATHS } from "@/constants/apiPaths";
import type { IBeneficiaryVerification } from "@/@types/verfityBeneficiary";

export interface IVerificationState {
  isCreating: boolean;
  errorMessage: string;
  verifications: IBeneficiaryVerification[];
}

const initialState: IVerificationState = {
  isCreating: false,
  errorMessage: "",
  verifications: [],
};

const verificationSlice = createSlice({
  name: "verifications",
  initialState,
  reducers: {
    setCreating(state, action: PayloadAction<boolean>) {
      state.isCreating = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    addVerification(state, action: PayloadAction<IBeneficiaryVerification>) {
      state.verifications = [...state.verifications, action.payload];
    },
  },
});

export const { setCreating, setError, addVerification } =
  verificationSlice.actions;

export default verificationSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const verifyBeneficiaryAction =
  (body: IBeneficiaryVerification, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(""));
    console.log('verify data is : ', body);
    try {
      const { data } = await axios.post<IBeneficiaryVerification>(
        API_KEY + VERIFY_BENEFICIARY_PATHS.VERIFY_BENEFICIARY,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(addVerification(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      else dispatch(setError("حدث خطأ أثناء عملية التحقق"));
    } finally {
      dispatch(setCreating(false));
    }
  };
