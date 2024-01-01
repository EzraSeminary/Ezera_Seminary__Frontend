import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    // remove user from storage
    localStorage.removeItem("user");
    // remove workouts from storage
    dispatch({ type: "LOGOUT" });
    // workoutsDispatch({ type: "SET_WORKOUTS", payload: null });
  };
  return { logout };
};
