import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "@/config/api";
import { NOTIFICATION_PATHS } from "@/constants/apiPaths";
import type { INotification, ICreateNotification } from "@/@types/notification";

interface NotificationState {
  loading: boolean;
  error: string | null;
  notifications: INotification[];
}

const initialState: NotificationState = {
  loading: false,
  error: null,
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = Array.isArray(action.payload) ? action.payload : [];
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, is_read: true } : n,
      );
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;

export const getNotificationsAction =
  (token: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.get<{ data: INotification[] }>(
        API_KEY + NOTIFICATION_PATHS.GET_NOTIFICATIONS,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(setNotifications(data.data));
      console.log("notify data , ", data.data);
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createNotificationAction =
  (body: ICreateNotification, token: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await axios.post<INotification>(
        API_KEY + NOTIFICATION_PATHS.CREATE_NOTIFICATION,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(addNotification(data));
      return { success: true, data };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const markNotificationAsReadAction =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    try {
      await axios.patch(
        API_KEY +
          NOTIFICATION_PATHS.READ_NOTIFICATION.replace(":id", String(id)),
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(markAsRead(id));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    }
  };

export const deleteNotificationAction =
  (id: number, token: string) => async (dispatch: AppDispatch) => {
    try {
      await axios.delete(
        API_KEY +
          NOTIFICATION_PATHS.DELETE_NOTIFICATION.replace(":id", String(id)),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(removeNotification(id));
      return { success: true };
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    }
  };

export const markAllNotificationsAsReadAction =
  (token: string) => async (dispatch: AppDispatch) => {
    try {
      await axios.put(
        API_KEY + NOTIFICATION_PATHS.GET_NOTIFICATIONS,
        { is_read: true },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(markAllAsRead());
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    }
  };
