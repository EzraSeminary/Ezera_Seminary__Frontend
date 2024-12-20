import { DndElementValue, updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";
import CustomTextarea from "@/components/CustomTextarea";

function DragAndDrop({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const dndElement = element.value as DndElementValue;

  // Check if the local state is empty, if so, use the values from the Redux state.
  const [dndQuestion, setDndQuestion] = useState<string>(
    dndElement?.question || ""
  );
  const [dndChoices, setDndChoices] = useState<string[]>(
    dndElement?.choices?.map((choice) => choice.text) || []
  );
  const [correctDndAnswer, setCorrectDndAnswer] = useState<string>(
    dndElement?.correctDndAnswer || ""
  );

  const handleDndQuestionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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

  const saveDndToRedux = () => {
    if (dndQuestion && dndChoices.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: element.id,
          value: {
            question: dndQuestion,
            choices: dndChoices.map((text) => ({ text })),
            correctDndAnswer,
          },
        })
      );
    }
    setCurrentElement("");
  };

  return (
    <div id={element.id}>
      <div className="flex flex-col items-center w-[100%] gap-1 py-4">
        <CustomTextarea
          value={dndQuestion}
          onChange={handleDndQuestionChange}
          placeholder="Enter question here..."
          className="font-Lato-Regular border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
          maxLength={150}
        />

        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddDndChoice}
            className=" flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <PlusCircle
              className="text-primary-6 transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={saveDndToRedux}
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
          <label key={index}>
            <h2 className="text-secondary-6 pt-4">Choice {index + 1}:</h2>
            <li className="flex justify-between">
              <CustomTextarea
                value={choice}
                onChange={(e) => handleDndChoiceChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="mt-1 border-2 border-secondary-3 rounded-md text-secondary-6 font-Lato-Regular px-2 py-1 w-full"
                maxLength={50}
              />
              <Trash
                onClick={() => {
                  // Add a function to handle removing choices
                  setDndChoices(dndChoices.filter((_, i) => i !== index));
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