import { combineReducers } from "@reduxjs/toolkit";
import PostReducer from "./slices/posts";
import authSlice from "./slices/authSlice";
import UserReducer from "./slices/users";
import AidReducer from "./slices/aids";
import userAidsReducer from "./slices/userAids";
import aidStateReducer from "./slices/aidState";

import storage from "redux-persist/lib/storage"; // localStorage'
import { persistReducer } from "redux-persist";
import { postsApi } from "./services/postsAPI";

// ! check
// ! check
// ! check
// ! check
// ! check
// ! check
// ! check

const persistedAuthReducer = persistReducer(
  { key: "auth", storage },
  authSlice,
);

export const RootReducer = combineReducers({
  auth: persistedAuthReducer,
  posts: PostReducer,
  users: UserReducer,
  aids: AidReducer,
  userAids: userAidsReducer,
  aidState: aidStateReducer,
  [postsApi.reducerPath]: postsApi.reducer,
});
