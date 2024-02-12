// DisplaySSLLesson.jsx
import "./SSLStyles.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetSSLOfDayLessonQuery,
  useGetSSLOfDayQuery,
} from "./../../services/SabbathSchoolApi";
import parse from "html-react-parser";
import { YoutubeLogo } from "@phosphor-icons/react";
import DateConverter from "./DateConverter";

function DisplaySSLLesson() {
  const { quarter, id, day, selectedDayId } = useParams();
  const [backgroundImage, setBackgroundImage] = useState("");
  const daysOfWeek = ["ቅዳሜ", "እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ"];
  const {
    data: lessonDetails,
    error,
    isLoading,
  } = useGetSSLOfDayLessonQuery({ path: quarter, id: id, day: day });

  const {
    data: dayDetails,
    dayError,
    dayIsLoading,
  } = useGetSSLOfDayQuery({ path: quarter, id: id });

  useEffect(() => {
    if (dayDetails) {
      setBackgroundImage(dayDetails.lesson.cover);
    }
  }, [dayDetails]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (dayError) return <div>Error: {dayError.message}</div>;
  const html = parse(lessonDetails.content);

  return (
    <div>
      <div
        className="flex flex-col justify-between rounded-md w-[100%] h-64 text-primary-1 px-8 py-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.001) 0%, rgba(0,0,0,0.7) 100%), url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-end mt-4">
          <button className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all">
            Watch on YouTube <YoutubeLogo size={24} weight="fill" />
          </button>
        </div>
        <div className="flex flex-col">
          <p className="flex flex-row text-primary-5 text-lg">
            {daysOfWeek[(day % 7) - 1]}፣&nbsp;&nbsp;
            <DateConverter gregorianDate={lessonDetails.date} />
          </p>
          <div className="border-b border-accent-4 w-full mb-2" />
          <div className="text-3xl text-primary-0">{lessonDetails.title}</div>
        </div>
      </div>

      <div className="text-secondary-6 text-justify wrapper my-4">{html}</div>
    </div>
  );
}

export default DisplaySSLLesson;
