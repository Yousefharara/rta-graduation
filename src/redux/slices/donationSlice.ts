import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { API_KEY } from "@/config/api";
import axios from "axios";
import type { ICreateDonation, IDonation } from "@/@types/donation";
import { DONATION_PATHS } from "@/constants/apiPaths";

interface IDonationState {
  error: string | null;
  isFetching: boolean;
  isCreating: boolean;
  donations: IDonation[];
  donation: IDonation | null;
}

const initialState: IDonationState = {
  error: "",
  isFetching: false,
  isCreating: false,
  donations: [],
  donation: null,
};

const donationSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDonations: (state, action: PayloadAction<IDonation[]>) => {
      state.donations = action.payload;
    },
    setDonation: (state, action: PayloadAction<IDonation>) => {
      state.donation = action.payload;
    },
    addDonation: (state, action: PayloadAction<IDonation>) => {
      state.donations = [...state.donations, action.payload];
    },
  },
});

export const {
  setFetching,
  setError,
  setDonation,
  setDonations,
  addDonation,
  setCreating,
} = donationSlice.actions;

export default donationSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getDonations =
  (token?: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));
    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get<IDonation[]>(
        API_KEY + DONATION_PATHS.GET_DONATINOS,
        headers,
      );
      dispatch(setDonations(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };

export const addDonationAction =
  (body: ICreateDonation) => async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(null));

    console.log("body is < ", body);
    try {
      const { data } = await axios.post<IDonation>(
        API_KEY + DONATION_PATHS.CREATE_DONATINO,
        body,
      );
      console.log("data is < ", data);
      dispatch(addDonation(data));
    } catch (err) {
      // console.log("error in donation : ", err.details.message);
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setCreating(false));
    }
  };
