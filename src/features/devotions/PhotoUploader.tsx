import { useDispatch, useSelector } from "react-redux";
import { updateFile, selectPreviewUrl } from "@/redux/devotionsSlice";
import { useState } from "react";
import PropTypes from "prop-types";

function PhotoUploader({ handleChange }) {
  const dispatch = useDispatch();
  const previewUrl = useSelector(selectPreviewUrl);

  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateFile(reader.result));
        setFile(file); // set the file object to the local state
        handleChange({
          target: {
            name: "image",
            value: reader.result,
            file, // pass the file object to DevotionForm.jsx
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="w-32 h-auto" />
      )}
      <label className=" bg-accent-6 text-[#fff] hover:bg-accent-7 rounded-full px-4 py-1  cursor-pointer text-sm  font-nokia-bold w-[27%]">
        <span className="placeholder-secondary-6">Upload Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          src={previewUrl}
        />
      </label>
    </div>
  );
}

PhotoUploader.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default PhotoUploader;
