import { CustomElement, updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { File, PlusCircle, Trash } from "@phosphor-icons/react";
import CustomInput from "@/components/CustomInput";
import CustomTextarea from "@/components/CustomTextarea";

export interface ElementTypeProps {
  chapterIndex: number;
  slideIndex: number;
  setCurrentElement: React.Dispatch<
    React.SetStateAction<string | null | string[] | boolean>
  >;
  element: CustomElement;
}

function List({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const [listItems, setListItems] = useState<string[]>([]);
  const [currentListItem, setCurrentListItem] = useState<string>("");

  // List related functions
  const handleListInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentListItem(event.target.value);
  };

  const handleAddListItem = () => {
    if (currentListItem) {
      setListItems([...listItems, currentListItem]);
      setCurrentListItem("");
    }
  };

  const handleListItemChange = (index: number, text: string) => {
    setListItems(listItems.map((item, i) => (i === index ? text : item)));
  };

  const saveListElementToRedux = () => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: element.id,
        value: listItems,
      })
    );
    // setListItems([]); // reset the data in the CustomInput
    setCurrentElement(""); // reset the current element to avoid form re-rendering
  };

  const handleDeleteListItem = (indexToDelete: number) => {
    const updatedList = listItems.filter((_, index) => index !== indexToDelete);
    setListItems(updatedList);
  };
  return (
    <div id={element.id}>
      <div className="flex flex-col items-center w-[100%] gap-1 py-3">
        <CustomInput
          type="text"
          value={currentListItem}
          onChange={handleListInputChange}
          placeholder="Enter list item"
          className="font-Lato-Regular border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
        />

        <div className="flex justify-between items-center gap-2 mt-2 w-[80%] mx-auto">
          <button
            onClick={handleAddListItem}
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
            onClick={saveListElementToRedux}
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
      <ul className="pt-4 w-[100%] cursor-pointer overflow-y-auto">
        {listItems.map((item, index) => (
          <label>
            <h2 className="text-secondary-6 py-3">List {index + 1}:</h2>
            <div key={index} className="flex justify-between">
              <CustomTextarea
                value={item}
                onChange={(e) => handleListItemChange(index, e.target.value)}
                className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
              />
              <Trash
                onClick={() => handleDeleteListItem(index)}
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

export default List;
