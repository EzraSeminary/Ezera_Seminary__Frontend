import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectSlides } from "../../redux/courseSlice";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";

function SlideDataDisplay({ selectedSlideIndex }) {
  //Quiz Related functions
  //track whether the selected answer is correct or not.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  //radio input switch
  const [selectedChoice, setSelectedChoice] = useState(null);
  const handleRadioChange = (choiceIndex, choiceValue) => {
    setSelectedChoice(choiceIndex);
    //logic to determine whether the selected answer is correct.
    if (selectedSlide.elements.some((el) => el.type === "quiz")) {
      const quizElement = selectedSlide.elements.find(
        (el) => el.type === "quiz"
      );
      const isCorrect = choiceValue === quizElement.value.correctAnswer;
      setIsAnswerCorrect(isCorrect);
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

  const slides = useSelector((state) =>
    selectSlides(state, selectedSlideIndex.chapter)
  );
  const selectedSlide = slides[selectedSlideIndex.slide];

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  useEffect(() => {
    if (selectedSlide && selectedSlide.elements) {
      const imgElement = selectedSlide.elements.find((e) => e.type === "img");
      if (imgElement && imgElement.value instanceof File) {
        const objectUrl = URL.createObjectURL(imgElement.value);
        setImagePreviewUrl(objectUrl);

        // Clean up the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [selectedSlide]);

  return (
    <div className="mr-16 h-[80%]  bg-chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg">
      <div className="flex flex-col justify-between w-full h-full">
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
        {selectedSlide && selectedSlide.elements && (
          <div className="flex flex-col justify-center items-center flex-grow p-5 w-full h-full overflow-y-hidden">
            <h1 className="text-3xl text-[#fff] text-center font-nokia-bold">
              {selectedSlide.slide}
            </h1>
            <ul className="flex flex-col justify-center items-center w-full h-full overflow-y-auto scrollbar-thin relative">
              {selectedSlide.elements.map((element, index) => {
                let elementComponent = null;
                const uniqueKey = `${element.type}-${index}`;

                if (element.type === "title") {
                  elementComponent = (
                    <h1
                      key={element.type}
                      className="text-white text-3xl font-nokia-bold text-center"
                    >
                      {element.value}
                    </h1>
                  );
                } else if (element.type === "sub") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-white font-nokia-bold w-[100%] self-center tracking-wide text-2xl text-center"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "text") {
                  elementComponent = (
                    <p
                      key={element.type}
                      className="text-white font-nokia-bold w-[100%] self-center tracking-wide text-justify text-lg mt-2"
                    >
                      {element.value}
                    </p>
                  );
                } else if (element.type === "list") {
                  const listItemsComponent = element.value.map(
                    (listItem, index) => (
                      <li
                        key={`${uniqueKey}-list-${index}`}
                        className="text-white font-nokia-bold w-[100%] tracking-wide text-lg"
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
                      <p className="text-white font-nokia-bold text-2xl">
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
                                <span className="text-white font-nokia-bold text-lg ml-2">
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
                } else if (element.type === "img") {
                  elementComponent = (
                    <img
                      key={element.type}
                      src={imagePreviewUrl}
                      alt={element.value.name}
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
          <button className="text-white text-center font-nokia-bold mt-2 py-1 px-2 bg-accent-6 hover:bg-accent-7 w-[15%] rounded-3xl text-2xl transition-all">
            ቀጥል
          </button>
        </div>
      </div>
    </div>
  );
}

SlideDataDisplay.propTypes = {
  selectedSlideIndex: PropTypes.shape({
    chapter: PropTypes.number.isRequired,
    slide: PropTypes.number.isRequired,
  }).isRequired,
};

export default SlideDataDisplay;
