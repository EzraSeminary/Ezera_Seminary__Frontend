import { FaTrash, FaEdit } from "react-icons/fa";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteDevotion,
  startEditing,
  selectForm,
  selectParagraphs,
  selectPreviewUrl,
  selectDevotionToDisplay, // import the selector if devotionToDisplay is from Redux
} from "../../redux/devotionsSlice";

const DevotionPreview = ({ devotionToDisplay }) => {
  // add as a prop if it's passed from a parent component
  const dispatch = useDispatch();
  const form = useSelector(selectForm);
  const paragraphs = useSelector(selectParagraphs);
  const previewUrl = useSelector(selectPreviewUrl);
  devotionToDisplay = useSelector(selectDevotionToDisplay); // add this line if devotionToDisplay is from Redux

  const handleDelete = (id) => {
    dispatch(deleteDevotion(id));
  };

  // const handleStartEditing = (devotion) => {
  //   dispatch(startEditing(devotion));
  // };

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

            {form && form.title !== "" ? (
              <>
                <FaTrash
                  className="text-gray-700 text-xl cursor-pointer self-center"
                  onClick={() =>
                    handleDelete(devotionToDisplay && devotionToDisplay._id)
                  }
                />
                <FaEdit
                  className="text-gray-700 text-xl cursor-pointer self-center"
                  onClick={() => startEditing(devotionToDisplay)}
                />
              </>
            ) : (
              <>
                <FaTrash
                  className="hidden text-gray-700 text-xl cursor-pointer self-center"
                  onClick={() =>
                    handleDelete(devotionToDisplay && devotionToDisplay._id)
                  }
                />
                <FaEdit
                  className="hidden text-gray-700 text-xl cursor-pointer self-center"
                  onClick={() => startEditing(devotionToDisplay)}
                />
              </>
            )}
          </div>
          <h2 className=" text-lg text-accent-5">{form && form.chapter}</h2>

          {form && form.chapter !== "" ? (
            <hr className="border-accent-5" />
          ) : (
            <hr className="hidden border-secondary-6" />
          )}

          <p className=" text-1xl text-secondary-6">{form && form.verse}</p>

          {paragraphs.map((paragraph, paragraphIndex) => (
            <p
              className=" font-nokia-bold text-sm text-justify text-secondary-6 space-y-3"
              key={paragraphIndex}
            >
              {paragraph}
            </p>
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
          {previewUrl && <img src={previewUrl} alt="Preview" />}
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
