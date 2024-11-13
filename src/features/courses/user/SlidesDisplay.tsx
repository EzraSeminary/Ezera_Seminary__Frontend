import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import "@splidejs/react-splide/css";
import { useGetCourseByIdQuery } from "../../../services/api";
import "@/index.css";
import AccordionItemDisplay from "../Elements/AccordionItemDisplay";
import LoadingPage from "@/pages/user/LoadingPage";
import { ToastContainer } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useProgress } from "./utils/progressUtils";
import DndComponent from "./elements/DndComponent";
import VideoSection from "./elements/VideoSection";
import { sliderMarks } from "@/utils/SliderMarks";
import SliderSection from "./elements/SliderSection";
import ImageSection from "./elements/ImageSection";
import RevealSection from "./elements/RevealSection";
import SlideSection from "./elements/SlideSection";
import MixSection from "./elements/MixSection";
import SequenceSection from "./elements/SequenceSection";
import QuizSection from "./elements/QuizSection";
import HeaderSection from "./Header";
import FooterNavigation from "./FooterNavigation";
import CourseDetails from "./CourseDetails";
import AudioSection from "./elements/AudioSection";
function SlidesDisplay() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  
  // Slider stat
  const [sliderValue, setSliderValue] = useState(2.5);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const {
    updateProgress,
    findUserProgress,
    isSlideComplete,
    setIsSlideComplete,
    isQuizAnswered,
    setIsQuizAnswered,
    isAccordionExpanded,
    setIsAccordionExpanded,
    isRevealFlipped,
    setIsRevealFlipped,
    isSequenceCompleted,
    setIsSequenceCompleted,
    isRangeChanged,
    setIsRangeChanged,
    isDndCompleted,
    setIsDndCompleted,
    isAudioPlayed,
    setIsAudioPlayed,
  } = useProgress();

  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();

  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId as string);

  const chapter = courseData?.chapters.find((chap) => chap._id === chapterId);
  const chapterIndex = courseData?.chapters.findIndex(
    (chap) => chap._id === chapterId
  );
  const courseID = courseData && courseData._id ? courseData._id : "";
  const userProgress = findUserProgress(courseID);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0); // New state variable to track the unlocked index

  useEffect(() => {
    if (userProgress) {
      if (
        chapterIndex === userProgress.currentChapter &&
        userProgress.currentSlide !== undefined
      ) {
        setActiveIndex(userProgress.currentSlide);
        if (userProgress.currentSlide > unlockedIndex) {
          setUnlockedIndex(userProgress.currentSlide);
        }
      } else {
        setActiveIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterIndex]);

  const handleArrowClick = () => {
    setOpen((prev) => !prev);
  };

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, open, () => setOpen(false));
  const [isDndAnswerCorrect, setIsDndAnswerCorrect] = useState<boolean | null>(
    null
  );
  const [droppedChoice, setDroppedChoice] = useState<string | null>(null);

  if (!chapter) {
    return <LoadingPage />;
  }
  const data = chapter.slides;
  const selectedSlide = data[activeIndex];

  //function to select chapter buttons
  const updateIndex = (newIndex: number) => {
    // First adjust the new index if it's out of bounds
    const adjustedIndex = Math.max(0, Math.min(newIndex, data.length - 1));
    // Use a functional update to ensure we're using the latest state
    setUnlockedIndex((prevUnlockedIndex) => {
      // Only update if the new index is greater than the previous unlocked index
      if (adjustedIndex > prevUnlockedIndex) {
        return adjustedIndex;
      } else {
        return prevUnlockedIndex;
      }
    });
    setActiveIndex(adjustedIndex);
    if (chapterIndex !== undefined) {
      updateProgress(courseID, chapterIndex, adjustedIndex);
    }
  };
  // slide number
  const currentSlideNumber = activeIndex + 1;
  const totalDataNumber = data.length;
  const isLastSlide = activeIndex === totalDataNumber - 1;

  const isSlideUnlocked = (index: number) => {
    return index <= unlockedIndex; // Check if the slide is unlocked based on the unlocked index
  };

  // Switch from the image to the video
  const handleImageClick = () => {
    setIsVideoVisible(true);
  };

  // Update the state indicating whether the accordion is expanded for Next button.
  const handleAccordionToggle = (values: string) => {
    if (values.includes("item-1")) {
      setIsAccordionExpanded(true);
    }
  };

  const resetInteractions = () => {
    setIsSlideComplete(false);
    setIsQuizAnswered(false);
    setIsAccordionExpanded(false);
    setIsRevealFlipped(false);
    setIsSequenceCompleted(false);
    setIsRangeChanged(false);
    setIsDndCompleted(false);
    setIsAudioPlayed(false);
    setIsVideoVisible(false);
    setSelectedChoice(null);
  };

  // Next button onClick
  const moveToNextSlide = () => {
    updateIndex(activeIndex + 1); // Navigate to the next slide
    resetInteractions(); // Reset Next button conditional states
  };

  // Element types whose Next button is always available
  const isNonInteractiveType = () => {
    if (!selectedSlide || !selectedSlide.elements) return false;
    return selectedSlide.elements.every((element) => {
      return ["title", "sub", "text", "img", "list", "mix"].includes(
        element.type
      );
    });
  };

  // Conditional Rendering of Next Button
  const shouldShowNextButton =
    !isLastSlide &&
    (isNonInteractiveType() ||
      isSlideComplete ||
      isQuizAnswered ||
      isAccordionExpanded ||
      isRevealFlipped ||
      isSequenceCompleted ||
      isRangeChanged ||
      isDndCompleted ||
      isAudioPlayed ||
      isVideoVisible);

  if (isLoading) return <LoadingPage />;

  if (error) return <div>Something went wrong.</div>;

  return (
    <>
      <ToastContainer />
      <div className="flex md:flex-row font-nokia-bold justify-center items-center w-full absolute top-0 bottom-0 z-50 h-full overflow-y-hidden">
      <CourseDetails
        open={open}
        handleArrowClick={handleArrowClick}
        courseData={courseData}
        data={data}
        activeIndex={activeIndex}
        totalDataNumber={totalDataNumber}
        currentSlideNumber={currentSlideNumber}
        isSlideUnlocked={isSlideUnlocked}
        updateIndex={updateIndex}
        courseId={courseId as string}
        chapterIndex={chapterIndex}
        updateProgress={updateProgress}
    />
        {/* slides display window*/}
        <div className="lg:w-[73%]  w-full h-full chapter-img-1 bg-no-repeat bg-cover bg-center  relative">
          {/* Chapter display container */}
          <div className="flex flex-col justify-between h-full">
            {/* Header */}
            {
               <HeaderSection
                currentSlideNumber={currentSlideNumber}
                totalDataNumber={totalDataNumber}
                handleArrowClick={handleArrowClick}
                courseId={courseId as string}
                chapterIndex={chapterIndex}
                updateProgress={updateProgress}
             />
            }
            {/* Slide content */}
            {data.map((slides, index) => {
              if (index === activeIndex) {
                return (
                  <div
                    key={index}
                    className=" flex flex-col justify-center items-center w-full px-2 md:w-[90%] mx-auto h-full overflow-y-hidden py-5"
                  >
                    <div
                      className={`flex flex-col  items-center w-full h-full overflow-y-auto  rounded-lg bg-black bg-opacity-20 scrollbar-thin px-2 space-y-1 ${
                        slides.elements.some(
                          (element) => element.type === "text"
                        )
                          ? " overflow-y-auto h-auto pb-3 justify-start  lg:justify-center"
                          : "py-0 justify-center"
                      }`}
                    >
                      <h1 className="text-lg lg:text-3xl xl:text-3xl text-accent-6 text-center pt-4 font-nokia-bold">
                        {slides.slide}
                      </h1>
                      {slides.elements.map((element) => {
                        if (element.type === "title") {
                          return (
                            <h1
                              key={element._id}
                              className="text-accent-5 text-sm lg:text-2xl xl:text-3xl font-nokia-bold pt-2"
                            >
                              {element.value}
                            </h1>
                          );
                        } else if (element.type === "sub") {
                          return (
                            <p
                              key={element._id}
                              className="text-primary-5 font-nokia-bold  self-center tracking-wide text-center text-xl w-[90%] mx-auto xl:text-xl"
                            >
                              {element.value}
                            </p>
                          );
                        } else if (element.type === "text") {
                          return (
                            <div className="my-3 rich-text-container rich-course">
                            <ReactQuill
                              key={element.type}
                              value={element.value || ''}
                              readOnly={true}
                              theme="snow"
                            />
                          </div>
                          );
                        } else if (element.type === "img") {
                          return (
                            <ImageSection
                              imageUrl={typeof element.value === 'string' ? element.value : URL.createObjectURL(element.value)}
                              placeholder="Loading image..."
                          />
                          )
                        } else if (element.type === "list") {
                          const listItemsComponent = element.value.map(
                            (listItem: string, index: number) => (
                              <li
                                key={index}
                                className=" text-primary-5 pt-2 font-nokia-bold w-[100%] tracking-wide text-lg xl:text-xl"
                              >
                                {listItem}
                              </li>
                            )
                          );

                          return (
                            <div key={element._id} className="w-[70%] mx-auto">
                              <ul className="flex w-full flex-col justify-center items-center list-disc my-2 custom-list-color ">
                                {listItemsComponent}
                              </ul>
                            </div>
                          );
                        } else if (element.type === "slide") {
                          return(
                            <SlideSection
                              slideItems={element.value}
                              setIsSlideComplete={setIsSlideComplete}
                            />
                          )
                        } else if (element.type === "quiz") {
                          return(
                            <QuizSection
                              question={element.value.question}
                              choices={element.value.choices}
                              correctAnswer={element.value.correctAnswer}
                              selectedChoice={selectedChoice}
                              setSelectedChoice={setSelectedChoice}
                          />)
                        } else if (element.type === "accordion") {
                          const accordionItemsComponent = element.value.map(
                            (accordionItem, index: number) => (
                              <AccordionItemDisplay
                                key={`$accordion-${index}`}
                                title={accordionItem.title}
                                content={accordionItem.content}
                                onToggle={handleAccordionToggle}
                              />
                            )
                          );
                          return (
                            <div className="flex flex-col justify-center items-center w-full">
                              {accordionItemsComponent}
                            </div>
                          );
                        } else if (element.type === "sequence") {
                          return (
                            <SequenceSection
                              sequenceItems={element.value}
                              setIsSequenceCompleted={setIsSequenceCompleted}
                              isSequenceCompleted={isSequenceCompleted}
                              />
                          );
                        } else if (element.type === "reveal") {
                          return (
                            <RevealSection
                              revealItems={element.value}
                              setIsRevealFlipped={setIsRevealFlipped}
                            />
                          );
                        } else if (element.type === "range") {
                          return (
                            <SliderSection
                              sliderMarks={sliderMarks}
                              sliderValue={sliderValue}
                              setSliderValue={setSliderValue}
                              setIsRangeChanged={setIsRangeChanged}
                          />
                          );
                        } else if (element.type === "dnd") {
                          return(
                            <DndComponent
                              element={element}
                              droppedChoice={droppedChoice}
                              setDroppedChoice={setDroppedChoice}
                              isDndAnswerCorrect={isDndAnswerCorrect}
                              setIsDndAnswerCorrect={setIsDndAnswerCorrect}
                              setIsDndCompleted={setIsDndCompleted}
                            />
                          )
                        } else if (element.type === "mix") {
                          return (
                            <MixSection
                              text1={element.value.text1}
                              text2={element.value.text2}
                              file={element.value.file}
                          />
                          );
                        } else if (element.type === "audio") {
                          return (
                            <AudioSection
                              key={element.id}
                              src={`${element.value}`}
                              onPlay={() => setIsAudioPlayed(true)}
                            />
                          );
                        } else if (element.type === "video") {
                          return (
                            <VideoSection
                              videoUrl={element.value}
                              isVideoVisible={isVideoVisible}
                              handleImageClick={handleImageClick}
                        />)
                        }
                      })}
                    </div>
                  </div>
                );
              } else {
                return null; // Hide the slide if it doesn't match the activeIndex
              }
            })}
            <FooterNavigation
              activeIndex={activeIndex}
              totalDataNumber={totalDataNumber}
              currentSlideNumber={currentSlideNumber}
              isLastSlide={isLastSlide}
              shouldShowNextButton={shouldShowNextButton}
              updateIndex={updateIndex}
              moveToNextSlide={moveToNextSlide}
              courseId={courseId as string}
              chapterIndex={chapterIndex}
              updateProgress={updateProgress}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SlidesDisplay;
