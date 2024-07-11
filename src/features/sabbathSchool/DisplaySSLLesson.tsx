import "./SSLStyles.css";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingPage from "@/pages/user/LoadingPage";
import {
  useGetSSLOfDayLessonQuery,
  useGetSSLOfDayQuery,
} from "../../services/SabbathSchoolApi";
import parse from "html-react-parser";
import { YoutubeLogo } from "@phosphor-icons/react";
import DateConverter from "./DateConverter";
import Modal from "./modal/Modal";
import AddSSLVideoLinks from "./AddSSLVideoLinks";
import EditSSLVideoLink from "./EditSSLVideoLink";

function DisplaySSLLesson() {
  interface Params {
    quarter: string;
    id: string;
    day: string;
    [key: string]: string;
  }
  interface VerseMap {
    [key: string]: string;
  }

  const { quarter = "", id = "", day } = useParams<Params>();
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const daysOfWeek = ["አርብ", "ቅዳሜ", "እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ"];
  const {
    data: lessonDetails,
    error: lessonError,
    isLoading,
  } = useGetSSLOfDayLessonQuery({ path: quarter, id: id, day: day });

  const { data: dayDetails, error: dayError } = useGetSSLOfDayQuery({
    path: quarter,
    id: id,
  });
  const [selectedVerse, setSelectedVerse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface YoutubeLink {
    year: number;
    quarter: number;
    lesson: number;
    videoUrl: string;
  }

  const [youtubeLink, setYoutubeLink] = useState<YoutubeLink | null>(null);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchYoutubeLink = useCallback(async () => {
    try {
      const response = await axios.get(`/sslLinks/${quarter}/${id}`);
      setYoutubeLink(response.data);
    } catch (error) {
      console.error("Failed to fetch YouTube link:", error);
    }
  }, [quarter, id]);

  useEffect(() => {
    fetchYoutubeLink();
  }, [fetchYoutubeLink]);

  const handleAddYoutubeLink = useCallback(
    async (newLink: string, year: number, quarter: number, lesson: number) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const response = await axios.post(`/sslLinks`, {
          videoUrl: newLink,
          quarter: quarter,
          lesson: lesson,
          year: year,
        });
        setYoutubeLink(response.data.videoUrl);
        setShowAddLinkForm(false);
      } catch (error: any) {
        console.error(
          "Error adding YouTube link:",
          error.response?.data || error
        );
        alert(
          "Failed to add YouTube link. Please try again. " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  const handleEditYoutubeLink = async (updatedLink: string) => {
    try {
      const response = await axios.put(
        `/sslLinks/${youtubeLink.year}/${youtubeLink.quarter}/${youtubeLink.lesson}`,
        {
          videoUrl: updatedLink,
        }
      );
      setYoutubeLink(response.data);
      setEditingLink(null);
    } catch (error: any) {
      console.error(
        "Error updating YouTube link:",
        error.response?.data || error
      );
      alert(
        "Failed to update YouTube link. Please try again. " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteYoutubeLink = async () => {
    if (window.confirm("Are you sure you want to delete this YouTube link?")) {
      try {
        if (
          !youtubeLink ||
          typeof youtubeLink.year !== "number" ||
          typeof youtubeLink.quarter !== "number" ||
          typeof youtubeLink.lesson !== "number"
        ) {
          throw new Error("Invalid YouTube link data");
        }
        await axios.delete(
          `/sslLinks/${youtubeLink.year}/${youtubeLink.quarter}/${youtubeLink.lesson}`
        );
        setYoutubeLink("");
      } catch (error: any) {
        console.error(
          "Error deleting YouTube link:",
          error.response?.data || error
        );
        alert(
          "Failed to delete YouTube link. Please try again. " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleVerseClick = (verseKey: string) => {
    if (
      lessonDetails?.bible &&
      lessonDetails.bible.length >= 1 &&
      lessonDetails.bible[0].verses
    ) {
      const verses = lessonDetails.bible[0].verses as VerseMap;
      const verseText: string | undefined = verses[verseKey];

      if (verseText) {
        setSelectedVerse(verseText);
        setIsModalOpen(true);
      } else {
        console.error(`Verse key "${verseKey}" not found`);
      }
    } else {
      console.error(
        "Bible data is not available or not in the expected format."
      );
    }
  };

  const modifyContentForDisplay = (content: string) => {
    if (!lessonDetails) return null;

    return parse(content, {
      replace: (domNode) => {
        if (
          domNode.type === "tag" &&
          domNode.name === "a" &&
          domNode.attribs &&
          domNode.attribs.class === "verse"
        ) {
          const verseKey = domNode.attribs.verse;
          const verseContent = domNode.children
            .map((childNode) =>
              childNode.type === "text" ? childNode.data : ""
            )
            .join("");
          return (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleVerseClick(verseKey);
              }}
              className="verse"
            >
              {verseContent}
            </a>
          );
        }
      },
    });
  };

  useEffect(() => {
    if (dayDetails) {
      setBackgroundImage(dayDetails.lesson.cover);
    }
  }, [lessonDetails, backgroundImage, dayDetails]);

  if (isLoading) return <LoadingPage />;
  if (lessonError && "message" in lessonError)
    return <div>Error: {lessonError.message}</div>;
  if (!lessonDetails) return null;

  if (dayError && "message" in dayError)
    return <div>Error: {dayError.message}</div>;

  return (
    <div className="relative">
      <div
        className="flex flex-col justify-between rounded-md w-[100%] h-64 text-primary-1 px-8 py-4"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.001) 0%, rgba(0,0,0,0.7) 100%), url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-end mt-2 md:mt-4 space-x-2">
          {youtubeLink ? (
            <>
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
              >
                Watch on YouTube <YoutubeLogo size={24} weight="fill" />
              </a>
              <button
                onClick={() => setEditingLink(youtubeLink)}
                className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
              >
                Edit Link
              </button>
              <button
                onClick={handleDeleteYoutubeLink}
                className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
              >
                Delete Link
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAddLinkForm(true)}
              className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
            >
              Add YouTube Link
            </button>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <p className="flex flex-row text-primary-5 text-sm lg:text-lg">
            {daysOfWeek[(Number(day) ?? 0) % 7]}፣&nbsp;&nbsp;
            <DateConverter gregorianDate={lessonDetails.date} />
          </p>
          <div className="border-b border-accent-4 w-full mb-2" />
          <div className="text-xl lg:text-3xl text-primary-0 ">
            {lessonDetails.title}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          key={selectedVerse}
          showModal={isModalOpen}
          toggleModal={toggleModal}
        >
          {parse(selectedVerse, { trim: true })}
        </Modal>
      )}
      <div className="text-secondary-6 text-justify wrapper my-4 ">
        {modifyContentForDisplay(lessonDetails.content)}
      </div>
      {showAddLinkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <AddSSLVideoLinks
              onSubmit={handleAddYoutubeLink}
              onCancel={() => setShowAddLinkForm(false)}
              year={new Date().getFullYear()}
              quarter={quarter}
              lesson={id}
            />
          </div>
        </div>
      )}
      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <EditSSLVideoLink
              link={youtubeLink}
              onSubmit={handleEditYoutubeLink}
              onCancel={() => setEditingLink(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplaySSLLesson;
