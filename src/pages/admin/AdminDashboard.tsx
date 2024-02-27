import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ManageCourse from "./ManageCourse";
import CreateCourse from "./CreateCourse";
import AdminChapter from "../../features/courses/admin/create-course/AdminChapter";
import EditCourse from "@/features/courses/admin/manage-course/EditCourse";
import EditCourseFirst from "@/features/courses/admin/manage-course/EditCourseFirst";
import CreateDevotion from "@/pages/admin/CreateDevotion";
import ManageDevotion from "@/pages/admin/ManageDevotion";
import Devotion from "@/pages/user/Devotion";
import Analytics from "@/features/courses/admin/analytics/Analytics";
import AdminHeader from "./AdminHeader";
import SabbathSchool from "@/pages/user/SabbathSchool";
import SSLQuarter from "@/features/sabbathSchool/SSLQuarter";
import SSLDay from "@/features/sabbathSchool/SSLDay";
import DisplaySSLLesson from "@/features/sabbathSchool/DisplaySSLLesson";

const AdminDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div className="grid grid-cols-admin-dashboard">
      <div className="fixed top-0 left-0 z-10 h-screen ">
        <Sidebar />
      </div>
      <div className="col-span-4 ml-64 px-12">
        <AdminHeader />
        <Routes>
          <Route path="/" element={<div>Admin Home</div>} />
          <Route path="analytics/usage" element={<Analytics />} />
          <Route path="course/edit" element={<ManageCourse />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/create/chapters" element={<AdminChapter />} />
          <Route
            path="edit/course/:id"
            element={<EditCourseFirst setShowComponent={setShowComponent} />}
          />
          <Route path="edit/course/:id/chapters" element={<EditCourse />} />
          <Route path="/sabbathSchool" element={<SabbathSchool />} />
          <Route path="/sabbathSchool/:quarter" element={<SSLQuarter />} />
          <Route
            path="/sabbathSchool/:quarter/lessons/:id"
            element={<SSLDay />}
          >
            <Route path="days/:day/read" element={<DisplaySSLLesson />} />
          </Route>
          <Route path="devotion" element={<Devotion />} />
          <Route path="devotion/create" element={<CreateDevotion />} />
          <Route path="devotion/manage" element={<ManageDevotion />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
