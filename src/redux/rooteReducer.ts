import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import UserReducer from "./slices/userSlice";
import AidReducer from "./slices/aidSlice";
import beneficiaryAidStepReducer from "./slices/beneficiaryAidStepSlice";
import beneficiaryAidReducer from "./slices/beneficiaryAidSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import localOrgReducer from "./slices/localOrgSlice";
import campaignsReducer from "./slices/campaignSlice";
import verificationReducer from "./slices/verificationSlice";
import beneficiaryOrderReducer from "./slices/beneficiaryOrderSlice";
import aidTypesReducer from "./slices/aidTypes";
import pickupLocationReducer from "./slices/pickupLocationSlice";

import storage from "redux-persist/lib/storage"; // localStorage'
import { persistReducer } from "redux-persist";
// import { postsApi } from "./services/postsAPI";

const persistedAuthReducer = persistReducer(
  {
    key: "auth",
    storage,
    whitelist: ["user", "accessToken", "role", "beneficiary", "refreshToken", "tokenAcquiredAt"],
  },
  authSlice,
);

export const RootReducer = combineReducers({
  auth: persistedAuthReducer,
  users: UserReducer,
  localOrg: localOrgReducer,
  beneficiaries: beneficiaryReducer,
  campaigns: campaignsReducer,
  verifications: verificationReducer,
  beneficiaryOrders: beneficiaryOrderReducer,
   aidTypes: aidTypesReducer,
   beneficiaryAids: beneficiaryAidReducer,
  // ! Edit here >>>>>>>>
  aids: AidReducer,
  beneficiaryAidStep: beneficiaryAidStepReducer,
  pickupLocations: pickupLocationReducer,
  // ! <<<<<<<<<< Edit here
  // [postsApi.reducerPath]: postsApi.reducer,
});
