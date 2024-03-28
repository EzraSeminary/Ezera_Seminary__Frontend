// authSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  role: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  token: string | null;
  avatar: string | null;
  progress: Progress[];
  achievement: number;
}

interface Progress {
  courseId: string;
  currentChapter: number;
  currentSlide: number;
}

export interface AuthState {
  token: string;
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
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    signup: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      // Assuming the token is part of the payload, update it in local storage as well
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }

      // Update the user details in local storage
      localStorage.setItem("user", JSON.stringify(action.payload));
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
