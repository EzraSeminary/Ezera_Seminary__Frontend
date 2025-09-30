import useAxiosInstance from "@/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import {
  MixElement,
  selectCourse,
  setCourse,
  togglePublished,
} from "@/redux/courseSlice";
import { ArrowCircleLeft, ArrowSquareOut, Pen } from "@phosphor-icons/react";
import EditChapters from "./EditChapters";
import EditCourseFirst from "./EditCourseFirst";
import BeatLoader from "react-spinners/BeatLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "@/redux/store";

function EditCourse() {
  const { id } = useParams();
  const instance = useAxiosInstance();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const basePath = role;

  const [loading, setLoading] = useState(true);
  const [isPublishClicked, setIsPublishClicked] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [shouldConfirmUnload, setShouldConfirmUnload] = useState(true);

  useEffect(() => {
    if (id) {
      instance
        .get("/course/get/" + id)
        .then((res) => {
          dispatch(
            setCourse({
              ...course,
              title: res.data.title,
              description: res.data.description,
              category: res.data.category,
              image: res.data.image,
              chapters: res.data.chapters,
              published: res.data.published,
            })
          );
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      console.log("Course ID is undefined");
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isPublishClicked) {
      handleSubmit();
      setIsPublishClicked(false);
    }
  }, [course.published, isPublishClicked]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const isReload = performance.getEntriesByType("navigation").some((nav) => {
        return (nav as PerformanceNavigationTiming).type === "reload";
      });
  
      if (!isReload && shouldConfirmUnload) {
        event.preventDefault();
        event.returnValue = ""; // Show the confirmation dialog
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConfirmUnload]);
  

  const handleNavigation = (event: Event) => {
    if (shouldConfirmUnload) {
      const confirmationMessage = "You have unsaved changes, do you really want to leave?";
      if (!window.confirm(confirmationMessage)) {
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleNavigation);
    return () => {
      window.removeEventListener("beforeunload", handleNavigation);
    };
  }, [shouldConfirmUnload]);

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    setIsSaveLoading(true);
    setShouldConfirmUnload(false);

    const formData = new FormData();
    formData.append("title", course.title);
    formData.append("description", course.description);
    formData.append("category", course.category);
    
    // CRITICAL FIX: Only append image to formData if it's a new File upload
    // Do NOT send the existing URL string - let backend keep the existing image
    if (course.image instanceof File) {
      console.log(`[FRONTEND] Uploading new image file for course ${id}`);
      formData.append("image", course.image, course.image.name);
    } else {
      console.log(`[FRONTEND] No new image file, keeping existing image for course ${id}`);
      // Don't append anything - backend will keep existing image
    }
    
    formData.append("chapters", JSON.stringify(course.chapters));
    formData.append("published", String(course.published));

    course.chapters.forEach((chapter, chapterIndex) => {
      chapter.slides.forEach((slide, slideIndex) => {
        slide.elements.forEach((element, elementIndex) => {
          if (element.type === "img" && element.value instanceof File) {
            formData.append(
              `chapter_${chapterIndex}_slide_${slideIndex}_img`,
              element.value,
              `${chapterIndex}_${slideIndex}_${element.value.name}`
            );
          }

          if (element.type === "audio" && element.value instanceof File) {
            formData.append(
              `chapter_${chapterIndex}_slide_${slideIndex}_audio`,
              element.value,
              `${chapterIndex}_${slideIndex}_${element.value.name}`
            );
          }

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
        });
      });
    });

    instance
      .put("/course/update/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        toast.success(`Updating "${course.title}"!`, {
          onClose: () => {
            setShouldConfirmUnload(false); // Disable confirmation dialog
            setTimeout(() => {
              window.location.reload();
            });
          },
        });
      })
      .catch((err) => {
        toast.error(`Error updating course: "${err.message}". Please try again.`);
        console.log(err);
      })
      .finally(() => {
        setIsSaveLoading(false);
        setShouldConfirmUnload(true);
      });
  };

  const handleButtonClick = () => {
    setShowComponent(true);
  };

  const handlePublish = () => {
    setIsPublishLoading(true);
    setShouldConfirmUnload(false);
    dispatch(togglePublished());
    setIsPublishClicked(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <BeatLoader
          color={"#EA9215"}
          loading
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  return (
    <>
      <ToastContainer />
      <div className="w-full">
        <div className="flex justify-between bg-secondary-6 rounded-t-lg px-6 py-3">
          <div className="flex items-center ">
            <Link to={`/${basePath}/course/edit`} className="flex items-center">
              <ArrowCircleLeft
                weight="fill"
                size={32}
                className="text-accent-6 hover:text-accent-7 transition-all"
              />
            </Link>{" "}
            <button
              onClick={handleButtonClick}
              className="ml-3 flex items-center bg-gray-200 rounded-3xl px-4 py-1 border hover:border-gray-400 transition-all"
            >
              <p className="text-accent-6 font-nokia-bold text-sm pr-4">
                {course.title}
              </p>
              <Pen size={22} className="text-accent-6" />
            </button>
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
          <div className="flex">
      <button
        onClick={handlePublish}
        className="w-max px-2 flex justify-center items-center gap-2 font-semibold text-accent-6 bg-primary-6 rounded-lg transition-all border border-accent-6"
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
          <span>Update</span>
        )}
        <ArrowSquareOut
          size={22}
          weight="fill"
          className="self-centered"
        />
      </button>
    </div>
        </div>
        {/* display the edit course or edit chapters */}
        {showComponent ? (
          <EditCourseFirst setShowComponent={setShowComponent} />
        ) : (
          <EditChapters />
        )}
      </div>
    </>
  );
}

export default EditCourse;