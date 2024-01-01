import { useLogout } from "../hooks/useLogout";

const LogoutButton = () => {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
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
