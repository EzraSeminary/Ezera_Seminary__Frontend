import { ElementTypeProps } from "./List";
import { updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";

function ScrollMix({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const handleInputChange = (id: string, value: string) => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: id,
        value: value,
      })
    );
  };

  // Image preview state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Get the first file from the input
      if (file) {
        dispatch(
          updateElement({
            chapterIndex,
            slideIndex,
            elementId: id,
            value: file,
          })
        );
        // Create a URL for the file
        const fileUrl = URL.createObjectURL(file);
        setImagePreviewUrl(fileUrl); // Set imagePreviewUrl state
      }
    }
  };

  return (
    <div>
      <textarea
        id={element.id}
        placeholder={`Enter ${element.type}`}
        value={element.value?.toString()}
        onChange={(e) => handleInputChange(element.id, e.target.value)}
        className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
      />
      <div className="flex flex-col my-3 border-2 border-secondary-3 rounded-md hover:border-accent-5">
        <input
          type="file"
          id={element.id}
          onChange={(e) => handleFileInputChange(e, element.id)}
          className="w-[100%] file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0 text-sm
        file:text-lg  text-secondary-6 font-bold p-2 file:bg-accent-6
        file:text-primary-6 file:font-nokia-bold  hover:file:bg-accent-7
        rounded-xs bg-transparent hover:text-secondary-5
        focus:outline-none focus:border-accent-8 cursor-pointer"
        />
        {imagePreviewUrl && (
          <img
            key={element.type}
            src={imagePreviewUrl}
            alt=""
            className="rounded-b-md"
          />
        )}
      </div>
      <textarea
        id={element.id}
        placeholder={`Enter ${element.type}`}
        value={element.value?.toString()}
        onChange={(e) => handleInputChange(element.id, e.target.value)}
        className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
      />
    </div>
  );
}

export default ScrollMix;
