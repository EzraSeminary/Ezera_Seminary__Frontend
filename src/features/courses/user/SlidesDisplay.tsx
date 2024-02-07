import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CaretCircleLeft } from "@phosphor-icons/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import { useGetCourseByIdQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";

interface Element {
  _id: string;
  type: string;
  value: any;
}

interface Slide {
  _id: string;
  slide: string;
  elements: Element[];
}

interface Chapter {
  _id: string;
  slides: Slide[];
}

function SlidesDisplay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0); // New state variable to track the unlocked index

  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>(); // Note the two separate parameters

  //get single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId);

  // Extracting chapter data from the fetched course data
  const chapter = courseData?.chapters.find(
    (chap: Chapter) => chap._id === chapterId
  );
  // If the chapter is not found, handle accordingly
  if (!chapter) {
    return <p>Chapter not found</p>;
  }
  // Setting the data to slides if the chapter is found
  const data: Slide[] = chapter.slides;
  // console.log(data);

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
  };

  // slide number
  const currentDataNumber = activeIndex + 1;
  const totalDataNumber = data.length;

  const isSlideUnlocked = (index: number) => {
    return index <= unlockedIndex; // Check if the slide is unlocked based on the unlocked index
  };

  //Quiz Related functions
  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const handleRadioChange = (
    choiceIndex: number,
    choiceValue: string,
    elementCorrectAnswer: string
  ) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    setIsAnswerCorrect(choiceValue === elementCorrectAnswer);
  };

  //isCorrect switch
  const renderQuizResult = () => {
    if (isAnswerCorrect === null) return null; // Don't show feedback before a choice has been made

    if (isAnswerCorrect) {
      return <p className="text-green-800 font-bold text-xl">Correct!</p>;
    } else {
      return <p className="text-red-700 font-bold text-xl">Wrong!</p>;
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <BeatLoader
          color={"#707070"}
          loading
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  if (error) return <div>Something went wrong.</div>;

  return (
    <div className="flex justify-center items-center w-[80%] mx-auto">
      <div className="flex w-[100%] justify-center items-center h-screen ">
        <div className="flex flex-col justify-start items-center md:w-[30%] h-[80%] overflow-auto shadow-2xl rounded-lg border-2 border-accent-5 ">
          {/* slide number */}
          <div className="w-[90%] mx-auto ">
            <div className="flex flex-col mt-6 border-accent-5 border-1">
              <h1 className=" font-Lato-Black pb-1">
                SLIDE {currentDataNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border-1 w-[100%] mx-auto" />
            </div>
            <div className="flex flex-col mt-[20px]">
              {data.map((slides, index) => {
                const unlocked = isSlideUnlocked(index);
                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center text-sm font-nokia-bold border-b-2 border-accent-5 px-4 text-secondary-6 cursor-pointer py-2 ${
                      unlocked ? "text-black" : "text-gray-500"
                    }  ${index === activeIndex && "font-bold bg-[#FAE5C7]"}
                    `}
                    onClick={() => {
                      updateIndex(index);
                    }}
                    disabled={!unlocked} // Disable the button if the slide is locked
                  >
                    <span>{slides.slide}</span>
                    {unlocked ? (
                      <span className="material-symbols-outlined text-accent-6 pl-4 text-xl">
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-accent-6 pl-4 text-lg">
                        radio_button_unchecked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <Link to={`/courses/get/${courseId}`}>
              <div className="flex justify-between items-center w-[100%] mx-auto mt-12">
                <button className="text-white font-nokia-bold bg-accent-6 hover:bg-accent-7 rounded-xl py-1 px-4 transition-all">
                  ዘግተህ ውጣ
                </button>
                <CaretCircleLeft className="text-2xl bg-accent-6 rounded-full text-primary-1 mr-2 hover:bg-accent-7 transition-all" />
              </div>
            </Link>
          </div>
        </div>
        {/* slides */}
        <div className=" md:w-[70%] justify-start items-center mx-auto h-[80%] bg-chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                <h1 className="text-[#fff] text-sm font-Lato-Black">
                  EZRA seminary
                </h1>
                <img
                  src="../assets/close-icon.svg"
                  className="w-[3%] z-40 cursor-pointer"
                  alt=""
                />
              </div>
              <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
            </div>

            {data.map((slides, index) => {
              if (index === activeIndex) {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center flex-grow w-[80%] mx-auto h-full overflow-y-hidden"
                  >
                    <h1 className="text-3xl text-[#fff] text-center font-nokia-bold">
                      {slides.slide}
                    </h1>
                    <div className="flex flex-col justify-center items-center h-[80%] overflow-y-auto scrollbar-thin">
                      {slides.elements.map((element) => {
                        if (element.type === "title") {
                          return (
                            <h1
                              key={element._id}
                              className="text-white text-3xl font-nokia-bold pl-20"
                            >
                              {element.value}
                            </h1>
                          );
                        } else if (element.type === "sub") {
                          return (
                            <p
                              key={element._id}
                              className="text-white font-nokia-bold  self-center tracking-wide text-center text-2xl mt-2"
                            >
                              {element.value}
                            </p>
                          );
                        } else if (element.type === "text") {
                          return (
                            <p
                              key={element._id}
                              className="text-white font-nokia-bold self-center tracking-wide text-justify text-lg mt-2"
                            >
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{element.value}
                            </p>
                          );
                        } else if (element.type === "img") {
                          return (
                            <img
                              key={element._id}
                              src={`https://ezra-seminary-api.onrender.com/images/${element.value}`}
                              alt={element._id}
                              className="w-[30%] mx-auto border border-accent-6 shadow-xl padding mt-2"
                            />
                          );
                        } else if (element.type === "list") {
                          const listItemsComponent = element.value.map(
                            (listItem: string, index: number) => (
                              <li
                                key={index}
                                className="text-white font-nokia-bold w-[100%] tracking-wide text-left text-lg"
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
                                className="flex justify-center items-center text-white font-nokia-bold w-full tracking-wide text-left text-lg px-8"
                              >
                                {listItem}
                              </SplideSlide>
                            )
                          );

                          return (
                            <div
                              key={element._id}
                              className="flex flex-col w-full ml-8"
                            >
                              <Splide
                                options={{
                                  gap: "1rem",
                                }}
                                className="w-full p-8 rounded-md list-disc mt-2"
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
                              <p className="text-white font-nokia-bold text-2xl">
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
                                          <span className="text-white font-nokia-bold text-lg ml-2">
                                            {choice.text}
                                          </span>
                                        </label>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                              {/* Correct Answer */}
                              {renderQuizResult()}
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </div>
                );
              } else {
                return null; // Hide the slide if it doesn't match the activeIndex
              }
            })}

            <div className="mb-4">
              <hr className="border-accent-5 border-1 w-[90%] mx-auto z-50" />
              <button
                className={`text-white text-center font-nokia-bold mt-2 py-1 px-2 bg-accent-6 hover:bg-accent-7 w-[15%] rounded-3xl mx-auto text-2xl transition-all ${
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
      ;
    </div>
  );
}

export default SlidesDisplay;
