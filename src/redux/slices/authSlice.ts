import { type RoleType } from "@/constants/roles";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { AUTH_PATHS } from "@/constants/apiPaths";
import { API_KEY } from "@/config/api";
import type { IAuth, ILoginAuth, ILoginBeneficiary } from "@/@types/auth";
import type { IUser } from "@/@types/user";
import type { IBeneficiary } from "@/@types/beneficiary";
import type { ILocalOrg } from "@/@types/localOrg";

interface IInitialState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  role: RoleType | undefined;
  beneficiary: IBeneficiary | null;
  organization: ILocalOrg | null;
  isLoading: boolean;
  error: string | null;
  tokenAcquiredAt: number | null;
}

const initialState: IInitialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  role: "guest",
  beneficiary: null,
  organization: null,
  error: null,
  isLoading: false,
  tokenAcquiredAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<IAuth>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.user?.role;
      state.beneficiary = action.payload.beneficiary;
      state.organization = action.payload.organization;
      state.refreshToken = action.payload.refreshToken;
      state.tokenAcquiredAt = Date.now();
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.tokenAcquiredAt = Date.now();
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.role = "guest";
      state.beneficiary = null;
      state.organization = null;
      state.tokenAcquiredAt = null;
    },
  },
});

export const { login, updateTokens, logout, setError, setLoading } =
  authSlice.actions;

export default authSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const setLogin = (body: ILoginAuth) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  console.log('setlogin body is , ', body);

  try {
    const { data } = await axios.post<IAuth>(API_KEY + AUTH_PATHS.LOGIN, body);
    console.log("data test login : ", data);
    dispatch(login(data));
  } catch (err) {
    if (err instanceof Error)
      dispatch(setError("خطـأ في اسم المستخدم او كلمه المرور"));
    else dispatch(setError("حدث خطأ غير معروف حاول مرة أخرى "));
  } finally {
    dispatch(setLoading(false));
  }
};

export const refreshTokenAction =
  (refreshToken: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post<{
        accessToken: string;
        refreshToken: string;
      }>(API_KEY + AUTH_PATHS.REFRESH_TOKEN, { refreshToken });
      dispatch(updateTokens(data));
      return { success: true };
    } catch (err) {
      dispatch(logout());
      if (err instanceof Error) dispatch(setError(err.message));
      return { success: false, error: err };
    }
  };

export const loginBeneficiaryAction =
  (body: ILoginBeneficiary, navigate: (path: string) => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    console.log("data test login beneficiary : ", body);
    try {
      const { data } = await axios.post<IAuth>(
        API_KEY + AUTH_PATHS.LOGIN_BENEFICIARY,
        body,
      );
      dispatch(login(data));
      navigate("/track-aid/auth");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Request failed with status code 401")
          dispatch(setError("رقم الهوية أو رقم الإصدار غير صحيح"));
        else if (err.message === "Request failed with status code 403")
          dispatch(setError("انت غير مصرح بالدخول"));
        else dispatch(setError(err.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
