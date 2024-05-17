import { updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";

function Quiz({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  // Quiz-related state and functions
  const [quizQuestion, setQuizQuestion] = useState<string>("");
  const [quizChoices, setQuizChoices] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  const handleQuizQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuizQuestion(event.target.value);
  };

  const handleQuizChoiceChange = (index: number, text: string) => {
    setQuizChoices(
      quizChoices.map((choice, i) => (i === index ? text : choice))
    );
  };

  const handleAddQuizChoice = () => {
    setQuizChoices([...quizChoices, ""]); // Adds a new empty choice
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value);
  };

  const saveQuizToRedux = () => {
    if (quizQuestion && quizChoices.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: element.id,
          value: {
            question: quizQuestion,
            choices: quizChoices.map((text) => ({ text })),
            correctAnswer,
          },
        })
      );
      // Reset quiz state
      // setQuizQuestion("");
      // setQuizChoices([]);
      // setCorrectAnswer("");
    }
    setCurrentElement("");
  };
  return (
    <div id={element.id}>
      <div className="flex flex-col items-center w-[100%] gap-1 py-4">
        <input
          type="text"
          value={quizQuestion}
          onChange={handleQuizQuestionChange}
          placeholder="Enter quiz question"
          className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
        />
        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddQuizChoice}
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
            onClick={saveQuizToRedux}
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
        {/* // Map over quizChoices to render choices */}
        {quizChoices.map((choice, index) => (
          <label>
            <h2 className="text-secondary-6 pt-4">Choice {index + 1}:</h2>
            <li key={index} className="flex justify-between">
              <input
                type="text"
                value={choice}
                onChange={(e) => handleQuizChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="mt-1 border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6  rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <Trash
                onClick={() => {
                  // Add a function to handle removing choices
                  setQuizChoices(quizChoices.filter((_, i) => i !== index));
                }}
                className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all mt-1"
                weight="fill"
                size={18}
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
          value={correctAnswer}
          className="border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md text-lg font-Lato-Regular px-2 py-1 w-full placeholder:text-lg cursor-pointer"
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
      </div>
    </div>
  );
}

export default Quiz;
