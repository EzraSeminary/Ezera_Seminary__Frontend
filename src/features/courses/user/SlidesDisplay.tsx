import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useGetCourseByIdQuery } from "../../../services/api";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ArrowRight,
  CaretCircleLeft,
  CheckFat,
  Lock,
  CornersOut,
} from "@phosphor-icons/react";
import logo from "../../../assets/ezra-logo.svg";
import AccordionItemDisplay from "../admin/create-course/Elements/AccordionItemDisplay";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import { CustomElement, AccordionElement } from "@/redux/courseSlice";
import LoadingPage from "@/pages/user/LoadingPage";
import { toast, ToastContainer } from "react-toastify";

function SlidesDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  //show quiz result
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [progressLoading, setProgressLoading] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();

  //get single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId as string);

  // Extracting chapter data from the fetched course data
  const chapter = courseData?.chapters.find((chap) => chap._id === chapterId);
  const chapterIndex = courseData?.chapters.findIndex(
    (chap) => chap._id === chapterId
  );

  //get the current user from the Root State
  const currentUser = useSelector((state: RootState) => state.auth.user);

  //find matching courseId from the user progress array
  const userProgress = currentUser?.progress?.find(
    (p) => p.courseId === courseId
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0); // New state variable to track the unlocked index

  //Resume chapter
  // When component did mount or userProgress has changed, update the activeIndex
  useEffect(() => {
    console.log("Current chapter index:", chapterIndex);
    console.log("User progress:", userProgress);
    if (userProgress) {
      if (
        chapterIndex === userProgress.currentChapter &&
        userProgress.currentSlide !== undefined
      ) {
        // The current selected chapter is the same as the chapterIndex from progress
        setActiveIndex(userProgress.currentSlide);
        if (userProgress.currentSlide > unlockedIndex) {
          setUnlockedIndex(userProgress.currentSlide);
        }
      } else {
        //set the activeIndex to the beginning of the current chapter
        setActiveIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterIndex]);

  {
    /* Function to open the chapters sidebar modal */
  }
  const handleArrowClick = () => {
    setOpen((prev) => !prev);
  };

  {
    /* Ref to listen the curser and close the chapters sidebar modal */
  }
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, open, () => setOpen(false));

  //Quiz Related functions
  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // If the chapter is not found, handle accordingly
  if (!chapter) {
    return <p>Chapter not found</p>;
  }
  // Setting the data to slides if the chapter is found
  const data = chapter.slides;

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
    setShowQuizResult(false); // Reset the showQuizResult state
    updateProgress();
  };

  interface AccordionItem {
    title: string;
    content: string;
  }

  // slide number
  const currentSlideNumber = activeIndex + 1;
  const totalDataNumber = data.length;
  const isLastSlide = activeIndex === totalDataNumber - 1;

  const isSlideUnlocked = (index: number) => {
    return index <= unlockedIndex; // Check if the slide is unlocked based on the unlocked index
  };

  //Quiz Related functions
  const handleRadioChange = (
    choiceIndex: number,
    choiceValue: string,
    elementCorrectAnswer: string
  ) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    setIsAnswerCorrect(choiceValue === elementCorrectAnswer);
    setShowQuizResult(false); // Reset showResult when a new answer is selected
  };

  //isCorrect switch
  const renderQuizResult = () => {
    if (!showQuizResult || isAnswerCorrect === null) return null; // Don't show feedback before a choice has been made

    if (isAnswerCorrect) {
      return (
        <CheckFat size={40} weight="fill" className="text-green-700 pl-1" />
      );
    } else {
      return <XCircle size={40} weight="fill" className="text-red-700 pl-1" />;
    }
  };

  // Check if courseData and courseData._id are not undefined
  const courseID = courseData && courseData._id ? courseData._id : "";

  const updateProgress = () => {
    if (chapterIndex !== undefined && chapterIndex !== -1) {
      dispatch(
        setProgress({
          courseId: courseID,
          currentChapter: chapterIndex,
          currentSlide: activeIndex,
        })
      );
    }
  };

  const token = localStorage.getItem("token");
  const userId = currentUser?._id;

  const submitProgress = () => {
    if (currentUser && currentUser.progress) {
      setProgressLoading(true);
      console.log("CurrentUser Token:", token);
      axios
        .put(
          "/users/profile/" + userId,
          {
            userId: currentUser._id,
            progress: currentUser.progress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("Progress updated successfully:", res.data);
          setProgressLoading(false);
          navigate(`/courses/get/${courseId}`);
        })
        .catch((err) => {
          console.error(
            "Error updating progress:",
            err.response ? err.response.data : err.message
          );
          toast.error(
            "Could not update progress: " +
              (err.response ? err.response.data : err.message)
          );
          setProgressLoading(false);
          navigate(`/courses/get/${courseId}`);
        });
    }
  };

  if (progressLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <PuffLoader
          color={"#707070"}
          loading
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <h1 className="text-secondary-6 font-nokia-bold text-3xl">Saving</h1>
      </div>
    );

  //display a full screen functionality when clicking on the image
  const handleOpenFullScreen = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  if (isLoading) return <LoadingPage />;

  if (error) return <div>Something went wrong.</div>;

  console.log(currentUser);

  return (
    <>
      <ToastContainer />
      <div className="flex  mt-16 md:flex-row w-[80%] mx-auto justify-center items-center h-screen relative lg:w-[100%] lg:mt-0  lg:absolute lg:top-0 lg:bottom-0 lg:z-50 lg:h-full">
        {/* Back button */}
        <div className="absolute top-3 -left-28 pl-24 flex justify-start w-full mb-2">
          <button
            className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 hover:bg-[#FAE5C7]"
            onClick={submitProgress}
          >
            <ArrowLeft
              size={22}
              className="text-white bg-accent-6 border p-1 rounded-lg"
            />
            <p className="text-accent-6 text-xs font-nokia-bold">ተመለስ</p>
          </button>
        </div>

        {/* Slides side bar for mobile and tablet*/}
        <div
          ref={ref}
          className={`lg:hidden ${
            open
              ? "absolute left-0 top-[10%]  lg:left-[4%] lg:top-[10%] flex flex-col justify-start items-center w-[80%] md:w-[50%] lg:w-[30%] z-40 h-[80%]"
              : "w-0 h-0"
          }`}
          style={{ transition: "width 0.3s" }}
        >
          {open ? (
            <ArrowLeft
              onClick={handleArrowClick}
              className="text-white text-2xl xl:text-3xl bg-accent-6 border p-1 rounded-full absolute -right-2 md:-right-3 lg:-right-2 xl:-right-3 top-14 cursor-pointer"
            />
          ) : (
            <ArrowRight
              onClick={handleArrowClick}
              className="text-white text-2xl xl:text-3xl  bg-accent-6 border p-1 rounded-full absolute -left-3  top-36 md:top-44 cursor-pointer"
            />
          )}

          {/* Course title and description*/}
          <div className="w-[100%] h-full bg-white opacity-90 pb-3 rounded-b-lg">
            <h1 className="text-secondary-6 font-nokia-bold text-xs lg:text-sm xl:text-lg  text-center mt-2 mb-1 xl:mt-3 xl:mb-2 ">
              {courseData?.title}
            </h1>
            <hr className="border-accent-5 border w-[90%] mx-auto" />
            <p className="text-secondary-5 text-xs1 font-nokia-Regular xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[90%] mx-auto leading-tight lg:text-xs ">
              {courseData?.description}
            </p>

            {/* Header */}
            <div className="flex flex-col mt-2 border-accent-5 border-b  w-[95%] mx-auto">
              <h1 className="font-nokia-bold text-secondary-6 pb-1 text-xs lg:text-sm">
                ትምህርት {currentSlideNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border-b-2 w-[30%] " />
            </div>
            {/* slide list */}
            <div className="flex flex-col h-[65%] px-2 pt-2 gap-2 md:px-3 overflow-y-auto">
              {data.map((slides, index) => {
                const unlocked = isSlideUnlocked(index - 1);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg hover:bg-[#FAE5C7] hover:opacity-80  ${
                      unlocked
                        ? "text-secondary-6"
                        : "text-secondary-3 hover:cursor-not-allowed"
                    }  ${isActive ? "bg-[#FAE5C7]" : "bg-gray-200"}

                    `}
                    onClick={() => {
                      updateIndex(index);
                      handleArrowClick();
                    }}
                    disabled={!unlocked} // Disable the button if the slide is locked
                  >
                    <div className="flex flex-col items-start justify-center">
                      <h2 className="font-nokia-bold text-secondary-6 text-xs lg:text-sm">
                        {slides.slide}
                      </h2>
                      <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-xs">
                        {index + 1}/{totalDataNumber} Slides
                      </p>
                    </div>
                    {unlocked ? (
                      <CheckCircle size={16} weight="fill" color={"#EA9215"} />
                    ) : (
                      <Lock size={16} color={"#EC4000"} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center w-[90%] mx-auto mt-2">
              <button
                className="text-accent-6 font-nokia-bold bg-white hover:bg-primary-5 border border-accent-6 rounded-xl py-1 px-4 transition-all text-xs1 w-auto"
                onClick={submitProgress}
              >
                ዘግተህ ውጣ
              </button>
              <CaretCircleLeft className="text-2xl bg-primary-1 rounded-full text-accent-6 mr-2 hover:bg-primary-5 transition-all" />
            </div>
          </div>
        </div>
        {/* Slides side bar for mdesktop*/}
        <div className="hidden w-[30%] h-full lg:flex flex-col justify-start items-center bg-primary-7 z-40 lg:w-[30%] lg:h-full">
          {/* Short information*/}
          <div className="flex  px-4 py-2 bg-secondary-5  gap-12 justify-between items-center w-full text-xs1  lg:text-xs z-50">
            <h1 className="text-primary-6 font-nokia-bold text-xs lg:text-lg flex-grow  items-center ">
              {courseData?.title}
            </h1>
          </div>

          {/* Course title and description*/}
          <div className="flex flex-col w-full h-full bg-white opacity-90 pb-3 rounded-b-lg">
            <p className="text-secondary-5 text-xs1 font-nokia-bold xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[90%] mx-auto leading-tight lg:text-sm ">
              {courseData?.description}
            </p>

            {/* Header */}
            <div className="flex flex-col mt-2 border-accent-5 border-b  w-[95%] mx-auto">
              <h1 className="font-nokia-bold text-secondary-6 pb-1 text-xs lg:text-lg">
                ትምህርቶች {currentSlideNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border-b-2 w-[30%] " />
            </div>
            {/* slide list */}
            <div className="flex flex-col h-[65%] px-2 pt-2 gap-2 md:px-3 overflow-y-auto">
              {data.map((slides, index) => {
                const unlocked = isSlideUnlocked(index - 1);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg hover:bg-[#FAE5C7] hover:opacity-80  ${
                      unlocked
                        ? "text-secondary-6"
                        : "text-secondary-3 hover:cursor-not-allowed"
                    }  ${isActive ? "bg-[#FAE5C7]" : "bg-gray-200"}

                    `}
                    onClick={() => {
                      updateIndex(index);
                      handleArrowClick();
                    }}
                    disabled={!unlocked} // Disable the button if the slide is locked
                  >
                    <div className="flex flex-col items-start justify-start w-[80%] text-justify">
                      <h2 className="font-nokia-bold text-secondary-6 text-xs lg:text-sm  ">
                        {slides.slide}
                      </h2>
                      <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-xs">
                        {index + 1}/{totalDataNumber} Slides
                      </p>
                    </div>
                    {unlocked ? (
                      <CheckCircle size={16} weight="fill" color={"#EA9215"} />
                    ) : (
                      <Lock size={16} color={"#EC4000"} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center w-[90%] mx-auto mt-4">
              <button
                className="text-accent-6 font-nokia-bold bg-white hover:bg-primary-5 border border-accent-6 rounded-xl py-2 px-6 transition-all text-sm w-auto"
                onClick={submitProgress}
              >
                ዘግተህ ውጣ
              </button>
              <CaretCircleLeft className="text-3xl bg-primary-1 rounded-full text-accent-6 mr-2 hover:bg-primary-5 transition-all" />
            </div>
          </div>
        </div>
        {/* slides display window*/}
        <div className="lg:w-[70%] items-center h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg lg:rounded-none lg:h-full relative">
          {/* Chapter display container */}
          <div className="flex flex-col justify-between h-full">
            {/* Header */}
            <div>
              <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                <div className=" z-30 h-full flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
                  <img
                    src={logo}
                    className="w-8 h-5 md:w-10 md:h-6  z-30"
                    alt=""
                  />
                  <h3 className="text-white font-nokia-bold text-xs md:text-sm ">
                    <strong>Ezra</strong> Seminary
                  </h3>
                </div>
              </div>
              <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
            </div>

            {/* Slide content */}
            {data.map((slides, index) => {
              if (index === activeIndex) {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center w-[80%] mx-auto h-full overflow-y-hidden"
                  >
                    <div className="flex flex-col justify-center items-center h-auto overflow-y-auto scrollbar-thin py-2">
                      <h1 className="text-lg lg:text-2xl text-[#fff] text-center pt-2 font-nokia-bold">
                        {slides.slide}
                      </h1>
                      {slides.elements.map((element) => {
                        if (element.type === "title") {
                          return (
                            <h1
                              key={element._id}
                              className="text-white text-sm lg:text-lg font-nokia-bold pb-2 "
                            >
                              {element.value}
                            </h1>
                          );
                        } else if (element.type === "sub") {
                          return (
                            <p
                              key={element._id}
                              className="text-white font-nokia-bold  self-center tracking-wide text-center text-sm"
                            >
                              {element.value}
                            </p>
                          );
                        } else if (element.type === "text") {
                          return (
                            <p
                              key={element._id}
                              className="text-white font-nokia-bold self-center tracking-wide text-justify text-xs1 lg:text-xs "
                            >
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{element.value}
                            </p>
                          );
                        } else if (element.type === "img") {
                          return (
                            <div className="w-full h-full">
                              {isFullScreen ? (
                                <div className="absolute top-0 right-0 w-full h-full z-50 p-4">
                                  <div className="relative w-full h-full bg-secondary-7 bg-opacity-50 p-4 rounded-xl">
                                    <ArrowLeft
                                      size={40}
                                      className="absolute top-4 left-4 text-white bg-secondary-7 border p-1 rounded-full z-50 cursor-pointer hover:bg-secondary-5 transition-all"
                                      weight="bold"
                                      onClick={handleCloseFullScreen}
                                    />
                                    <img
                                      src={`http://ezra-seminary.mybese.tech/images/${element.value}`}
                                      alt="fullscreen content"
                                      className="w-full h-full object-contain rounded-3xl"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="relative w-[30vh] h-[30vh] mx-auto my-2 shadow-xl bg-secondary-7 bg-opacity-50 rounded-xl"
                                  onClick={handleOpenFullScreen}
                                >
                                  <img
                                    key={element._id}
                                    src={`http://ezra-seminary.mybese.tech/images/${element.value}`}
                                    alt="no image"
                                    className="w-full h-full object-contain shadow-xl rounded-xl text-white text-center"
                                  />
                                  <CornersOut
                                    size={28}
                                    className="absolute bottom-1 right-1 text-white bg-secondary-7 border p-1 rounded-lg z-50 cursor-pointer hover:bg-secondary-5 transition-all"
                                    weight="bold"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        } else if (element.type === "list") {
                          const listItemsComponent = element.value.map(
                            (listItem: string, index: number) => (
                              <li
                                key={index}
                                className="text-white font-nokia-bold w-[100%] tracking-wide text-left text-xs"
                              >
                                {listItem}
                              </li>
                            )
                          );

                          return (
                            <div
                              key={element._id}
                              className="flex flex-col justify-center items-center ml-8"
                            >
                              <ul className="list-disc mt-2">
                                {listItemsComponent}
                              </ul>
                            </div>
                          );
                        } else if (element.type === "slide") {
                          const listItemsComponent = element.value.map(
                            (listItem: string, index: number) => (
                              <SplideSlide
                                key={index}
                                className="flex justify-center items-center mx-auto text-white font-nokia-bold w-full h-auto text-justify px-4 tracking-wide text-xs1 md:text-xs "
                              >
                                {listItem}
                              </SplideSlide>
                            )
                          );

                          return (
                            <div
                              key={element._id}
                              className=" flex  w-[50%] md:w-[80%] lg:w-[90%] mx-auto h-auto"
                            >
                              <Splide
                                options={{
                                  perPage: 1,
                                  width: "100%",
                                  height: "100%",
                                  autoWidth: true,
                                  arrows: true, // Enable arrow navigation
                                  pagination: false,
                                  focus: "center",
                                  trimSpace: true,
                                  isNavigation: false,
                                }}
                              >
                                {listItemsComponent}
                              </Splide>
                            </div>
                          );
                        } else if (element.type === "quiz") {
                          return (
                            <div
                              key={element._id}
                              className="flex flex-col justify-center items-center mb-4"
                            >
                              {/* Questions */}
                              <p className="text-white font-nokia-bold text-sm lg:text-xl">
                                {element.value.question}
                              </p>
                              {/* Choices */}
                              {element.value.choices && (
                                <div className="flex flex-col mt-2">
                                  {element.value.choices.map(
                                    (
                                      choice: { text: string },
                                      choiceIndex: number
                                    ) => {
                                      return (
                                        <label
                                          key={`${element._id}-choice-${choiceIndex}`}
                                          className="inline-flex items-center"
                                        >
                                          <input
                                            type="radio"
                                            className="w-5 h-5 appearance-none bg-white focus:bg-orange-400 rounded-full transition-all"
                                            checked={
                                              selectedChoice === choiceIndex
                                            }
                                            onChange={() =>
                                              handleRadioChange(
                                                choiceIndex,
                                                choice.text,
                                                element.value.correctAnswer
                                              )
                                            }
                                          />
                                          <span className="text-white font-nokia-bold text-xs lg:text-lg ml-2">
                                            {choice.text}
                                          </span>
                                        </label>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                              {/* Correct Answer */}
                              <div className="flex mt-2">
                                <button
                                  className="text-white text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm lg:py-1 px-2"
                                  onClick={() => setShowQuizResult(true)}
                                >
                                  Check Answer
                                </button>
                                {renderQuizResult()}
                              </div>
                            </div>
                          );
                        } else if (
                          (element as CustomElement).type === "accordion"
                        ) {
                          if (
                            Array.isArray((element as AccordionElement).value)
                          ) {
                            const accordionItemsComponent = (
                              element as AccordionElement
                            ).value.map(
                              (accordionItem: AccordionItem, index: number) => (
                                <AccordionItemDisplay
                                  key={`$accordion-${index}`}
                                  title={accordionItem.title}
                                  content={accordionItem.content}
                                />
                              )
                            );

                            return (
                              <div className="flex flex-col justify-center items-center w-full">
                                {accordionItemsComponent}
                              </div>
                            );
                          } else {
                            console.error(
                              "Unexpected value for accordion element:",
                              (element as AccordionElement).value
                            );
                            return null;
                          }
                        }
                      })}
                    </div>

                    {isLastSlide && (
                      <button
                        className="text-white font-nokia-bold bg-accent-6 hover:bg-accent-7 rounded-xl py-1 px-4 mt-2 transition-all text-xs1"
                        onClick={submitProgress}
                      >
                        ዘግተህ ውጣ
                      </button>
                    )}
                  </div>
                );
              } else {
                return null; // Hide the slide if it doesn't match the activeIndex
              }
            })}

            <div className="mb-4">
              <hr className="border-accent-5 border-1 w-[90%] mx-auto z-50" />
              <div className="flex justify-between">
                <button
                  className={`text-white text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm  lg:py-1 px-2  ${
                    activeIndex === 0 ? "hidden" : "block"
                  }`} // hidding the previous button for the first slide
                  onClick={() => {
                    updateIndex(activeIndex - 1);
                  }}
                >
                  ተመለስ
                </button>
                <button
                  className={`text-white text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm  lg:py-1 px-2  ${
                    activeIndex === data.length - 1 ? "hidden" : "block"
                  }`} // hidding the next button for the last slide
                  onClick={() => {
                    updateIndex(activeIndex + 1);
                  }}
                >
                  ቀጥል
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SlidesDisplay;
