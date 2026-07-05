import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import type { IComplaint, ICreateComplaint } from "@/@types/complaint";
import { COMPLAINT_PATHS } from "@/constants/apiPaths";

interface IComplaintState {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  complaints: IComplaint[];
  complaint: IComplaint | null;
}

// interface IResolveAPI extends ICreateComplaint {
//     beneficiary: number
// }

const initialState: IComplaintState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  complaints: [],
  complaint: null,
};

const complaintSlice = createSlice({
  name: "complaints",
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
    setComplaints: (state, action: PayloadAction<IComplaint[]>) => {
      state.complaints = action.payload;
    },
    setComplaint: (state, action: PayloadAction<IComplaint>) => {
      state.complaint = action.payload;
    },
    addComplaint: (state, action: PayloadAction<IComplaint>) => {
      state.complaints = [...state.complaints, action.payload];
    },
    resolveComplaint: (
      state,
      action: PayloadAction<{
        id: number;
        admin_response: string;
        status: IComplaint["status"];
      }>,
    ) => {
      state.complaints = state.complaints.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c,
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
  addComplaint,
  resolveComplaint,
  setComplaint,
  setComplaints,
} = complaintSlice.actions;

export default complaintSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getComplaints =
  (token: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.get<IComplaint[]>(
        API_KEY + COMPLAINT_PATHS.GET_COMPLAINTS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setComplaints(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };

export const addComplaintAction =
  (body: ICreateComplaint, token: string) => async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.post<IComplaint>(
        API_KEY + COMPLAINT_PATHS.CREATE_COMPLAINT,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(addComplaint(data));
      return { success: true };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false };
    } finally {
      dispatch(setCreating(false));
    }
  };

export const resolveCampaignAction =
  (
    id: number,
    status: IComplaint["status"],
    admin_response: string,
    token: string,
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setUpdating(true));
    dispatch(setError(null));
    try {
      console.log("Inside editing >>>>>>");
      const { data } = await axios.patch<IComplaint>(
        API_KEY + COMPLAINT_PATHS.RESOLVE_COMPLAINT.replace(":id", String(id)),
        { status, admin_response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Updating data : ", data);
      dispatch(resolveComplaint({ id, admin_response, status }));
      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError(err.message));
        return { success: false, error: err.message };
      }
    } finally {
      dispatch(setUpdating(false));
    }
  };
