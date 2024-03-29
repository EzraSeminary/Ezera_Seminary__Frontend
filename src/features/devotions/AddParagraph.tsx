import { Trash } from "@phosphor-icons/react";
import { useEffect, ChangeEvent, FC, Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {
  addParagraph,
  updateParagraph,
  deleteParagraph,
} from "../../redux/devotionsSlice";

interface AddParagraphProps {
  paragraphs?: string[];
  localParagraphs: string[];
  setLocalParagraphs: Dispatch<SetStateAction<string[]>>;
}

const AddParagraph: FC<AddParagraphProps> = ({
  paragraphs,
  localParagraphs,
  setLocalParagraphs,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (paragraphs) {
      setLocalParagraphs(paragraphs);
    }
  }, [paragraphs]);

  useEffect(() => {
    localParagraphs.forEach((paragraph, index) => {
      dispatch(updateParagraph({ index, text: paragraph }));
    });
  }, [localParagraphs, dispatch]);

  const handleParaChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newParagraphs = [...localParagraphs];
    newParagraphs[index] = event.target.value;
    setLocalParagraphs(newParagraphs);
    dispatch(updateParagraph({ index, text: event.target.value }));
  };

  const addPara = () => {
    const newParagraphs = Array.isArray(localParagraphs)
      ? [...localParagraphs, ""]
      : [""];
    setLocalParagraphs(newParagraphs);
    dispatch(addParagraph());
  };

  const deletePara = (index: number) => {
    const newParagraphs = [...localParagraphs];
    newParagraphs.splice(index, 1);
    setLocalParagraphs(newParagraphs);
    dispatch(deleteParagraph(index));
  };

  return (
    <div className="space-y-3">
      {Array.isArray(localParagraphs) &&
        localParagraphs.map((para, paragraphIndex) => (
          <div
            key={paragraphIndex}
            className="flex flex-col space-y-1 text-sm text-accent-6"
          >
            <label>Paragraph {paragraphIndex + 1}</label>
            <div className="flex ">
              <textarea
                name="para"
                id={`body-${paragraphIndex}`}
                placeholder="paragraph"
                className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg text-accent-6 px-2 py-1 placeholder-accent-4"
                value={para}
                onChange={(e) => handleParaChange(e, paragraphIndex)}
                maxLength={350}
              />
              <Trash
                size={25}
                onClick={() => deletePara(paragraphIndex)}
                className=" text-gray-700 text-xl cursor-pointer self-center"
              />
            </div>
          </div>
        ))}
      <button
        type="button"
        onClick={addPara}
        className="bg-accent-6 hover:bg-accent-7 text-[#fff] px-4 py-1 rounded-full cursor-pointer"
      >
        Add Paragraph
      </button>
    </div>
  );
};

AddParagraph.propTypes = {
  paragraphs: PropTypes.array,
  localParagraphs: PropTypes.array.isRequired,
  setLocalParagraphs: PropTypes.func.isRequired,
};
export default AddParagraph;
