import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/redux/authSlice";
import { toast } from "react-toastify";

const OAuthRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:5100/users/current`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();

          if (response.ok) {
            localStorage.setItem("user", JSON.stringify(result));
            dispatch(loginAction(result));
            navigate("/");
            toast.success("Login successful!");
          } else {
            toast.error(
              result.error || "Google sign-in failed. Please try again."
            );
          }
        } catch (error) {
          console.error(error);
          toast.error("Google sign-in failed. Please try again.");
        }
      };

      fetchUser();
    }
  }, [location, dispatch, navigate]);

  return <div>Loading...</div>;
};

export default OAuthRedirectHandler;
