import { useEffect, useState } from "react";
import ElementsAdd from "./ElementsAdd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCourse,
  selectChapters,
  selectAllSlides,
  addChapter,
  updateChapter,
  addSlide,
  updateSlide,
  deleteChapter,
  deleteSlide,
  addElementToSlide,
} from "../../../../redux/courseSlice";
import { BookOpenText, PlusCircle, Trash } from "@phosphor-icons/react";
import SlideDataDisplay from "./SlideDataDisplay";
import ElementPopup from "../../Elements/ElementPopup";
import CustomInput from "@/components/CustomInput";

export interface EditingSlideIndex {
  chapter: number;
  slide: number;
}

function ChaptersAdd() {
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);
  const chapters = useSelector(selectChapters) || [];
  const allSlides = useSelector(selectAllSlides);

  const [editingSlideIndex, setEditingSlideIndex] =
    useState<EditingSlideIndex | null>(null);

  const [selectedChapterIndex, setSelectedChapterIndex] = useState<
    number | null
  >(null);

  // show element popup
  const [showElementPopup, setShowElementPopup] = useState(false);
  const [currentElement, setCurrentElement] = useState<
    string | null | string[] | boolean
  >("");

  const addChapterHandler = () => {
    dispatch(addChapter());
  };

  const updateChapterHandler = (index: number, value: string) => {
    dispatch(updateChapter({ chapterIndex: index, value }));
  };

  const deleteChapterHandler = (chapterIndex: number) => {
    dispatch(deleteChapter({ chapterIndex }));
    // Check if the current editingSlideIndex is within the chapter being deleted
    if (editingSlideIndex && editingSlideIndex.chapter === chapterIndex) {
      // Reset the editingSlideIndex since the current chapter is being deleted
      setEditingSlideIndex(null);
    } else if (editingSlideIndex && editingSlideIndex.chapter > chapterIndex) {
      // Adjust the chapterIndex for the slide currently being edited.
      setEditingSlideIndex((prevIndex) => {
        // Ensure prevIndex is not null before trying to access its properties.
        if (prevIndex) {
          return { chapter: prevIndex.chapter - 1, slide: prevIndex.slide };
        }
        return null;
      });
    }
  };

  const deleteSlideHandler = (chapterIndex: number, slideIndex: number) => {
    dispatch(deleteSlide({ chapterIndex, slideIndex }));
    // Check if the slide being edited is the one being deleted
    if (
      editingSlideIndex &&
      editingSlideIndex.chapter === chapterIndex &&
      editingSlideIndex.slide === slideIndex
    ) {
      // Reset the editingSlideIndex since the current slide is being deleted
      setEditingSlideIndex(null);
    }
  };

  const handleShowElementPopup = () => {
    setShowElementPopup(true);
  };
  const closeElementPopup = () => {
    setShowElementPopup(false);
  };

  const updateSlideHandler = (
    chapterIndex: number,
    slideIndex: number,
    value: string
  ) => {
    dispatch(updateSlide({ chapterIndex, slideIndex, value }));
  };

  // when click on slide title CustomInput
  const handleSlideClick = (chapterIndex: number, slideIndex: number) => {
    setEditingSlideIndex({
      chapter: chapterIndex,
      slide: slideIndex,
    });
  };

  const handleChapterClick = (chapterIndex: number) => {
    if (selectedChapterIndex === chapterIndex) {
      setSelectedChapterIndex(null); // Hide slides if clicked again
    } else {
      setSelectedChapterIndex(chapterIndex); // Show slides for the selected chapter
    }
  };

  //Next button
  const goToNextSlide = () => {
    setEditingSlideIndex((prevSlideIndex) => {
      if (prevSlideIndex) {
        return { ...prevSlideIndex, slide: prevSlideIndex.slide + 1 };
      }
      return prevSlideIndex;
    });
  };

  // add a slide to redux
  const addSlideHandler = (chapterIndex: number) => {
    dispatch(addSlide({ chapterIndex }));
    setEditingSlideIndex({
      chapter: chapterIndex,
      slide: chapters[chapterIndex].slides.length,
    });
  };

  // Set the element type & add the element
  const handleSelectElement = (elementType: string) => {
    setCurrentElement(elementType); // set the element type
  };

  // add element to redux
  const handleAddElementToRedux = (
    chapterIndex: number,
    slideIndex: number
  ) => {
    if (
      (currentElement && currentElement === "title") ||
      currentElement === "sub" ||
      currentElement === "text"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: "",
        })
      );
      setCurrentElement("");
    } else if (currentElement && currentElement === "img") {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: null,
        })
      );
      setCurrentElement(null);
    } else if (
      (currentElement && currentElement === "list") ||
      currentElement === "slide" ||
      currentElement === "quiz" ||
      currentElement === "accordion" ||
      currentElement === "sequence" ||
      currentElement === "reveal" ||
      currentElement === "dnd" ||
      currentElement === "mix"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: [],
        })
      );
      setCurrentElement([]);
    } else if (currentElement && currentElement === "range") {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: false,
        })
      );
      setCurrentElement(false);
    }
  };

  // Display elements when click a slide
  useEffect(() => {
    if (currentElement && editingSlideIndex) {
      handleAddElementToRedux(
        editingSlideIndex.chapter,
        editingSlideIndex.slide
      );
    }
    // This effect should only run when `currentElement` or `editingSlideIndex` changes
  }, [currentElement, editingSlideIndex]);

  console.log("course", course);

  return (
    <div className="flex justify-around h-screen w-full relative bg-[#F1F1F1] text-secondary-6 font-nokia-bold">
      <div className="bg-secondary-5 w-[25%] h-screen overflow-auto scrollbar-thin p-6">
        <button
          className="flex gap-2 justify-center items-center text-primary-6 bg-accent-6 hover:bg-accent-8 transition-all rounded-3xl mb-4 p-2"
          onClick={addChapterHandler}
        >
          <PlusCircle
            className="text-primary-6 hover:cursor-pointer transition-all"
            size={24}
            weight="fill"
          />
          Add Chapter
        </button>
        {chapters.map((chapter, chapterIndex) => {
          const slides = allSlides[chapterIndex] || [];
          const isSelected = selectedChapterIndex === chapterIndex;

          return (
            <div key={chapterIndex}>
              <div
                className={`flex bg-secondary-2 items-center justify-between gap-2 px-4 py-2 rounded-md mb-2 border mt-2 ${
                  isSelected ? "bg-opacity-100" : "bg-opacity-0 border-accent-5"
                }`}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleChapterClick(chapterIndex)}
                >
                  <BookOpenText
                    weight="fill"
                    className="text-accent-6 rounded-full w-8 h-8"
                  />
                  <CustomInput
                    type="text"
                    name={`chapter-${chapterIndex}`}
                    placeholder="Chapter Title"
                    autoComplete="off"
                    className="w-full text-lg font-bold focus:outline-none bg-transparent placeholder:text-secodary-3 text-secondary-6"
                    value={chapter.chapter}
                    onChange={(e) =>
                      updateChapterHandler(chapterIndex, e.target.value)
                    }
                    maxLength={35}
                  />
                </div>
                <Trash
                  onClick={() => deleteChapterHandler(chapterIndex)}
                  weight="fill"
                  className="text-accent-6 cursor-pointer"
                  size={22}
                />
              </div>
              {isSelected && (
                <div className="ml-7 pl-1 border-l-2 border-secondary-2">
                  {slides.map((slide, slideIndex) => (
                    <div key={slideIndex} className="flex flex-col">
                      <div className="flex px-2 items-center gap-2">
                        <p className="flex items-center font-nokia-bold text-primary-6  lg:text-xl">
                          {slideIndex + 1}.
                        </p>
                        <CustomInput
                          type="text"
                          name={`slide-${chapterIndex}-${slideIndex}`}
                          placeholder="Slide Title"
                          autoComplete="off"
                          className="w-full text-sm font-bold py-1 focus:outline-none mb-1 bg-secondary-1 border border-accent-5 rounded-lg  px-2 mt-2 text-secondary-6 placeholder:text-xs placeholder:text-secondary-4"
                          value={slide.slide}
                          onChange={(e) =>
                            updateSlideHandler(
                              chapterIndex,
                              slideIndex,
                              e.target.value
                            )
                          }
                          onClick={() =>
                            handleSlideClick(chapterIndex, slideIndex)
                          }
                          maxLength={75}
                        />
                        <Trash
                          onClick={() =>
                            deleteSlideHandler(chapterIndex, slideIndex)
                          }
                          weight="fill"
                          className="text-accent-6 cursor-pointer"
                          size={24}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      addSlideHandler(chapterIndex); // add slide to redux
                      handleShowElementPopup(); // show the slide popup
                    }}
                  >
                    <p className=" flex items-center text-accent-6 px-4 gap-2 mt-4">
                      <PlusCircle
                        className="text-accent-6"
                        size={22}
                        weight="fill"
                      />{" "}
                      New Slide
                    </p>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-[50%]">
        {/* Pass selectedSlideIndex to SlideDataDisplay */}
        {editingSlideIndex !== null && (
          <SlideDataDisplay
            selectedSlideIndex={editingSlideIndex}
            onNextSlide={goToNextSlide}
          />
        )}
      </div>

      <div className="w-[25%]">
        {editingSlideIndex && (
          <ElementsAdd
            key={`${editingSlideIndex.chapter}-${editingSlideIndex.slide}`}
            chapterIndex={editingSlideIndex.chapter}
            slideIndex={editingSlideIndex.slide}
            setCurrentElement={setCurrentElement}
          />
        )}
      </div>

      {/* display elements popup over this whole file */}
      {showElementPopup && (
        <ElementPopup
          closeElementPopup={closeElementPopup}
          onSelectElement={handleSelectElement}
        />
      )}
    </div>
  );
}

export default ChaptersAdd;
