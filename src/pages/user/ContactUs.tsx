import Footer from "@/components/Footer";
import { GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
// import { useLoginMutation } from "@/redux/api-slices/apiSlice";
import LoadingAnimation from "../../features/login/LoadingAnimation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface APIError extends Error {
  status: number;
  data: {
    error: string;
  };
}

const ContactUs = () => {
  const [sendMessage, { isLoading, error }] = useSendMessageMutation();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await sendMessage(values).unwrap();
        // Assuming the API returns some success message on successful contact message submission.
        toast.success("Your message has been sent successfully!");
        setSubmitting(false);
      } catch (err) {
        toast.error(
          "An error occurred while sending your message. Please try again later."
        );
        setSubmitting(false);
      }
    },
  });
  return (
    <div className="flex flex-col min-h-screen absolute top-0 w-full font-nokia-bold">
      <div className="contact-img bg-cover  w-full py-14  md:py-20 lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle font-bold text-center">
          <div className=" text-2xl md:text-5xl">
            Contact <span className="text-accent-6">Us</span>
          </div>
          <div className="text-lg md:text-3xl tracking-widest text-accent-6">
            ያናግሩን
          </div>
        </div>
      </div>
      <div className=" h-auto flex-1">
        <ToastContainer />
        <div className="flex w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-[80%]  rounded-xl mx-auto ">
          <div className="hidden lg:flex flex-col  lg:w-[40%] font-nokia-bold p-7 justify-center items-start text-secondary-6 rounded-xl">
            <h3 className=" text-2xl font-Lato-Regular">
              Ask how we can help you:
            </h3>
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
            className="flex flex-col font-nokia-bold px-7 justify-center items-center  lg:items-start py-16 text-accent-6 w-[90%] mx-auto   lg:w-[50%]  rounded-lg  "
            onSubmit={formik.handleSubmit}
          >
            <h3 className="text-lg md:text-3xl xl:text-4xl">
              <span className="text-secondary-6">Let's start a </span>
              conversation
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-xs  md:text-sm w-[90%] md:w-full xl:text-xl ">
              <label>First Name</label>
              <input
                type="firstName"
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1  p-2 mb-2  outline-accent-6 xl:text-sm ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="First name"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.firstName}
                </div>
              )}
              <label>Last Name</label>
              <input
                type="lastName"
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1  p-2 mb-2  outline-accent-6 xl:text-sm ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Last name"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.lastName}
                </div>
              )}
              <label>Your Message</label>
              <textarea
                cols={30}
                rows={5}
                className={`border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1  p-2 mb-2  outline-accent-6 xl:text-sm ${
                  formik.touched.message && formik.errors.message
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Write your message here..."
                {...formik.getFieldProps("message")}
              />
              {formik.touched.message && formik.errors.message && (
                <div className="text-red-500 text-xs xl:text-sm">
                  {formik.errors.message}
                </div>
              )}
              {error && "data" in error && (
                <div className="text-red-500 text-xl xl:text-sm">
                  {(error as APIError).data.error}
                </div>
              )}
            </div>
            <div className="w-full  mt-4 flex justify-center md:justify-between lg:items-start  lg:justify-start gap-2  xl:text-xl">
              <button
                type="submit"
                disabled={isLoading}
                className="w-max bg-accent-6 text-primary-1 px-4 py-[1%] lg:py-[1.4%] xl:py-[1%] rounded-sm hover:bg-accent-7 hover:cursor-pointer transition-all"
              >
                {isLoading ? <LoadingAnimation /> : "Contact Us"}
                {/* Render loading spinner if isLoading is true, otherwise show "Login" */}
              </button>
            </div>
            <div className="text-xs mt-4  xl:text-xl">
              <p>Or Connect using</p>
              <div className="flex mt-2 text-2xl text-white gap-2  xl:text-3xl ">
                <GoogleLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer  transition-all"></GoogleLogo>
                <FacebookLogo className="bg-accent-6 rounded-full  hover:bg-accent-7  hover:cursor-pointer  transition-all"></FacebookLogo>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
