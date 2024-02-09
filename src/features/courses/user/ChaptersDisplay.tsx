import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useGetCourseByIdQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ArrowLeft } from "@phosphor-icons/react";
import bibleImage from "../../../assets/bible2.jpeg";

interface Chapter {
  _id: string;
  chapter: string;
}

interface CourseData {
  chapters: Chapter[];
}

function ChaptersDisplay() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0); // New state variable to track the unlocked index

  const { courseId } = useParams<{ courseId: string }>();

  //get single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId, {
    skip: !courseId, // Skip the query if courseId is not available yet
  });

  const { chapters }: CourseData = courseData || {};
  const data: Chapter[] = chapters || [];

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

  {/* Loading state */ }
  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
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
      {/* <NavLink
        to={"/courses"}
        className="font-Lato-Black border-4 border-accent-5 rounded-lg p-1.5 ml-2 hover:bg-[#FAE5C7]"
      >
        Back
      </NavLink> */}


      {/* <div className=" w-[80%] mx-auto"> */}

      {/* Container */}
      <div className="flex flex-col mt-12 md:flex-row w-[80%] mx-auto justify-center items-center h-screen ">
        {/* Back button */}
        <div className="flex justify-start w-full mb-2">
          <NavLink
            to={"/courses"}
            className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 hover:bg-[#FAE5C7]"
          >
            <ArrowLeft size={22} className="text-white bg-accent-6 border p-1 rounded-lg" />
            <button className="text-accent-6 text-xs font-nokia-bold">ተመለስ</button>
          </NavLink>
        </div>

        {/* Chapters side bar*/}
        <div className="flex flex-col justify-start items-center md:w-[30%] h-[80%] overflow-y-auto shadow-2xl rounded-lg border-2 border-accent-5 pb-6">

          {/* Bible image container*/}
          <div className=" ">
            <img src={bibleImage} alt="Bible image" className="w-full" />
          </div>

          {/* Short information*/}
          <div className="flex  pl-2 py-1 bg-primary-7  gap-2 justify-between items-center">
            <div className="p-1 bg-accent-6 rounded">
              <p className="font-nokia-bold text-primary-1 text-xs">10%</p>
            </div>
            <p className="font-nokia-bold text-secondary-6 text-xs leading-none">Pass 100% of your lessons to complete this course</p>
          </div>

          {/* Course title and description*/}
          <div className=" mx-auto w-[90%]">
            <h1 className="text-secondary-6 font-nokia-bold text-sm xl:text-lg  text-center  my-2 ">
              {courseData?.title}
            </h1>
            <hr className="border-accent-5 border w-[100%] " />
            <p className="text-secondary-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[95%] mx-auto leading-tight">
              {courseData?.description}
            </p>
            {/* </div> */}

            {/* Chapters container */}
            {/* <div className="w-[90%] mx-auto"> */}
            {/* Header */}
            <div className="flex flex-col mt-6 border-accent-5 border-1">
              <h1 className="font-Lato-Black pb-1">
                CHAPTER {currentDataNumber}/{totalDataNumber}
              </h1>
              <hr className="border-accent-5 border w-[100%] mx-auto" />
            </div>
            {/* Chapters */}
            <div className="flex flex-col mt-[20px]">
              {data.map((chapter, index) => {
                const unlocked = isSlideUnlocked(index);
                return (
                  <button
                    key={index}
                    className={`flex justify-between items-center text-sm font-nokia-bold border-b-2 border-accent-5 px-4 text-secondary-6 cursor-pointer py-2 ${unlocked ? "text-black" : "text-gray-500"
                      }  ${index === activeIndex && "font-bold bg-[#FAE5C7]"}
                    `} // Locked slide to gray
                    onClick={() => {
                      updateIndex(index);
                    }}
                  >
                    <span>{chapter.chapter}</span>
                    {unlocked ? (
                      <span className="material-symbols-outlined text-accent-6 pl-4 text-xl">
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-accent-6 pl-4 text-lg">
                        radio_button_unchecked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chapter display window*/}
        <div className="hidden md:w-[70%] justify-start items-center mx-auto h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg ">

          {/* Chapter display container */}
          <div className="flex flex-col justify-between h-full">

            {/* Header */}
            <div>
              <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                <h1 className="text-[#fff] text-sm font-Lato-Black">
                  EZRA seminary
                </h1>
                <img
                  src="../../assets/close-icon.svg"
                  className="w-[3%] z-40 cursor-pointer"
                  alt=""
                />
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
                    <h1 className="text-3xl text-[#fff] text-center font-nokia-bold">
                      {chapter.chapter}
                    </h1>
                    <button className="text-white text-center font-nokia-bold mt-2 py-2 px-4 bg-accent-6 hover:bg-accent-7 w-[20%] rounded-3xl mx-auto text-2xl ">
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
      {/* </div> */}
    </>
  );
}

export default ChaptersDisplay;
