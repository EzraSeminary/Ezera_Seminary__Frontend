import CoursesAvailable from "../../features/courses/user/CoursesAvailable";
import Categories from "../../features/courses/user/Categories";
const Courses = () => {
  return (
    <div className="h-auto flex flex-col w-[90%]  mt-12 mx-auto space-y-6 mb-12">
      <CoursesAvailable />
      <Categories title="Categories" />
    </div>
  );
};

export default Courses;
