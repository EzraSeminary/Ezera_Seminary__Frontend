import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import { api } from "../services/api";
import { CourseState } from "./courseSlice";
import { ApiState } from "../services/api";

export interface RootState {
  course: CourseState;
  [api.reducerPath]: ApiState;
  // Define other state fields if you have more reducers
}

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
