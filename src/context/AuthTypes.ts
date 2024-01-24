// Define user information and action types here

export interface User {
    role?: string;
    firstName?: string;
    email?: string;
    token?:string
  }
  
  // State type
  export interface AuthState {
    user: User | null;
    role: string | null | undefined;
    isAuthReady: boolean;
    firstName: string | null | undefined;
  }
  
  // Action types
  export type AuthAction =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" };