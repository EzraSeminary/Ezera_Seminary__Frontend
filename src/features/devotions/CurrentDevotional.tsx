import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  selectDevotion,
  deleteDevotion,
  setIsEditing,
} from "../../redux/devotionsSlice";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { RootState, Devotion } from "@/redux/types";

interface CurrentDevotionalProps {
  devotionToDisplay: Devotion;
  showControls: boolean;
}

const CurrentDevotional: React.FC<CurrentDevotionalProps> = ({
  devotionToDisplay,
  showControls,
}) => {
  const { refetch } = useGetDevotionsQuery({}); // get the authentication token
  const role = useSelector((state: RootState) => state.auth.user?.role); // get the authentication token
  const dispatch = useDispatch();

  const handleDelete = async (id: string) => {
    await dispatch(deleteDevotion(id)); // dispatch delete action
    refetch(); // refetch the devotions data
  };

  const startEditing = (devotion: Devotion) => {
    dispatch(selectDevotion(devotion)); // dispatch select action
    dispatch(setIsEditing(true)); // dispatch startEditing action
  };

  return (
    <div className="h-auto border-2 shadow-lg rounded-2xl p-6">
      <div>
        <h1 className="font-nokia-bold  md:text-xl text-accent-5 ">
          Daily Devotional
        </h1>
      </div>
      <div className="flex flex-col justify-center md:flex-row  md:space-x-12">
        {/* Replace latestDevotion with devotionToDisplay */}
        {devotionToDisplay &&
        (devotionToDisplay.month !== "" || devotionToDisplay.day !== "") ? (
          <div className="rounded-xl md:w-[20%] h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
            <div className="w-[95%] h-[95%] mx-auto  flex flex-col justify-center items-center border-2 bg-secondary-6  rounded-xl my-1 leading-none  py-6">
              <p className=" font-nokia-bold md:text-xl text-[#fff]">
                {devotionToDisplay.month}
              </p>
              <p className="md:text-3xl font-nokia-bold text-[#fff]">
                {devotionToDisplay.day}
              </p>
            </div>
          </div>
        ) : (
          <div className="hidden rounded-xl md:w-[20%] h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
            <div className="w-[90%] mx-auto h-[95%] flex flex-col justify-center items-center border-2 bg-secondary-6   rounded-xl my-1 leading-none py-6">
              <p className="font-nokia-bold md:text-xl text-[#fff]">
                {devotionToDisplay && devotionToDisplay.month}
              </p>
              <p className="font-nokia-bold md:text-3xl text-[#fff]">
                {devotionToDisplay && devotionToDisplay.day}
              </p>
            </div>
          </div>
        )}

        {/* devotion contents */}
        <div className="font-nokia-bold flex flex-col w-[90%] md:w-[50%] space-y-2 mt-8 mx-auto">

          {/* devotion titles */}
          <div className="flex width: 100% space-x-12">
            <h1 className="md:text-2xl text-justify text-secondary-6">
              {devotionToDisplay && devotionToDisplay.title}
            </h1>
            {role === "Admin" && showControls && (
              <>
                <FaTrash
                  className="text-gray-700 md:text-sm cursor-pointer self-center"
                  onClick={() =>
                    handleDelete(devotionToDisplay && devotionToDisplay._id)
                  }
                />
                <FaEdit
                  className="text-gray-700 md:text-xl cursor-pointer self-center "
                  onClick={() => startEditing(devotionToDisplay)}
                />
              </>
            )}
          </div>

          {/* devotion chapter */}
         
          <h4 className="flex gap-2 text-1xl text-secondary-6 w-full">የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል- 
            <span>
              <h2 className=" text-sm text-accent-5">
                {devotionToDisplay && devotionToDisplay.chapter}
              </h2>
            </span>
          </h4>

          {/* devotion verse */}
          <p className=" text-xs text-accent-5">
            {devotionToDisplay && devotionToDisplay.verse}
          </p>

          {devotionToDisplay && devotionToDisplay.chapter !== "" ? (
            <hr className="border-accent-5" />
          ) : (
            <hr className="hidden border-secondary-6" />
          )}

          {/* devotion paragraphs */}
          {devotionToDisplay &&
            devotionToDisplay.body.map((paragraph, paragraphIndex) => (
              <p
                className=" font-nokia-bold text-xs leading-6 tracking-wide text-justify text-secondary-6 space-y-3"
                key={paragraphIndex}
              >
                {paragraph}
              </p>
            ))}

          {/* devotion prayer */}
          {devotionToDisplay && devotionToDisplay.prayer !== "" ? (
            <p className="font-nokia-bold md:text-xs text-center border-2 border-accent-5 p-2 rounded text-accent-5">
              {devotionToDisplay.prayer}
            </p>
          ) : (
            <p className="hidden font-nokia-bold md:text-1xl text-center border-2 border-accent-5 p-2 rounded text-accent-5">
              {devotionToDisplay && devotionToDisplay.prayer}
            </p>
          )}
        </div>

        {/* devotion image */}
        <div className="w-full md:w-[25%] h-full mt-12">
          <img
            src={`https://ezra-seminary.mybese.tech/images/${
              devotionToDisplay && devotionToDisplay.image
            }`}
            alt="Devotion Image"
            className="h-full"
          />

          {devotionToDisplay && devotionToDisplay.previewUrl && (
            <img src={devotionToDisplay.previewUrl} alt="Preview" />
          )}

          {devotionToDisplay && devotionToDisplay.previewUrl !== "" ? (
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

CurrentDevotional.propTypes = {
  devotionToDisplay: PropTypes.object.isRequired,
  showControls: PropTypes.bool.isRequired,
};

export default CurrentDevotional;
