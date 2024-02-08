import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  addElementToSlide,
  updateElement,
  deleteElement,
} from "../../redux/courseSlice";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";

function ElementsAdd({ chapterIndex, slideIndex }) {
  const dispatch = useDispatch();

  const chapters = useSelector((state) => state.course.chapters);
  const elements = chapters[chapterIndex]?.slides[slideIndex]?.elements || [];

  const [currentElement, setCurrentElement] = useState("");

  const [listItems, setListItems] = useState([]);
  const [currentListItem, setCurrentListItem] = useState("");
  const [slidesDetails, setSlidesDetails] = useState([]);
  const [currentSlideDetails, setCurrentSlideDetails] = useState("");

  const handleListInputChange = (event) => {
    setCurrentListItem(event.target.value);
  };

  const handleAddListItem = () => {
    if (currentListItem) {
      setListItems([...listItems, currentListItem]);
      setCurrentListItem("");
    }
  };

  const handleAddListElement = () => {
    if (listItems.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "list",
          value: listItems,
        })
      );
      setListItems([]);
    }
    setCurrentElement("");
    console.log(elements);
  };

  const handleAddSlide = () => {
    if (currentSlideDetails) {
      setSlidesDetails([...slidesDetails, currentSlideDetails]);
      setCurrentSlideDetails("");
    }
  };

  const handleDeleteSlideItem = (indexToDelete) => {
    const updatedSlides = slidesDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setSlidesDetails(updatedSlides);
  };

  const handleSaveSlides = () => {
    dispatch(
      addElementToSlide({
        chapterIndex,
        slideIndex,
        elementType: "slide",
        value: slidesDetails,
      })
    );
    setSlidesDetails([]); // Clear slides details after adding
  };

  const handleFileInputChange = (e, id) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: file,
        })
      );
    }
  };
  const handleDeleteListItem = (indexToDelete) => {
    const updatedList = listItems.filter((_, index) => index !== indexToDelete);
    setListItems(updatedList);
  };

  const renderListForm = () => (
    <div className="mt-2">
      <div className="flex flex-row items-center w-[100%] gap-1">
        <input
          type="text"
          value={currentListItem}
          onChange={handleListInputChange}
          placeholder="Enter list item"
          className="border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
        />
        <PlusCircle
          onClick={handleAddListItem}
          className="text-accent-6 hover:text-accent-7 hover:cursor-pointer transition-all"
          size={24}
          weight="fill"
        />
        <File
          onClick={handleAddListElement}
          className="text-accent-6 hover:text-accent-7 hover:cursor-pointer transition-all"
          size={24}
          weight="fill"
        />
      </div>
      <ul>
        {listItems.map((item, index) => (
          <li key={index} className="flex justify-between">
            - {item}{" "}
            <span>
              <Trash
                onClick={() => handleDeleteListItem(index)}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                weight="fill"
                size={22}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
  const renderSlideForm = () => (
    <div className="mt-4">
      <div className="flex flex-row items-center w-[100%] gap-1">
        <textarea
          type="text"
          value={currentSlideDetails}
          onChange={(e) => setCurrentSlideDetails(e.target.value)}
          placeholder="Enter slide details"
          className="border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
        />
        <PlusCircle
          onClick={handleAddSlide}
          className="text-accent-6 hover:text-accent-7 hover:cursor-pointer transition-all"
          size={24}
          weight="fill"
        />
        <File
          onClick={handleSaveSlides}
          className="text-accent-6 hover:text-accent-7 hover:cursor-pointer transition-all"
          size={24}
          weight="fill"
        />
      </div>
      <ul className="w-[100%]">
        {slidesDetails.map((details, index) => (
          <li key={index} className="flex justify-between break-words">
            - {details}{" "}
            <span>
              <Trash
                onClick={() => handleDeleteSlideItem(index)}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all"
                weight="fill"
                size={22}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const handleDropdownChange = (e) => {
    setCurrentElement(e.target.value);
  };

  const handleAddButtonClick = () => {
    // Only dispatch addElementToSlide when the add button is clicked and currentElement is not "list"
    if (
      currentElement &&
      currentElement !== "list" &&
      currentElement !== "img" &&
      currentElement !== "quiz"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
        })
      );
      setCurrentElement("");
    } else if (currentElement && currentElement === "img") {
      // For an image, just setup the element; don't add until an image is selected
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: currentElement,
          value: null, // Initially no image file chosen
        })
      );
    }
  };

  const handleInputChange = (id, value) => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: id,
        value: value,
      })
    );
  };

  const handleDeleteButtonClick = (elementId) => {
    dispatch(
      deleteElement({
        chapterIndex,
        slideIndex,
        elementId,
      })
    );
  };

  // Quiz-related state and functions
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizChoices, setQuizChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleQuizQuestionChange = (event) => {
    setQuizQuestion(event.target.value);
  };

  const handleQuizChoiceChange = (index, text) => {
    setQuizChoices(
      quizChoices.map((choice, i) => (i === index ? text : choice))
    );
  };

  const handleAddQuizChoice = () => {
    setQuizChoices([...quizChoices, ""]); // Adds a new empty choice
  };

  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(value);
  };

  const saveQuizToRedux = () => {
    if (quizQuestion && quizChoices.length > 0) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: "quiz",
          value: {
            question: quizQuestion,
            choices: quizChoices.map((text) => ({ text })),
            correctAnswer,
          },
        })
      );
      // Reset quiz state
      setQuizQuestion("");
      setQuizChoices([]);
      setCorrectAnswer("");
    }
    setCurrentElement("");
  };

  const renderQuizForm = () => (
    <div className="mt-2">
      <div className="flex flex-row items-center w-[100%] gap-1">
        <input
          type="text"
          value={quizQuestion}
          onChange={handleQuizQuestionChange}
          placeholder="Enter quiz question"
          className="border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
        />
        <PlusCircle
          onClick={handleAddQuizChoice}
          className="text-accent-6 hover:text-accent-7 hover:cursor-pointer transition-all"
          size={24}
          weight="fill"
        />
        {/* // Replace the existing File OnClick action with saveQuizToRedux */}
        <File
          onClick={saveQuizToRedux}
          className="text-accent-6 hover:text-accent-7 hover:cursor-pointer transition-all"
          size={24}
          weight="fill"
        />
      </div>
      {/* // Map over quizChoices to render choices */}
      {quizChoices.map((choice, index) => (
        <div key={index} className="flex justify-between">
          <input
            type="text"
            value={choice}
            onChange={(e) => handleQuizChoiceChange(index, e.target.value)}
            placeholder={`Choice ${index + 1}`}
            className="mt-1 border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
          />
          <Trash
            onClick={() => {
              // Add a function to handle removing choices
              setQuizChoices(quizChoices.filter((_, i) => i !== index));
            }}
            className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all mt-1"
            weight="fill"
            size={22}
          />
        </div>
      ))}
      {/* choose the correct answer on the dropdown */}
      <label>
        Correct Answer:
        <select
          value={correctAnswer}
          onChange={(e) => handleCorrectAnswerChange(e.target.value)}
          required
        >
          <option value="">Select the correct answer</option>
          {quizChoices.map((a, index) => (
            <option key={index} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div className="bg-white w-[100%] px-4">
      <p className="font-bold py-2">Insert Element</p>
      <div className="flex justify-between">
        <select
          name="elements"
          id="elements"
          value={currentElement}
          onChange={handleDropdownChange}
          className="w-[100%] border-2 border-accent-6 rounded-md mr-2 py-1"
        >
          <option value="">Choose Type</option>
          <option value="title">Title</option>
          <option value="sub">Sub-title</option>
          <option value="text">Paragraph</option>
          <option value="slide">Slide</option>
          <option value="img">Image</option>
          <option value="quiz">Quiz</option>
          <option value="list">List</option>
        </select>
        <button
          onClick={handleAddButtonClick}
          className="px-2 font-semibold text-white bg-accent-6 rounded-md hover:bg-accent-7 hover:cursor-pointer transition-all"
        >
          Add
        </button>
      </div>

      {currentElement === "list" && renderListForm()}
      {currentElement === "slide" && renderSlideForm()}
      {currentElement === "quiz" && renderQuizForm()}
      {elements.map((element, index) => (
        <div key={index} className="py-2">
          <div className="flex flex-col justify-between pb-2">
            <div className="flex justify-between">
              <label className="text-accent-6 font-bold mb-1">
                {element.type}
              </label>
              <button
                className="flex items-center text-accent-6 hover:text-accent-6"
                onClick={() => handleDeleteButtonClick(element.id)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            {element.type === "img" ? (
              <input
                type="file"
                id={element.id}
                onChange={(e) => handleFileInputChange(e, element.id)}
                className="w-[100%] border-2 border-accent-6 rounded-md text-primary-6 font-bold p-2"
              />
            ) : (
              <input
                id={element.id}
                placeholder={`Enter ${element.type}`}
                value={
                  element.type === "quiz"
                    ? element.value.question
                    : element.value
                }
                onChange={(e) => handleInputChange(element.id, e.target.value)}
                className="w-[100%] border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

ElementsAdd.propTypes = {
  chapterIndex: PropTypes.number.isRequired,
  slideIndex: PropTypes.number.isRequired,
};

export default ElementsAdd;
