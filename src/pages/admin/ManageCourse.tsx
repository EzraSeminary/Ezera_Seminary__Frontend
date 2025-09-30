import { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useGetCoursesQuery } from "../../services/api";
import Modal from "react-modal"; // Import Modal from react-modal
import useAxiosInstance from "../../api/axiosInstance";
import LoadingPage from "../user/LoadingPage";
import { RootState } from "@/redux/store";
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
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const basePath = role;
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = courses
    ?.filter((course) => {
      return course.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

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
      <div className="h-auto flex flex-col p-6 md:p-11 rounded-3xl mt-12 mb-12">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-accent-6 text-3xl md:text-4xl font-nokia-bold tracking-wide">
                Manage Courses
              </h1>
              <p className="text-secondary-5 text-sm mt-2">
                Edit, publish, or delete your courses
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 md:flex-none text-sm text-secondary-6 border-2 border-accent-6 w-full md:w-64 outline-none focus:ring-2 focus:ring-accent-6 rounded-lg px-4 py-2.5 transition-all"
              />
              <button className="self-center cursor-pointer rounded-lg px-3 py-2.5 bg-accent-6 text-white hover:bg-accent-7 transition-all">
                <MagnifyingGlass size={22} weight="bold" />
              </button>
            </div>
          </div>

          {/* Course Count */}
          <div className="flex items-center gap-2 text-secondary-6">
            <span className="text-lg font-semibold">{filteredData?.length || 0}</span>
            <span className="text-sm">course{(filteredData?.length || 0) !== 1 ? 's' : ''} found</span>
          </div>

          <hr className="border-accent-6 border-t-2" />

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {filteredData?.map((course, index: number) => {
              return (
                <motion.div
                  variants={gridSquareVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  key={index}
                  className="group relative flex flex-col bg-white border-2 border-accent-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image Container with Overlay */}
                  <div className="relative w-full h-56 overflow-hidden bg-secondary-1">
                    <img
                      src={
                        typeof course.image === "string"
                          ? course.image
                          : URL.createObjectURL(course.image)
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={course.title}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {course.published ? (
                        <span className="flex items-center gap-1 bg-green-500 text-white font-nokia-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-yellow-500 text-white font-nokia-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Title */}
                    <h2 className="text-secondary-6 text-xl font-nokia-bold line-clamp-2 mb-2">
                      {course.title}
                    </h2>

                    {/* Category Badge */}
                    <div className="flex items-center">
                      <span className="text-accent-6 text-xs font-nokia-bold bg-accent-6/10 px-3 mb-3 rounded-full">
                        {course.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-secondary-5 font-nokia-bold text-sm line-clamp-3 flex-1 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-accent-6/20">
                      <Link
                        to={`/${basePath}/edit/course/${course._id}/chapters`}
                        className="flex-1 flex items-center justify-center gap-2 bg-accent-6 text-white font-nokia-bold text-sm px-4 py-2.5 rounded-lg hover:bg-accent-7 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          setCourseToDelete(course._id);
                          setModalIsOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white font-nokia-bold text-sm px-4 py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {(!filteredData || filteredData.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-24 h-24 text-secondary-3 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-nokia-bold text-secondary-6 mb-2">No courses found</h3>
              <p className="text-secondary-5">Try adjusting your search or create a new course</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ManageCourse;
