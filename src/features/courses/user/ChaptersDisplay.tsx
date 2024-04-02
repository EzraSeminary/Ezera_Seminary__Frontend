import { useState, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useGetCourseByIdQuery } from "../../../services/api";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import BeatLoader from "react-spinners/BeatLoader";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  XCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import logo from "../../../assets/ezra-logo.svg";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

function ChaptersDisplay() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState<boolean>(true);
  {
    /* State to control account modal  */
  }

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0); // New state variable to track the unlocked index

  {
    /* Function to open the chapters sidebar modal */
  }
  const handleArrowClick = () => {
    setOpen((prev) => !prev);
  };

  {
    /* Ref to listen the curser and close the chapters sidebar modal */
  }
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, open, () => setOpen(false));

  const { courseId } = useParams<{ courseId: string }>();

  //get single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId as string);

  const { chapters } = courseData || {};
  const data = chapters || [];

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= data.length) {
      newIndex = data.length - 1;
    }

    if (newIndex > unlockedIndex) {
      setUnlockedIndex(newIndex); // Update the unlocked index
    }

    setActiveIndex(newIndex);
  };

  // slide number
  const currentDataNumber = activeIndex + 1;
  const totalDataNumber = data.length;

  const isSlideUnlocked = (index: number) => {
    return index <= unlockedIndex; // Check if the slide is unlocked based on the unlocked index
  };

  //progress
  // Retrieves the current user from Redux state
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const progressValue = () => {
    const userProgress = currentUser?.progress?.find(
      (p) => p.courseId === courseId
    );

    if (userProgress && userProgress.currentChapter !== undefined) {
      // the progressPercent should be calculated based on the index of chapter
      // (adding 1 because index are zero-based) and the total number of chapters
      const progressPercent =
        ((userProgress.currentChapter + 1) / totalDataNumber) * 100;
      // convert it to a fixed string to avoid too many decimals
      return progressPercent.toFixed();
    }
    return "0"; // if there's no progress, return 0
  };

  {
    /* Loading state */
  }
  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <BeatLoader
          color={"#707070"}
          loading
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  if (error) return <div>Something went wrong.</div>;

  return (
    // Chapters Section
    <>
      {/* Chapters container */}
      <div className="grid grid-cols-1  mt-16  w-[80%] mx-auto justify-center items-center h-screen relative">
        {/* Back button */}
        <div className="absolute top-3 -left-28 pl-24 flex justify-start w-full mb-2">
          <NavLink
            to={"/courses"}
            className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 hover:bg-[#FAE5C7]"
          >
            <ArrowLeft
              size={22}
              className="text-white bg-accent-6 border p-1 rounded-lg"
            />
            <button className="text-accent-6 text-xs font-nokia-bold">
              ተመለስ
            </button>
          </NavLink>
        </div>

        {/* Chapters side bar*/}
        <div
          ref={ref}
          className={`absolute left-0 top-[10%]  lg:left-[4%] lg:top-[10%] flex flex-col justify-start items-center ${
            open ? "w-[80%] md:w-[50%] lg:w-[30%] z-40 h-[80%]" : "w-0 h-0"
          }`}
          style={{ transition: "width 0.3s" }}
        >
          {open ? (
            <ArrowLeft
              onClick={handleArrowClick}
              className="text-white text-2xl xl:text-3xl bg-accent-6 border p-1 rounded-full absolute -right-2 md:-right-3 lg:-right-2 xl:-right-3 top-14 cursor-pointer"
            />
          ) : (
            <ArrowRight
              onClick={handleArrowClick}
              className="text-white text-2xl xl:text-3xl  bg-accent-6 border p-1 rounded-full absolute -right-3 xl:-right-4 top-14 cursor-pointer"
            />
          )}

          {/* Bible image container*/}
          <div className="w-[100%]">
            <img
              src={
                `http://ezra-seminary.mybese.tech/images/` + courseData?.image
              }
              alt=""
              className="w-full rounded-t-lg"
            />
          </div>

          {/* Short information*/}
          <div
            className={`  pl-2 py-1 bg-primary-7  gap-2 justify-between items-center  w-full text-xs1  lg:text-xs ${
              open ? "flex" : "hidden"
            }`}
          >
            <div className="p-1 bg-accent-6 rounded">
              <p className="font-Lato-Bold text-primary-1 ">
                {progressValue()}%
              </p>
            </div>
            <p className="font-Lato-Bold text-secondary-6 leading-none">
              Pass 100% of your lessons to complete this course
            </p>
          </div>

          {/* Course title and description*/}
          <div className="w-[100%] overflow-y-auto bg-white opacity-85 pb-3 rounded-b-lg h-full ">
            <h1 className="text-secondary-6 font-nokia-bold text-xs lg:text-sm xl:text-lg  text-center mt-2 mb-1 xl:mt-3 xl:mb-2 ">
              {courseData?.title}
            </h1>
            <hr className="border-accent-5 border w-[90%] mx-auto" />
            <p className="text-secondary-5 text-xs1 font-nokia-Regular xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[90%] mx-auto leading-tight lg:text-xs ">
              {courseData?.description}
            </p>

            {/* Header */}
            <div className="flex flex-col mt-2 border-accent-5 border-b  w-[95%] mx-auto">
              <h1 className="font-nokia-bold text-secondary-6 pb-1 text-xs lg:text-sm">
                ትምህርቶች {currentDataNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border-b-2 w-[30%] " />
            </div>

            {/* Chapters */}
            <div className="flex flex-col px-2 pt-2 gap-2 md:px-3">
              {data.map((chapter, index) => {
                const unlocked = isSlideUnlocked(index);
                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 text-secondary-6 cursor-pointer py-2 rounded-lg bg-gray-200 hover:bg-[#FAE5C7] hover:opacity-80  ${
                      unlocked ? "text-black  " : "text-gray-500 "
                    }  ${index === activeIndex && "font-bold"}
                    `} // Locked slide to gray
                    onClick={() => {
                      updateIndex(index);
                      handleArrowClick();
                    }}
                  >
                    <div className="flex flex-col items-start justify-center">
                      <h2 className="font-nokia-bold text-secondary-6 text-xs lg:text-sm">
                        {chapter.chapter}
                        {/* <Text>ID</Text> {courseId} */}
                      </h2>
                      <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-xs">
                        {index + 1}/{totalDataNumber} Chapters
                      </p>
                    </div>
                    {unlocked ? (
                      <CheckCircle size={16} weight="fill" color={"#EA9215"} />
                    ) : (
                      <Circle size={16} color={"#EA9215"} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chapter display window*/}
        <div className=" lg:w-[92%] justify-start items-center mx-auto h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg ">
          {/* Chapter display container */}
          <div className="flex flex-col justify-between h-full">
            {/* Header */}
            <div>
              <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                <div className=" z-30 h-full flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
                  <img
                    src={logo}
                    className="w-8 h-5 md:w-10 md:h-6  z-30"
                    alt=""
                  />

                  <h3 className="text-white font-nokia-bold text-xs md:text-sm ">
                    <strong>Ezra</strong> Seminary
                  </h3>
                </div>
                <NavLink to={"/courses"}>
                  <XCircle
                    size={24}
                    color={"white"}
                    className="z-20 cursor-pointer"
                  />
                </NavLink>
              </div>
              <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
            </div>

            {/* Chapter content */}
            {data.map((chapter, index) => {
              if (index === activeIndex) {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center h-52 flex-grow"
                  >
                    <h1 className="text-lg lg:text-xl text-[#fff] text-center font-nokia-bold">
                      {chapter.chapter}
                    </h1>
                    <button className="text-white text-center font-nokia-bold  py-1 px-2 bg-accent-6 hover:bg-accent-7 w-auto lg:px-4 lg:py-2  rounded-3xl mx-auto lg:mt-2 text-xs1 lg:text-sm ">
                      <NavLink
                        to={`/courses/get/${courseId}/chapter/${chapter._id}`}
                      >
                        ትምህርቱን ጀምር
                      </NavLink>
                    </button>
                  </div>
                );
              } else {
                return null; // Hide the chapter if it doesn't match the activeIndex
              }
            })}

            {/* Footer */}
            <div>
              <hr className="border-accent-5 border-1 w-[90%] mx-auto mb-8" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChaptersDisplay;
