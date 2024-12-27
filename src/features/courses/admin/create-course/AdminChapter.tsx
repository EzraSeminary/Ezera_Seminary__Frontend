import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ChaptersAdd from "./ChaptersAdd";
import {
  MixElement,
  selectCourse,
  togglePublished,
} from "../../../../redux/courseSlice";
import { ArrowCircleLeft, ArrowSquareOut } from "@phosphor-icons/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import BeatLoader from "react-spinners/BeatLoader";

function AdminChapter() {
  // New state to track when the publish button has been clicked
  const [isPublishClicked, setIsPublishClicked] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false); // Separate loading state for save button
  const [isPublishLoading, setIsPublishLoading] = useState(false); // Separate loading state for publish button
  const [progress, setProgress] = useState(0); // New progress state
  const [shouldConfirmUnload, setShouldConfirmUnload] = useState(true); // State to track if confirmation dialog should be shown
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const basePath = role;
  const course = useSelector(selectCourse);

  useEffect(() => {
    // When 'published' state changes and the publish button was clicked, handle the submission
    if (isPublishClicked) {
      handleSubmit();
      setIsPublishClicked(false); // Reset the publish click tracker
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.published]); // Add isPublishClicked to the dependency array if your linter requires it

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldConfirmUnload) {
        event.preventDefault();
        event.returnValue = ""; // This shows the confirmation dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConfirmUnload]);

  const handleSubmit = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsSaveLoading(true); // Set save loading state to true
    setShouldConfirmUnload(false); // Disable confirmation dialog

    const { title, description, category, image, chapters, published } = course;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("published", String(published));
    formData.append("chapters", JSON.stringify(chapters));

    course.chapters.forEach((chapter, chapterIndex) => {
      chapter.slides.forEach((slide, slideIndex) => {
        slide.elements.forEach((element, elementIndex) => {
          // If it's an img type element
          if (element.type === "img" && element.value instanceof File) {
            formData.append(
              `chapter_${chapterIndex}_slide_${slideIndex}_img`,
              element.value,
              `${chapterIndex}_${slideIndex}_${element.value.name}`
            );
          }

          // If it's a mix type element
          if (element.type === "mix") {
            const mixElement = element as MixElement;
            if (mixElement.value.file instanceof File) {
              formData.append(
                `chapter_${chapterIndex}_slide_${slideIndex}_mix_file`,
                mixElement.value.file,
                `${chapterIndex}_${slideIndex}_${mixElement.value.file.name}`
              );
            } else {
              console.error(
                "File missing in Mix Element:",
                elementIndex,
                mixElement.value.file
              );
            }
          }

          // If it's an audio type element
          if (element.type === "audio" && element.value instanceof File) {
            formData.append(
              `chapter_${chapterIndex}_slide_${slideIndex}_audio`,
              element.value,
              `${chapterIndex}_${slideIndex}_${element.value.name}`
            );
          }
        });
      });
    });

    axios
      .post("/course/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0
          );
          setProgress(percentage);
        },
      })
      .then((res) => {
        console.log(res);
        toast.success(`Creating "${course.title}"!`, {
          onClose: () => {
            // Delay the reload to allow user to see the message
            setTimeout(() => {
              window.location.reload();
            }, 3000); // Adjust the timing as needed
          },
        });
      })
      .catch((err) => {
        toast.error(
          `Course creation failed. "${err.message}" Please try again.`
        );
        console.log(err);
      })
      .finally(() => {
        setIsSaveLoading(false); // Set save loading state to false
        setProgress(0); // Reset progress
        setShouldConfirmUnload(true); // Re-enable confirmation dialog
      });
  };

  const handlePublish = () => {
    setIsPublishLoading(true); // Set publish loading state to true
    setShouldConfirmUnload(false); // Disable confirmation dialog
    dispatch(togglePublished());

    const formData = new FormData();
    formData.append("published", String(!course.published));

    axios
      .put(`/course/update/${course.id}`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0
          );
          setProgress(percentage);
        },
      })
      .then(() => {
        toast.success(`Course ${course.published ? "unpublished" : "published"} successfully!`, {
          onClose: () => {
            // Delay the reload to allow user to see the message
            setTimeout(() => {
              window.location.reload();
            }, 3000); // Adjust the timing as needed
          },
        });
      })
      .catch((err) => {
        toast.error(`Error updating publish status: ${err.message}`);
      })
      .finally(() => {
        setIsPublishLoading(false); // Set publish loading state to false
        setProgress(0); // Reset progress
        setShouldConfirmUnload(true); // Re-enable confirmation dialog
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full">
        <div className="flex justify-between bg-secondary-6 rounded-t-lg px-6 py-3">
          <div className="flex items-center">
            <Link
              to={`/${basePath}/courses/create`}
              className="ml-3 flex items-center bg-gray-200 rounded-3xl px-4 py-1 border hover:border-gray-400 transition-all"
            >
              <ArrowCircleLeft
                weight="fill"
                size={24}
                className="text-accent-6"
              />{" "}
              <p className="text-accent-6 font-nokia-bold text-sm pl-2">
                {course.title}
              </p>
            </Link>
            {course.published ? (
              <p className="text-green-700 bg-gray-200 font-nokia-bold text-sm py-1 px-2 rounded-full ml-2">
                Published
              </p>
            ) : (
              <p className="text-primary-5 font-nokia-bold text-sm ml-4 py-1 px-4 border border-primary-5 rounded-full">
                Draft
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {progress > 0 && (
              <span className="text-sm text-accent-6 font-nokia-bold mr-2">{progress}%</span>
            )}
            <button
              onClick={handlePublish}
              className=" w-max px-2 flex justify-center items-center gap-2 font-semibold text-accent-6 bg-primary-6 rounded-lg  transition-all border border-accent-6"
              disabled={isPublishLoading} // Disable publish button when loading
            >
              {isPublishLoading ? (
                <BeatLoader size={8} color={"#EA9215"} />
              ) : !course.published ? (
                <span>Publish</span>
              ) : (
                <span>Unpublish</span>
              )}
              <ArrowSquareOut
                size={22}
                weight="fill"
                className="self-centered text-accent-6"
              />
            </button>
            <button
              onClick={handleSubmit}
              className="w-max px-2 flex justify-center items-center gap-2 ml-1 font-semibold text-primary-6 bg-accent-6 rounded-lg hover:bg-accent-7 transition-all"
              disabled={isSaveLoading} // Disable save button when loading
            >
              {isSaveLoading ? (
                <BeatLoader size={8} color={"#FFFFFF"} />
              ) : (
                <span>Save</span>
              )}
              <ArrowSquareOut
                size={22}
                weight="fill"
                className="self-centered"
              />
            </button>
          </div>
        </div>
        <ChaptersAdd />
      </div>
    </>
  );
}

export default AdminChapter;