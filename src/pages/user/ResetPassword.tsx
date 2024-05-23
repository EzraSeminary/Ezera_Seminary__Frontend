// Reset Password Component.
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useResetPasswordMutation } from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams(); // Get the reset token from the URL
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation(); // Use the resetPassword mutation from the apiSlice

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the resetPassword mutation with the token and new password
      const result = await dispatch(
        resetPassword({ token, newPassword })
      ).unwrap();
      // Show a success toast and navigate to the login page
      toast.success(
        "Password reset successful. You can now log in with your new password."
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      // Show an error toast
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
