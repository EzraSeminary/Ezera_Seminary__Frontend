import useAxiosInstance from "@/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { selectCourse, setCourse, togglePublished } from "@/redux/courseSlice";
import { ArrowCircleLeft, ArrowSquareOut, Pen } from "@phosphor-icons/react";
import EditChapters from "./EditChapters";
import EditCourseFirst from "./EditCourseFirst";
import BeatLoader from "react-spinners/BeatLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const instance = useAxiosInstance();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);

  const [loading, setLoading] = useState(true);
  // New state to track when the publish button has been clicked
  const [isPublishClicked, setIsPublishClicked] = useState(false);

  //get a single course
  useEffect(() => {
    if (id) {
      instance
        .get("/course/get/" + id)
        .then((res) => {
          console.log(id);
          dispatch(
            setCourse({
              ...course,
              title: res.data.title,
              description: res.data.description,
              image: res.data.image,
              chapters: res.data.chapters,
              published: res.data.published,
            })
          );
          console.log(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("Course ID is undefined");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  useEffect(() => {
    // When 'published' state changes and the publish button was clicked, handle the submission
    if (isPublishClicked) {
      handleSubmit();
      setIsPublishClicked(false); // Reset the publish click tracker
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.published, isPublishClicked]); // Add isPublishClicked to the dependency array if your linter requires it

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();

    const formData = new FormData();
    formData.append("title", course.title);
    formData.append("description", course.description);
    if (typeof course.image === "string") {
      formData.append("image", course.image);
    } else if (course.image instanceof File) {
      formData.append("image", course.image, course.image.name);
    }
    formData.append("chapters", JSON.stringify(course.chapters)); // Convert chapters to JSON string and append it to formData
    formData.append("published", String(course.published));

    // Loop through the chapters and slides to append any image files
    course.chapters.forEach((chapter, chapterIndex) => {
      chapter.slides.forEach((slide, slideIndex) => {
        slide.elements.forEach((element) => {
          // If it's an img type element
          if (element.type === "img" && element.value instanceof File) {
            // Append the file using chapter and slide indices to help reference the file on the server-side
            formData.append(
              `chapter_${chapterIndex}_slide_${slideIndex}_image`,
              element.value,
              `${chapterIndex}_${slideIndex}_${element.value.name}`
            );
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

    console.log(formData);

    const payload = Object.fromEntries(formData);
    console.log("payload" + payload);

    //update course
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
            navigate("/admin/course/edit");
            // Delay the reload to allow user to see the message
            setTimeout(() => {
              window.location.reload();
            }, 3000); // Adjust the timing as needed
          },
        });
      })
      .catch((err) => {
        toast.error(
          `Error updating course: "${err.message}". Please try again.`
        );
        console.log(err);
      });
  };

  //show component to edit title, desc & image
  const [showComponent, setShowComponent] = useState(false);

  const handleButtonClick = () => {
    setShowComponent(true);
  };

  const handlePublish = () => {
    dispatch(togglePublished());
    setIsPublishClicked(true); // Indicate that publish was clicked
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
            <Link to="/admin/course/edit" className="flex items-center">
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
              <p className="text-secondary-9 font-nokia-bold text-sm pl-4">
                Draft
              </p>
            )}
          </div>
          <div className="flex">
            <button
              onClick={handlePublish}
              className=" w-max px-2 flex justify-center items-center gap-2 font-semibold text-accent-6 bg-primary-6 rounded-lg  transition-all border border-accent-6"
            >
              {!course.published ? (
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
            >
              <span>Update</span>
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
