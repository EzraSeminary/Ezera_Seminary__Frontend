import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "@/redux/api-slices/apiSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      toast.success("Password reset instructions sent to your email.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send Password Reset Instructions</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
