// store.js
import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import devotionsReducer from "./devotionsSlice";
import authReducer from "./authSlice"; // import the auth reducer
import { apiSlice } from "./api-slices/apiSlice"; // import the api reducer


const store = configureStore({
  reducer: {
    course: courseReducer,
    devotions: devotionsReducer,
    auth: authReducer, // include the auth reducer
    [apiSlice.reducerPath]: apiSlice.reducer, // include the api reducer
  },
  // Adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

console.log(store.getState());

export type AppDispatch = typeof store.dispatch;

export default store;
