import { updateElement } from "@/redux/courseSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";

function Reveal({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const [revealTitles, setRevealTitles] = useState<string[]>([]);
  const [revealContents, setRevealContents] = useState<string[]>([]);

  // Reveal Related Functions
  const handleRevealTitleChange = (index: number, text: string) => {
    setRevealTitles(
      revealTitles.map((title, i) => (i === index ? text : title))
    );
  };

  const handleRevealContentChange = (index: number, text: string) => {
    setRevealContents(
      revealContents.map((content, i) => (i === index ? text : content))
    );
  };

  const handleAddRevealItem = () => {
    setRevealTitles([...revealTitles, ""]);
    setRevealContents([...revealContents, ""]);
  };

  const saveRevealToRedux = () => {
    if (revealTitles.length > 0 && revealContents.length > 0) {
      const revealItems = revealTitles.map((title, index) => ({
        title,
        content: revealContents[index],
      }));

      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: element.id,
          value: revealItems,
        })
      );

      // Reset state
      // setRevealTitles([]);
      // setRevealContents([]);
    }
    setCurrentElement("");
  };

  return (
    <div id={element.id}>
      <div className="flex justify-between items-center gap-2 w-full py-4">
        <button
          onClick={handleAddRevealItem}
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
          onClick={saveRevealToRedux}
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
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {revealTitles.map((title, index) => (
          <label className="text-accent-6 ">
            Reveal Item {index + 1}:
            <li key={index} className="flex flex-col space-y-2 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => handleRevealTitleChange(index, e.target.value)}
                placeholder={`Title ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <textarea
                value={revealContents[index]}
                onChange={(e) =>
                  handleRevealContentChange(index, e.target.value)
                }
                placeholder={`Content ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <Trash
                onClick={() => {
                  setRevealTitles(revealTitles.filter((_, i) => i !== index));
                  setRevealContents(
                    revealContents.filter((_, i) => i !== index)
                  );
                }}
                className="text-red-600 hover:text-red-700 hover:cursor-pointer transition-all mt-1 self-end"
                weight="fill"
                size={22}
              />
            </li>
          </label>
        ))}
      </ul>
    </div>
  );
}

export default Reveal;
