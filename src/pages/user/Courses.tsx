import CoursesAvailable from "../../features/courses/user/CoursesAvailable";
import Categories from "../../features/courses/user/Categories";
// import Sample1 from "../../features/courses/user/Sample1";
const Courses = () => {
  return (
    <div className="h-auto flex flex-col w-[90%] md:w-[80%] mt-12 mx-auto space-y-6 mb-12">
      <CoursesAvailable />
      {/* <Sample1 /> */}
      <Categories title="Categories" />
    </div>
  );
};

export default Courses;
