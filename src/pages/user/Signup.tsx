import { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { useSignupMutation } from "@/redux/api-slices/apiSlice"; // Import the useSignupMutation hook
import { signup as signupAction } from "@/redux/authSlice"; // Import the signup action
import { GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupMutation, { isLoading, error }] = useSignupMutation(); // Use the useSignupMutation hook
  const dispatch = useDispatch(); // Use useDispatch
  const navigate = useNavigate(); // Use useNavigate

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signupMutation({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(result));

      // update the auth context
      dispatch(signupAction(result)); // Dispatch the signup action

      navigate("/"); // Navigate to the home page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex w-[95%] md:w-[70%] rounded-xl border-2 border-accent-6 mx-auto my-20">
      <div
        className="md:flex flex-col bg-coming-soon bg-cover hidden lg:w-[40%] font-nokia-bold p-7 justify-between text-white rounded-xl gap-64"
        style={{ backgroundPositionX: "-80px" }}
      >
        <div className="flex space-x-3 cursor-pointer text-white ">
          <img src="/assets/ezra-logo.svg" alt="" />
          <h3 className="self-center text-2xl font-Lato-Regular">
            <span className="font-Lato-Bold">EZRA</span> Seminary
          </h3>
        </div>
        <p className="text-3xl">
          መጽሃፍ ቅዱስ እግዚአብሔርን
          <br />
          <span className="text-4xl text-accent-6">በግላችን የምናውቅበት</span>
          <br />
          ዋነኛው መንገድ ነው።
          <br />
        </p>
      </div>
      <form
        className="flex flex-col font-nokia-bold px-7 py-8 text-accent-6 w-[100%] sm:w-[10em] md:w-[20em] lg:w-[60%]"
        onSubmit={handleSubmit}
      >
        <h3 className="text-3xl">
          <span className="text-secondary-6">Create </span>Account
        </h3>
        <div className="mt-10 flex flex-col gap-2 text-xs">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-auto gap-2">
              <label>First Name</label>
              <input
                type="text"
                className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 md:w-168"
                placeholder="Abebe"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <label>Last Name</label>
              <input
                type="text"
                className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 md:w-168"
                placeholder="Kebede"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <label>Email</label>
          <input
            type="email"
            className="border rounded-lg border-accent-6  placeholder:text-accent-3 text-xs1 p-2 w-[50%]"
            placeholder="AbebeKebede@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-auto gap-2">
              <label>Password</label>
              <input
                type="password"
                className="border rounded-lg border-accent-6  placeholder:text-accent-3 text-xs1 p-2 "
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <label>Confirm Password</label>
              <input
                type="password"
                className="border rounded-lg border-accent-6  placeholder:text-accent-3 text-xs1 p-2 "
                placeholder="********"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="checkbox"
              className="appearance-none border-2 border-accent-6 rounded-md w-5 h-5 checked:bg-accent-6 checked:border-transparent text-white"
            />
            <label className="text-xs">
              I accept the terms and conditions.
            </label>
          </div>
        </div>
        <div className="w-[100%] mt-4 flex flex-col sm:flex sm:flex-row gap-2">
          <button
            disabled={isLoading}
            className="md:w-[30%] lg:w-[50%] bg-accent-6 text-white px-16 py-1 rounded-sm hover:bg-accent-7 hover:cursor-pointer transition-all"
          >
            Sign Up
          </button>
          <p className="flex item-center">
            Already have an account?
            <Link
              className="text-secondary-6 hover:text-secondary-3 transition-all cursor-pointer"
              to="/login"
            >
              {"  "}
              Sign In
            </Link>
          </p>
        </div>
        {error && 'message' in error && <div className="error">{error.message}</div>}
        <div className="text-xs mt-4">
          <p>Or signup with</p>
          <div className="flex mt-2 text-2xl text-white gap-2">
            <GoogleLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer  transition-all"></GoogleLogo>
            <FacebookLogo className="bg-accent-6 rounded-full  hover:bg-accent-7  hover:cursor-pointer  transition-all"></FacebookLogo>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
