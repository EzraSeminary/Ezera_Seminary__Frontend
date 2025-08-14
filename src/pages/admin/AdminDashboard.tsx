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
import EnhancedAnalytics from "@/features/courses/admin/analytics/EnhancedAnalytics";
import AdminHeader from "./AdminHeader";
import CreateUser from "./CreateUser";
import ManageUser from "./ManageUsers";
import PerformanceDashboard from "./PerformanceDashboard";
import DashboardOverview from "./DashboardOverview";

const AdminDashboard = () => {
  // eslint-disable-next-line
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div className="flex bg-gray-100">
      <div
        // Make the sidebar fixed to be visible on vertical scroll...!!
        className={`sticky top-0 left-0 bottom-0 z-10 h-screen transition-all duration-500 ease-in-out text-white`}
      >
        <Sidebar isInstructor={false} />
      </div>
      <div
        className={`flex-grow transition-all duration-500 ease-in-out pl-4 mx-8`}
      >
        <AdminHeader />
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="analytics/usage" element={<EnhancedAnalytics />} />
          <Route
            path="analytics/dashboard"
            element={<PerformanceDashboard />}
          />
          <Route path="course/edit" element={<ManageCourse />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/create/chapters" element={<AdminChapter />} />
          <Route
            path="edit/course/:id"
            element={<EditCourseFirst setShowComponent={setShowComponent} />}
          />
          <Route path="edit/course/:id/chapters" element={<EditCourse />} />

          <Route path="devotion" element={<Devotion />} />
          <Route path="devotion/create" element={<CreateDevotion />} />
          <Route path="devotion/manage" element={<ManageDevotion />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/manage" element={<ManageUser />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
