import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BeatLoader from "react-spinners/BeatLoader";
import useAxiosInstance from "@/api/axiosInstance";
import {
  MixElement,
  selectCourse,
  setCourse,
  togglePublished,
} from "@/redux/courseSlice";
import { RootState } from "@/redux/store";
import { ArrowCircleLeft, ArrowSquareOut, Pen } from "@phosphor-icons/react";
import EditChapters from "./EditChapters";
import EditCourseFirst from "./EditCourseFirst";

function EditCourse() {
  const { id } = useParams();
  const instance = useAxiosInstance();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const basePath = role;

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComponent, setShowComponent] = useState(false);

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

  const handleUpdate = (event?: FormEvent) => {
    event?.preventDefault();
    setUpdateLoading(true);

    const formData = new FormData();
    formData.append("title", course.title);
    formData.append("description", course.description);
    formData.append("category", course.category);

    if (typeof course.image === "string") {
      formData.append("image", course.image);
    } else if (course.image instanceof File) {
      formData.append("image", course.image, course.image.name);
    }

    formData.append("chapters", JSON.stringify(course.chapters));
    formData.append("published", String(course.published));

    course.chapters.forEach((chapter, chapterIndex) => {
      chapter.slides.forEach((slide, slideIndex) => {
        slide.elements.forEach((element, ) => {
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
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0
          );
          setProgress(percentage);
        },
      })
      .then(() => {
        toast.success(`Course updated successfully!`);
      })
      .catch((err) => {
        toast.error(`Error updating course: ${err.message}`);
      })
      .finally(() => {
        setUpdateLoading(false);
        setProgress(0);
        window.location.reload();
      });
  };

  const handlePublish = () => {
    setPublishLoading(true);
    dispatch(togglePublished());

    const formData = new FormData();
    formData.append("published", String(!course.published));

    instance
      .put(`/course/update/${id}`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0
          );
          setProgress(percentage);
        },
      })
      .then(() => {
        toast.success(`Course ${course.published ? "unpublished" : "published"} successfully!`);
      })
      .catch((err) => {
        toast.error(`Error updating publish status: ${err.message}`);
      })
      .finally(() => {
        setPublishLoading(false);
        setProgress(0);
        window.location.reload();
      });
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
          <div className="flex items-center">
            <Link to={`/${basePath}/course/edit`} className="flex items-center">
              <ArrowCircleLeft
                weight="fill"
                size={32}
                className="text-accent-6 hover:text-accent-7 transition-all"
              />
            </Link>
            <button
              onClick={() => setShowComponent(true)}
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
          <div className="flex items-center gap-2">
            {progress > 0 && (
              <span className="text-sm text-accent-6 font-nokia-bold mr-2">{progress}%</span>
            )}
            <button
              onClick={handlePublish}
              className={`w-max px-4 py-1 flex justify-center items-center gap-2 font-semibold text-accent-6 bg-primary-6 rounded-lg transition-all border border-accent-6 ${
                publishLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={publishLoading}
            >
              {publishLoading ? (
                <BeatLoader size={8} color="#EA9215" />
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
              onClick={handleUpdate}
              className={`w-max px-4 py-1 flex justify-center items-center gap-2 ml-1 font-semibold text-primary-6 bg-accent-6 rounded-lg hover:bg-accent-7 transition-all ${
                updateLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={updateLoading}
            >
              {updateLoading ? (
                <BeatLoader size={8} color="#FFFFFF" />
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
