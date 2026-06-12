import { combineReducers } from "@reduxjs/toolkit";
import PostReducer from "./slices/posts";
import authSlice from "./slices/authSlice";
import UserReducer from "./slices/userSlice";
import AidReducer from "./slices/aids";
import userAidsReducer from "./slices/userAids";
import aidStateReducer from "./slices/aidState";
import beneficiaryReducer from "./slices/beneficiarySlice";

import storage from "redux-persist/lib/storage"; // localStorage'
import { persistReducer } from "redux-persist";
import { postsApi } from "./services/postsAPI";



const persistedAuthReducer = persistReducer(
  { key: "auth", storage, whitelist: ["user", "accessToken", "role"], },
  authSlice,
);

export const RootReducer = combineReducers({
  auth: persistedAuthReducer,
  posts: PostReducer,
  beneficiaries: beneficiaryReducer,
  users: UserReducer,
  aids: AidReducer,
  userAids: userAidsReducer,
  aidState: aidStateReducer,
  [postsApi.reducerPath]: postsApi.reducer,
});
