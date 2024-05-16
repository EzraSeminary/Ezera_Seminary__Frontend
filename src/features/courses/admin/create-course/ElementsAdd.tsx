import {
  useState,
  ChangeEvent,
  // useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // addElementToSlide,
  updateElement,
  deleteElement,
  CourseState,
  // selectElements,
} from "../../../../redux/courseSlice";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import List from "../../Elements/List";
import Slide from "../../Elements/Slide";
import Quiz from "../../Elements/Quiz";
import Accordion from "../../Elements/Accordion";
import Sequence from "../../Elements/Sequence";
import Reveal from "../../Elements/Reveal";
// import { element } from "prop-types";

export interface ElementsAddProps {
  chapterIndex: number;
  slideIndex: number;
  // currentElement: string | null | string[] | boolean;
  setCurrentElement: React.Dispatch<
    React.SetStateAction<string | null | string[] | boolean>
  >;
}

function ElementsAdd({
  chapterIndex,
  slideIndex,
  // currentElement,
  setCurrentElement,
}: ElementsAddProps) {
  // console.log("chapter", chapterIndex);
  // console.log("slide", slideIndex);

  const dispatch = useDispatch();

  const chapters = useSelector(
    (state: { course: CourseState }) => state.course.chapters
  );
  const elements = chapters[chapterIndex]?.slides[slideIndex]?.elements || [];

  const handleInputChange = (id: string, value: string) => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: id,
        value: value,
      })
    );
  };

  // Image preview state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
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
        // Create a URL for the file
        const fileUrl = URL.createObjectURL(file);
        setImagePreviewUrl(fileUrl); // Set imagePreviewUrl state
      }
    }
  };

  const handleDeleteButtonClick = (elementId: string) => {
    dispatch(
      deleteElement({
        chapterIndex,
        slideIndex,
        elementId,
      })
    );
  };

  // Elements

  // DND-related state and functions
  const [dndQuestion, setDndQuestion] = useState("");
  const [dndChoices, setDndChoices] = useState<string[]>([]);
  const [correctDndAnswer, setCorrectDndAnswer] = useState("");

  const handleDndQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDndQuestion(event.target.value);
  };

  const handleDndChoiceChange = (index: number, text: string) => {
    setDndChoices(dndChoices.map((choice, i) => (i === index ? text : choice)));
  };

  const handleAddDndChoice = () => {
    setDndChoices([...dndChoices, ""]); // Adds a new empty choice
  };

  const handleCorrectDndAnswerChange = (value: string) => {
    setCorrectDndAnswer(value);
  };

  const saveDndToRedux = (id: string) => {
    if (dndQuestion && dndChoices.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: id,
          value: {
            question: dndQuestion,
            choices: dndChoices.map((text) => ({ text })),
            correctDndAnswer,
          },
        })
      );
      // Reset quiz state
      // setDndQuestion("");
      // setDndChoices([]);
      // setCorrectDndAnswer("");
    }
    setCurrentElement("");
  };

  const uniqueKey = `${chapterIndex}-${slideIndex}`;

  const elementName = (elementType: string) => {
    switch (elementType) {
      case "title":
        return "Title";
      case "sub":
        return "Sub Title";
      case "text":
        return "Paragraph";
      case "img":
        return "Image";
      case "list":
        return "Bulleted list";
      case "slide":
        return "Horizontal series";
      case "quiz":
        return "Multiple choice";
      case "accordion":
        return "Expandable list";
      case "sequence":
        return "Sequence";
      case "reveal":
        return "Reveal";
      case "range":
        return "Slider";
      case "dnd":
        return "Missing Words";
      default:
        return "";
    }
  };

  // useEffect(() => {
  //   setCurrentElement("");
  // }, [chapterIndex, slideIndex]);

  // useEffect(() => {
  //   console.log("Effect ran: Checking new slide elements");
  //   const newSlideElements =
  //     chapters[chapterIndex]?.slides[slideIndex]?.elements || [];
  //   console.log("New slide elements:", newSlideElements);

  //   if (newSlideElements.length > 0) {
  //     console.log("First element type:", newSlideElements[[1]].type);
  //     setCurrentElement(newSlideElements[[1]].type);
  //   } else {
  //     console.log("No elements found, resetting currentElement");
  //     setCurrentElement("");
  //   }
  // }, [chapterIndex, slideIndex, chapters, setCurrentElement]);

  // console.log("Current element before rendering form:", currentElement);

  return (
    <div
      key={uniqueKey}
      className="bg-secondary-1 w-full h-full overflow-y-auto px-4 border border-secondary-3"
    >
      {elements.map((element, index) => {
        let elementComponent;
        if (
          element.type === "title" ||
          element.type === "sub" ||
          element.type === "text"
        ) {
          elementComponent = (
            <input
              id={element.id}
              placeholder={`Enter ${element.type}`}
              value={element.value?.toString()}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
            />
          );
        } else if (element.type === "img") {
          elementComponent = (
            <div className="flex flex-col my-3 border-2 border-secondary-3 rounded-md hover:border-accent-5">
              <input
                type="file"
                id={element.id}
                onChange={(e) => handleFileInputChange(e, element.id)}
                className="w-[100%] file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 text-sm
                file:text-lg  text-secondary-6 font-bold p-2 file:bg-accent-6
                file:text-primary-6 file:font-nokia-bold  hover:file:bg-accent-7
                rounded-xs bg-transparent hover:text-secondary-5
                focus:outline-none focus:border-accent-8 cursor-pointer"
              />

              {imagePreviewUrl && (
                <img
                  key={element.type}
                  src={imagePreviewUrl}
                  alt=""
                  className="rounded-b-md"
                />
              )}
            </div>
          );
        } else if (element.type === "list") {
          elementComponent = (
            <List
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "slide") {
          elementComponent = (
            <Slide
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "quiz") {
          elementComponent = (
            <Quiz
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "accordion") {
          elementComponent = (
            <Accordion
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "sequence") {
          elementComponent = (
            <Sequence
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "reveal") {
          elementComponent = (
            <Reveal
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "range") {
          elementComponent = null; // Here you can define what the 'range' type should render
        } else if (element.type === "dnd") {
          elementComponent = (
            <div id={element.id}>
              <div className="flex flex-col items-center w-[100%] gap-1 py-4">
                <input
                  type="text"
                  value={dndQuestion}
                  onChange={handleDndQuestionChange}
                  placeholder="Enter quiz question"
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
                />

                <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
                  <button
                    onClick={handleAddDndChoice}
                    className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
                  >
                    <PlusCircle
                      className="text-primary-6  transition-all"
                      size={16}
                      weight="fill"
                    />
                    Add
                  </button>
                  <button
                    onClick={() => saveDndToRedux(element.id)}
                    className=" flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
                  >
                    <File
                      className="text-primary-6  transition-all"
                      size={16}
                      weight="fill"
                    />
                    Save
                  </button>
                </div>
              </div>
              <ul className="space-y-2 py-4">
                {/* // Map over dndChoices to render choices */}
                {dndChoices.map((choice, index) => (
                  <label className="text-accent-6 ">
                    Choice {index + 1}:
                    <li key={index} className="flex justify-between">
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleDndChoiceChange(index, e.target.value)
                        }
                        placeholder={`Choice ${index + 1}`}
                        className="mt-1 border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
                      />
                      <Trash
                        onClick={() => {
                          // Add a function to handle removing choices
                          setDndChoices(
                            dndChoices.filter((_, i) => i !== index)
                          );
                        }}
                        className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all mt-1"
                        weight="fill"
                        size={22}
                      />
                    </li>
                  </label>
                ))}
              </ul>
              {/* choose the correct answer on the dropdown */}
              <div className="border-y-2 border-secondary-4 py-6">
                <h2 className="text-lg border border-secondary-3 w-fit px-1 bg-primary-4 rounded-md">
                  Correct Answer:
                </h2>
                <select
                  value={correctDndAnswer}
                  className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md text-lg font-Lato-Regular px-2 py-1 w-full placeholder:text-lg cursor-pointer"
                  onChange={(e) => handleCorrectDndAnswerChange(e.target.value)}
                  required
                >
                  <option value="">Select the correct answer</option>
                  {dndChoices.map((a, index) => (
                    <option key={index} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="py-2">
            <div className="flex flex-col justify-between pb-2">
              <div className="flex justify-between items-center border-b-2 border-secondary-4 px-1 py-3 mb-1">
                <h2 className="text-secondary-7 font-bold text-xl">
                  {elementName(element.type)}
                </h2>
                <Trash
                  onClick={() => handleDeleteButtonClick(element.id)}
                  className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                  weight="fill"
                  size={18}
                />
              </div>
              {elementComponent}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ElementsAdd;
