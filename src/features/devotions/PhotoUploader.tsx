import { ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateFile, selectPreviewUrl } from "@/redux/devotionsSlice";
import imageCompression from "browser-image-compression";
// import { CircleNotch } from "@phosphor-icons/react";

interface PhotoUploaderProps {
  handleFileUpload: (file: File) => void; // Change to handleFileUpload to make it clear it's for files
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ handleFileUpload }) => {
  const dispatch = useDispatch();
  const previewUrl = useSelector(selectPreviewUrl);
  const [isProcessing, setIsProcessing] = useState(false);

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

        // Compress and convert the image
        const compressedFile = await imageCompression(file, options);

        // Convert the compressed file to a data URL for preview and dispatch
        const compressedFileDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);

        // Dispatch the compressed image for preview (as a data URL)
        dispatch(updateFile(compressedFileDataUrl));

        // Pass the compressed file to the parent component
        handleFileUpload(compressedFile); // Directly pass the File object
      } catch (error) {
        console.error("Image compression error:", error);
      } finally {
        setIsProcessing(false); // Hide the spinner
      }
    }
  };

  return (
    <div>
      {/* {isProcessing && <CircleNotch size={32} className="animate-spin" />} */}

      {previewUrl && typeof previewUrl === "string" && !isProcessing && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-32 h-auto p-2 border border-accent-6 mb-2 rounded-lg"
        />
      )}

      <label className="bg-accent-6 text-[#fff] hover:bg-accent-7 rounded-full px-4 py-1 cursor-pointer text-sm font-nokia-bold w-[27%]">
        <span className="placeholder-secondary-6">Upload Image</span>
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
  handleFileUpload: PropTypes.func.isRequired, // Update the prop name
};

export default PhotoUploader;
