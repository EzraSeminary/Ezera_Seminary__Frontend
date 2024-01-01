import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";

const store = configureStore({
  reducer: {
    course: courseReducer,
  },
});

console.log(store.getState());

export default store;