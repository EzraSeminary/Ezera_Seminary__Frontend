import { updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";

function DragAndDrop({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

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

  return (
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
                onChange={(e) => handleDndChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="mt-1 border-2 border-accent-6 rounded-md text-accent-6 font-bold px-2 py-1 w-[75%]"
              />
              <Trash
                onClick={() => {
                  // Add a function to handle removing choices
                  setDndChoices(dndChoices.filter((_, i) => i !== index));
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

export default DragAndDrop;
