import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import devotionsReducer from "./devotionsSlice";
import authReducer, { AuthState } from "./authSlice";
import { apiSlice } from "./api-slices/apiSlice";
import { SSLapi } from "./../services/SabbathSchoolApi";
import { CourseState } from "./courseSlice";
import { ApiState } from "../services/api";
import DevotionsState from "./devotionsSlice";

export interface RootState {
  devotions: typeof DevotionsState; // Replace 'any' with the appropriate type
  course: CourseState;
  api: ApiState;
  auth: AuthState;
  // Define other state fields if you have more reducers
}

const store = configureStore({
  reducer: {
    course: courseReducer,
    devotions: devotionsReducer,
    auth: authReducer,
    [SSLapi.reducerPath]: SSLapi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(SSLapi.middleware, apiSlice.middleware),
});

type AppDispatch = typeof store.dispatch;

export type { AppDispatch };

export default store;
