import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { DownloadSimple, PencilSimpleLine, Trash } from "@phosphor-icons/react";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import {
  selectDevotion,
  deleteDevotion,
  setIsEditing,
} from "../../redux/devotionsSlice";
import { RootState, Devotion } from "@/types/devotionTypes";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import prayerImage from "@/assets/prayerImg.png";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CurrentDevotionalProps {
  devotionToDisplay: Devotion;
  showControls: boolean;
  toogleForm: () => void;
}

Modal.setAppElement("#root");

const CurrentDevotional: React.FC<CurrentDevotionalProps> = ({
  devotionToDisplay,
  showControls,
  toogleForm,
}) => {
  const { refetch } = useGetDevotionsQuery({ page: 1, limit: 10 });
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [devotionToDelete, setDevotionToDelete] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleDelete = async (id: string) => {
    // One typescript error below to fix ❗❗❗
    // eslint-disable-next-line
    // @ts-expect-error
    await dispatch(deleteDevotion(id));
    toast.success("Devotion deleted successfully!");
    refetch();
    setModalIsOpen(false);
  };

  const startEditing = (devotion: Devotion) => {
    dispatch(selectDevotion(devotion));
    dispatch(setIsEditing(true));
    toogleForm();
  };

  const handleDownload = () => {
    if (devotionToDisplay && typeof devotionToDisplay.image === "string") {
      const imageUrl = devotionToDisplay.image;
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${devotionToDisplay.title}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
        });
    } else {
      console.error("Invalid image URL");
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="h-auto border shadow-2xl rounded-2xl px-6 pb-6  lg:p-6 md:w-[90%] mx-auto border-accent-6">
        <div className="flex flex-col justify-center lg:flex-row  lg:space-x-8">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Delete Confirmation"
            style={
              {
                /* Modal styles */
              }
            }
          >
            <h2 className="text-2xl font-Lato-black text-secondary-6 mb-2">
              Are you sure you want to delete this devotion?
            </h2>
            <div>
              <button
                onClick={() => {
                  if (devotionToDelete) {
                    handleDelete(devotionToDelete);
                  }
                }}
                style={
                  {
                    /* Button styles */
                  }
                }
              >
                Yes
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                style={
                  {
                    /* Button styles */
                  }
                }
              >
                No
              </button>
            </div>
          </Modal>

          {/* Months and days */}
          <div className="flex items-center justify-between w-full gap-5 md:gap-8 lg:gap-0 lg:block lg:w-[15%]">
            <div className="w-[35%] md:w-[25%] lg:w-full">
              {devotionToDisplay &&
              (devotionToDisplay.month !== "" ||
                devotionToDisplay.day !== "") ? (
                <div className="rounded-xl lg:w-full h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
                  <div className="w-[95%] h-[95%] mx-auto flex flex-col justify-center items-center border-2 bg-secondary-6 rounded-xl my-1 lg:leading-none py-4">
                    <p className="font-nokia-bold md:text-2xl text-[#fff]">
                      {devotionToDisplay.month}
                    </p>
                    <p className="font-nokia-bold md:text-5xl text-[#fff] md:-mt-3">
                      {devotionToDisplay.day}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="hidden rounded-xl lg:w-full h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
                  <div className="w-[90%] mx-auto h-[95%] flex flex-col justify-center items-center border-2 bg-secondary-6 rounded-xl my-1 leading-none py-6">
                    <p className="font-nokia-bold md:text-2xl text-[#fff]">
                      {devotionToDisplay?.month}
                    </p>
                    <p className="font-nokia-bold md:text-5xl text-[#fff] -mt-3">
                      {devotionToDisplay?.day}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-[60%] self-end flex-grow lg:hidden">
              <h1 className="text-2xl md:text-4xl text-secondary-6">
                {devotionToDisplay?.title}
              </h1>
              <h4 className="flex gap-2 text-sm md:text-xl text-secondary-6 w-full">
                የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል -
              </h4>
              <h2 className="text-sm md:text-xl text-accent-6">
                {devotionToDisplay?.chapter}
              </h2>
            </div>
          </div>

          {/* Devotion contents */}
          <div className="font-nokia-bold flex flex-col lg:w-[50%] space-y-2 mt-3 lg:mt-8 mx-auto">
            {/* Devotion title and controls */}
            <div className="flex w-[100%] gap-x-[1vw]">
              <h1 className="hidden lg:block lg:text-4xl xl:text-5xl text-secondary-6">
                {devotionToDisplay.title}
              </h1>
              {(role === "Admin" || "Instructor") && showControls && (
                <>
                  <Trash
                    size={28}
                    className="text-red-700 text-xl cursor-pointer self-center"
                    onClick={() => {
                      setDevotionToDelete(devotionToDisplay?._id || "");
                      setModalIsOpen(true);
                    }}
                  />
                  <PencilSimpleLine
                    size={28}
                    className="text-gray-700 text-xl cursor-pointer self-center "
                    onClick={() => startEditing(devotionToDisplay)}
                  />
                </>
              )}
            </div>

            {/* Devotion chapter */}
            <h4 className="hidden lg:flex gap-2 text-2xl xl:text-3x items-center text-secondary-6 w-full">
              የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል -{" "}
              <span className="text-lg xl:text-2xl text-accent-6">
                {devotionToDisplay.chapter}
              </span>
            </h4>

            {/* Devotion verse */}
            <p className=" text-sm md:text-lg xl:text-2xl text-accent-6">
              {devotionToDisplay.verse}
            </p>

            {devotionToDisplay.chapter !== "" && (
              <hr className="border-accent-6" />
            )}

            {/* Devotion paragraphs */}
            {devotionToDisplay.body.map((paragraph, paragraphIndex) => (
              <div
                key={paragraphIndex}
                className="font-nokia-bold text-justify text-secondary-6 space-y-3 rich-text-container"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}

            {/* Devotion prayer */}
            <div className="relative border-2 border-accent-5 rounded text-accent-5">
              <p className="font-nokia-bold text-1xl text-center px-8 py-2">
                {devotionToDisplay.prayer}
              </p>
              <div className="absolute top-[30%] md:top-[25%] lg:top-[30%] xl:top-[20%] -left-5 bg-accent-6 rounded-full w-max p-2">
                <img src={prayerImage} alt="" className="w-6" />
              </div>
            </div>
          </div>

          {/* Devotion image */}
          <div className="w-full md:w-[60%] mx-auto lg:w-[30%] h-full mt-6 lg:mt-12 border border-accent-5 rounded-xl">
            {isImageLoading && (
              <div className="flex items-center justify-center h-full my-8">
                <LoadingSpinner />
              </div>
            )}
            <img
              src={
                typeof devotionToDisplay?.image === "string"
                  ? devotionToDisplay.image
                  : undefined
              }
              alt="Devotion Image"
              className={`h-full rounded-xl p-1 object-cover ${
                isImageLoading ? "hidden" : ""
              }`}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              onLoad={handleImageLoad}
            />

            {devotionToDisplay &&
              typeof devotionToDisplay.previewUrl === "string" && (
                <img src={devotionToDisplay.previewUrl} alt="Preview" />
              )}

            <div className="flex gap-2 justify-center my-2 w-[90%] mx-auto">
              <button
                className="flex text-xs xl:text-lg w-max items-center gap-2 xl:gap-3 px-2 py-1 border border-accent-6 bg-secondary-6 rounded-xl font-nokia-bold text-primary-1"
                onClick={handleDownload}
              >
                ምስሉን አውርድ
                <DownloadSimple
                  weight="bold"
                  className="text-primary-1 animate-pulse text-sm md:text-lg lg:text-xl xl:text-2xl"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CurrentDevotional.propTypes = {
  showControls: PropTypes.bool.isRequired,
};

export default CurrentDevotional;
