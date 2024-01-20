import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import { coursesApi } from "../services/coursesApi";

const store = configureStore({
  reducer: {
    course: courseReducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coursesApi.middleware),
});

console.log(store.getState());

export default store;
