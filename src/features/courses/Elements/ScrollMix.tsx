import { ElementTypeProps } from "./List";
import { updateElement, MixElementValue } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";

function ScrollMix({ chapterIndex, slideIndex, element }: ElementTypeProps) {
  const dispatch = useDispatch();

  const [mixValue, setMixValue] = useState<MixElementValue>({
    text1: element.value?.text1 || "",
    file: element.value?.file || "",
    text2: element.value?.text2 || "",
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
    typeof element.value?.file === "string" ? element.value.file : ""
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[[0]]; // Get the first file from the input
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
      <textarea
        id={`${element.id}-text1`}
        placeholder="Enter text for Text1"
        value={mixValue.text1}
        onChange={(e) => handleTextChange("text1", e.target.value)}
        className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
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
      <textarea
        id={`${element.id}-text2`}
        placeholder="Enter text for Text2"
        value={mixValue.text2}
        onChange={(e) => handleTextChange("text2", e.target.value)}
        className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
      />
    </div>
  );
}

export default ScrollMix;
