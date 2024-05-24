import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useForgotPasswordMutation } from "@/redux/api-slices/apiSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email).unwrap();
      toast.success("Password reset instructions sent to your email.");
      setTimeout(() => {
        navigate("/login");
      }, 8000); // Delay navigation by 4 seconds
    } catch (err) {
      console.error(err);
      if ((err as any).status === 400) {
        toast.error("Invalid email address.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="mt-5 mx-auto text-center">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="flex-column">
          <div className="mt-5">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="mt-5 p-4 bg-primary-5">
            Send Password Reset Instructions
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
