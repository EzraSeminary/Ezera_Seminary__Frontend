import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authReducer } from "./AuthReducer";
import { AuthState, AuthAction, User } from "./AuthTypes";

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

// Create context with an undefined default value, which will be set in the provider.
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const initialState: AuthState = {
    user: null,
    role: null,
    isAuthReady: false,
    firstName: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null") as User;

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    setIsAuthReady(true);
  }, []);

  if (!isAuthReady) {
    return <div>Loading...</div>;
  }

  // Add type assertion for the context value
  return (
    <AuthContext.Provider
      value={{ ...state, isAuthReady, dispatch } as AuthContextType}
    >
      {children}
    </AuthContext.Provider>
  );
};
