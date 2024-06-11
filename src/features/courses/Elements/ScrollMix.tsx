import CustomTextarea from "@/components/CustomTextarea";
import { ElementTypeProps } from "./List";
import { updateElement, MixElementValue } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";

function ScrollMix({ chapterIndex, slideIndex, element }: ElementTypeProps) {
  const dispatch = useDispatch();

  const mixElementValue = element.value as MixElementValue;

  const [mixValue, setMixValue] = useState<MixElementValue>({
    text1: mixElementValue?.text1 || "",
    file: mixElementValue?.file || "",
    text2: mixElementValue?.text2 || "",
  });

  const handleTextChange = (textKey: keyof MixElementValue, value: string) => {
    const updatedValue = { ...mixValue, [textKey]: value };
    setMixValue(updatedValue);

    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: element.id,
        value: updatedValue,
      })
    );
  };

  // Image preview state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    typeof mixElementValue?.file === "string" ? mixElementValue.file : ""
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const updatedValue = { ...mixValue, file: file };
      setMixValue(updatedValue);

      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: element.id,
          value: updatedValue,
        })
      );

      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl); // Set imagePreviewUrl state
    }
  };

  return (
    <div>
      <CustomTextarea
        id={`${element.id}-text1`}
        placeholder="Enter text"
        value={mixValue.text1}
        onChange={(e) => handleTextChange("text1", e.target.value)}
        className="w-[100%] h-[25vh] font-Lato-Regular border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
        maxLength={300}
      />
      <div className="flex flex-col my-3 border-2 border-secondary-3 rounded-md hover:border-accent-5">
        <input
          type="file"
          id={`${element.id}-file`}
          onChange={handleFileInputChange}
          className="w-[100%] ..."
        />
        {imagePreviewUrl && (
          <img src={imagePreviewUrl} alt="" className="rounded-b-md" />
        )}
      </div>
      <CustomTextarea
        id={`${element.id}-text2`}
        placeholder="Enter text"
        value={mixValue.text2}
        onChange={(e) => handleTextChange("text2", e.target.value)}
        className="w-[100%] h-[25vh] font-Lato-Regular border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
        maxLength={300}
      />
    </div>
  );
}

export default ScrollMix;
