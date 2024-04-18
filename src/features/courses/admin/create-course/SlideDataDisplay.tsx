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
import AccordionItemDisplay from "./Elements/AccordionItemDisplay";
import { RootState } from "../../../../redux/store";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import { XCircle, CheckFat } from "@phosphor-icons/react";

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
        setShowQuizResult(false); // Reset showResult when a new answer is selected
      }
    }
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
    setShowQuizResult(false); // Reset the showQuizResult state
  }, [selectedSlide]);

  return (
    <div className=" h-screen chapter-img-1 bg-no-repeat bg-cover bg-center rounded-b-lg">
      <div className="flex flex-col justify-between w-full h-full">
        <div>
          <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
            <h1 className="font-nokia-bold text-primary-6 text-xs lg:text-sm">
              {selectedChapter?.chapter}
            </h1>
            <p className="font-nokia-bold text-primary-6 text-xs lg:text-sm">
              {currentSlideNumber}/{totalSlides}
            </p>
          </div>
          <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
        </div>
        {selectedSlide && selectedSlide.elements && (
          <div className="flex flex-col justify-center items-center flex-grow p-5 w-full h-full overflow-y-hidden">
            <ul className="flex flex-col justify-center items-center w-full h-full overflow-y-auto scrollbar-thin relative">
              <h1 className="text-2xl text-primary-6 text-center font-nokia-bold">
                {selectedSlide.slide}
              </h1>
              {selectedSlide.elements.map((element: CustomElement, index) => {
                let elementComponent = null;
                const uniqueKey = `${element.type}-${index}`;

                if (element.type === "title") {
                  elementComponent = (
                    <h1
                      key={element.type}
                      className="text-primary-6 text-2xl font-nokia-bold text-center"
                    >
                      {element.value}
                    </h1>
                  );
                } else if (element.type === "sub") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-primary-6 font-nokia-bold w-[100%] self-center tracking-wide text-lg text-center"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "text") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-primary-6 font-nokia-bold self-center tracking-wide text-justify text-xs mt-2"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "list") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <li
                        key={`${uniqueKey}-list-${index}`}
                        className="text-primary-6 font-nokia-bold w-[100%] tracking-wide text-xs"
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
                      <p className="text-primary-6 font-nokia-bold text-lg">
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
                                  className="w-5 h-5 appearance-none bg-primary-6 focus:bg-orange-400 rounded-full transition-all"
                                  checked={selectedChoice === choiceIndex}
                                  onChange={() =>
                                    handleRadioChange(choiceIndex, choice.text)
                                  }
                                />
                                <span className="text-primary-6 font-nokia-bold text-sm ml-2">
                                  {choice.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {/* Correct Answer */}
                      <div className="flex mt-2">
                        <button
                          className="text-primary-6 text-center font-nokia-bold bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm lg:py-1 px-2"
                          onClick={() => setShowQuizResult(true)}
                        >
                          Check Answer
                        </button>
                        {renderQuizResult()}
                      </div>
                    </div>
                  );
                } else if (element.type === "slide") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <SplideSlide
                        key={index}
                        className="text-primary-6 font-nokia-bold text-xs"
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
                } else if (element.type === "accordion") {
                  const accordionItemsComponent = element.value.map(
                    (accordionItem, index) => (
                      <AccordionItemDisplay
                        key={`${uniqueKey}-accordion-${index}`}
                        title={accordionItem.title}
                        content={accordionItem.content}
                      />
                    )
                  );

                  elementComponent = (
                    <div className="flex flex-col justify-center items-center w-full">
                      {accordionItemsComponent}
                    </div>
                  );
                } else if (element.type === "sequence") {
                  const sequenceItemsComponent = element.value.map(
                    (sequenceItem, index) => (
                      <li
                        key={`${uniqueKey}-list-${index}`}
                        className="text-primary-6 font-nokia-bold w-[100%] tracking-wide text-xs"
                      >
                        {sequenceItem}
                      </li>
                    )
                  );

                  elementComponent = (
                    <div className="flex flex-col justify-center items-center ml-8">
                      <ul className="list-disc mt-2">
                        {sequenceItemsComponent}
                      </ul>
                    </div>
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
              className="text-primary-6 text-center font-nokia-bold mt-2 py-1 px-2 bg-accent-6 hover:bg-accent-7 w-[15%] rounded-3xl text-xs transition-all"
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
