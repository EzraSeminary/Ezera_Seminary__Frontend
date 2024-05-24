import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useResetPasswordMutation } from "@/redux/api-slices/apiSlice";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      toast.success("Password has been reset successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      console.error(err);
      if ((err as any).status === 400) {
        toast.error("Invalid token or password.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col mt-[10%]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="flex h-[80%] items-center justify-center flex-1">
        <div className="flex w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-[80%] rounded-xl md:border-2 md:border-accent-6 mx-auto md:shadow-xl">
          <form
            className="flex flex-col font-nokia-bold px-7 justify-center items-center lg:items-start py-16 text-accent-6 w-[90%] mx-auto md:w-[80%] lg:w-[80%] border border-accent-5 md:border-none rounded-lg shadow-2xl md:shadow-none"
            onSubmit={handleSubmit}
          >
            <h3 className="text-3xl xl:text-4xl">
              <span className="text-secondary-6 text-center">Reset</span>{" "}
              Password
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-xs w-max lg:w-full xl:text-xl">
              <label>New Password</label>
              <input
                type="password"
                className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 outline-accent-6 xl:text-sm"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-4 flex flex-col gap-2 text-xs w-max lg:w-full xl:text-xl">
              <label>Confirm Password</label>
              <input
                type="password"
                className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 outline-accent-6 xl:text-sm"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="w-full mt-4 flex justify-center md:justify-between lg:items-start lg:justify-start gap-2 xl:text-xl">
              <button
                type="submit"
                className="w-[45%] lg:w-[55%] xl:w-[65%] bg-accent-6 text-primary-1 px-4 py-[1%] lg:py-[1.4%] xl:py-[1%] rounded-sm hover:bg-accent-7 hover:cursor-pointer transition-all"
              >
                Reset Password
              </button>
              <a
                className="w-max border border-accent-6 rounded-sm px-4 lg:px-8 flex justify-center py-1 lg:py-[1%] xl:py-1 items-center hover:bg-secondary-6 hover:text-primary-1 hover:border-secondary-6 transition-all"
                href="/login"
              >
                <p>Back to Login</p>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
