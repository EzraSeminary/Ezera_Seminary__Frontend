import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/api-slices/apiSlice";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [resetPassword, { isLoading, isError, error }] =
    useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await resetPassword({ token, newPassword });
      console.log(result);
      if (result.error) {
        throw result.error;
      }
      toast.success(
        "Password reset successful. You can now log in with your new password."
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="mt-5 mx-auto text-center">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex-column">
          <div className="mt-5">
            <label>New Password: </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="mt-5 p-4 bg-primary-5">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
