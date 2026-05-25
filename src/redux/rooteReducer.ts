import { combineReducers } from "@reduxjs/toolkit";
import CounterReducer from "./slices/counter";
import PostReducer from "./slices/posts";
import authSlice from "./slices/authSlice";

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
  counter: CounterReducer,
  posts: PostReducer,
  [postsApi.reducerPath]: postsApi.reducer,
});
