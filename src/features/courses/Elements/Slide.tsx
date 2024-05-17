import { updateElement } from "@/redux/courseSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";

function Slide({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const [slidesDetails, setSlidesDetails] = useState<string[]>([]);
  const [currentSlideDetails, setCurrentSlideDetails] = useState<string>("");

  // Slide related functions
  const handleAddSlide = () => {
    if (currentSlideDetails) {
      setSlidesDetails([...slidesDetails, currentSlideDetails]);
      setCurrentSlideDetails("");
    }
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
    // setSlidesDetails([]); // Clear slides details after adding
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
        <textarea
          value={currentSlideDetails}
          onChange={(e) => setCurrentSlideDetails(e.target.value)}
          placeholder="Enter slide details...."
          className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
        />
        <div
          className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto"
          onClick={handleAddSlide}
        >
          <button className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all">
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
      <ul className="w-[100%]  pb-4 cursor-pointer overflow-y-auto">
        {slidesDetails.map((details, index) => (
          <label>
            <h2 className="text-secondary-6 py-3">Slide {index + 1}:</h2>
            <li
              key={index}
              className="flex justify-between break-words border border-secondary-3 rounded px-2 py-1 bg-primary-1 text-secondary-6"
            >
              {details}{" "}
              <span>
                <Trash
                  onClick={() => handleDeleteSlideItem(index)}
                  className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                  weight="fill"
                  size={18}
                />
              </span>
            </li>
          </label>
        ))}
      </ul>
    </div>
  );
}

export default Slide;
