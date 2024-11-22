import { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateElement,
  deleteElement,
  CourseState,
} from "../../../../redux/courseSlice";
import { Trash } from "@phosphor-icons/react";
import List from "../../Elements/List";
import Verse from "../../Elements/Verse";
import Slide from "../../Elements/Slide";
import Quiz from "../../Elements/Quiz";
import Accordion from "../../Elements/Accordion";
import Sequence from "../../Elements/Sequence";
import Reveal from "../../Elements/Reveal";
import DragAndDrop from "../../Elements/DragAndDrop";
import RichTextEditor from "../../Elements/RichTextEditor";
import ScrollMix from "../../Elements/ScrollMix";
import CustomInput from "@/components/CustomInput";
import imageCompression from 'browser-image-compression';
// import CustomTextarea from "@/components/CustomTextarea";

export interface ElementsAddProps {
  chapterIndex: number;
  slideIndex: number;
  setCurrentElement: React.Dispatch<
    React.SetStateAction<string | null | string[] | boolean>
  >;
}

function ElementsAdd({
  chapterIndex,
  slideIndex,
  setCurrentElement,
}: ElementsAddProps) {
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

  // Now, the imagePreviewUrl is stored in the component's local state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileInputChange = async (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: "image/webp",
          };

          const compressedFile = await imageCompression(file, options);
          const compressedFileUrl = await imageCompression.getDataUrlFromFile(
            compressedFile
          );

          setImagePreviewUrl(compressedFileUrl);

          dispatch(
            updateElement({
              chapterIndex,
              slideIndex,
              elementId: id,
              value: compressedFileUrl,
            })
          );
        } catch (error) {
          console.error("Image compression error:", error);
        }
      }
    }
  };

  const uniqueKey = `${chapterIndex}-${slideIndex}`;

  const handleDeleteButtonClick = (id: string) => {
    dispatch(
      deleteElement({
        chapterIndex,
        slideIndex,
        elementId: id,
      })
    );
  };

  // ... rest of the component remains the same


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
      case "verse":
        return "Add Verse";
      case "main-verse":
        return "Add Main Verse";
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
        } else if (element.type === "verse" || element.type === "main-verse") {
          elementComponent = (
            <Verse
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
    </div>
  );
}

export default ElementsAdd;
