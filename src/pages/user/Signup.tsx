import { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { useSignupMutation } from "@/redux/api-slices/apiSlice"; // Import the useSignupMutation hook
import { signup as signupAction } from "@/redux/authSlice"; // Import the signup action
import { GoogleLogo } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useFormik } from "formik";
import * as Yup from "yup";

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
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .test("confirmPassword", "Passwords must match", (value, context) => {
      return value === context.parent.password;
    })
    .required("Confirm password is required"),
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupMutation, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await signupMutation(values).unwrap();
        localStorage.setItem("user", JSON.stringify(result));
        dispatch(signupAction(result));
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <div className="flex w-[95%] md:w-[80%] rounded-xl border-2 border-accent-6 mx-auto mt-20 mb-12 xl:mt-28 xl:mb-16">
      <div
        className="md:flex flex-col coming-soon bg-cover hidden md:w-[50%] font-nokia-bold p-7 justify-between text-white rounded-xl gap-64"
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
        className="flex flex-col font-nokia-bold px-7 py-8 text-accent-6 w-[100%] md:w-[70%] lg:w-[40%]"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-3xl xl:text-4xl">
          <span className="text-secondary-6">Create </span>Account
        </h3>
        <div className="mt-10 flex flex-col gap-2 text-xs xl:text-xl">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-auto gap-2">
              <label>First Name</label>
              <input
                type="text"
                maxLength={30}
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-full xl:text-sm ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Abebe"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <label>Last Name</label>
              <input
                type="text"
                maxLength={30}
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 mb-2 w-full xl:text-sm ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Kebede"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.lastName}
                </div>
              )}
            </div>
          </div>
          <label>Email</label>
          <input
            type="email"
            maxLength={35}
            className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 w-full lg:w-[50%] xl:text-sm ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            }`}
            placeholder="AbebeKebede@gmail.com"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs xl:text-sm">
              {formik.errors.email}
            </div>
          )}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-auto gap-2">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 w-full xl:text-sm ${
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
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1 p-2 w-full xl:text-sm ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="********"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs xl:text-sm">
                    {formik.errors.confirmPassword}
                  </div>
                )}
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
        {error && "message" in error && (
          <div className="error text-red-500 text-xs xl:text-sm">
            {error.message}
          </div>
        )}
        <div className="text-xs mt-4 xl:text-xl">
          <p>Or signup with</p>
          <div className="flex mt-2 text-2xl text-white gap-2 xl:text-3xl">
            <GoogleLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer transition-all"></GoogleLogo>
            {/* <FacebookLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer transition-all"></FacebookLogo> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
