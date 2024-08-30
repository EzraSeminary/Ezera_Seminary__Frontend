import { AccordionElementValue, updateElement } from "@/redux/courseSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import { ElementTypeProps } from "./List";
import CustomInput from "@/components/CustomInput";
import CustomTextarea from "@/components/CustomTextarea";

function Accordion({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  // Use element.value to initialize the state, or fall back to empty arrays
  const accordionItems = element.value as AccordionElementValue[];

  const [accordionTitles, setAccordionTitles] = useState<string[]>(
    accordionItems?.map((item) => item.title) || []
  );
  const [accordionContents, setAccordionContents] = useState<string[]>(
    accordionItems?.map((item) => item.content) || []
  );

  // Accordion-related functions
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
    }
    setCurrentElement("");
  };

  return (
    <div id={element.id}>
      <div className="flex justify-between items-center gap-2 w-full py-4">
        <button
          onClick={handleAddAccordionItem}
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
          onClick={saveAccordionToRedux}
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
        {accordionTitles.map((title, index) => (
          <div key={index}>
            <div className="flex justify-between items-center">
              <h2 className="text-secondary-6 text-xl">
                Accordion {index + 1}:
              </h2>
              <Trash
                onClick={() => {
                  setAccordionTitles(
                    accordionTitles.filter((_, i) => i !== index)
                  );
                  setAccordionContents(
                    accordionContents.filter((_, i) => i !== index)
                  );
                }}
                className="text-secondary-6 hover:text-secondary-7 hover:cursor-pointer transition-all"
                weight="fill"
                size={18}
              />
            </div>
            <li className="flex flex-col mb-4 p-2 bg-secondary-2 w-full rounded-md border-secondary-4">
              <label className="text-xs text-secondary-10 border border-secondary-3 w-fit px-1 rounded-t-md">
                TITLE
              </label>
              <CustomInput
                type="text"
                value={title}
                onChange={(e) =>
                  handleAccordionTitleChange(index, e.target.value)
                }
                placeholder={`Title ${index + 1}`}
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-b-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-4"
                maxLength={50}
              />
              <label className="text-xs text-secondary-10 border border-secondary-3 w-fit px-1 mt-2 rounded-t-md">
                CONTENT
              </label>
              <CustomTextarea
                value={accordionContents[index]}
                onChange={(e) =>
                  handleAccordionContentChange(index, e.target.value)
                }
                placeholder={`Content ${index + 1}`}
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-b-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-4"
                maxLength={200}
              />
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Accordion;
