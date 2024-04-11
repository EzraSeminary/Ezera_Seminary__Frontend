import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useGetCourseByIdQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  XCircle,
  ArrowRight,
  CaretCircleLeft,
  CheckFat,
} from "@phosphor-icons/react";
import logo from "../../../assets/ezra-logo.svg";
import AccordionItemDisplay from "../admin/create-course/Elements/AccordionItemDisplay";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import { CustomElement, AccordionElement } from "@/redux/courseSlice";

function SlidesDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0); // New state variable to track the unlocked index

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  //show quiz result
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [progressLoading, setProgressLoading] = useState(false);

  //get the current user from the Root State
  const currentUser = useSelector((state: RootState) => state.auth.user);

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

  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();

  //get single course
  const { data: courseData, error } = useGetCourseByIdQuery(courseId as string);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Extracting chapter data from the fetched course data
  const chapter = courseData?.chapters.find((chap) => chap._id === chapterId);
  const chapterIndex = courseData?.chapters.findIndex(
    (chap) => chap._id === chapterId
  );
  // If the chapter is not found, handle accordingly
  if (!chapter) {
    return <p>Chapter not found</p>;
  }
  // Setting the data to slides if the chapter is found
  const data = chapter.slides;
  // console.log(data);

  //Slide changing functionality
  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= data.length) {
      newIndex = data.length - 1;
    }

    if (newIndex > unlockedIndex) {
      setUnlockedIndex(newIndex); // Update the unlocked index
    }

    setActiveIndex(newIndex);
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
            userId: currentUser._id, // Make sure you have a field to identify the user, like _id
            progress: currentUser.progress,
          },
          {
            headers: {
              // Add headers if needed, for example authorization token
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
          setProgressLoading(false);
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

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center min-h-screen">
        <BeatLoader
          color={"#EA9215"}
          loading
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  if (error) return <div>Something went wrong.</div>;

  console.log(currentUser);

  return (
    // <div className="flex justify-center items-center w-[80%] mx-auto">
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
              const unlocked = isSlideUnlocked(index);
              return (
                <button
                  key={index}
                  className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 text-secondary-6 cursor-pointer py-2 rounded-lg bg-gray-200 hover:bg-[#FAE5C7] hover:opacity-80  ${
                    unlocked ? "text-black" : "text-gray-500"
                  }  ${index === activeIndex && "font-bold "}

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
                    <Circle size={16} color={"#EA9215"} />
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
              const unlocked = isSlideUnlocked(index);
              return (
                <button
                  key={index}
                  className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 text-secondary-6 cursor-pointer py-2 rounded-lg bg-gray-200 hover:bg-[#FAE5C7] hover:opacity-80  ${
                    unlocked ? "text-black" : "text-gray-500"
                  }  ${index === activeIndex && "font-bold "}

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
                    <Circle size={16} color={"#EA9215"} />
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
      <div className="  lg:w-[70%]   items-center  h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg lg:rounded-none lg:h-full">
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
                            <img
                              key={element._id}
                              src={`http://ezra-seminary.mybese.tech/images/${element.value}`}
                              alt="no image"
                              className="w-[40vh] max-h-[40vh] min-h-[40vh] mx-auto md:w-[30vh] md:min-h-[30vh] md:max-h-[30vh] object-cover shadow-xl mt-2 bg-accent-9 rounded-xl text-white text-center"
                            />
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
    // </div>
  );
}

export default SlidesDisplay;
