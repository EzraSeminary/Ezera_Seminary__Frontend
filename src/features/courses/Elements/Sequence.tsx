import { updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";
import CustomTextarea from "@/components/CustomTextarea";

function Sequence({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  // Initialize sequenceItems with element.value or an empty array
  const [sequenceItems, setSequenceItems] = useState<string[]>(() => {
    return (element.value as string[]) || [];
  });

  const [currentSequenceItem, setCurrentSequenceItem] = useState<string>("");

  // populate sequenceItems with element.value, if element.value exists and if sequenceItems is empty.
  useEffect(() => {
    if (element.value && sequenceItems.length === 0) {
      setSequenceItems(element.value as string[]);
    }
  }, [element.value, sequenceItems.length]);

  // Sequence Related Functions.
  const handleSequenceInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentSequenceItem(event.target.value);
  };

  const handleAddSequenceItem = () => {
    if (currentSequenceItem) {
      setSequenceItems([...sequenceItems, currentSequenceItem]);
      setCurrentSequenceItem("");
    }
  };

  const handleSequenceItemChange = (index: number, text: string) => {
    setSequenceItems(
      sequenceItems.map((item, i) => (i === index ? text : item))
    );
  };

  const handleAddSequenceElement = () => {
    if (sequenceItems.length > 0) {
      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: element.id,
          value: sequenceItems,
        })
      );
    }
    setCurrentElement("");
  };

  const handleDeleteSequenceItem = (indexToDelete: number) => {
    const updatedSequence = sequenceItems.filter(
      (_, index) => index !== indexToDelete
    );
    setSequenceItems(updatedSequence);
  };

  return (
    <div id={element.id}>
      <div className="flex flex-col items-center w-[100%] gap-1 py-3">
        <CustomTextarea
          value={currentSequenceItem}
          onChange={handleSequenceInputChange}
          placeholder="Enter sequence item"
          className="font-Lato-Regular border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
          maxLength={100}
        />

        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddSequenceItem}
            className="flex gap-1 text-sm items-center text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <PlusCircle
              className="text-primary-6 transition-all"
              size={16}
              weight="fill"
            />
            Add
          </button>
          <button
            onClick={handleAddSequenceElement}
            className="flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all"
          >
            <File
              className="text-primary-6 transition-all"
              size={16}
              weight="fill"
            />
            Save
          </button>
        </div>
      </div>
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {sequenceItems.map((item, index) => (
          <label key={index}>
            <h2 className="text-secondary-6 py-3">Sequence {index + 1}:</h2>
            <div className="flex justify-between">
              <CustomTextarea
                value={item}
                onChange={(e) =>
                  handleSequenceItemChange(index, e.target.value)
                }
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
                maxLength={100}
              />
              <Trash
                onClick={() => handleDeleteSequenceItem(index)}
                className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                weight="fill"
                size={18}
              />
            </div>
          </label>
        ))}
      </ul>
    </div>
  );
}

export default Sequence;