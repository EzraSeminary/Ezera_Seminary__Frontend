// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  firstName: null,
  token: null,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.firstName = action.payload.firstName;
      state.token = action.payload.token;

      // Store the token in localStorage
      localStorage.setItem("token", action.payload.token);
    },
    signup: (state, action) => {
      // Add this reducer
      state.user = action.payload;
      state.role = action.payload.role;
      state.firstName = action.payload.firstName;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.firstName = null;
      state.token = null;

      // Remove the token from localStorage
      localStorage.removeItem("token");
    },
    setAuthReady: (state, action) => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { login, signup, logout, setAuthReady } = authSlice.actions; // Export the signup action

export default authSlice.reducer;
