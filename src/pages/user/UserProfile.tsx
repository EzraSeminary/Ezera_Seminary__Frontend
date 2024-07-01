import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { ArrowLeft } from "@phosphor-icons/react";
import mehari from "@/assets/avatar.png";

const UserProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Retrieve the user information from local storage if it's not available in the Redux store
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  // Use the user information from the Redux store or local storage
  const currentUser = user || initialUser;

  const avatarPreview = currentUser?.avatar
    ? `https://ezrabackend.online/images/${currentUser.avatar}`
    : mehari;

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-secondary-6 rounded-lg  mx-auto py-8 flex flex-col items-center justify-center w-[80%] my-12 shadow-2xl lg:w-[70%] md:mt-32 lg:mt-14">
      <div className="flex justify-between items-center w-[90%]">
        <h1 className="text-xl lg:text-2xl font-bold text-primary-6 text-center mb-4">
          My Profile
        </h1>
        <button
          onClick={goBack}
          className="text-xs md:text-sm lg:text-lg flex items-center w-max justify-start gap-1 bg-accent-6 hover:bg-accent-7 rounded-full font-nokia-bold mb-4  text-white px-2 py-1 cursor-pointer"
        >
          <ArrowLeft className="text-lg lg:text-xl" />
          Back
        </button>
      </div>

      <div className="flex flex-col w-full space-y-12 mt-6">
        <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between md:w-[80%] mx-auto md:space-y-6">
          {/* User Avatar and Email */}
          <div className="flex flex-col items-center mb-4 lg:mt-8">
            <img
              src={avatarPreview}
              alt="User Avatar"
              className="w-[25vmin] rounded-full mx-auto"
            />
            <span className="text-lg text-primary-6 font-medium mt-2">
              {user?.email}
            </span>
          </div>

          <div className="md:w-[60%] space-y-5 flex flex-col items-center p-5  rounded-lg shadow-md divide-y">
            {/* User Info */}
            <div className="flex items-start space-x-2  py-2">
              <div className="font-bold text-lg text-accent-6">Name:</div>
              <div className="text-lg  text-primary-6">{user?.firstName}</div>
            </div>

            <div className="w-full mx-auto text-center divide-y cursor-pointer">
              {/* Achievements */}
              <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110 hover:bg-accent-3 rounded">
                <a href="#achievements">Achievements</a>
              </h2>

              {/* Leaderboards */}
              <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110 hover:bg-accent-3 rounded">
                <a href="#leaderboards">Leaderboards</a>
              </h2>

              {/* Certificates */}
              <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110 hover:bg-accent-3 rounded">
                <a href="#certificates">Certificates</a>
              </h2>

              {/* Practical Assessment Results */}
              <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110 hover:bg-accent-3 rounded">
                <a href="#practical-assessment-results">
                  Practical Assessment Results
                </a>
              </h2>

              {/* My Performance */}
              <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110 hover:bg-accent-3 rounded">
                <a href="#my-performance">My Performance</a>
              </h2>

              {/* Account Settings */}
              <h2 className="py-2 text-xl font-bold text-accent-6 transform transition duration-500 hover:scale-110 hover:bg-accent-3 rounded ">
                <a href="profile/settings">Account Settings</a>
              </h2>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="flex flex-col-reverse lg:flex-row justify-center items-center gap-3 w-[90%] mx-auto ">
          <div className="text-center">
            <a href="/terms" className="text-accent-6  hover:underline">
              Terms and Conditions and Privacy Policy
            </a>
          </div>
          <div>
            <button
              onClick={() => {
                // Handle contact support action
                console.log("Contact support clicked");
              }}
              className="ml-4 bg-accent-6 text-primary-6 px-3 py-1 rounded hover:bg-accent-4 hover:text-accent-7"
            >
              Contact support
            </button>
            <button
              onClick={
                // Handle sign out action
                handleLogout
              }
              className="ml-4 bg-red-500 text-primary-6 px-3 py-1 rounded hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserProfile;
