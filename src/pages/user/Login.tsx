import { FocusEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useActivateUserMutation,
  useGetAuthProvidersQuery,
  useSocialAuthMutation,
} from "@/redux/api-slices/apiSlice";
import { login as loginAction } from "@/redux/authSlice";
import LoadingAnimation from "../../features/login/LoadingAnimation";
import * as Yup from "yup";
import { useFormik } from "formik";
import Footer from "@/components/Footer";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface APIError extends Error {
  status: number;
  data: {
    error: string;
  };
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const [socialAuth] = useSocialAuthMutation();
  const [activateUser] = useActivateUserMutation();
  const { data: authProviders, isLoading: isAuthProvidersLoading, isFetching: isAuthProvidersFetching } =
    useGetAuthProvidersQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const persistAuthenticatedUser = (result: any) => {
    dispatch(loginAction(result));

    if (result.role === "Admin") {
      navigate("/admin");
      return;
    }

    navigate("/");
  };

  const handleGoogleLogin = async (credential: string) => {
    if (isAuthProvidersLoading || isAuthProvidersFetching) {
      toast.info("Google sign-in is still loading. Please try again.");
      return;
    }

    if (!authProviders?.google?.webClientId) {
      toast.error("Google sign-in is not configured yet.");
      return;
    }

    try {
      const result = await socialAuth({ token: credential }).unwrap();
      persistAuthenticatedUser(result);
      toast.success("Signed in successfully!");
    } catch (err) {
      console.error("Error during Google login:", err);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        if (result) {
          if (result.status === "inactive") {
            const confirmed = window.confirm(
              "Your account is inactive. Do you want to make it active?"
            );
            if (confirmed) {
              await activateUser({
                userId: result._id,
                status: "active",
              }).unwrap();
              const updatedResult = { ...result, status: "active" }; // Create a new object with the updated status
              toast.success("Account activated successfully!");
              persistAuthenticatedUser(updatedResult);
              toast.success("Login successful!");
            } else {
              return;
            }
          } else {
            persistAuthenticatedUser(result);
            toast.success("Login successful!");
          }
        }
      } catch (err) {
        console.error("Error during login:", err);
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

  const isFieldValid = (field: keyof typeof formik.values) =>
    Boolean(formik.values[field]) && !formik.errors[field];

  const getInputClassName = (field: keyof typeof formik.values, baseClass: string) => {
    if (formik.errors[field] && (formik.touched[field] || formik.values[field])) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-200`;
    }
    if (isFieldValid(field)) {
      return `${baseClass} border-green-600 focus:border-green-600 focus:ring-green-200`;
    }
    return `${baseClass} border-accent-6 focus:border-accent-6 focus:ring-accent-2`;
  };

  const handleFieldBlur = (event: FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(event);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <div className="flex h-[80%] py-16 xl:pt-20 items-center justify-center flex-1">
        <div className="flex w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-[80%] rounded-xl md:border-2 md:border-accent-6 mx-auto md:shadow-xl md:min-h-[680px] overflow-hidden">
          <div
            className="md:flex flex-col coming-soon bg-cover hidden lg:w-[58%] md:min-h-[680px] font-nokia-bold p-7 justify-between text-white rounded-xl gap-64"
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
            <div className="mt-6 w-full">
              <GoogleAuthButton
                onCredential={handleGoogleLogin}
                text="signin_with"
                disabled={isLoading}
              />
              <p className="mt-3 text-center text-xs text-accent-4 xl:text-sm">
                or sign in with email and password
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-xs  w-max lg:w-full xl:text-xl ">
              <label>Email</label>
              <input
                type="email"
                className={getInputClassName(
                  "email",
                  "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 mb-2 outline-none xl:text-sm focus:ring-2"
                )}
                placeholder="abc@gmail.com"
                {...formik.getFieldProps("email")}
                onBlur={handleFieldBlur}
              />
              <div className="min-h-5">
                {(formik.touched.email || formik.values.email) && formik.errors.email && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"} // change type based on showPassword state
                className={getInputClassName(
                  "password",
                  "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 outline-none xl:text-sm focus:ring-2"
                )}
                placeholder="********"
                {...formik.getFieldProps("password")}
                onBlur={handleFieldBlur}
              />
              <div className="min-h-5">
                {(formik.touched.password || formik.values.password) && formik.errors.password && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>
              {error && "data" in error && (
                <div
                  className="text-red-500 text-xl xl:text-sm"
                  data-testid="error-message"
                >
                  {(error as APIError).data.error}
                </div>
              )}
              <div className="mt-4 flex justify-between gap-7">
                <div
                  className=" flex gap-2 items-center hover:cursor-pointer hover:text-accent-7 transition-all"
                  onClick={() => setShowPassword(!showPassword)}
                >
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
              </button>
              <Link
                className="w-max border border-accent-6 rounded-sm px-4 lg:px-8 flex justify-center py-1 lg:py-[1%] xl:py-1 items-center hover:bg-secondary-6 hover:text-primary-1 hover:border-secondary-6 transition-all"
                to="/signup"
              >
                <p>Sign Up</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
