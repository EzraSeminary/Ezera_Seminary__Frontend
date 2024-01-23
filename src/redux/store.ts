import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import { api } from "../services/api";

const store = configureStore({
  reducer: {
    course: courseReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

console.log(store.getState());

export default store;
