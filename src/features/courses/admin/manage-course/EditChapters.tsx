import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChapters,
  selectAllSlides,
  addChapter,
  updateChapter,
  addSlide,
  updateSlide,
  deleteChapter,
  deleteSlide,
  Chapter,
  addElementToSlide,
  selectCourse,
} from "@/redux/courseSlice";
import { BookOpenText, PlusCircle, Trash } from "@phosphor-icons/react";
import EditElements from "./EditElements";
import AdminCourseDisplay from "./AdminCourseDisplay";
import { EditingSlideIndex } from "../create-course/ChaptersAdd";
import CustomInput from "@/components/CustomInput";
import ElementPopup from "../../Elements/ElementPopup";

function EditChapters() {
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);
  const chapters = useSelector(selectChapters) as Chapter[];
  const allSlides = useSelector(selectAllSlides);

  const [editingSlideIndex, setEditingSlideIndex] =
    useState<EditingSlideIndex | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<
    number | null
  >(null);
  const [currentElement, setCurrentElement] = useState<
    string | null | string[] | boolean
  >("");
  // show element popup
  const [showElementPopup, setShowElementPopup] = useState(false);

  const addChapterHandler = () => {
    dispatch(addChapter());
  };

  const updateChapterHandler = (index: number, value: string) => {
    dispatch(updateChapter({ chapterIndex: index, value }));
  };

  const deleteChapterHandler = (chapterIndex: number) => {
    dispatch(deleteChapter({ chapterIndex }));
  };

  const deleteSlideHandler = (chapterIndex: number, slideIndex: number) => {
    dispatch(deleteSlide({ chapterIndex, slideIndex }));
  };

  const addSlideHandler = (chapterIndex: number) => {
    dispatch(addSlide({ chapterIndex }));
    setEditingSlideIndex({
      chapter: chapterIndex,
      slide: chapters[chapterIndex].slides.length,
    });
  };

  const updateSlideHandler = (
    chapterIndex: number,
    slideIndex: number,
    value: string
  ) => {
    dispatch(updateSlide({ chapterIndex, slideIndex, value }));
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

  const handleShowElementPopup = () => {
    setShowElementPopup(true);
  };
  const closeElementPopup = () => {
    setShowElementPopup(false);
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
      currentElement === "text" ||
      currentElement === "video"
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
    } else if (
      (currentElement && currentElement === "img") ||
      currentElement === "audio"
    ) {
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
          className="flex gap-2 justify-center items-center text-white bg-accent-6 hover:bg-accent-8 transition-all rounded-3xl mb-4 p-2"
          onClick={addChapterHandler}
        >
          <PlusCircle
            className="text-white hover:cursor-pointer transition-all"
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
                className={`flex bg-secondary-2 items-center justify-between gap-2 px-4 py-2 mb-2 border border-accent-5 rounded-lg ${
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
                    className={`w-full text-lg font-bold border-accent-6 focus:outline-none bg-transparent placeholder:text-secondary-4  ${
                      isSelected ? "text-secondary-6" : "text-primary-2"
                    }`}
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
                          {slideIndex + 1}
                        </p>
                        <CustomInput
                          type="text"
                          name={`slide-${chapterIndex}-${slideIndex}`}
                          placeholder="Slide Title"
                          autoComplete="off"
                          className={`w-full text-sm font-bold py-1 focus:outline-none mb-1 bg-secondary-1 border border-accent-5 rounded-lg  px-2 mt-2 text-secondary-6 placeholder:text-xs placeholder:text-secondary-4 ${
                            isSelected ? "text-accent-6" : "text-primary-2"
                          }`}
                          value={slide.slide}
                          onChange={(e) =>
                            updateSlideHandler(
                              chapterIndex,
                              slideIndex,
                              e.target.value
                            )
                          }
                          onClick={() =>
                            setEditingSlideIndex({
                              chapter: chapterIndex,
                              slide: slideIndex,
                            })
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
        {/* Pass selectedSlideIndex to AdminCourseDisplay */}
        {editingSlideIndex !== null && (
          <AdminCourseDisplay
            selectedSlideIndex={editingSlideIndex}
            onNextSlide={goToNextSlide}
          />
        )}
      </div>
      <div className="w-[25%]">
        {editingSlideIndex && (
          <EditElements
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

export default EditChapters;
