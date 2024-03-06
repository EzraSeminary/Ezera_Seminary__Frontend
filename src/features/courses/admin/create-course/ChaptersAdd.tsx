import { useState } from "react";
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
} from "../../../../redux/courseSlice";
import { BookOpenText, PlusCircle, Trash } from "@phosphor-icons/react";
import SlideDataDisplay from "./SlideDataDisplay";

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

  console.log(course);

  return (
    <div className="flex justify-between h-screen w-full bg-[#F1F1F1] text-secondary-6 font-nokia-bold">
      <div className="bg-primary-1 w-[30%] h-screen overflow-auto scrollbar-thin p-6">
        <button
          className="flex justify-center items-center text-white bg-accent-6 hover:bg-accent-6 rounded-3xl mb-4 p-2"
          onClick={addChapterHandler}
        >
          <span className="material-symbols-outlined">add</span>
          Add Chapter
        </button>
        {chapters.map((chapter, chapterIndex) => {
          const slides = allSlides[chapterIndex] || [];
          const isSelected = selectedChapterIndex === chapterIndex;

          return (
            <div key={chapterIndex}>
              <div
                className={`flex bg-secondary-1 items-center justify-between gap-2 px-4 py-2 rounded-md mb-2 border mt-2 ${
                  isSelected ? "bg-opacity-100" : "bg-opacity-0"
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
                  <input
                    type="text"
                    name={`chapter-${chapterIndex}`}
                    placeholder="Chapter Title"
                    autoComplete="off"
                    className="w-full text-lg font-bold focus:outline-none bg-transparent"
                    value={chapter.chapter}
                    onChange={(e) =>
                      updateChapterHandler(chapterIndex, e.target.value)
                    }
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
                    <div key={slideIndex} className="flex flex-col ">
                      <div className="flex px-2 items-center">
                        <p className="flex items-center font-nokia-bold text-secondary-6 text-xs lg:text-sm pr-1">
                          {slideIndex + 1}
                        </p>
                        <input
                          type="text"
                          name={`slide-${chapterIndex}-${slideIndex}`}
                          placeholder="Slide Title"
                          autoComplete="off"
                          className="w-full text-sm font-bold py-1 focus:outline-none mb-1 border-b border-t px-2 mt-2"
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
                        />
                        <Trash
                          onClick={() =>
                            deleteSlideHandler(chapterIndex, slideIndex)
                          }
                          weight="fill"
                          className="text-accent-6 cursor-pointer"
                          size={22}
                        />
                      </div>
                      {editingSlideIndex &&
                        editingSlideIndex.chapter === chapterIndex &&
                        editingSlideIndex.slide === slideIndex && (
                          <ElementsAdd
                            chapterIndex={chapterIndex}
                            slideIndex={slideIndex}
                          />
                        )}
                    </div>
                  ))}
                  <button
                    className=""
                    onClick={() => addSlideHandler(chapterIndex)}
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
      <div className="w-[65%]">
        {/* Pass selectedSlideIndex to SlideDataDisplay */}
        {editingSlideIndex !== null && (
          <SlideDataDisplay
            selectedSlideIndex={editingSlideIndex}
            onNextSlide={goToNextSlide}
          />
        )}
      </div>
    </div>
  );
}

export default ChaptersAdd;
