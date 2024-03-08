import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ChaptersAdd from "./ChaptersAdd";
import { selectCourse } from "../../../../redux/courseSlice";
import { ArrowCircleLeft, ArrowSquareOut } from "@phosphor-icons/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminChapter() {
  const navigate = useNavigate();
  const course = useSelector(selectCourse);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { title, description, image, chapters } = course;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
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

    toast.success(`Course "${course.title}" has been created!`);

    axios
      .post("/course/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Course published successfully!");
        navigate("/admin/course/edit");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Course publication failed. Please try again.");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full">
        <div className="flex justify-between border-gray-200 border-2 px-6 py-2">
          <button className="font-nokia-bold text-accent-6 flex flex-row gap-2 hover:text-accent-7 transition-all">
            <Link
              to="/admin/courses/create"
              className="flex flex-row gap-2 items-center justify-center mt-3"
            >
              <ArrowCircleLeft weight="fill" size={24} />{" "}
              <span>Back to course</span>
            </Link>
          </button>
          <div>
            <button
              onClick={handleSubmit}
              className="h-[45px] w-[120px] flex justify-center gap-2 font-semibold text-white bg-accent-6 rounded-md hover:bg-accent-7 transition-all"
              style={{ padding: "10px" }}
            >
              <span>Publish</span>
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
