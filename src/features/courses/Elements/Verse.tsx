import { CustomElement, updateElement } from "@/redux/courseSlice";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { File } from "@phosphor-icons/react";
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

function Verse({
  chapterIndex,
  slideIndex,
  setCurrentElement,
  element,
}: ElementTypeProps) {
  const dispatch = useDispatch();

  const [verseReference, setVerseReference] = useState<string>(
    (element.value as string[])[0] || ""
  );
  const [verseText, setVerseText] = useState<string>(
    (element.value as string[])[1] || ""
  );

  const saveVerseToRedux = () => {
    dispatch(
      updateElement({
        chapterIndex,
        slideIndex,
        elementId: element.id,
        value: [verseReference, verseText],
      })
    );
    setCurrentElement("");
  };

  return (
    <div id={element.id}>
      <div className="flex flex-col items-center w-[100%] gap-1 py-3">
        <CustomInput
          type="text"
          value={verseReference}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setVerseReference(e.target.value)}
          placeholder="Enter verse reference"
          className="font-Lato-Regular border border-secondary-3 outline-accent-6 bg-primary-4 rounded-md p-2 w-full placeholder:text-lg"
          maxLength={100}
        />
        <CustomTextarea
          value={verseText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setVerseText(e.target.value)}
          placeholder="Enter verse text"
          className="border outline-accent-6 border-secondary-3 bg-primary-1 text-secondary-6 rounded-md font-Lato-Regular px-2 py-1 w-full placeholder:text-sm placeholder:text-secondary-3"
          maxLength={500}
        />
        <button
          onClick={saveVerseToRedux}
          className="flex gap-1 items-center text-sm text-primary-6 bg-accent-6 rounded-3xl px-2 py-1 border hover:bg-accent-7 transition-all mt-2"
        >
          <File className="text-primary-6 transition-all" size={16} weight="fill" />
          Save
        </button>
      </div>
    </div>
  );
}

export default Verse;