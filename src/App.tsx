// App.jsx
import PropTypes from "prop-types";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setAuthReady } from "./redux/authSlice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { useGetCurrentUserQuery } from "@/redux/api-slices/apiSlice";
import Header from "./components/Header";
import LoadingPage from "./pages/user/LoadingPage";
// import Footer from "./components/Footer";
// import OAuthRedirectHandler from "@/components/OAuthRedirectHandler";

// using React.lazy for dynamic imports
const Home = lazy(() => import("@/pages/user/Home"));
const NotMatch = lazy(() => import("@/pages/user/NotMatch"));
const ProtectedAdminRoute = lazy(
  () => import("@/components/ProtectedAdminRoute")
);
const ProtectedInstructorRoute = lazy(
  () => import("@/components/ProtectedInstructorRoute")
);
const LoggedInHome = lazy(() => import("./features/home/LoggedInHome"));
const SabbathSchool = lazy(() => import("@/pages/user/SabbathSchool"));
const UserProfile = lazy(() => import("@/pages/user/UserProfile"));
const ProfileSettings = lazy(() => import("@/pages/user/ProfileSettings"));
const Devotion = lazy(() => import("@/pages/user/Devotion"));
const PlanDevotionViewer = lazy(() => import("@/pages/user/PlanDevotionViewer"));
const AboutUs = lazy(() => import("@/pages/user/AboutUs"));
const ContactUs = lazy(() => import("@/pages/user/ContactUs"));
const Login = lazy(() => import("@/pages/user/Login"));
const ResetPassword = lazy(() => import("@/pages/user/ResetPassword"));
const ForgotPassword = lazy(() => import("@/pages/user/ForgotPassword"));
const Signup = lazy(() => import("@/pages/user/Signup"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
// Add this import
const InstructorDashboard = lazy(
  () => import("@/pages/admin/InstructorDashboard")
);
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

  //fetch user data (skip if no token yet)
  const stored = (typeof window !== 'undefined') ? localStorage.getItem("user") : null;
  let hasToken = false;
  try {
    const parsed = stored ? JSON.parse(stored) : null;
    hasToken = !!parsed?.token;
  } catch (_) {
    hasToken = false;
  }
  const { data: userData, error: userError } = useGetCurrentUserQuery({}, { skip: !hasToken });

  //save user data to redux
  useEffect(() => {
    const localStorageUser = JSON.parse(localStorage.getItem("user") as string);

    // Prefer userData from the API, fallback to localStorage if not available
    const userToLogin = userData || localStorageUser;

    if (userToLogin) {
      dispatch(login(userToLogin));
    }

    dispatch(setAuthReady(true));
  }, [dispatch, userData]);

  if (!isAuthReady) {
    return <LoadingPage />; // Or a  loading spinne
  }

  //catch error while fetching user data
  if (userError) {
    console.log(userError, userData);
  }

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return user ? <>{children}</> : <Navigate to="/login" replace />;
  };

  PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Public Route (redirect if logged in)
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (user && user.role === "Admin") {
      return <Navigate to="/admin" replace={true} />;
    } else if (user && user.role === "Instructor") {
      return <Navigate to="/instructor" replace={true} />;
    }
    return !user ? children : <Navigate to="/" replace={false} />;
  };

  PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const isAdmin = user && user.role === "Admin";
  const isInstructor = user && user.role === "Instructor";

  // console.log(user); remove unnecessary console logs as we can use it later

  return (
    <BrowserRouter>
      {!isAdmin && !isInstructor && <Header />}
      {/* Wrap Routes in Suspense for React lazy loading */}
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Public Routes */}

          <Route
            path="/"
            element={
              isAdmin ? (
                <Navigate to="/admin" replace={true} />
              ) : isInstructor ? (
                <Navigate to="/instructor" replace={true} />
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
          <Route path="/devotion/plan/:planId" element={<PlanDevotionViewer />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/settings"
            element={
              <PrivateRoute>
                <ProfileSettings />
              </PrivateRoute>
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

          <Route
            path="/instructor/*"
            element={
              <ProtectedInstructorRoute>
                <InstructorDashboard />
              </ProtectedInstructorRoute>
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
          {/* <Route
            path="/google/success"
            element={
              <PublicRoute>
                <OAuthRedirectHandler />
              </PublicRoute>
            }
          /> */}
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
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
