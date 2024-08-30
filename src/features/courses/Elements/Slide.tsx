import { updateElement } from "@/redux/courseSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";
import CustomTextarea from "@/components/CustomTextarea";

function Slide({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  // Initialize slideItems with element.value or an empty array
  const [slidesDetails, setSlidesDetails] = useState<string[]>(() => {
    return (element.value as string[]) || [];
  });

  const [currentSlideDetails, setCurrentSlideDetails] = useState<string>("");

  // populate slidesDetails with element.value, if element.value exists and if slidesDetails is empty.
  useEffect(() => {
    if (element.value && slidesDetails.length === 0) {
      setSlidesDetails(element.value as string[]);
    }
  }, [element.value, slidesDetails.length]);

  // Slide related functions
  const handleAddSlide = () => {
    if (currentSlideDetails) {
      setSlidesDetails([...slidesDetails, currentSlideDetails]);
      setCurrentSlideDetails("");
    }
  };

  const handleSlideDetailChange = (index: number, text: string) => {
    setSlidesDetails(
      slidesDetails.map((details, i) => (i === index ? text : details))
    );
  };

  const handleSaveSlides = () => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: element.id,
        value: slidesDetails,
      })
    );
    setCurrentElement("");
  };

  const handleDeleteSlideItem = (indexToDelete: number) => {
    const updatedSlides = slidesDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setSlidesDetails(updatedSlides);
  };

  return (
    <div id={element.id}>
      <div className="flex flex-col items-center w-[100%] gap-1 py-4">
        <CustomTextarea
          value={currentSlideDetails}
          onChange={(e) => setCurrentSlideDetails(e.target.value)}
          placeholder="Enter slide details...."
          className="font-Lato-Regular border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
          maxLength={150}
        />
        <div
          className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto"
          onClick={handleAddSlide}
        >
          <button className="flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all">
            <PlusCircle
              className="text-primary-6 transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={handleSaveSlides}
            className=" flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <File
              className="text-primary-6  transition-all"
              size={16}
              weight="fill"
            />
            Save
          </button>
        </div>
      </div>
      <ul className="w-[100%] pb-4 cursor-pointer overflow-y-auto">
        {slidesDetails.map((details, index) => (
          <label key={index}>
            <h2 className="text-secondary-6 py-3">Slide {index + 1}:</h2>
            <div className="flex justify-between">
              <CustomTextarea
                value={details}
                onChange={(e) => handleSlideDetailChange(index, e.target.value)}
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                maxLength={150}
              />
              <Trash
                onClick={() => handleDeleteSlideItem(index)}
                className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                weight="fill"
                size={18}
              />
            </div>
          </label>
        ))}
      </ul>
    </div>
  );
}

export default Slide;
