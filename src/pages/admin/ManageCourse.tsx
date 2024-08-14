import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useGetCoursesQuery } from "../../services/api";
import Modal from "react-modal"; // Import Modal from react-modal
import useAxiosInstance from "../../api/axiosInstance";
import LoadingPage from "../user/LoadingPage";
Modal.setAppElement("#root"); // Assuming the root element of your app is `#root`

const gridSquareVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

function ManageCourse() {
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null); // State for storing course ID to delete

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = courses?.filter((course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const instance = useAxiosInstance();

  // delete property
  const handleDelete = async (id: string) => {
    // You may want to add error handling or state updates here
    await instance.delete("/course/delete/" + id);
    setModalIsOpen(false); // Close the modal after the action
    window.location.reload(); // Consider refetching the courses rather than reloading the page
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Something went wrong.</div>;

  const confirmationModal = (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Delete Confirmation"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)", // This will give the overlay a black color with 75% opacity
        },
        content: {
          top: "50%",
          left: "55%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff", // This will give the modal a white background
          border: "1px solid #ccc", // This will give the modal a border
          borderRadius: "10px", // This will round the corners of the modal
          padding: "20px", // This will add some padding inside the modal
          width: "30%", // This will set the width of the modal to 30% of the viewport width
          height: "30%", // This will set the height of the modal to 30% of the viewport height
          display: "flex", // This will make the content a flex container
          flexDirection: "column", // This will make the flex items stack vertically
          justifyContent: "center", // This will center the flex items vertically
          alignItems: "center", // This will center the flex items horizontally
        },
      }}
      // Add your custom styling here or use inline styles as needed
    >
      <h2>Are you sure you want to delete this course?</h2>
      <div>
        <button
          onClick={() => {
            if (courseToDelete) handleDelete(courseToDelete); // delete course
          }}
          style={{
            backgroundColor: "#ff0000", // red background
            color: "#ffffff", // white text
            border: "none", // remove border
            borderRadius: "5px", // rounded corners
            padding: "10px 20px", // vertical and horizontal padding
            marginRight: "10px", // space between the buttons
            cursor: "pointer", // change cursor on hover
          }}
        >
          Yes
        </button>
        <button onClick={() => setModalIsOpen(false)}>No</button>
      </div>
    </Modal>
  );

  return (
    <>
      {confirmationModal}
      <div className="h-auto flex flex-col border border-gray-300 p-11 rounded-3xl mt-12 space-y-12 mb-12 shadow-2xl">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-accent-6 text-xl font-nokia-bold md:text-2xl tracking-wide">
                Manage Courses
              </h1>
            </div>
            <div className="flex  ">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="text-xs text-secondary-6 border border-accent-6 w-auto outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
              />
              <span className=" self-center cursor-pointer border  rounded-r-lg px-1 py-[0.54rem] -ml-1 bg-accent-6 text-white">
                <MagnifyingGlass size={20} />
              </span>
            </div>
          </div>
          <hr className="border-accent-5 border-1 w-[100%] pb-3 md:w-[30%]" />

          <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 justify-center items-center md:items-start w-[90%] mx-auto md:w-[98%] md:flex-row md:justify-start md:flex-wrap space-y-6 md:space-y-0 md:gap-4 ">
            {filteredData?.map((course, index: number) => {
              return (
                <motion.div
                  variants={gridSquareVariants}
                  whileHover={{
                    scale: 1.03,
                  }}
                  transition={{
                    bounceDamping: 10,
                    bounceStiffness: 600,
                  }}
                  key={index}
                  className="flex flex-col justify-center items-start  border-accent-5 border-2 w-[100%] shadow-2xl rounded-3xl md:rounded-xl h-full pb-6 cursor-pointer"
                >
                  <div className="w-full p-2 ">
                    <img
                      src={`https://ezrabackend.online/images/` + course.image}
                      // src={`https://ezrabackend.online/images/` + course.image}
                      className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-lg  bg-secondary-1"
                      alt=""
                    />
                  </div>
                  <div className="space-y-2 w-[95%] md:w-[90%] mx-auto h-full">
                    <h2 className="text-secondary-6 text-xl font-nokia-bold w-[90%] truncate">
                      {course.title}
                    </h2>
                    <p className="text-secondary-5 text-xs font-nokia-bold w-[100%] line-clamp-3 text-justify">
                      {course.description}
                    </p>
                    <div className="flex justify-between ">
                      <p className="text-secondary-6 text-xs font-nokia-bold line-clamp-3">
                        {course.chapters.length} Chapter
                      </p>
                      {course.published ? (
                        <p className="text-green-700 font-nokia-bold text-xs bg-secondary-1 rounded-3xl px-2">
                          Published
                        </p>
                      ) : (
                        <p className="text-secondary-6 font-nokia-bold text-xs bg-secondary-2 rounded-3xl px-2">
                          Draft
                        </p>
                      )}
                    </div>
                    <hr className="border-accent-5 border-1 w-[100%] " />
                    <div className="flex justify-between ">
                      <Link
                        to={`/admin/edit/course/` + course._id + `/chapters`}
                        className="inline-block bg-accent-6 text-primary-6 px-3 py-1 rounded transition duration-300 focus:outline-none font-nokia-bold text-xs hover:bg-accent-7"
                      >
                        edit
                      </Link>
                      <button
                        onClick={() => {
                          setCourseToDelete(course._id); // Set the course to delete
                          setModalIsOpen(true); // Open the modal
                        }}
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-nokia-bold text-xs py-1 px-3 rounded transition duration-300 focus:outline-none"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageCourse;
