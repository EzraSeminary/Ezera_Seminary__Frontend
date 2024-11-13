import { ChangeEvent, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateFile } from "@/redux/devotionsSlice";
import imageCompression from "browser-image-compression";

interface PhotoUploaderProps {
  handleFileUpload: (file: File) => void;
  existingImageUrl?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  handleFileUpload,
  existingImageUrl,
}) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(
    existingImageUrl || null
  );

  useEffect(() => {
    if (existingImageUrl) {
      setLocalPreviewUrl(existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsProcessing(true);

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/webp",
        };

        const compressedFile = await imageCompression(file, options);
        const compressedFileDataUrl = await imageCompression.getDataUrlFromFile(
          compressedFile
        );

        dispatch(updateFile(compressedFileDataUrl));
        setLocalPreviewUrl(compressedFileDataUrl);
        handleFileUpload(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      {/* {isProcessing && <CircleNotch size={32} className="animate-spin" />} */}

      {localPreviewUrl && !isProcessing && (
        <img
          src={localPreviewUrl}
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
  handleFileUpload: PropTypes.func.isRequired,
  existingImageUrl: PropTypes.string,
};

export default PhotoUploader;
