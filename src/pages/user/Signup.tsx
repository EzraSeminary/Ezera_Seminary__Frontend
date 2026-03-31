import { FocusEvent, useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import {
  useGetAuthProvidersQuery,
  useSignupMutation,
  useSocialAuthMutation,
} from "@/redux/api-slices/apiSlice"; // Import the useSignupMutation hook
import { login as loginAction, signup as signupAction } from "@/redux/authSlice"; // Import the signup action
// import { GoogleLogo } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one symbol"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .test("confirmPassword", "Passwords must match", (value, context) => {
      return value === context.parent.password;
    })
    .required("Confirm password is required"),
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [signupMutation, { isLoading, error }] = useSignupMutation();
  const [socialAuth] = useSocialAuthMutation();
  const { data: authProviders, isLoading: isAuthProvidersLoading, isFetching: isAuthProvidersFetching } =
    useGetAuthProvidersQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const persistAuthenticatedUser = (result: any) => {
    dispatch(loginAction(result));
    navigate("/");
  };

  const handleGoogleSignup = async (credential: string) => {
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
      toast.success("Account ready!");
    } catch (err) {
      console.error("Error during Google signup:", err);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const result = await signupMutation(values).unwrap();
        dispatch(signupAction(result));
        localStorage.setItem("user", JSON.stringify(result));
        navigate("/");
      } catch (err) {
        console.error(err);
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
    setFocusedField((current) =>
      current === event.target.name ? null : current
    );
  };

  return (
    <div className="flex w-[95%] md:w-[80%] rounded-xl border-2 border-accent-6 mx-auto mt-20 mb-12 xl:mt-28 xl:mb-16 md:min-h-[720px] overflow-hidden">
      <ToastContainer />
      <div
        className="md:flex flex-col coming-soon bg-cover hidden md:w-[50%] md:min-h-[720px] font-nokia-bold p-7 justify-between text-white rounded-xl gap-64"
        style={{ backgroundPositionX: "-80px" }}
      >
        <div className="flex space-x-3 cursor-pointer text-white">
          <img src="/assets/ezra-logo.svg" alt="" />
          <h3 className="self-center text-2xl font-Lato-Regular">
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
        className="flex flex-col justify-center font-nokia-bold px-7 py-8 text-accent-6 w-[100%] md:w-[70%] lg:w-[40%]"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-3xl xl:text-4xl">
          <span className="text-secondary-6">Create </span>Account
        </h3>
        <div className="mt-6 w-full max-w-[24rem]">
          <GoogleAuthButton
            onCredential={handleGoogleSignup}
            text="signup_with"
            disabled={isLoading}
          />
          <p className="mt-3 text-center text-xs text-accent-4 xl:text-sm">
            or sign up with email and password
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-2 text-xs xl:text-xl">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-auto gap-2">
              <label>First Name</label>
              <input
                type="text"
                maxLength={30}
                className={getInputClassName(
                  "firstName",
                  "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 mb-2 w-full xl:text-sm focus:outline-none focus:ring-2"
                )}
                placeholder="Abebe"
                {...formik.getFieldProps("firstName")}
                onBlur={handleFieldBlur}
                onFocus={() => setFocusedField("firstName")}
              />
              <div className="min-h-5">
                {(formik.touched.firstName || formik.values.firstName) && formik.errors.firstName && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <label>Last Name</label>
              <input
                type="text"
                maxLength={30}
                className={getInputClassName(
                  "lastName",
                  "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 mb-2 w-full xl:text-sm focus:outline-none focus:ring-2"
                )}
                placeholder="Kebede"
                {...formik.getFieldProps("lastName")}
                onBlur={handleFieldBlur}
                onFocus={() => setFocusedField("lastName")}
              />
              <div className="min-h-5">
                {(formik.touched.lastName || formik.values.lastName) && formik.errors.lastName && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>
          </div>
          <label>Email</label>
          <input
            type="email"
            maxLength={35}
            className={getInputClassName(
              "email",
              "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 w-full lg:w-[50%] xl:text-sm focus:outline-none focus:ring-2"
            )}
            placeholder="AbebeKebede@gmail.com"
            {...formik.getFieldProps("email")}
            onBlur={handleFieldBlur}
            onFocus={() => setFocusedField("email")}
          />
          <div className="min-h-5">
            {(formik.touched.email || formik.values.email) && formik.errors.email && (
              <div className="text-red-500 text-xs xl:text-sm">
                {formik.errors.email}
              </div>
            )}
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-auto gap-2">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className={getInputClassName(
                  "password",
                  "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 w-full xl:text-sm focus:outline-none focus:ring-2"
                )}
                placeholder="********"
                {...formik.getFieldProps("password")}
                onBlur={handleFieldBlur}
                onFocus={() => setFocusedField("password")}
              />
              <div className="min-h-5">
                {(formik.touched.password || formik.values.password) && formik.errors.password && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>
              <div className="min-h-[88px]">
                {focusedField === "password" && (
                  <div className="text-xs xl:text-sm space-y-1">
                    <div className={formik.values.password.length >= 6 ? "text-green-600" : "text-gray-500"}>
                      Minimum 6 characters
                    </div>
                    <div className={/[A-Z]/.test(formik.values.password) ? "text-green-600" : "text-gray-500"}>
                      At least 1 capital letter
                    </div>
                    <div className={/[a-z]/.test(formik.values.password) ? "text-green-600" : "text-gray-500"}>
                      At least 1 small letter
                    </div>
                    <div className={/[^A-Za-z0-9]/.test(formik.values.password) ? "text-green-600" : "text-gray-500"}>
                      At least 1 symbol
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className={getInputClassName(
                  "confirmPassword",
                  "border rounded-lg placeholder:text-accent-3 text-xs1 p-2 w-full xl:text-sm focus:outline-none focus:ring-2"
                )}
                placeholder="********"
                {...formik.getFieldProps("confirmPassword")}
                onBlur={handleFieldBlur}
                onFocus={() => setFocusedField("confirmPassword")}
              />
              <div className="min-h-5">
                {(formik.touched.confirmPassword || formik.values.confirmPassword) &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" flex gap-2 items-center">
            <input
              type="checkbox"
              className="appearance-none border-2 border-accent-6 rounded-md w-5 h-5 checked:bg-accent-6 checked:border-transparent text-white"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)} // toggle showPassword state when checkbox is clicked
            />
            <label>Show Password</label>
          </div>
          {/* <div className="flex gap-2 mt-2">
            <input
              type="checkbox"
              className="appearance-none border-2 border-accent-6 rounded-md w-5 h-5 checked:bg-accent-6 checked:border-transparent text-white"
            />
            <label className="text-xs xl:text-xl">
              I accept the terms and conditions.
            </label>
          </div> */}
        </div>
        <div className="w-[100%] mt-4 flex flex-col xl:flex-row lg:w-full gap-2 xl:gap-4 xl:text-xl">
          <button
            type="submit"
            disabled={isLoading}
            className="w-[35%] px-2 md:w-[50%] bg-accent-6 text-white xl:w-[70%] py-1 rounded-full hover:bg-accent-7 hover:cursor-pointer transition-all"
          >
            Sign Up
          </button>
          <p className="flex item-center gap-2 xl:w-[90%] xl:flex-col xl:gap-0">
            Already have an account?
            <Link
              className="text-secondary-6 hover:text-accent-5 hover:underline transition-all cursor-pointer"
              to="/login"
            >
              {"  "}
              Sign In
            </Link>
          </p>
        </div>
        {error && "data" in error && (
          <div className="error text-red-500 text-xs xl:text-sm">
            {(error as { data?: { error?: string }; message?: string }).data?.error ||
              (error as { message?: string }).message ||
              "Failed to sign up. Please try again."}
          </div>
        )}
        {/* <div className="text-xs mt-4 xl:text-xl">
          <p>Or signup with</p>
          <div className="flex mt-2 text-2xl text-white gap-2 xl:text-3xl">
            <GoogleLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer transition-all"></GoogleLogo>
            <FacebookLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer transition-all"></FacebookLogo>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default Signup;
