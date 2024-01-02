import { AuthState, AuthAction } from './AuthTypes';

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        role: action.payload.role ?? null,
        firstName: action.payload.firstName ?? null,
      };
    case "LOGOUT":
      return { ...state, user: null, role: null, firstName: null };
    default:
      return state;
  }
};