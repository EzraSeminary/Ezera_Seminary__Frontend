import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateElement,
  deleteElement,
  selectChapters,
  Chapter,
  addElementToSlide,
} from "@/redux/courseSlice";
import { Trash } from "@phosphor-icons/react";
// import CustomTextarea from "@/components/CustomTextarea";
import CustomInput from "@/components/CustomInput";
import List from "../../Elements/List";
import Slide from "../../Elements/Slide";
import Quiz from "../../Elements/Quiz";
import Accordion from "../../Elements/Accordion";
import Sequence from "../../Elements/Sequence";
import Reveal from "../../Elements/Reveal";
import DragAndDrop from "../../Elements/DragAndDrop";
import ScrollMix from "../../Elements/ScrollMix";
import RichTextEditor from "../../Elements/RichTextEditor";

interface EditElementsProps {
  chapterIndex: number;
  slideIndex: number;
  setCurrentElement: React.Dispatch<
    React.SetStateAction<string | null | string[] | boolean>
  >;
}

function EditElements({
  chapterIndex,
  slideIndex,
  setCurrentElement,
}: EditElementsProps) {
  const dispatch = useDispatch();

  // new state for the dropdown
  const [newElementType, setNewElementType] = useState<
    string | null | string[] | boolean
  >("");

  const chapters = useSelector(selectChapters) as Chapter[];
  const elements = chapters[chapterIndex]?.slides[slideIndex]?.elements || [];

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

  const handleDeleteButtonClick = (elementId: string) => {
    dispatch(
      deleteElement({
        chapterIndex,
        slideIndex,
        elementId,
      })
    );
  };

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewElementType(e.target.value);
  };

  const handleAddButtonClick = (chapterIndex: number, slideIndex: number) => {
    if (
      (newElementType && newElementType === "title") ||
      newElementType === "sub" ||
      newElementType === "text" ||
      newElementType === "video"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: newElementType,
          value: "",
        })
      );
      setNewElementType("");
    } else if (
      (newElementType && newElementType === "img") ||
      newElementType === "audio"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: newElementType,
          value: null,
        })
      );
      setNewElementType(null);
    } else if (
      (newElementType && newElementType === "list") ||
      newElementType === "slide" ||
      newElementType === "quiz" ||
      newElementType === "accordion" ||
      newElementType === "sequence" ||
      newElementType === "reveal" ||
      newElementType === "dnd" ||
      newElementType === "mix"
    ) {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: newElementType,
          value: [],
        })
      );
      setNewElementType([]);
    } else if (newElementType && newElementType === "range") {
      dispatch(
        addElementToSlide({
          chapterIndex,
          slideIndex,
          elementType: newElementType,
          value: false,
        })
      );
      setNewElementType(false);
    }
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
      case "mix":
        return "Scroll Mix";
      case "audio":
        return "Audio";
      case "video":
        return "Video";
      default:
        return "";
    }
  };

  return (
    <div
      key={uniqueKey}
      className="bg-secondary-1 w-full h-full overflow-y-auto px-4 border border-secondary-3"
    >
      {elements.map((element, index) => {
        let elementComponent;
        if (element.type === "title" || element.type === "sub") {
          elementComponent = (
            <CustomInput
              id={element.id}
              placeholder={`Enter ${element.type}`}
              value={element.value?.toString()}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
              maxLength={50}
            />
          );
        } else if (element.type === "text") {
          elementComponent = (
            // <CustomTextarea
            //   id={element.id}
            //   placeholder={`Enter ${element.type}`}
            //   value={element.value?.toString()}
            //   onChange={(e) => handleInputChange(element.id, e.target.value)}
            //   className="w-[100%] h-[30vh] font-Lato-Regular text-sm border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
            //   maxLength={700}
            // />
            <RichTextEditor 
            key={index} 
            setRichTextData={(content) => handleInputChange(element.id, content)} 
            initialValue={element.value as string} 
          />
          );
        } else if (element.type === "img") {
          elementComponent = (
            <div className="bg-white flex flex-col my-3 border-2 border-secondary-3 rounded-md hover:border-accent-5">
              <input
                type="file"
                id={element.id}
                onChange={(e) => handleFileInputChange(e, element.id)}
                className="w-[100%]
                file:rounded-md text-sm
                file:text-lg  text-secondary-6 font-bold p-2
                file:font-nokia-bold
                rounded-xs bg-transparent hover:text-secondary-5
                focus:outline-none focus:border-accent-8 cursor-pointer"
              />
              {imagePreviewUrl && (
                <img
                  key={element.type}
                  src={imagePreviewUrl}
                  alt=""
                  className="rounded-b-md w-[20vw] m-auto"
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
          elementComponent = null;
        } else if (element.type === "dnd") {
          elementComponent = (
            <DragAndDrop
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "mix") {
          elementComponent = (
            <ScrollMix
              key={index}
              chapterIndex={chapterIndex}
              slideIndex={slideIndex}
              setCurrentElement={setCurrentElement}
              element={element}
            />
          );
        } else if (element.type === "audio") {
          elementComponent = (
            <input
              type="file"
              id={element.id}
              onChange={(e) => handleFileInputChange(e, element.id)}
              className="w-[100%]
                file:rounded-md text-sm
                file:text-lg  text-secondary-6 font-bold p-2
                file:font-nokia-bold
                rounded-xs bg-transparent hover:text-secondary-5
                focus:outline-none focus:border-accent-8 cursor-pointer"
            />
          );
        } else if (element.type === "video") {
          elementComponent = (
            <CustomInput
              id={element.id}
              placeholder="Add video Link here"
              value={element.value?.toString()}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
              maxLength={50}
            />
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

      {/* add a new element with dropdown */}
      <div className="flex justify-between pb-4">
        <select
          name="elements"
          id="elements"
          value={newElementType as string}
          onChange={handleDropdownChange}
          className="w-[90%] mx-auto border-2 border-accent-6 bg-primary-6 rounded-md mr-2 py-1 px-2 cursor-pointer"
        >
          <option value="" disabled>
            Choose Type
          </option>
          <option value="title">Title</option>
          <option value="sub">Sub-title</option>
          <option value="text">Paragraph</option>
          <option value="slide">Slide</option>
          <option value="img">Image</option>
          <option value="quiz">Quiz</option>
          <option value="list">List</option>
          <option value="accordion">Accordion</option>
          <option value="sequence">Sequence</option>
          <option value="reveal">Reveal</option>
          <option value="range">Range</option>
          <option value="dnd">Missing Words</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
        <button
          onClick={() => handleAddButtonClick(chapterIndex, slideIndex)}
          className="px-2 font-semibold text-white bg-accent-6 rounded-md hover:bg-accent-7"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default EditElements;
