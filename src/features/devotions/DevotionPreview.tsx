import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  selectForm,
  selectParagraphs,
  selectPreviewUrl,
} from "../../redux/devotionsSlice";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DevotionPreview = () => {
  // add as a prop if it's passed from a parent component
  const form = useSelector(selectForm);
  const paragraphs = useSelector(selectParagraphs);
  const previewUrl = useSelector(selectPreviewUrl);
  // const devotionToDisplay = useSelector(selectDevotionToDisplay); // add this line if devotionToDisplay is from Redux

  return (
    <div className="h-auto border-2 shadow-lg rounded-2xl p-6 w-[80%]">
      <div>
        <h1 className="font-nokia-bold  text-3xl text-accent-5 ">
          Daily Devotional
        </h1>
      </div>
      <div className="flex space-x-12">
        {/* Replace latestDevotion with devotionToDisplay */}
        {form && (form.month !== "" || form.day !== "") ? (
          <div className="rounded-xl w-[20%] h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
            <div className="w-[95%] h-[95%] mx-auto  flex flex-col justify-center items-center border-2 bg-secondary-6  rounded-xl my-1 leading-none  py-6">
              <p className=" font-nokia-bold text-3xl text-[#fff]">
                {form.month}
              </p>
              <p className="text-5xl font-nokia-bold text-[#fff]">{form.day}</p>
            </div>
          </div>
        ) : (
          <div className="hidden rounded-xl w-[20%] h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
            <div className="w-[90%] mx-auto h-[95%] flex flex-col justify-center items-center border-2 bg-secondary-6   rounded-xl my-1 leading-none py-6">
              <p className="font-nokia-bold text-3xl text-[#fff]">
                {form && form.month}
              </p>
              <p className="font-nokia-bold text-5xl text-[#fff]">
                {form && form.day}
              </p>
            </div>
          </div>
        )}

        <div className="font-nokia-bold flex flex-col w-[50%] space-y-2 mt-8">
          <div className="flex width: 100% space-x-12">
            <h1 className="text-4xl text-justify text-secondary-6">
              {form && form.title}
            </h1>
          </div>
          <h2 className=" text-lg text-accent-5">የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል - {form && form.chapter}</h2>

          {form && form.chapter !== "" ? (
            <hr className="border-accent-5" />
          ) : (
            <hr className="hidden border-secondary-6" />
          )}

          <p className=" text-1xl text-secondary-6">{form && form.verse}</p>

          {paragraphs.map((paragraph, paragraphIndex) => (
            <div
              key={paragraphIndex}
              className="font-nokia-bold text-sm text-justify text-secondary-6 space-y-3"
              dangerouslySetInnerHTML={{ __html: paragraph }} // Render the rich text safely
            />
          ))}

          {form && form.prayer !== "" ? (
            <p className="font-nokia-bold text-1xl text-center border-2 border-accent-5 p-2 rounded text-accent-5">
              {form.prayer}
            </p>
          ) : (
            <p className="hidden font-nokia-bold text-1xl text-center border-2 border-accent-5 p-2 rounded text-accent-5">
              {form && form.prayer}
            </p>
          )}
        </div>
        <div className="w-[25%] mt-12 flex flex-col space-y-6">
          {previewUrl && typeof previewUrl === "string" && (
            <img src={previewUrl} alt="Preview" />
          )}
          {previewUrl !== "" ? (
            <img src="../../assets/Advert-Image.svg" alt="" />
          ) : (
            <img
              src="../../assets/Advert-Image.svg"
              alt=""
              className="hidden"
            />
          )}
        </div>
      </div>
    </div>
  );
};

DevotionPreview.propTypes = {
  devotionToDisplay: PropTypes.object,
};

export default DevotionPreview;
