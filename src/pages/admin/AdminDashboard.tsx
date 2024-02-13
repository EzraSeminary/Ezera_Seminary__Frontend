// AdminDashboard.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ManageCourse from "./ManageCourse";
import CreateCourse from "./CreateCourse";
import AdminChapter from "../../features/courses/admin/create-course/AdminChapter";
import EditCourse from "@/features/courses/admin/manage-course/EditCourse";
import EditCourseFirst from "@/features/courses/admin/manage-course/EditCourseFirst";
import SabbathSchool from "@/pages/user/SabbathSchool";
import CreateDevotion from "@/pages/admin/CreateDevotion";
import ManageDevotion from "@/pages/admin/ManageDevotion";
import Devotion from "@/pages/user/Devotion";
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
          <Route path="edit/course/:id" element={<EditCourseFirst />} />
          <Route path="edit/course/:id/chapters" element={<EditCourse />} />
          <Route path="sabbathSchool" element={<SabbathSchool />} />
          <Route path="devotion" element={<Devotion />} />
          <Route path="devotion/create" element={<CreateDevotion />} />
          <Route path="devotion/manage" element={<ManageDevotion />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
