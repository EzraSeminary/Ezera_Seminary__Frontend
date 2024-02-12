// AdminDashboard.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Courses from "@/pages/user/Courses";
import SabbathSchool from "@/pages/user/SabbathSchool";
import CreateDevotion from "@/pages/admin/CreateDevotion";
import ManageDevotion from "@/pages/admin/ManageDevotion";
import Devotion from "@/pages/user/Devotion";
// import AddCourse from "../components/AddCourse";
// import AdminChapter from "@/features/courses/admin/AdminChapter";
// import EditCourse from "../components/admin/EditCourse";
import ManageCourse from "@/features/courses/admin/ManageCourse";
import CreateCourse from "@/pages/admin/CreateCourse";
// import EditCourseFirst from "@/components/admin/EditCourseFirst";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-5">
      <Sidebar />
      <div className="col-span-4">
        <Routes>
          <Route path="/" element={<div>Admin Home</div>} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="sabbathSchool" element={<SabbathSchool />} />
          <Route path="devotion" element={<Devotion />} />
          <Route path="devotion/create" element={<CreateDevotion />} />
          <Route path="devotion/manage" element={<ManageDevotion />} />
          {/* <Route path="courses/create/chapters" element={<AdminChapter />} /> */}
          <Route path="course/edit" element={<ManageCourse />} />
          {/* <Route path="edit/course/:id" element={<EditCourseFirst />} /> */}
          {/* <Route path="edit/course/:id/chapters" element={<EditCourse />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
