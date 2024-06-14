import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  setDescription,
  setImage,
  selectCourse,
} from "../../redux/courseSlice";
import { Button } from "../../components/ui/button";
import { CourseState } from "../../redux/courseSlice";
import "../../index.css";
import CustomInput from "@/components/CustomInput";
import CustomTextarea from "@/components/CustomTextarea";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { title, description } = useSelector(
    (state: { course: CourseState }) => state.course
  );
  const course = useSelector(selectCourse);

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  // form validation error
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    description: false,
    image: false,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      dispatch(setImage(file)); // Dispatch the File object to the store
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreviewUrl(fileReader.result as string);
        setValidationErrors((prevErrors) => ({ ...prevErrors, image: false }));
      };
      fileReader.readAsDataURL(file); // Generate a URL for preview
    } else {
      // Set the image error if no file is selected
      setValidationErrors((prevErrors) => ({ ...prevErrors, image: true }));
    }
  };

  const toNextPage = () => {
    // Perform form validation
    let hasErrors = false;
    if (!title.trim()) {
      // Set title error
      setValidationErrors((prevErrors) => ({ ...prevErrors, title: true }));
      hasErrors = true;
    }

    if (!description.trim()) {
      // Set description error
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        description: true,
      }));
      hasErrors = true;
    }

    // Validation for image
    if (!imagePreviewUrl) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, image: true }));
      hasErrors = true;
    }

    // If there are no validationErrors, then proceed with the navigate logic.
    if (!hasErrors) {
      //navigate to create chapters
      navigate("/admin/courses/create/chapters");
    }
  };

  console.log(course);

  return (
    <div className="w-[80%] mx-auto pt-9 font-nokia-bold">
      <h2 className="text-accent-6 text-2xl border-b border-primary-8 pb-1">
        Create Course
      </h2>
      <form className="w-[90%] mx-auto my-10 flex gap-8  border-2 border-accent-6 p-8 rounded-xl bg-secondary-6">
        <div
          className={`relative flex flex-col col-span-12 mx-auto h-72 w-[100%] border ${
            validationErrors.image
              ? "border-red-500"
              : "border-accent-6 rounded-lg"
          }`}
        >
          {imagePreviewUrl && (
            <>
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-md bg-red bg-opacity-30"
              />
              <div className="absolute inset-0 bg-accent-8 bg-opacity-70 rounded-md"></div>
              </>
          )}

          <input
            type="file"
            id="fileInput"
            className="relative z-10 w-[100%] lg:px-[35%] lg:py-[30%]
            md:px-[30%] md:py-[30%]
            text-white
            file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:font-nokia-bold
            hover:file:bg-secondary-2 rounded-xs bg-transparent
            focus:outline-none focus:border-accent-8 cursor-pointer"
            name="image"
            onChange={handleImageChange}
            required
          />

          {validationErrors.image && (
            <p className="text-red-500 text-xs italic text-center">
              Please provide an image.
            </p>
          )}
        </div>

        <div className="w-[80%] space-y-6">
          <div className="col-span-12">
            <label className="block text-accent-6 mb-1">Course Title:</label>
            <CustomInput
              type="text"
              className={`w-full px-3 py-2 text-accent-6 leading-tight border bg-primary-6 ${
                validationErrors.title ? "border-red-500" : "border-accent-6"
              } rounded-md focus:outline-none focus:shadow-lg transition-all placeholder:text-secondary-4 placeholder:text-sm`}
              name="title"
              placeholder="Untitled Course"
              autoComplete="off"
              value={title}
              onChange={(e) => {
                dispatch(setTitle(e.target.value));
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  title: false,
                }));
              }}
              required
              maxLength={30}
            />
            {/* Conditionally render an error message */}
            {validationErrors.title && (
              <p className="text-red-500 text-xs italic">
                Please enter a title.
              </p>
            )}
          </div>
          <div className="col-span-12">
            <label className="block text-accent-6 mb-1">Description:</label>
            <CustomTextarea
              className={`w-full px-3 pt-2 pb-12 text-accent-6 leading-tight border bg-primary-6 ${
                validationErrors.description
                  ? "border-red-500"
                  : "border-accent-6"
              } rounded-md focus:outline-none focus:shadow-lg transition-all placeholder:text-secondary-4 placeholder:text-sm`}
              name="description"
              placeholder="Add a description"
              autoComplete="off"
              value={description}
              onChange={(e) => {
                dispatch(setDescription(e.target.value));
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  description: false,
                }));
              }}
              required
              maxLength={150}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs italic">
                Please enter a description.
              </p>
            )}
          </div>
          <div className="col-span-12 text-primary-6">
            <Button onClick={toNextPage}>Create</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
