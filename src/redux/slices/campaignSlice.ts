import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import type { ICampaign, ICreateCampaign } from "@/@types/campaign";
import { CAMPAIGN_PATHS } from "@/constants/apiPaths";

export interface ICampaignState {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  campaigns: ICampaign[];
  campaign: ICampaign | null;
}

const initialState: ICampaignState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  campaigns: [],
  campaign: null,
};

const campaignSlice = createSlice({
  name: "campaigns",
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
    setCampaigns: (state, action: PayloadAction<ICampaign[]>) => {
      state.campaigns = action.payload;
    },
    setCampaign: (state, action: PayloadAction<ICampaign>) => {
      state.campaign = action.payload;
    },
    addCampaign: (state, action: PayloadAction<ICampaign>) => {
      state.campaigns = [...state.campaigns, action.payload];
    },
    editCampaign: (state, action: PayloadAction<ICampaign>) => {
      state.campaigns = state.campaigns.map((beneificiary) =>
        beneificiary.id === action.payload.id ? action.payload : beneificiary,
      );
    },
    deleteCampaign: (state, action: PayloadAction<number>) => {
      state.campaigns = state.campaigns.filter(
        (campaign) => campaign.id !== action.payload,
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
  setCampaigns,
  setCampaign,
  addCampaign,
  editCampaign,
  deleteCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getCampaigns = () => async (dispatch: AppDispatch) => {
  dispatch(setFetching(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get<ICampaign[]>(
      API_KEY + CAMPAIGN_PATHS.GET_CAMPAIGNS
    );

    dispatch(setCampaigns(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setFetching(false));
  }
};

export const addCampaignAction =
  (body: ICreateCampaign, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.post<ICampaign>(
        API_KEY + CAMPAIGN_PATHS.CREATE_CAMPAIGN,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(addCampaign(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setCreating(false));
    }
  };

export const getCampaign = (id: number, token: string) => async (dispatch: AppDispatch) => {
  dispatch(setFetching(true));
  dispatch(setError(null));
  try {
    const { data } = await axios.get<ICampaign>(
      API_KEY + CAMPAIGN_PATHS.GET_CAMPAIGN.replace(":id", String(id)), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
    );

    dispatch(setCampaign(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setFetching(false));
  }
};

export const editCampaignAction =
  (body: Partial<ICampaign> & { id: number }, token?: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setUpdating(true));
    dispatch(setError(null));
    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
        console.log('editCampaignAction : ', body);
      const { data } = await axios.put<ICampaign>(
        API_KEY +
          CAMPAIGN_PATHS.EDIT_CAMPAIGN.replace(":id", String(body.id)),
        body,
        headers,
      );
      dispatch(editCampaign(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setUpdating(false));
    }
  };

export const deleteCampaignAction =
  (id: number) => async (dispatch: AppDispatch) => {
    dispatch(setDeleting(true));
    dispatch(setError(null));
    try {
      await axios.delete(
        API_KEY +
          CAMPAIGN_PATHS.DELETE_CAMPAIGN.replace(":id", id.toString()),
      );
      dispatch(deleteCampaign(id));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setDeleting(false));
    }
  };
