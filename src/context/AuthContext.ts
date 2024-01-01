import { createContext, useReducer, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        role: action.payload.role,
        firstName: action.payload.firstName,
      }; // Include firstName property
    case "LOGOUT":
      return { user: null, role: null, firstName: null }; // Reset firstName on logout
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    setIsAuthReady(true); // Set this to true after checking localStorage
  }, []);

  if (!isAuthReady) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ ...state, isAuthReady, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
