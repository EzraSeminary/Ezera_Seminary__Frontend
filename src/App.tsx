import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/user/Home";
import Courses from "./pages/user/Courses";
import ChaptersDisplay from "./features/courses/user/ChaptersDisplay";
import SlidesDisplay from "./features/courses/user/SlidesDisplay";
// import SabbathSchool from "./pages/user/SabbathSchool";
import Devotion from "./pages/user/Devotion";
// import AboutUs from "./pages/user/AboutUs";
// import ContactUs from "./pages/user/ContactUs";
// import NotMatch from "./pages/user/NotMatch";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App: React.FC = () => {
  const { user, isAuthReady } = useAuthContext();

  if (!isAuthReady) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  interface PrivateRouteProps {
    children: React.ReactNode;
  }

  // Private Route for Admin
  const PrivateAdminRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    if (user && user.role === "Admin") {
      return <>{children}</>;
    } else {
      return <Navigate to="/" replace={true} />;
    }
  };

  PrivateAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  interface PublicRouteProps {
    children: React.ReactNode;
  }

  // Public Route (redirect if logged in)
  const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    return !user ? <>{children}</> : <Navigate to="/" replace={true} />;
  };

  PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="courses/get/:courseId" element={<ChaptersDisplay />} />
        <Route
          path="courses/get/:courseId/chapter/:chapterId"
          element={<SlidesDisplay />}
        />
        {/* <Route path="/sabbathSchool" element={<SabbathSchool />} /> */}
        <Route path="/devotion" element={<Devotion />} />
        {/* <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} /> */}

        {/* Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateAdminRoute>
              <AdminDashboard />
            </PrivateAdminRoute>
          }
        />

        {/* Public Routes (Redirect if logged in) */}
        {/* <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        /> */}

        {/* Not Found Route */}
        {/* <Route path="*" element={<NotMatch />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
