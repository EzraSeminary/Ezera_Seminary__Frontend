// App.jsx
import PropTypes from "prop-types";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setAuthReady } from "./redux/authSlice";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/user/Home";
// import Footer from "./components/Footer";
import NotMatch from "@/pages/user/NotMatch";
import { RootState } from "@/redux/store";
import LoadingPage from "./pages/user/LoadingPage";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import LoggedInHome from "./features/home/LoggedInHome";
import { useGetCurrentUserQuery } from "@/redux/api-slices/apiSlice";

// using React.lazy for dynamic imports
const SabbathSchool = lazy(() => import("@/pages/user/SabbathSchool"));
const UserProfile = lazy(() => import("@/pages/user/UserProfile"));
const ProfileSettings = lazy(() => import("@/pages/user/ProfileSettings"));
const Devotion = lazy(() => import("@/pages/user/Devotion"));
const AboutUs = lazy(() => import("@/pages/user/AboutUs"));
const ContactUs = lazy(() => import("@/pages/user/ContactUs"));
const Login = lazy(() => import("@/pages/user/Login"));
const Signup = lazy(() => import("@/pages/user/Signup"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ChaptersDisplay = lazy(
  () => import("@/features/courses/user/ChaptersDisplay")
);
const SlidesDisplay = lazy(
  () => import("@/features/courses/user/SlidesDisplay")
);
const SSLQuarter = lazy(() => import("@/features/sabbathSchool/SSLQuarter"));
const SSLDay = lazy(() => import("@/features/sabbathSchool/SSLDay"));
const DisplaySSLLesson = lazy(
  () => import("@/features/sabbathSchool/DisplaySSLLesson")
);
const Courses = lazy(() => import("./pages/user/Courses"));

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthReady = useSelector((state: RootState) => state.auth.isAuthReady);

  //fetch user data
  const { data: userData, error: userError } = useGetCurrentUserQuery({});
  console.log(userData);

  //save user data to redux
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user") as string);

    if (userData) {
      dispatch(login(userData)); // Dispatch the login action
    }

    dispatch(setAuthReady(true)); // Dispatch the setAuthReady action
  }, [dispatch, userData]);

  if (!isAuthReady) {
    return <div>Loading...</div>; // Or a  loading spinner
  }

  //catch error while fetching user data
  if (userError) {
    console.log(userError);
  }

  const PrivateUserRoute = ({ children }: { children: React.ReactNode }) => {
    if (user) {
      return children;
    } else {
      return <Navigate to="/login" replace={true} />;
    }
  };

  PrivateUserRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Public Route (redirect if logged in)
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (user && user.role === "Admin") {
      return <Navigate to="/admin" replace={true} />;
    }
    return !user ? children : <Navigate to="/" replace={true} />;
  };

  PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const isAdmin = user && user.role === "Admin";

  return (
    <BrowserRouter>
      {!isAdmin && <Header />}
      {/* Wrap Routes in Suspense for React lazy loading */}
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Public Routes */}

          <Route
            path="/"
            element={
              isAdmin ? (
                <Navigate to="/admin" replace={true} />
              ) : user ? (
                <LoggedInHome /> // Render LoggedInHome if user is logged in
              ) : (
                <Home /> // Render Home if user is not logged in
              )
            }
          />
          <Route path="/courses/get/:courseId" element={<ChaptersDisplay />} />
          <Route
            path="/courses/get/:courseId/chapter/:chapterId"
            element={<SlidesDisplay />}
          />
          <Route path="/sabbathSchool" element={<SabbathSchool />} />
          <Route path="/sabbathSchool/:quarter" element={<SSLQuarter />} />
          <Route
            path="/sabbathSchool/:quarter/lessons/:id"
            element={<SSLDay />}
          >
            <Route path="days/:day/read" element={<DisplaySSLLesson />} />
          </Route>
          <Route path="/devotion" element={<Devotion />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/profile"
            element={
              <PrivateUserRoute>
                <UserProfile />
              </PrivateUserRoute>
            }
          />
          <Route
            path="/profile/settings"
            element={
              <PrivateUserRoute>
                <ProfileSettings />
              </PrivateUserRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
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
      </Suspense>
      {/* {!isAdmin && <Footer />} */}
    </BrowserRouter>
  );
}

export default App;
