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
  progress?: Progress[];
  achievement?: number;
  _id?: string;
}

interface Progress {
  courseId?: string;
  currentChapter?: number;
  currentSlide?: number;
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
    setProgress: (state, action: PayloadAction<{courseId: string, currentChapter: number, currentSlide: number}>) => {
      const { courseId, currentChapter, currentSlide } = action.payload;
    
      // Error handling for existence of user and progress array
      if (state.user && state.user.progress) {
        // Find the index of the progress item for the specific course
        const progressIndex = state.user.progress.findIndex(
          (p) => p.courseId === courseId
        );
    
        // If the course progress does not exist, initialize it
        if (progressIndex === -1) {
          state.user.progress.push({ courseId, currentChapter, currentSlide });
        } else {
          // Update the current chapter and slide in the existing progress item
          state.user.progress[progressIndex].currentChapter = currentChapter;
          state.user.progress[progressIndex].currentSlide = currentSlide;
        }
      } else if (state.user) {
        // If user exists but has no progress, initialize progress with the current details
        state.user.progress = [{ courseId, currentChapter, currentSlide }];
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      // Store the token in localStorage
      localStorage.setItem("token", action.payload.token || "");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

  },
});

export const { login, signup, updateUser, logout, setAuthReady, setProgress, setUser } =
  authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;

export default authSlice.reducer;
