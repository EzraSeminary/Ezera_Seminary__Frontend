import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import "../App.css";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <button className="logout" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
