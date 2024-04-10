import { useState, useRef, useEffect } from "react";
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
  const [open, setOpen] = useState<boolean>(false);
  {
    /* State to control account modal  */
  }

  //get courseId from the route
  const { courseId } = useParams<{ courseId: string }>();

  //get single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useGetCourseByIdQuery(courseId as string);

  // Retrieves the current user from Redux state
  const currentUser = useSelector((state: RootState) => state.auth.user);
  console.log(currentUser);

  //find matching courseId from the user progress array
  const userProgress = currentUser?.progress?.find(
    (p) => p.courseId === courseId
  );

  // Get current chapter index from the user's progress
  const currentChapterIndex = userProgress?.currentChapter ?? 0;

  const [activeIndex, setActiveIndex] = useState<number>(currentChapterIndex);
  const [unlockedIndex, setUnlockedIndex] =
    useState<number>(currentChapterIndex); // New state variable to track the unlocked index

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

  const { chapters } = courseData || {};
  const data = chapters || [];

  //Resume chapter
  // When component did mount or userProgress has changed, update the activeIndex
  useEffect(() => {
    if (userProgress?.currentChapter !== undefined) {
      const newActiveIndex = userProgress.currentChapter;
      setActiveIndex(newActiveIndex);
      if (newActiveIndex > unlockedIndex) {
        setUnlockedIndex(newActiveIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProgress]);

  //function for next & previous buttons
  const updateIndex = (newIndex: number) => {
    // First adjust the new index if it's out of bounds
    const adjustedIndex = Math.max(0, Math.min(newIndex, data.length - 1));
    // Use a functional update to ensure we're using the latest state
    setUnlockedIndex((prevUnlockedIndex) => {
      // Only update if the new index is greater than the previous unlocked index
      if (adjustedIndex > prevUnlockedIndex) {
        return adjustedIndex;
      } else {
        return prevUnlockedIndex;
      }
    });
    setActiveIndex(adjustedIndex);
  };

  const isSlideUnlocked = (index: number) => {
    return index <= unlockedIndex; // Check if the slide is unlocked based on the unlocked index
  };

  // We'll add this new function to "complete" a chapter, which means that
  // the next chapter should be unlocked.
  const completeChapter = (completedIndex: number) => {
    // If the completed chapter is the current unlocked one,
    // then we unlock the next one.
    if (completedIndex === unlockedIndex) {
      // Assume the max chapters are equal to the length of the data array
      const maxChapters = data.length;
      // Set the next chapter as the unlocked one if it isn't the last chapter
      if (completedIndex < maxChapters - 1) {
        setUnlockedIndex(completedIndex + 1);
        // Auto-advance to next chapter.
        setActiveIndex(completedIndex + 1);
      }
    }
  };

  // slide number
  const currentDataNumber = activeIndex + 1;
  const totalDataNumber = data.length;

  //progress

  const progressValue = () => {
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

  // Check the status of the chapter
  const getChapterStatus = (chapterIndex: number): string => {
    if (userProgress) {
      const { currentChapter } = userProgress;

      // Check if the chapter is completed
      if (currentChapter && currentChapter > chapterIndex) {
        return "Completed";
      }

      // Check if the current chapter is the ongoing chapter
      if (currentChapter === chapterIndex) {
        return "In Progress";
      }
    }

    // Default to not started if no user progress is found
    return "Finish all slides to complete this lesson";
  };

  // Helper function to calculate the progress percent based on chapter status
  const calculateProgressPercent = (chapterStatus: string) => {
    switch (chapterStatus) {
      case "Completed":
        return "100%";
      case "In Progress":
        return "....";
      default:
        return "0%";
    }
  };

  {
    /* Loading state */
  }
  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center min-h-screen">
        <BeatLoader
          color={"#EA9215"}
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
      <div className="flex   mt-6  w-[80%] mx-auto justify-between items-center h-screen relative lg:w-[100%] lg:mt-0  lg:absolute lg:top-0 lg:bottom-0 lg:z-50 lg:h-full ">
        {/* Back button */}
        <div className="absolute top-3 -left-28  pl-24 flex justify-start w-full mb-2 lg:hidden">
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

        {/* Chapters side bar for mobile and tablet*/}
        <div
          ref={ref}
          className={`lg:hidden ${
            open
              ? "absolute left-0 top-[10%] flex flex-col justify-start items-center w-[80%] md:w-[50%] lg:top-0  z-40 h-[80%] lg:absolute-none "
              : "w-0 h-0"
          }`}
          style={{ transition: "width 0.3s" }}
        >
          {open ? (
            <ArrowLeft
              onClick={handleArrowClick}
              className="text-white text-2xl xl:text-3xl bg-accent-6 border p-1 rounded-full absolute -right-2 md:-right-3 lg:-right-2 xl:-right-3 top-14  cursor-pointer "
            />
          ) : (
            <ArrowRight
              onClick={handleArrowClick}
              className="text-white text-2xl xl:text-3xl  bg-accent-6 border p-1 rounded-full absolute  -left-3  top-36 md:top-44 cursor-pointer "
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
          <div className="w-[100%] overflow-y-auto bg-white opacity-85 pb-3 rounded-b-lg  ">
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

        {/* Chapters side bar for desktop*/}
        <div className="hidden w-[30%] h-full lg:flex flex-col justify-start items-center bg-primary-7 z-40 lg:w-[30%] lg:h-full">
          <NavLink to={"/courses"}>
            <ArrowLeft
              onClick={handleArrowClick}
              className="text-white text-3xl  bg-accent-6 border p-1 rounded-lg absolute left-3  top-4 cursor-pointer "
            />{" "}
          </NavLink>

          {/* Bible image container*/}

          <img
            src={`http://ezra-seminary.mybese.tech/images/` + courseData?.image}
            alt=""
            className="w-full h-[30vh] object-cover"
          />

          {/* Short information*/}
          <div className="pl-2 py-1 bg-primary-7  gap-2 flex justify-between items-center  w-full text-xs1  lg:text-xs">
            <div className="p-1 bg-accent-6 rounded w-[8%]">
              <p className="font-Lato-Bold text-primary-1 ">
                {progressValue()}%
              </p>
            </div>
            <p className="font-Lato-Bold text-secondary-6 leading-none flex-grow">
              Pass 100% of your lessons to complete this course
            </p>
          </div>

          {/* Course title and description*/}
          <div className="w-[100%] overflow-y-auto bg-white opacity-85 pb-3 rounded-b-lg  ">
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
                    className={`flex justify-between items-center font-nokia-bold border-b border-accent-5 px-2 cursor-pointer py-2 rounded-lg bg-gray-200 hover:bg-[#FAE5C7] hover:opacity-80  ${
                      unlocked ? "text-secondary-6" : "text-secondary-3"
                    }  ${index === activeIndex && "bg-[#FAE5C7]"}
                    `} // Locked slide to gray
                    onClick={() => {
                      updateIndex(index);
                      handleArrowClick();
                    }}
                    disabled={!unlocked} // Disable the button if the slide is locked
                  >
                    <div className="flex flex-col items-start justify-center">
                      <h2 className="font-nokia-bold text-secondary-6 text-xs lg:text-sm">
                        {chapter.chapter}
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
        <div className=" lg:w-[70%]   items-center  h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg lg:rounded-none lg:h-full">
          {/* Chapter display container */}
          <div className="flex flex-col justify-between w-full h-full relative">
            {/* Header */}
            <>
              <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                <div className=" z-30 h-full flex justify-center items-center md:space-x-0 xl:space-x-1 cursor-pointer ">
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
            </>

            {/* Chapter content */}
            {data.map((chapter, index) => {
              const chapterStatus = getChapterStatus(index);
              const progressPercent = calculateProgressPercent(chapterStatus);

              let buttonText = "ትምህርቱን ጀምር";
              switch (chapterStatus) {
                case "In Progress":
                  buttonText = "Resume Lesson";
                  break;
                case "Completed":
                  buttonText = "Restart Lesson";
                  break;
                default:
                  buttonText = "ትምህርቱን ጀምር";
              }

              if (index === activeIndex) {
                return (
                  <>
                    <div
                      key={index}
                      className="flex flex-col w-full justify-center h-52 flex-grow"
                    >
                      <h1 className="text-lg lg:text-xl text-[#fff] text-center font-nokia-bold">
                        {chapter.chapter}
                      </h1>
                      <button className="text-white text-center font-nokia-bold  py-1 px-2 bg-accent-6 hover:bg-accent-7 w-auto lg:px-4 lg:py-2  rounded-3xl mx-auto lg:mt-2 text-xs1 lg:text-sm ">
                        <NavLink
                          to={`/courses/get/${courseId}/chapter/${chapter._id}`}
                        >
                          {buttonText}
                        </NavLink>
                      </button>
                    </div>
                    {/* footer */}
                    <div className="pl-2 py-1 bg-primary-7 gap-2 flex justify-center items-center w-full text-xs lg:text-sm absolute bottom-0">
                      <div className="p-1 bg-accent-6 rounded">
                        <p className="font-Lato-Bold text-primary-1">
                          {progressPercent}
                        </p>
                      </div>
                      <p className="font-Lato-Bold text-secondary-6 leading-none">
                        {chapterStatus}
                      </p>
                    </div>
                    ;
                  </>
                );
              } else {
                return null; // Hide the chapter if it doesn't match the activeIndex
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChaptersDisplay;
