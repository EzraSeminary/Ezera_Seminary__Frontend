// import { useState } from "react";
import { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateFile, selectPreviewUrl } from "@/redux/devotionsSlice";

interface PhotoUploaderProps {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ handleChange }) => {
  const dispatch = useDispatch();
  const previewUrl = useSelector(selectPreviewUrl);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0]; // Use optional chaining

    if (newFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Ensure `reader.result` is a string before dispatching
        dispatch(updateFile(reader.result as string));

        handleChange({
          target: {
            name: "image",
            value: reader.result as string,
            // eslint-disable-next-line
            // @ts-expect-error
            files: newFile,
          },
        });
      };
      reader.readAsDataURL(newFile);
    } else {
      // Handle the case where no file is selected (e.g., display an error message)
    }
  };

  return (
    <div>
      {previewUrl && typeof previewUrl === "string" && (
        <img src={previewUrl} alt="Preview" className="w-32 h-auto p-2 border border-accent-6 mb-2 rounded-lg" />
      )}
      <label className="bg-accent-6 text-[#fff] hover:bg-accent-7 rounded-full px-4 py-1 cursor-pointer text-sm font-nokia-bold w-[27%]">
        <span className="placeholder-secondary-6">Upload Image</span>
        {/* Use input type="file" for file selection */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

PhotoUploader.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default PhotoUploader;
