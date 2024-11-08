import React, { useState, useRef } from 'react';
import { X, ArrowLeft, CheckCircle, Lock } from '@phosphor-icons/react';
import ProgressSubmit from './ProgressSubmit';

interface CourseDetailsProps {
  open: boolean;
  handleArrowClick: () => void;
  courseData: { title: string; description: string } | undefined;
  data: { slide: string }[];
  activeIndex: number;
  totalDataNumber: number;
  currentSlideNumber: number;
  isSlideUnlocked: (index: number) => boolean;
  updateIndex: (index: number) => void;
  courseId: string;
  chapterIndex: number | undefined;
  updateProgress: (courseId: string, chapterIndex: number, slideIndex: number) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  open,
  handleArrowClick,
  courseData,
  data,
  activeIndex,
  totalDataNumber,
  currentSlideNumber,
  isSlideUnlocked,
  updateIndex,
  courseId,
  chapterIndex,
  updateProgress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const progressSubmitRef = useRef<{ submitProgress: () => void }>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
    <div
    ref={ref}
    className={`lg:hidden ${
      open
        ? "absolute left-0 top-0 flex flex-col justify-start items-center w-full  z-50 h-full"
        : "w-0 h-0"
    }`}
    style={{ transition: "width 0.3s" }}
  >
    {open ? (
      <X
        onClick={handleArrowClick}
        className="text-primary-5 z-50 text-2xl  bg-accent-6 border p-1 rounded-full absolute right-3  top-3 cursor-pointer"
      />
    ) : null}

    {/* Course title and description*/}
    <div className="w-[100%] h-full bg-secondary-6 opacity-95 pb-3 rounded-b-lg pt-3 ">
      <h1 className="text-primary-6 font-nokia-bold text-xs lg:text-sm xl:text-lg  text-center mt-2 mb-1 xl:mt-3 xl:mb-2 ">
        {courseData?.title}
      </h1>
      <hr className="border-accent-5 border w-[90%] mx-auto" />

      <div className="w-[90%] mx-auto mt-2  flex flex-col">
        <p
          className={`text-accent-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-2  text-justify  w-[90%] mx-auto leading-tight lg:text-xs  ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          } text-justify leading-tight lg:text-xs`}
        >
          {courseData?.description}
        </p>
        <button
          onClick={toggleExpand}
          className="bg-accent-6 rounded-full px-2 text-xs text-primary-2 mt-2 hover:bg-accent-7 transition-all self-end"
        >
          {isExpanded ? "Less" : "More"}
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col mt-2 border-accent-5 border-b  w-[95%] mx-auto">
        <h1 className="font-nokia-bold text-primary-6 pb-1 text-xs lg:text-sm">
          ትምህርት {currentSlideNumber}/{totalDataNumber}
        </h1>
        <hr className="border-accent-5 border-b-2 w-[30%] " />
      </div>
      {/* slide list */}
      <div className="flex flex-col h-[73%] px-2 pt-2 gap-2 md:px-3 overflow-y-auto">
        {data.map((slides, index) => {
          const unlocked = isSlideUnlocked(index - 1);
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg hover:bg-[#FAE5C7] hover:opacity-80  ${
                unlocked
                  ? "text-secondary-6"
                  : "text-primary-5 hover:cursor-not-allowed"
              }  ${isActive ? "bg-[#FAE5C7]" : "bg-secondary-2"}

              `}
              onClick={() => {
                updateIndex(index);
                handleArrowClick();
              }}
              disabled={!unlocked} // Disable the button if the slide is locked
            >
              <div className="flex flex-col items-start justify-start w-[90%] ">
                <h2 className="font-nokia-bold text-secondary-6 text-left text-xs lg:text-sm">
                  {slides.slide}
                </h2>
                <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-xs">
                  {index + 1}/{totalDataNumber} Slides
                </p>
              </div>
              {unlocked ? (
                <CheckCircle size={16} weight="fill" color={"#EA9215"} />
              ) : (
                <Lock size={16} color={"#EC4000"} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
  <div className="hidden  h-full lg:flex flex-col justify-start items-center bg-primary-7  z-40 lg:w-[27%] ">
    {/* Short information*/}

    <div className="flex   py-2 bg-secondary-5  pl-12 w-full text-xs1  lg:text-xs z-50">
      <ArrowLeft
        onClick={() => {
            if (progressSubmitRef.current) {
              progressSubmitRef.current.submitProgress();
            }
          }}
        className="text-white text-2xl  bg-accent-6 border p-1 rounded-lg absolute left-3  top-2.5 cursor-pointer "
      />

      <h1 className="text-primary-6 font-nokia-bold text-xs lg:text-lg flex-grow   items-center ">
        {courseData?.title}
      </h1>
    </div>

    {/* Course title and description*/}
    <div className="flex flex-col w-full h-full bg-primary-3 opacity-90 pb-3 rounded-b-lg">
      <div className="w-[90%] mx-auto mt-2  flex flex-col">
        <p
          className={`text-secondary-5 text-xs1 font-nokia-bold xl:text-lg ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          } text-justify leading-tight lg:text-xs`}
        >
          {courseData?.description}
        </p>
        <button
          onClick={toggleExpand}
          className="bg-accent-6 rounded-full px-2 text-xs text-primary-2 mt-2 hover:bg-accent-7 transition-all self-end"
        >
          {isExpanded ? "Less" : "More"}
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col  border-accent-5 border-b  w-[95%] mx-auto">
        <h1 className="font-nokia-bold text-secondary-6 pb-1 text-xs lg:text-sm">
          ትምህርቶች {currentSlideNumber}/{totalDataNumber}
        </h1>
        <hr className="border-accent-5 border-b-2 w-[30%] " />
      </div>
      {/* slide list */}
      <div className="flex flex-col h-[73%] px-2 pt-2 gap-2 md:px-3 overflow-y-auto ">
        {data.map((slides, index) => {
          const unlocked = isSlideUnlocked(index - 1);
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg hover:bg-[#FAE5C7] hover:opacity-80  ${
                unlocked
                  ? "text-secondary-6"
                  : "text-secondary-3 hover:cursor-not-allowed"
              }  ${isActive ? "bg-[#FAE5C7]" : "bg-secondary-2"}

              `}
              onClick={() => {
                updateIndex(index);
                handleArrowClick();
              }}
              disabled={!unlocked} // Disable the button if the slide is locked
            >
              <div className="flex flex-col items-start justify-start w-[90%] text-left">
                <h2 className="font-nokia-bold text-secondary-6 text-xs lg:text-sm xl:text-lg">
                  {slides.slide}
                </h2>
                <p className="font-lato-Bold text-accent-6 text-xs1 lg:text-sm xl:text-lg">
                  {index + 1}/{totalDataNumber} Slides
                </p>
              </div>
              {unlocked ? (
                <CheckCircle size={16} weight="fill" color={"#EA9215"} />
              ) : (
                <Lock size={16} color={"#EC4000"} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
  <ProgressSubmit
        courseId={courseId}
        chapterIndex={chapterIndex}
        currentSlideNumber={currentSlideNumber}
        updateProgress={updateProgress}
        ref={progressSubmitRef}
      />
  </>
  );
};

export default CourseDetails;