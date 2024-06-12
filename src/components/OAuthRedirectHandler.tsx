import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login as loginAction } from "@/redux/authSlice";

const OAuthRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("OAuthRedirectHandler executed");
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log("token", token);

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:5100/users/current`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Ensure this token is valid
            },
          });

          const result = await response.json();

          if (response.ok) {
            localStorage.setItem("user", JSON.stringify(result));
            console.log("here is $result");
            dispatch(loginAction(result));
            navigate("/google/suceess");
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
