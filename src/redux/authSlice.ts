// authSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  role: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null; // Add this line
  password: string | null; // Add this line
  token: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthReady: boolean;
}

const initialState = {
  user: null as User | null,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      // Store the token in localStorage
      localStorage.setItem("token", action.payload.token || "");
    },
    signup: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;

      // Remove the token from localStorage
      localStorage.removeItem("token");
    },
    setAuthReady: (state, action: PayloadAction<boolean>) => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { login, signup, updateUser, logout, setAuthReady } =
  authSlice.actions;

export default authSlice.reducer;
