import PropTypes from "prop-types";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import SabbathSchool from "./routes/SabbathSchool";
import Devotion from "./routes/Devotion";
import AboutUs from "./routes/AboutUs";
import ContactUs from "./routes/ContactUs";
import NotMatch from "./routes/NotMatch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
import Footer from "./components/Footer";
import AdminDashboard from "./routes/AdminDashboard";
import CoursesAvailable from "./features/CourseComponents/CoursesAvailable";
import ChaptersDisplay from "./features/CourseComponents/ChaptersDisplay";
import SlidesDisplay from "./features/CourseComponents/SlidesDisplay";

function App() {
  const { user, isAuthReady } = useAuthContext();

  if (!isAuthReady) {
    return <div>Loading...</div>; // Or a  loading spinner
  }

  // Private Route for Admin
  const PrivateAdminRoute = ({ children }) => {
    if (user && user.role === "Admin") {
      return children;
    } else {
      return <Navigate to="/" replace={true} />;
    }
  };

  PrivateAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Public Route (redirect if logged in)
  const PublicRoute = ({ children }) => {
    return !user ? children : <Navigate to="/" replace={true} />;
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
        <Route path="courses/get/:courseId" element={<ChaptersDisplay />} />
        <Route
          path="courses/get/:courseId/chapter/:chapterId"
          element={<SlidesDisplay />}
        />
        <Route path="/sabbathSchool" element={<SabbathSchool />} />
        <Route path="/devotion" element={<Devotion />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/courses" element={<CoursesAvailable />} />

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
        <Route
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
        />

        {/* Not Found Route */}
        <Route path="*" element={<NotMatch />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
