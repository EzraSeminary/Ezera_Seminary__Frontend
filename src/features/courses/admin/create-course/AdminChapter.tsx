import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ChaptersAdd from "./ChaptersAdd";
import { selectCourse, togglePublished } from "../../../../redux/courseSlice";
import { ArrowCircleLeft, ArrowSquareOut } from "@phosphor-icons/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

function AdminChapter() {
  // New state to track when the publish button has been clicked
  const [isPublishClicked, setIsPublishClicked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);

  useEffect(() => {
    // When 'published' state changes and the publish button was clicked, handle the submission
    if (isPublishClicked) {
      handleSubmit();
      setIsPublishClicked(false); // Reset the publish click tracker
    }
    // Add isPublishClicked to the dependency array if your linter requires it
  }, [course.published]);

  const handleSubmit = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    const { title, description, image, chapters, published } = course;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("published", String(published));
    formData.append("chapters", JSON.stringify(chapters));

    course.chapters.forEach((chapter, chapterIndex) => {
      chapter.slides.forEach((slide, slideIndex) => {
        slide.elements.forEach((element) => {
          if (element.type === "img" && element.value instanceof File) {
            formData.append(
              `chapter_${chapterIndex}_slide_${slideIndex}_image`,
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
      })
      .then((res) => {
        console.log(res);
        toast.success(`Creating "${course.title}"!`, {
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
        console.log(err);
        toast.error("Course creation failed. Please try again.");
      });
  };

  const handlePublish = () => {
    dispatch(togglePublished());
    setIsPublishClicked(true); // Indicate that publish was clicked
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full">
        <div className="flex justify-between border-gray-200 border-2 px-6 py-2">
          <div className="flex items-center">
            <Link
              to="/admin/courses/create"
              className="ml-3 flex items-center bg-gray-200 rounded-3xl px-4 py-1 border hover:border-gray-400 transition-all"
            >
              <ArrowCircleLeft
                weight="fill"
                size={24}
                className="text-accent-6"
              />{" "}
              <p className="text-accent-6 font-nokia-bold text-sm pl-4">
                {course.title}
              </p>
            </Link>
            {course.published ? (
              <p className="text-green-700 font-nokia-bold text-sm pl-4">
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
              className="h-[40px] w-[120px] flex justify-center items-center gap-2 font-semibold text-accent-6 bg-white rounded-md hover:bg-secondary-1 transition-all border border-accent-6"
              style={{ padding: "10px" }}
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
              className="h-[40px] w-[120px] flex justify-center items-center gap-2 ml-1 font-semibold text-white bg-accent-6 rounded-md hover:bg-accent-7 transition-all"
              style={{ padding: "10px" }}
            >
              <span>Save</span>
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
