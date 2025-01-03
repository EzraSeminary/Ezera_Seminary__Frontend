import { useState } from "react";
// import { GoogleLogo } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/redux/api-slices/apiSlice";
import { login as loginAction } from "@/redux/authSlice";
import LoadingAnimation from "../../features/login/LoadingAnimation";
import * as Yup from "yup";
import { useFormik } from "formik";
import Footer from "@/components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useGoogleLogin } from "@react-oauth/google";

interface APIError extends Error {
  status: number;
  data: {
    error: string;
  };
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation(); // use the hook
  const navigate = useNavigate();
  const dispatch = useDispatch(); // get the dispatch function from Redux

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        if (result) {
          // save the user to local storage
          localStorage.setItem("user", JSON.stringify(result));
          // update the auth context
          dispatch(loginAction(result)); // dispatch the login action from authSlice
          if (result.role === "Admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
          // Show success toast
          toast.success("Login successful!");
        }
      } catch (err) {
        console.error(err);
        // Show error toast
        if ((err as APIError).status === 400) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(
            "An error occurred during login. Please try again later."
          );
        }
      }
    },
  });

  // Add the useGoogleLogin hook
  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       // This is where you extract the token
  //       const res = await fetch(
  //         `http://localhost:5100/users/auth/google/verify`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ token: tokenResponse.access_token }), // Check the token here
  //         }
  //       );

  //       const result = await res.json();

  //       if (result) {
  //         // Handle successful sign in with the user object returned from your backend
  //         localStorage.setItem("user", JSON.stringify(result));
  //         dispatch(loginAction(result));

  //         if (result.role === "Admin") {
  //           navigate("/admin");
  //         } else {
  //           navigate("/"); // Navigate to /google/success
  //         }
  //         toast.success("Login successful!");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Google sign-in failed. Please try again.");
  //     }
  //   },
  //   onError: () => {
  //     toast.error("Google sign-in failed. Please try again.");
  //   },
  // });

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <div className="flex h-[80%] py-16 xl:pt-20 items-center justify-center flex-1">
        <div className="flex w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-[80%]  rounded-xl md:border-2 md:border-accent-6 mx-auto   md:shadow-xl ">
          <div
            className="md:flex flex-col coming-soon bg-cover hidden lg:w-[58%] font-nokia-bold p-7 justify-between text-white rounded-xl gap-64"
            style={{ backgroundPositionX: "-80px" }}
          >
            <div className="flex space-x-3 cursor-pointer text-white ">
              <img src="/assets/ezra-logo.svg" alt="" />
              <h3 className=" text-2xl font-Lato-Regular">
                <span className="font-Lato-Bold">EZRA</span> Seminary
              </h3>
            </div>
            <p className="text-xl lg:text-3xl w-max">
              መጽሃፍ ቅዱስ እግዚአብሔርን
              <br />
              <span className="text-3xl lg:text-4xl text-accent-6">
                በግላችን የምናውቅበት
              </span>
              <br />
              ዋነኛው መንገድ ነው።
              <br />
            </p>
          </div>
          <form
            className="flex flex-col font-nokia-bold px-7 justify-center items-center  lg:items-start py-16 text-accent-6 w-[90%] mx-auto  md:w-[20em] lg:w-[50%] border border-accent-5 md:border-none rounded-lg shadow-2xl md:shadow-none "
            onSubmit={formik.handleSubmit}
          >
            <h3 className="text-3xl xl:text-4xl">
              <span className="text-secondary-6">Log</span>in
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-xs  w-max lg:w-full xl:text-xl ">
              <label>Email</label>
              <input
                type="email"
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1  p-2 mb-2  outline-accent-6 xl:text-sm ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="abc@gmail.com"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.email}
                </div>
              )}
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"} // change type based on showPassword state
                className={`border rounded-lg border-accent-6  placeholder:text-accent-3 text-xs1 p-2 outline-accent-6 xl:text-sm ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="********"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.password}
                </div>
              )}
              {error && "data" in error && (
                <div className="text-red-500 text-xl xl:text-sm">
                  {(error as APIError).data.error}
                </div>
              )}
              <div className="mt-4 flex justify-between gap-7">
                <div className=" flex gap-2 items-center hover:cursor-pointer hover:text-accent-7 transition-all"
                  onClick={() => setShowPassword(!showPassword)}>
                  <input
                    type="checkbox"
                    className="appearance-none border-2 border-accent-6 rounded-md w-5 h-5 checked:bg-accent-6 checked:border-transparent text-white"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)} // toggle showPassword state when checkbox is clicked
                  />
                  <label className="hover:cursor-pointer">Show Password</label>
                </div>
                <Link
                  to="/forgot-password"
                  className="self-end text-xs xl:text-xl hover:cursor-pointer hover:text-accent-7 transition-all"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="w-full  mt-4 flex justify-center md:justify-between lg:items-start  lg:justify-start gap-2  xl:text-xl">
              <button
                type="submit"
                disabled={isLoading}
                className="w-[30%] lg:w-[55%] xl:w-[65%] bg-accent-6 text-primary-1 px-4 py-[1%] lg:py-[1.4%] xl:py-[1%] rounded-sm hover:bg-accent-7 hover:cursor-pointer transition-all"
              >
                {isLoading ? <LoadingAnimation /> : "Login"}
                {/* Render loading spinner if isLoading is true, otherwise show "Login" */}
              </button>
              <Link
                className="w-max border border-accent-6 rounded-sm px-4 lg:px-8 flex justify-center py-1 lg:py-[1%] xl:py-1 items-center hover:bg-secondary-6 hover:text-primary-1 hover:border-secondary-6 transition-all"
                to="/signup"
              >
                <p>Sign Up</p>
              </Link>
            </div>
            {/* <div className="text-xs mt-4  xl:text-xl">
              <p>Or signup with</p>
              <div className="flex mt-2 text-2xl text-white gap-2  xl:text-3xl ">
                <div
                  // onClick={() => googleLogin()}
                  className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer  transition-all"
                >
                  <GoogleLogo />
                </div>
              </div>
            </div> */}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
