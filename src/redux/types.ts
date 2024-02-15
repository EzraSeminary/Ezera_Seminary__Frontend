export interface User {
  role: string;
  firstName: string;
  token: string;
  // add other properties of a user object
}

export interface AuthState {
  user: User | null;
  role: string | null;
  firstName: string | null;
  token: string | null;
  isAuthReady: boolean;
}

export interface RootState {
  auth: AuthState;
  user: User;
  // other slices of state
}
