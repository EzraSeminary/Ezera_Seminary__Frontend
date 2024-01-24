import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ManageCourse from "../../features/courses/admin/ManageCourse";
// import SabbathSchool from "../routes/SabbathSchool";
// import CreateDevotion from "./CreateDevotion";
// import ManageDevotion from "./ManageDevotion";
// import Devotion from "../routes/Devotion";
// import AdminChapter from "../features/CourseComponents/AdminChapter";
// import EditCourse from "../components/admin/EditCourse";
// import CreateCourse from "@/components/CreateCourse";
// import EditCourseFirst from "@/components/admin/EditCourseFirst";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-5">
      <Sidebar />
      <div className="col-span-4">
        <Routes>
          <Route path="/" element={<div>Admin Home</div>} />
          <Route path="course" element={<ManageCourse />} />
          {/* <Route path="courses/create/add" element={<CreateCourse />} />
          <Route path="sabbathSchool" element={<SabbathSchool />} />
          <Route path="devotion" element={<Devotion />} />
          <Route path="devotion/create" element={<CreateDevotion />} />
          <Route path="devotion/manage" element={<ManageDevotion />} />
          <Route path="courses/create/chapters" element={<AdminChapter />} />
          <Route path="edit/course/:id" element={<EditCourseFirst />} />
          <Route path="edit/course/:id/chapters" element={<EditCourse />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
