import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import devotionsReducer from "./devotionsSlice";
import authReducer from "./authSlice";
import { apiSlice } from "./api-slices/apiSlice";
import { SSLapi } from "./../services/SabbathSchoolApi";

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

export type RootState = ReturnType<typeof store.getState>;

export default store;
