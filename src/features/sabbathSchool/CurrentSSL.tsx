import { useState, useEffect } from "react";
import useCalculateLessonIndex from "./hooks/useCalculateLessonIndex";
import { Link } from "react-router-dom";
import {
  useGetSSLOfDayQuery,
  useGetSSLOfQuarterQuery,
} from "@/services/SabbathSchoolApi";
import { useGetVideoLinkQuery } from "@/services/videoLinksApi";
import DateConverter from "./DateConverter";
import { YoutubeLogo } from "@phosphor-icons/react";
import LoadingPage from "@/pages/user/LoadingPage";

function CurrentSSL() {
  const currentDate = new Date().toISOString().slice(0, 10);
  const [quarter, week] = useCalculateLessonIndex(currentDate);
  const [backgroundImage, setBackgroundImage] = useState("");

  const {
    data: lessonDetails,
    error: lessonError,
    isLoading: lessonIsLoading,
  } = useGetSSLOfDayQuery({ path: quarter, id: week });
  const {
    data: quarterDetails,
    error: quarterError,
    isLoading: quarterIsLoading,
  } = useGetSSLOfQuarterQuery(quarter);

  // Fetch video link
  const {
    data: videoLink,
    error: videoLinkError,
    isLoading: videoLinkIsLoading,
  } = useGetVideoLinkQuery({
    year: new Date().getFullYear(),
    quarter: parseInt(quarter.split("-")[1]),
    lesson: week,
  });

  useEffect(() => {
    if (lessonDetails) {
      setBackgroundImage(lessonDetails.lesson.cover);
    }
  }, [lessonDetails]);

  if (lessonIsLoading || quarterIsLoading || videoLinkIsLoading)
    return <LoadingPage />;
  if (lessonError && "message" in lessonError)
    return <div>Error: {lessonError.message}</div>;
  if (quarterError && "message" in quarterError)
    return <div>Error: {quarterError.message}</div>;
  if (videoLinkError && "message" in videoLinkError)
    return <div>Error: {videoLinkError.message}</div>;
  if (!quarterDetails || !lessonDetails) return <div>Missing data...</div>;

  return (
    <div className="shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4 w-full border border-accent-6 p-2 rounded-xl">
        <div
          className="flex rounded-md w-full lg:w-[35%] h-48 text-primary-1 p-4 items-end"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(234,146,21,0.8) 100%), url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        >
          <div className="">
            <p className="xl:text-xl">የዚህ ሳምንት ትምህርት</p>
            {quarterDetails && quarterDetails.quarterly && (
              <div className="flex text-2xl text-primary-3">
                <DateConverter
                  gregorianDate={lessonDetails.lesson.start_date}
                />
                &nbsp;- &nbsp;
                <DateConverter gregorianDate={lessonDetails.lesson.end_date} />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-[65%]">
          <div className="flex w-full justify-between">
            <div className="w-full">
              <p className="text-lg xl:text-xl text-accent-6">
                {quarterDetails.quarterly.title}
              </p>
              <p className="text-lg xl:text-4xl md:text-3xl text-secondary-6 ">
                {lessonDetails.lesson.title}
              </p>
              <p className="text-xs xl:text-lg text-accent-6 mt-2">
                {quarterDetails.quarterly.human_date}
              </p>
              <div className="border border-b-accent-6 my-2" />
            </div>
            <div className="flex flex-col gap-2 items-end w-[45%] space-y-1">
              <Link
                className="px-4 py-1 mt-2 mr-2 bg-accent-6 text-primary-1 rounded-full text-xs xl:text-lg hover:bg-accent-7 transition-all"
                to={
                  {
                    pathname: `/sabbathSchool/${quarter}/lessons/${week}`,
                    state: {
                      quarterlyTitle: quarterDetails.quarterly.title,
                      quarterlyCover: quarterDetails.quarterly.cover,
                    },
                  } as {
                    pathname: string;
                    state: { quarterlyTitle: string; quarterlyCover: string };
                  }
                }
              >
                ትምህርቱን ክፈት
              </Link>
              {videoLink ? (
                <a
                  href={videoLink.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-max leading-snug md:leading-none md:w-auto px-2 xl:text-lg border border-accent-6 text-accent-6 text-xs flex rounded-full items-center gap-2 hover:border-accent-7 hover:text-accent-7"
                >
                  Watch on YouTube{" "}
                  <YoutubeLogo weight="fill" className="text-lg md:text-xl" />
                </a>
              ) : (
                <div className="text-accent-6">YouTube link unavailable.</div>
              )}
            </div>
          </div>
          <p className="text-xs xl:text-sm">
            {quarterDetails.quarterly.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurrentSSL;
