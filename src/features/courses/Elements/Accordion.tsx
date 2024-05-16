import { updateElement } from "@/redux/courseSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";

function Accordion({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const [accordionTitles, setAccordionTitles] = useState<string[]>([]);
  const [accordionContents, setAccordionContents] = useState<string[]>([]);

  // Accordion related functions
  const handleAccordionTitleChange = (index: number, text: string) => {
    setAccordionTitles(
      accordionTitles.map((title, i) => (i === index ? text : title))
    );
  };

  const handleAccordionContentChange = (index: number, text: string) => {
    setAccordionContents(
      accordionContents.map((content, i) => (i === index ? text : content))
    );
  };

  const handleAddAccordionItem = () => {
    setAccordionTitles([...accordionTitles, ""]);
    setAccordionContents([...accordionContents, ""]);
  };

  const saveAccordionToRedux = () => {
    if (accordionTitles.length > 0 && accordionContents.length > 0) {
      const accordionItems = accordionTitles.map((title, index) => ({
        title,
        content: accordionContents[index],
      }));

      dispatch(
        updateElement({
          chapterIndex,
          slideIndex,
          elementId: element.id,
          value: accordionItems,
        })
      );

      // Reset accordion state
      // setAccordionTitles([]);
      // setAccordionContents([]);
    }
    setCurrentElement("");
  };
  return (
    <div id={element.id}>
      <div className="flex justify-between items-center gap-2 w-full py-4">
        <button
          onClick={handleAddAccordionItem}
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
          onClick={saveAccordionToRedux}
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
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {accordionTitles.map((title, index) => (
          <label className="text-accent-6 ">
            Accordion Item {index + 1}:
            <li key={index} className="flex flex-col space-y-2 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) =>
                  handleAccordionTitleChange(index, e.target.value)
                }
                placeholder={`Title ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <textarea
                value={accordionContents[index]}
                onChange={(e) =>
                  handleAccordionContentChange(index, e.target.value)
                }
                placeholder={`Content ${index + 1}`}
                className="mt-1  border outline-accent-6 border-accent-5 bg-primary-4 text-secondary-6 rounded-md  font-bold px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <Trash
                onClick={() => {
                  setAccordionTitles(
                    accordionTitles.filter((_, i) => i !== index)
                  );
                  setAccordionContents(
                    accordionContents.filter((_, i) => i !== index)
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

export default Accordion;
