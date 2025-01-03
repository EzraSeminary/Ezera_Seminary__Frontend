import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setTitle,
  setDescription,
  setImage,
  setCategory,
  selectCourse,
} from "../../redux/courseSlice";
import { Button } from "../../components/ui/button";
import { CourseState } from "../../redux/courseSlice";
import "../../index.css";
import CustomInput from "@/components/CustomInput";
import CustomTextarea from "@/components/CustomTextarea";
import CustomDropdown from "../../components/CustomDropdown";
import imageCompression from "browser-image-compression";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const basePath = role;
  const { title, description, category } = useSelector(
    (state: { course: CourseState }) => state.course
  );
  const course = useSelector(selectCourse);

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [ , setIsProcessing] = useState(false); // State for loading spinner
  // form validation error
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    description: false,
    image: false,
    category: false,
  });

  const categoryOptions = [
    "መሰረታዊ የመጽሐፍ ቅዱስ እውነቶች",
    "ስነ-ትዳር",
    "ወጣቶች",
    "መጽሐፍ ቅዱስ አጠናን",
    "የመጽሃፍ ቅዱስ ገጸ ባህርያት",
    "የአኗኗር ዘይቤ",
    "የተለያዩ...",
  ];

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsProcessing(true); // Show loading spinner

      try {
        // Compression options
        const options = {
          maxSizeMB: 1, // Max size in MB
          maxWidthOrHeight: 800, // Resize to max width or height of 800px
          useWebWorker: true, // Use web workers for better performance
          fileType: "image/webp", // Convert the image to WebP format
        };

        const compressedFile = await imageCompression(file, options);
        const compressedFileDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
        setImagePreviewUrl(compressedFileDataUrl);
        dispatch(setImage(compressedFile)); // Dispatch the compressed File object to the store
        setValidationErrors((prevErrors) => ({ ...prevErrors, image: false }));
      } catch (error) {
        console.error("Image compression error:", error);
      } finally {
        setIsProcessing(false); // Hide the spinner
      }
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

    if (!category) {
      // Set category error
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        category: true,
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
      navigate(`/${basePath}/courses/create/chapters`);
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
            onChange={handleFileChange}
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
              className={`w-full px-3 py-2 text-accent-6 leading-tight border bg-primary-6 font-nokia-bold ${
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
              className={`w-full px-3 pt-2 pb-12 text-accent-6 leading-tight border bg-primary-6 font-nokia-bold  ${
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
          <div className="col-span-12">
            <label className="block text-accent-6 mb-1">Category:</label>
            <CustomDropdown
              options={categoryOptions}
              selectedValue={category}
              onSelect={(value) => {
                dispatch(setCategory(value));
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  category: false,
                }));
              }}
              className={`w-full px-3 py-2 text-accent-6 leading-tight border bg-primary-6 font-nokia-bold ${
                validationErrors.category ? "border-red-500" : "border-accent-6"
              } rounded-md focus:outline-none focus:shadow-lg transition-all placeholder:text-secondary-4 placeholder:text-sm`}
            />
            {validationErrors.category && (
              <p className="text-red-500 text-xs italic">
                Please select a category.
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