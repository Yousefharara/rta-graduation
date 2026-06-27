import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { BENEFICIARY_ORDER_PATHS } from "@/constants/apiPaths";
import type {
  IBeneficiaryOrder,
  ICreateBeneficiaryOrder,
} from "@/@types/beneficiaryOrder";

export interface IBeneficiaryOrderState {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  errorMessage: string;
  orders: IBeneficiaryOrder[];
}

const initialState: IBeneficiaryOrderState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  errorMessage: "",
  orders: [],
};

const beneficiaryOrderSlice = createSlice({
  name: "beneficiaryOrders",
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
    setError(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    setOrders(state, action: PayloadAction<IBeneficiaryOrder[]>) {
      state.orders = action.payload;
    },
    addOrder(state, action: PayloadAction<IBeneficiaryOrder>) {
      state.orders = [...state.orders, action.payload];
    },
    updateOrderStatus(
      state,
      action: PayloadAction<{ id: number; status: IBeneficiaryOrder["status"] }>,
    ) {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id
          ? { ...order, status: action.payload.status }
          : order,
      );
    },
  },
});

export const {
  setFetching,
  setCreating,
  setUpdating,
  setError,
  setOrders,
  addOrder,
  updateOrderStatus,
} = beneficiaryOrderSlice.actions;

export default beneficiaryOrderSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getBeneficiaryOrders =
  (token: string) => async (dispatch: AppDispatch) => {
    dispatch(setFetching(true));
    dispatch(setError(""));
    try {
      const { data } = await axios.get<IBeneficiaryOrder[]>(
        API_KEY + BENEFICIARY_ORDER_PATHS.GET_BENEFICIARY_ORDERS,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(setOrders(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setFetching(false));
    }
  };

export const createBeneficiaryOrderAction =
  (body: ICreateBeneficiaryOrder, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setCreating(true));
    dispatch(setError(""));
    try {
      const { data } = await axios.post<IBeneficiaryOrder>(
        API_KEY + BENEFICIARY_ORDER_PATHS.CREATE_BENEFICIARY_ORDER,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(addOrder(data));
      return { success: true };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false };
    } finally {
      dispatch(setCreating(false));
    }
  };

export const updateBeneficiaryOrderStatusAction =
  (id: number, status: IBeneficiaryOrder["status"], token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setUpdating(true));
    dispatch(setError(""));
    try {
      await axios.patch(
        API_KEY +
          BENEFICIARY_ORDER_PATHS.EDIT_BENEFICIARY_ORDER.replace(
            ":id",
            String(id),
          ),
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(updateOrderStatus({ id, status }));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setUpdating(false));
    }
  };
