import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ManageCourse from "./ManageCourse";
import CreateCourse from "./CreateCourse";
import AdminChapter from "../../features/courses/admin/AdminChapter";
// import SabbathSchool from "../routes/SabbathSchool";
// import CreateDevotion from "./CreateDevotion";
// import ManageDevotion from "./ManageDevotion";
// import Devotion from "../routes/Devotion";
// import EditCourse from "../components/admin/EditCourse";
// import EditCourseFirst from "@/components/admin/EditCourseFirst";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-5">
      <Sidebar />
      <div className="col-span-4">
        <Routes>
          <Route path="/" element={<div>Admin Home</div>} />
          <Route path="course/edit" element={<ManageCourse />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/create/chapters" element={<AdminChapter />} />
          {/* <Route path="sabbathSchool" element={<SabbathSchool />} />
          <Route path="devotion" element={<Devotion />} />
          <Route path="devotion/create" element={<CreateDevotion />} />
          <Route path="devotion/manage" element={<ManageDevotion />} />
          <Route path="edit/course/:id" element={<EditCourseFirst />} />
          <Route path="edit/course/:id/chapters" element={<EditCourse />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
