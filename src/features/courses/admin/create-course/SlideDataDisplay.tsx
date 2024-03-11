import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectChapters,
  selectSlides,
  Chapter,
  CustomElement,
  QuizElement,
  Slide,
} from "../../../../redux/courseSlice";
import { RootState } from "../../../../redux/store";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";

interface SlideDataDisplayProps {
  selectedSlideIndex: {
    chapter: number;
    slide: number;
  };
  onNextSlide: () => void;
}

const SlideDataDisplay: React.FC<SlideDataDisplayProps> = ({
  selectedSlideIndex,
  onNextSlide,
}) => {
  //Quiz Related functions
  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  //show quiz result
  const [showQuizResult, setShowQuizResult] = useState(false);

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const handleRadioChange = (choiceIndex: number, choiceValue: string) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    if (selectedSlide?.elements?.some((element) => element.type === "quiz")) {
      const quizElement = selectedSlide.elements.find(
        (element): element is QuizElement => element.type === "quiz"
      );
      if (quizElement) {
        const isCorrect = choiceValue === quizElement.value.correctAnswer;
        setIsAnswerCorrect(isCorrect);
      }
    }
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

  const chapters = useSelector(selectChapters) as Chapter[];
  const slides: Slide[] = useSelector((state: RootState) =>
    selectSlides(state, selectedSlideIndex.chapter)
  );
  const selectedChapter = chapters[selectedSlideIndex.chapter];
  const selectedSlide = slides[selectedSlideIndex.slide];

  //slide number
  const currentSlideNumber = selectedSlideIndex.slide + 1;
  const totalSlides = slides.length;
  const isLastSlide = selectedSlideIndex.slide === totalSlides - 1;

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  useEffect(() => {
    if (selectedSlide && selectedSlide.elements) {
      const imgElement = selectedSlide.elements.find(
        (element) => element.type === "img"
      );
      if (imgElement && imgElement.value instanceof File) {
        const objectUrl = URL.createObjectURL(imgElement.value);
        setImagePreviewUrl(objectUrl);

        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [selectedSlide]);

  return (
    <div className="max-w-full h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg">
      <div className="flex flex-col justify-between w-full h-full">
        <div>
          <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
            <h1 className="font-nokia-bold text-white text-xs lg:text-sm">
              {selectedChapter?.chapter}
            </h1>
            <p className="font-nokia-bold text-white text-xs lg:text-sm">
              {currentSlideNumber}/{totalSlides}
            </p>
          </div>
          <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
        </div>
        {selectedSlide && selectedSlide.elements && (
          <div className="flex flex-col justify-center items-center flex-grow p-5 w-full h-full overflow-y-hidden">
            <ul className="flex flex-col justify-center items-center w-full h-full overflow-y-auto scrollbar-thin relative">
              <h1 className="text-2xl text-[#fff] text-center font-nokia-bold">
                {selectedSlide.slide}
              </h1>
              {selectedSlide.elements.map((element: CustomElement, index) => {
                let elementComponent = null;
                const uniqueKey = `${element.type}-${index}`;

                if (element.type === "title") {
                  elementComponent = (
                    <h1
                      key={element.type}
                      className="text-white text-2xl font-nokia-bold text-center"
                    >
                      {element.value}
                    </h1>
                  );
                } else if (element.type === "sub") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-white font-nokia-bold w-[100%] self-center tracking-wide text-lg text-center"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "text") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-white font-nokia-bold self-center tracking-wide text-justify text-xs mt-2"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "list") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <li
                        key={`${uniqueKey}-list-${index}`}
                        className="text-white font-nokia-bold w-[100%] tracking-wide text-xs"
                      >
                        {listItem}
                      </li>
                    )
                  );

                  elementComponent = (
                    <div className="flex flex-col justify-center items-center ml-8">
                      <ul className="list-disc mt-2">{listItemsComponent}</ul>
                    </div>
                  );
                } else if (element.type === "quiz") {
                  elementComponent = (
                    <div
                      key={uniqueKey}
                      className="flex flex-col justify-center items-center mb-4"
                    >
                      {/* Questions */}
                      <p className="text-white font-nokia-bold text-lg">
                        {element.value.question}
                      </p>
                      {/* Choices */}
                      {element.value.choices && (
                        <div className="flex flex-col mt-2">
                          {element.value.choices.map((choice, choiceIndex) => {
                            return (
                              <label
                                key={`${uniqueKey}-choice-${choiceIndex}`}
                                className="inline-flex items-center"
                              >
                                <input
                                  type="radio"
                                  className="w-5 h-5 appearance-none bg-white focus:bg-orange-400 rounded-full transition-all"
                                  checked={selectedChoice === choiceIndex}
                                  onChange={() =>
                                    handleRadioChange(choiceIndex, choice.text)
                                  }
                                />
                                <span className="text-white font-nokia-bold text-sm ml-2">
                                  {choice.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {/* Correct Answer */}
                      {renderQuizResult()}
                    </div>
                  );
                } else if (element.type === "slide") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <SplideSlide
                        key={index}
                        className="text-white font-nokia-bold text-xs"
                      >
                        {listItem}
                      </SplideSlide>
                    )
                  );

                  return (
                    <div key={element._id}>
                      <Splide>{listItemsComponent}</Splide>
                    </div>
                  );
                } else if (element.type === "img") {
                  const altText =
                    element.value instanceof File
                      ? element.value.name
                      : "image";
                  elementComponent = (
                    <img
                      key={element.type}
                      src={imagePreviewUrl}
                      alt={altText}
                      className="w-[40%] mx-auto"
                    />
                  );
                }

                return elementComponent;
              })}
            </ul>
          </div>
        )}
        <div className="mb-4 w-[100%] flex flex-col items-center justify-center">
          <hr className="border-accent-5  border-1 w-[90%] mx-auto z-50 " />
          {!isLastSlide && (
            <button
              onClick={onNextSlide}
              className="text-white text-center font-nokia-bold mt-2 py-1 px-2 bg-accent-6 hover:bg-accent-7 w-[15%] rounded-3xl text-xs transition-all"
            >
              ቀጥል
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideDataDisplay;
