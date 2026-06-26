import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import UserReducer from "./slices/userSlice";
import AidReducer from "./slices/aids";
import userAidsReducer from "./slices/userAids";
import aidStateReducer from "./slices/aidState";
import beneficiaryReducer from "./slices/beneficiarySlice";
import localOrgReducer from "./slices/localOrgSlice";
import campaignsReducer from "./slices/campaignSlice";

import storage from "redux-persist/lib/storage"; // localStorage'
import { persistReducer } from "redux-persist";
import { postsApi } from "./services/postsAPI";

const persistedAuthReducer = persistReducer(
  {
    key: "auth",
    storage,
    whitelist: ["user", "accessToken", "role", "beneficiary", "refreshToken"],
  },
  authSlice,
);

export const RootReducer = combineReducers({
  auth: persistedAuthReducer,
  users: UserReducer,
  localOrg: localOrgReducer,
  beneficiaries: beneficiaryReducer,
  campaigns: campaignsReducer,
  // ! Edit here >>>>>>>>
  aids: AidReducer,
  userAids: userAidsReducer,
  aidState: aidStateReducer,
  // ! <<<<<<<<<< Edit here
  [postsApi.reducerPath]: postsApi.reducer,
});
